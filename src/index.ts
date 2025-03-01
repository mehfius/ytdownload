import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './config';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

// Valida a configuração necessária
try {
  validateConfig();
} catch (error) {
  console.error('Erro na configuração:', error);
  process.exit(1);
}

// Inicializa o aplicativo Express
const app = express();

// Middleware global
app.use(cors({ origin: true }));
app.use(express.json());

// Rotas
app.use(routes);

// Middleware de erro
app.use(errorHandler);

// Inicia o servidor
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Healthcheck disponível em: http://localhost:${PORT}/health`);
});