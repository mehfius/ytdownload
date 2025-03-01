import { Request, Response } from 'express';
import { YouTubeService } from '../services/youtube.service';
import { listFiles } from '../utils/supabase';
import { AdvancedDownloadRequest, DownloadRequest } from '../interfaces';

export class YouTubeController {
  /**
   * Rota para download de vídeo
   */
  public static async download(req: Request, res: Response): Promise<Response> {
    try {
      const { video_id } = req.body as DownloadRequest;

      // Validação de entrada
      if (!video_id) {
        return res.status(400).json({ error: 'O parâmetro video_id é obrigatório' });
      }

      // Validação do ID do vídeo
      if (!YouTubeService.validateVideoId(video_id)) {
        return res.status(400).json({ error: 'ID do vídeo inválido' });
      }

      // Download do vídeo
      const result = await YouTubeService.downloadVideo(video_id);
      
      // Remove o campo 'existed' da resposta
      const { existed, ...response } = result;
      
      return res.status(200).json(response);
    } catch (error: any) {
      // Erros específicos do YouTube
      if (error.message === 'Vídeo não encontrado no YouTube') {
        return res.status(404).json({ error: error.message });
      }
      
      // Log do erro (em produção usaria um sistema de logging adequado)
      console.error('Erro no download:', error);
      
      // Erro genérico para o cliente
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * Rota avançada para download com verificação de tamanho e upload em bucket do usuário
   */
  public static async advancedDownload(req: Request, res: Response): Promise<Response> {
    try {
      const { video_id, user_id, item_id } = req.body as AdvancedDownloadRequest;

      // Validação de entrada
      if (!video_id || !user_id || !item_id) {
        return res.status(400).json({ 
          error: 'Os parâmetros video_id, user_id e item_id são obrigatórios' 
        });
      }

      // Validação do ID do vídeo
      if (!YouTubeService.validateVideoId(video_id)) {
        return res.status(400).json({ error: 'ID do vídeo inválido' });
      }

      console.log(`Usuário ${user_id} está baixando o item ${item_id}`);

      // Download do vídeo com verificação de tamanho
      const result = await YouTubeService.advancedDownload(video_id, user_id, item_id);
      
      return res.status(200).json(result);
    } catch (error: any) {
      // Erros específicos do YouTube
      if (error.message === 'Vídeo não encontrado no YouTube') {
        return res.status(404).json({ error: error.message });
      }
      
      // Erro de arquivo muito grande
      if (error.message === 'Arquivo muito grande') {
        return res.status(error.status_code || 413).json({
          error: error.message,
          size: error.size,
          max_size: error.max_size
        });
      }
      
      // Log do erro (em produção usaria um sistema de logging adequado)
      console.error('Erro no download avançado:', error);
      
      // Erro genérico para o cliente
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * Rota para listar arquivos
   */
  public static async getInfo(req: Request, res: Response): Promise<Response> {
    try {
      const files = await listFiles();
      return res.status(200).json(files);
    } catch (error: any) {
      console.error('Erro ao listar arquivos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}