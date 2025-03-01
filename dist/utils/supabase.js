"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDownloadUrl = exports.generateFileName = exports.uploadToUserBucket = exports.uploadFile = exports.listFiles = exports.checkFileExists = void 0;
const config_1 = require("../config");
/**
 * Verifica se um arquivo existe no Supabase Storage
 */
const checkFileExists = async (fileName) => {
    const checkUrl = `${config_1.config.supabase.url}/storage/v1/object/info/all/${fileName}`;
    try {
        const response = await fetch(checkUrl, {
            method: 'HEAD',
            headers: {
                'Authorization': `Bearer ${config_1.config.supabase.token}`
            }
        });
        return response.ok;
    }
    catch (error) {
        return false;
    }
};
exports.checkFileExists = checkFileExists;
/**
 * Lista os arquivos no bucket do Supabase
 */
const listFiles = async (limit = 100, offset = 0) => {
    const listUrl = `${config_1.config.supabase.url}/storage/v1/object/list/all`;
    const response = await fetch(listUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config_1.config.supabase.token}`
        },
        body: JSON.stringify({
            prefix: '',
            limit,
            offset,
            sortBy: {
                column: 'name',
                order: 'asc'
            }
        })
    });
    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Erro ao listar arquivos: ${JSON.stringify(errorResponse)}`);
    }
    return response.json();
};
exports.listFiles = listFiles;
/**
 * Faz upload de um arquivo para o Supabase Storage
 */
const uploadFile = async (fileName, fileData) => {
    const uploadUrl = `${config_1.config.supabase.url}/storage/v1/object/all/${fileName}`;
    const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'audio/mpeg',
            'Authorization': `Bearer ${config_1.config.supabase.token}`
        },
        body: fileData
    });
    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Erro no upload: ${JSON.stringify(errorResponse)}`);
    }
};
exports.uploadFile = uploadFile;
/**
 * Faz upload de um arquivo para um bucket personalizado do usuário no Supabase Storage
 */
const uploadToUserBucket = async (fileName, fileData, userId, itemId) => {
    const uploadUrl = `${config_1.config.supabase.url}/storage/v1/object/mp3/${userId}/${itemId}/${fileName}`;
    const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'audio/mpeg',
            'Authorization': `Bearer ${config_1.config.supabase.token}`
        },
        body: fileData
    });
    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Erro no upload: ${JSON.stringify(errorResponse)}`);
    }
};
exports.uploadToUserBucket = uploadToUserBucket;
/**
 * Gera um nome de arquivo baseado nas informações do vídeo
 */
const generateFileName = (fileInfo) => {
    const encodedJson = Buffer.from(JSON.stringify(fileInfo)).toString('base64');
    return `${encodedJson}.mp3`;
};
exports.generateFileName = generateFileName;
/**
 * Gera a URL de download para um arquivo
 */
const getDownloadUrl = (fileName) => {
    return `${config_1.config.supabase.url}/storage/v1/object/public/all/${fileName}`;
};
exports.getDownloadUrl = getDownloadUrl;
//# sourceMappingURL=supabase.js.map