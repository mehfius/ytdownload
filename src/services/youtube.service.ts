import ytdl from '@distube/ytdl-core';
import { FileInfo } from '../interfaces';
import { 
  checkFileExists, 
  generateFileName, 
  getDownloadUrl, 
  uploadFile 
} from '../utils/supabase';

export class YouTubeService {
  /**
   * Valida o ID do vídeo do YouTube
   */
  public static validateVideoId(videoId: string): boolean {
    return ytdl.validateID(videoId);
  }

  /**
   * Obtém informações do vídeo do YouTube
   */
  public static async getVideoInfo(videoId: string): Promise<{
    title: string;
    author: string;
  }> {
    try {
      const info = await ytdl.getInfo(videoId);
      
      return {
        title: info.videoDetails.title,
        author: info.videoDetails.author.name
      };
    } catch (error: any) {
      if (error.message.includes('Video unavailable')) {
        throw new Error('Vídeo não encontrado no YouTube');
      }
      throw error;
    }
  }

  /**
   * Baixa um vídeo do YouTube
   * Se o arquivo já existir no Supabase, retorna a URL diretamente
   * Caso contrário, baixa o áudio, faz upload e retorna a URL
   */
  public static async downloadVideo(videoId: string): Promise<{
    message: string;
    file_name: string;
    download_url: string;
    existed: boolean;
  }> {
    // Obtém informações do vídeo
    const { title, author } = await this.getVideoInfo(videoId);
    
    // Gera nome do arquivo
    const fileInfo: FileInfo = { t: title, a: author };
    const fileName = generateFileName(fileInfo);
    
    // Verifica se o arquivo já existe
    const fileExists = await checkFileExists(fileName);
    if (fileExists) {
      const downloadUrl = getDownloadUrl(fileName);
      return {
        message: 'Arquivo já existe',
        file_name: fileName,
        download_url: downloadUrl,
        existed: true
      };
    }
    
    // Faz download do vídeo
    return new Promise((resolve, reject) => {
      const stream = ytdl(videoId, {
        filter: 'audioonly',
        quality: 'highestaudio',
        format: 'mp3'
      });
      
      const chunks: Buffer[] = [];
      
      stream.on('data', (chunk) => chunks.push(chunk));
      
      stream.on('end', async () => {
        try {
          // Constrói o arquivo de áudio a partir dos chunks
          const fileData = Buffer.concat(chunks);
          
          // Faz upload para o Supabase
          await uploadFile(fileName, fileData);
          
          // Retorna a URL de download
          const downloadUrl = getDownloadUrl(fileName);
          resolve({
            message: 'Download concluído com sucesso',
            file_name: fileName,
            download_url: downloadUrl,
            existed: false
          });
        } catch (error) {
          reject(new Error('Erro ao fazer upload do arquivo'));
        }
      });
      
      stream.on('error', (error) => {
        reject(new Error('Erro ao baixar o vídeo'));
      });
    });
  }
}