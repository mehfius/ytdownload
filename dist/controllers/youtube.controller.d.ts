import { Request, Response } from 'express';
export declare class YouTubeController {
    /**
     * Rota para download de vídeo
     */
    static download(req: Request, res: Response): Promise<Response>;
    /**
     * Rota avançada para download com verificação de tamanho e upload em bucket do usuário
     */
    static advancedDownload(req: Request, res: Response): Promise<Response>;
    /**
     * Rota para listar arquivos
     */
    static getInfo(req: Request, res: Response): Promise<Response>;
}
