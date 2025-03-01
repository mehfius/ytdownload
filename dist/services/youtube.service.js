"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeService = void 0;
const ytdl_core_1 = __importDefault(require("@distube/ytdl-core"));
const supabase_1 = require("../utils/supabase");
class YouTubeService {
    /**
     * Valida o ID do vídeo do YouTube
     */
    static validateVideoId(videoId) {
        return ytdl_core_1.default.validateID(videoId);
    }
    /**
     * Obtém informações do vídeo do YouTube
     */
    static async getVideoInfo(videoId) {
        try {
            const info = await ytdl_core_1.default.getInfo(videoId);
            return {
                title: info.videoDetails.title,
                author: info.videoDetails.author.name,
                duration: parseInt(info.videoDetails.lengthSeconds)
            };
        }
        catch (error) {
            if (error.message.includes('Video unavailable')) {
                throw new Error('Vídeo não encontrado no YouTube');
            }
            throw error;
        }
    }
    /**
     * Calcula o tamanho estimado do arquivo MP3 com base na duração
     */
    static calculateFileSize(duration, bitrate = 128) {
        // Fórmula: (bitrate * duração) / 8 / 1024 = tamanho em MB
        return ((bitrate * duration) / 8) / 1024;
    }
    /**
     * Baixa um vídeo do YouTube
     * Se o arquivo já existir no Supabase, retorna a URL diretamente
     * Caso contrário, baixa o áudio, faz upload e retorna a URL
     */
    static async downloadVideo(videoId) {
        // Obtém informações do vídeo
        const { title, author } = await this.getVideoInfo(videoId);
        // Gera nome do arquivo
        const fileInfo = { t: title, a: author };
        const fileName = (0, supabase_1.generateFileName)(fileInfo);
        // Verifica se o arquivo já existe
        const fileExists = await (0, supabase_1.checkFileExists)(fileName);
        if (fileExists) {
            const downloadUrl = (0, supabase_1.getDownloadUrl)(fileName);
            return {
                message: 'Arquivo já existe',
                file_name: fileName,
                download_url: downloadUrl,
                existed: true
            };
        }
        // Faz download do vídeo
        return new Promise((resolve, reject) => {
            const stream = (0, ytdl_core_1.default)(videoId, {
                filter: 'audioonly',
                quality: 'highestaudio'
            });
            const chunks = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', async () => {
                try {
                    // Constrói o arquivo de áudio a partir dos chunks
                    const fileData = Buffer.concat(chunks);
                    // Faz upload para o Supabase
                    await (0, supabase_1.uploadFile)(fileName, fileData);
                    // Retorna a URL de download
                    const downloadUrl = (0, supabase_1.getDownloadUrl)(fileName);
                    resolve({
                        message: 'Download concluído com sucesso',
                        file_name: fileName,
                        download_url: downloadUrl,
                        existed: false
                    });
                }
                catch (error) {
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
    static async advancedDownload(videoId, userId, itemId) {
        // Obtém informações do vídeo
        const { title, author, duration } = await this.getVideoInfo(videoId);
        // Calcular tamanho estimado
        const sizeInMb = this.calculateFileSize(duration);
        // Verificar limite de tamanho (40MB)
        const MAX_SIZE_MB = 40;
        if (sizeInMb > MAX_SIZE_MB) {
            const error = new Error('Arquivo muito grande');
            // Adiciona propriedades ao erro
            error.size = `${sizeInMb.toFixed(2)} MB`;
            error.max_size = `${MAX_SIZE_MB} MB`;
            error.status_code = 413;
            throw error;
        }
        // Gera nome do arquivo com informações
        const fileInfo = {
            t: title,
            a: author,
            s: sizeInMb.toFixed(2)
        };
        const fileName = (0, supabase_1.generateFileName)(fileInfo);
        // Faz download do vídeo
        return new Promise((resolve, reject) => {
            const stream = (0, ytdl_core_1.default)(videoId, {
                filter: 'audioonly',
                quality: 'highestaudio'
            });
            const chunks = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', async () => {
                try {
                    // Constrói o arquivo de áudio a partir dos chunks
                    const fileData = Buffer.concat(chunks);
                    // Faz upload para o bucket do usuário no Supabase
                    await (0, supabase_1.uploadToUserBucket)(fileName, fileData, userId, itemId);
                    resolve({
                        message: 'Download concluído com sucesso',
                        file_name: fileName,
                        user_id: userId,
                        item_id: itemId
                    });
                }
                catch (error) {
                    reject(new Error('Erro ao fazer upload do arquivo'));
                }
            });
            stream.on('error', (error) => {
                reject(new Error('Erro ao baixar o vídeo'));
            });
        });
    }
}
exports.YouTubeService = YouTubeService;
//# sourceMappingURL=youtube.service.js.map