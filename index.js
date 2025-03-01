const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
require('dotenv').config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const SUPABASE_URL = 'https://kgwnnqbpohhldfroogmm.supabase.co';
const SUPABASE_TOKEN = process.env.SUPABASE_TOKEN; 

app.post('/download', async (req, res) => {
  try {
    const { video_id } = req.body;

    if (!video_id) {
      return res.status(400).json({ error: 'O parâmetro video_id é obrigatório' });
    }

    if (!ytdl.validateID(video_id)) {
      return res.status(400).json({ error: 'ID do vídeo inválido' });
    }

    const info = await ytdl.getInfo(video_id).catch(err => {
      if (err.message.includes('Video unavailable')) {
        throw new Error('Vídeo não encontrado no YouTube');
      }
      throw err;
    });

    const video_title = info.videoDetails.title;
    const file_info = {
      t: video_title,
      a: info.videoDetails.author.name
    };

    const encoded_json = Buffer.from(JSON.stringify(file_info)).toString('base64');
    const file_name = `${encoded_json}.mp3`;

    // Verifica se o arquivo já existe no Supabase
    const check_url = `${SUPABASE_URL}/storage/v1/object/info/all/${file_name}`;
    const check_response = await fetch(check_url, {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${SUPABASE_TOKEN}`
      }
    });

    if (check_response.ok) {
      const download_url = `${SUPABASE_URL}/storage/v1/object/public/all/${file_name}`;
      return res.status(200).json({ 
        message: 'Arquivo já existe',
        file_name,
        download_url
      });
    }

    const stream = ytdl(video_id, {
      filter: 'audioonly',
      quality: 'highestaudio',
      format: 'mp3'
    });

    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    
    stream.on('end', async () => {
      try {
        const file_data = Buffer.concat(chunks);

        const upload_url = `${SUPABASE_URL}/storage/v1/object/all/${file_name}`;

        const response = await fetch(upload_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'audio/mpeg',
            'Authorization': `Bearer ${SUPABASE_TOKEN}`
          },
          body: file_data
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          return res.status(response.status).json({
            error: 'Erro no upload',
            supabase_error: errorResponse,
            status_code: response.status
          });
        }

        const download_url = `${SUPABASE_URL}/storage/v1/object/public/all/${file_name}`;
        return res.status(200).json({ 
          message: 'Download concluído com sucesso',
          file_name,
          download_url
        });
      } catch (upload_error) {
        return res.status(500).json({ error: 'Erro ao fazer upload do arquivo' });
      }
    });

    stream.on('error', (error) => {
      return res.status(500).json({ error: 'Erro ao baixar o vídeo' });
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/info', async (req, res) => {
  try {
    const list_url = `${SUPABASE_URL}/storage/v1/object/list/all`;
    
    const response = await fetch(list_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_TOKEN}`
      },
      body: JSON.stringify({
        prefix: '',
        limit: 100,
        offset: 0,
        sortBy: {
          column: 'name',
          order: 'asc'
        }
      })
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return res.status(response.status).json({
        error: 'Erro ao listar arquivos',
        supabase_error: errorResponse,
        status_code: response.status
      });
    }

    const files = await response.json();
    return res.status(200).json(files);

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
