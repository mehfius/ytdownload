import { Router } from 'express';
import { YouTubeController } from '../controllers/youtube.controller';

const router = Router();

/**
 * @route POST /api/download
 * @desc Faz download de um vídeo do YouTube e converte para MP3
 * @access Public
 */
router.post('/download', YouTubeController.download);

/**
 * @route POST /api/advanced-download
 * @desc Faz download com verificação de tamanho e envia para bucket do usuário
 * @access Public
 */
router.post('/advanced-download', YouTubeController.advancedDownload);

/**
 * @route GET /api/info
 * @desc Lista todos os arquivos no bucket
 * @access Public
 */
router.get('/info', YouTubeController.getInfo);

export default router;