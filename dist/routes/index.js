"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const youtube_routes_1 = __importDefault(require("./youtube.routes"));
const router = (0, express_1.Router)();
// Versionar a API
router.use('/api', youtube_routes_1.default);
// Rota de status da API
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        version: process.env.npm_package_version || '1.0.0',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map