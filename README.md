# YouTube Downloader API

API para download de vídeos do YouTube e conversão para MP3, com armazenamento no Supabase.

## Tecnologias Utilizadas

- TypeScript
- Express.js
- @distube/ytdl-core
- Supabase Storage
- dotenv para gerenciamento de variáveis de ambiente

## Estrutura do Projeto

```
src/
├── config/         # Configurações da aplicação
├── controllers/    # Controladores para rotas
├── interfaces/     # Definições de tipos
├── middlewares/    # Middlewares Express
├── routes/         # Definições de rotas
├── services/       # Lógica de negócio
├── utils/          # Funções utilitárias
└── index.ts        # Ponto de entrada da aplicação
```

## Requisitos

- Node.js 16.x ou superior
- Conta no Supabase com bucket de armazenamento configurado

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/ytdownload.git
   cd ytdownload
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Preencha as variáveis de ambiente no arquivo `.env`:
   ```
   PORT=8080
   SUPABASE_URL=sua_url_do_supabase
   SUPABASE_TOKEN=seu_token_do_supabase
   ```

## Executando a Aplicação

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## API Endpoints

### Download de vídeo
- **URL**: `/api/download`
- **Método**: `POST`
- **Body**:
  ```json
  {
    "video_id": "ID_DO_VIDEO_DO_YOUTUBE"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "message": "Download concluído com sucesso",
    "file_name": "nome_do_arquivo.mp3",
    "download_url": "url_para_download"
  }
  ```

### Listar arquivos
- **URL**: `/api/info`
- **Método**: `GET`
- **Resposta de Sucesso**: Lista de arquivos do bucket do Supabase

### Verificação de Saúde
- **URL**: `/health`
- **Método**: `GET`
- **Resposta de Sucesso**:
  ```json
  {
    "status": "ok",
    "version": "1.0.0",
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
  ```