export declare class YouTubeService {
    /**
     * Valida o ID do vídeo do YouTube
     */
    static validateVideoId(videoId: string): boolean;
    /**
     * Obtém informações do vídeo do YouTube
     */
    static getVideoInfo(videoId: string): Promise<{
        title: string;
        author: string;
        duration: number;
    }>;
    /**
     * Calcula o tamanho estimado do arquivo MP3 com base na duração
     */
    static calculateFileSize(duration: number, bitrate?: number): number;
    /**
     * Baixa um vídeo do YouTube
     * Se o arquivo já existir no Supabase, retorna a URL diretamente
     * Caso contrário, baixa o áudio, faz upload e retorna a URL
     */
    static downloadVideo(videoId: string): Promise<{
        message: string;
        file_name: string;
        download_url: string;
        existed: boolean;
    }>;
    /**
     * Versão avançada do download com verificação de tamanho e upload personalizado
     * para bucket específico do usuário
     */
    static advancedDownload(videoId: string, userId: string, itemId: string): Promise<{
        message: string;
        file_name: string;
        user_id: string;
        item_id: string;
        download_url?: string;
    }>;
}
