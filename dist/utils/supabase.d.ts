import { FileInfo } from '../interfaces';
/**
 * Verifica se um arquivo existe no Supabase Storage
 */
export declare const checkFileExists: (fileName: string) => Promise<boolean>;
/**
 * Lista os arquivos no bucket do Supabase
 */
export declare const listFiles: (limit?: number, offset?: number) => Promise<any>;
/**
 * Faz upload de um arquivo para o Supabase Storage
 */
export declare const uploadFile: (fileName: string, fileData: Buffer) => Promise<void>;
/**
 * Faz upload de um arquivo para um bucket personalizado do usuário no Supabase Storage
 */
export declare const uploadToUserBucket: (fileName: string, fileData: Buffer, userId: string, itemId: string) => Promise<void>;
/**
 * Gera um nome de arquivo baseado nas informações do vídeo
 */
export declare const generateFileName: (fileInfo: FileInfo) => string;
/**
 * Gera a URL de download para um arquivo
 */
export declare const getDownloadUrl: (fileName: string) => string;
