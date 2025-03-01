"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Carrega as variáveis de ambiente do arquivo .env
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 8080,
    supabase: {
        url: process.env.SUPABASE_URL || 'https://kgwnnqbpohhldfroogmm.supabase.co',
        token: process.env.SUPABASE_TOKEN || '',
    }
};
// Valida a configuração necessária
const validateConfig = () => {
    if (!exports.config.supabase.token) {
        throw new Error('SUPABASE_TOKEN não está definido nas variáveis de ambiente');
    }
};
exports.validateConfig = validateConfig;
//# sourceMappingURL=index.js.map