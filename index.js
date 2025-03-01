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

    console.log(`Verificando vídeo ${video_id}`);

    const info = await ytdl.getInfo(video_id).catch(err => {
      if (err.message.includes('Video unavailable')) {
        throw new Error('Vídeo não encontrado no YouTube');
      }
      throw err;
    });

    const duration = parseInt(info.videoDetails.lengthSeconds);
    const bitrate = 128;
    const size_in_mb = ((bitrate * duration) / 8) / 1024;

    if (size_in_mb > 40) {
      return res.status(413).json({
        error: 'Arquivo muito grande',
        size: `${size_in_mb.toFixed(2)} MB`,
        max_size: '40 MB'
      });
    }

    const video_title = info.videoDetails.title;
    const file_info = {
      t: video_title,
      a: info.videoDetails.author.name,
      s: size_in_mb.toFixed(2)
    };

    const encoded_json = Buffer.from(JSON.stringify(file_info)).toString('base64');
    const file_name = `${encoded_json}.mp3`;

    // Verifica se o arquivo já existe no Supabase
    const check_url = `${SUPABASE_URL}/storage/v1/object/info/all/${file_name}`;
    console.log('Verificando existência do arquivo no Supabase:', check_url);
    const check_response = await fetch(check_url, {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${SUPABASE_TOKEN}`
      }
    });

    console.log('Resposta da verificação:', {
      status: check_response.status,
      statusText: check_response.statusText
    });

    if (check_response.ok) {
      const download_url = `${SUPABASE_URL}/storage/v1/object/public/all/${file_name}`;
      console.log('Arquivo já existe no Supabase:', file_name);
      return res.status(200).json({ 
        message: 'Arquivo já existe',
        file_name,
        download_url
      });
    }

    console.log('Arquivo não encontrado no Supabase, iniciando download...');

    console.log(`Baixando vídeo ${video_id}`);
    const stream = ytdl(video_id, {
      filter: 'audioonly',
      quality: 'highestaudio',
      format: 'mp3',
    });

    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    
    stream.on('end', async () => {
      try {
        const file_data = Buffer.concat(chunks);

        const upload_url = `${SUPABASE_URL}/storage/v1/object/all/${file_name}`;

        console.log('Iniciando upload do arquivo:', { url: upload_url, file_size: file_data.length, file_name });

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
          console.error('Erro no Supabase:', errorResponse);
          return res.status(response.status).json({
            error: 'Erro no upload',
            supabase_error: errorResponse,
            status_code: response.status
          });
        }

        console.log('Upload concluído com sucesso');

        return res.status(200).json({ 
          message: 'Download concluído com sucesso',
          file_name
        });
      } catch (upload_error) {
        console.error('Erro ao fazer upload do arquivo:', upload_error);
        return res.status(500).json({ error: 'Erro ao fazer upload do arquivo' });
      }
    });

    stream.on('error', (error) => {
      console.error('Erro ao baixar o vídeo:', error);
      return res.status(500).json({ error: 'Erro ao baixar o vídeo' });
    });

  } catch (error) {
    console.error('Erro no servidor:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
