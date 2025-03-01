import { Router } from 'express';
import youtubeRoutes from './youtube.routes';

const router = Router();

// Versionar a API
router.use('/api', youtubeRoutes);

// Rota de status da API
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString()
  });
});

export default router;