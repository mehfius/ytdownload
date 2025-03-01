"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
// Valida a configuração necessária
try {
    (0, config_1.validateConfig)();
}
catch (error) {
    console.error('Erro na configuração:', error);
    process.exit(1);
}
// Inicializa o aplicativo Express
const app = (0, express_1.default)();
// Middleware global
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
// Rotas
app.use(routes_1.default);
// Middleware de erro
app.use(error_middleware_1.errorHandler);
// Inicia o servidor
const PORT = config_1.config.port;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Healthcheck disponível em: http://localhost:${PORT}/health`);
});
//# sourceMappingURL=index.js.map