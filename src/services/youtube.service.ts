import ytdl from '@distube/ytdl-core';
import { FileInfo } from '../interfaces';
import { 
  checkFileExists, 
  generateFileName, 
  getDownloadUrl, 
  uploadFile,
  uploadToUserBucket 
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
    duration: number;
  }> {
    try {
      const info = await ytdl.getInfo(videoId);
      
      return {
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        duration: parseInt(info.videoDetails.lengthSeconds)
      };
    } catch (error: any) {
      if (error.message.includes('Video unavailable')) {
        throw new Error('Vídeo não encontrado no YouTube');
      }
      throw error;
    }
  }

  /**
   * Calcula o tamanho estimado do arquivo MP3 com base na duração
   */
  public static calculateFileSize(duration: number, bitrate = 128): number {
    // Fórmula: (bitrate * duração) / 8 / 1024 = tamanho em MB
    return ((bitrate * duration) / 8) / 1024;
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
        quality: 'highestaudio'
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

  /**
   * Versão avançada do download com verificação de tamanho e upload personalizado
   * para bucket específico do usuário
   */
  public static async advancedDownload(
    videoId: string, 
    userId: string, 
    itemId: string
  ): Promise<{
    message: string;
    file_name: string;
    user_id: string;
    item_id: string;
    download_url?: string;
  }> {
    // Obtém informações do vídeo
    const { title, author, duration } = await this.getVideoInfo(videoId);
    
    // Calcular tamanho estimado
    const sizeInMb = this.calculateFileSize(duration);
    
    // Verificar limite de tamanho (40MB)
    const MAX_SIZE_MB = 40;
    if (sizeInMb > MAX_SIZE_MB) {
      const error = new Error('Arquivo muito grande');
      // Adiciona propriedades ao erro
      (error as any).size = `${sizeInMb.toFixed(2)} MB`;
      (error as any).max_size = `${MAX_SIZE_MB} MB`;
      (error as any).status_code = 413;
      throw error;
    }
    
    // Gera nome do arquivo com informações
    const fileInfo: FileInfo = { 
      t: title, 
      a: author, 
      s: sizeInMb.toFixed(2) 
    };
    const fileName = generateFileName(fileInfo);
    
    // Faz download do vídeo
    return new Promise((resolve, reject) => {
      const stream = ytdl(videoId, {
        filter: 'audioonly',
        quality: 'highestaudio'
      });
      
      const chunks: Buffer[] = [];
      
      stream.on('data', (chunk) => chunks.push(chunk));
      
      stream.on('end', async () => {
        try {
          // Constrói o arquivo de áudio a partir dos chunks
          const fileData = Buffer.concat(chunks);
          
          // Faz upload para o bucket do usuário no Supabase
          await uploadToUserBucket(fileName, fileData, userId, itemId);
          
          resolve({
            message: 'Download concluído com sucesso',
            file_name: fileName,
            user_id: userId,
            item_id: itemId
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