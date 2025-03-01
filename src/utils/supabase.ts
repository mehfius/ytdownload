import { config } from '../config';
import { FileInfo } from '../interfaces';

/**
 * Verifica se um arquivo existe no Supabase Storage
 */
export const checkFileExists = async (fileName: string): Promise<boolean> => {
  const checkUrl = `${config.supabase.url}/storage/v1/object/info/all/${fileName}`;
  
  try {
    const response = await fetch(checkUrl, {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${config.supabase.token}`
      }
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Lista os arquivos no bucket do Supabase
 */
export const listFiles = async (limit = 100, offset = 0): Promise<any> => {
  const listUrl = `${config.supabase.url}/storage/v1/object/list/all`;
  
  const response = await fetch(listUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.supabase.token}`
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

/**
 * Faz upload de um arquivo para o Supabase Storage
 */
export const uploadFile = async (fileName: string, fileData: Buffer): Promise<void> => {
  const uploadUrl = `${config.supabase.url}/storage/v1/object/all/${fileName}`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'audio/mpeg',
      'Authorization': `Bearer ${config.supabase.token}`
    },
    body: fileData
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(`Erro no upload: ${JSON.stringify(errorResponse)}`);
  }
};

/**
 * Gera um nome de arquivo baseado nas informações do vídeo
 */
export const generateFileName = (fileInfo: FileInfo): string => {
  const encodedJson = Buffer.from(JSON.stringify(fileInfo)).toString('base64');
  return `${encodedJson}.mp3`;
};

/**
 * Gera a URL de download para um arquivo
 */
export const getDownloadUrl = (fileName: string): string => {
  return `${config.supabase.url}/storage/v1/object/public/all/${fileName}`;
};