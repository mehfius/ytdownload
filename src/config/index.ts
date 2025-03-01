import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  supabase: {
    url: process.env.SUPABASE_URL || 'https://kgwnnqbpohhldfroogmm.supabase.co',
    token: process.env.SUPABASE_TOKEN || '',
  }
};

// Valida a configuração necessária
export const validateConfig = (): void => {
  if (!config.supabase.token) {
    throw new Error('SUPABASE_TOKEN não está definido nas variáveis de ambiente');
  }
};