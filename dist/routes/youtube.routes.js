"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const youtube_controller_1 = require("../controllers/youtube.controller");
const router = (0, express_1.Router)();
/**
 * @route POST /api/download
 * @desc Faz download de um vídeo do YouTube e converte para MP3
 * @access Public
 */
router.post('/download', youtube_controller_1.YouTubeController.download);
/**
 * @route POST /api/advanced-download
 * @desc Faz download com verificação de tamanho e envia para bucket do usuário
 * @access Public
 */
router.post('/advanced-download', youtube_controller_1.YouTubeController.advancedDownload);
/**
 * @route GET /api/info
 * @desc Lista todos os arquivos no bucket
 * @access Public
 */
router.get('/info', youtube_controller_1.YouTubeController.getInfo);
exports.default = router;
//# sourceMappingURL=youtube.routes.js.map