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
- **Headers**:
  ```
  Authorization: Bearer <SUPABASE_TOKEN>
  Content-Type: application/json
  ```
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
- **Respostas de Erro**:
  - 400: Parâmetros inválidos ou faltando
  - 401: Não autorizado
  - 404: Vídeo não encontrado
  - 413: Arquivo muito grande (limite de 40MB)
  - 500: Erro interno do servidor

### Download Avançado
- **URL**: `/api/download/advanced`
- **Método**: `POST`
- **Headers**:
  ```
  Authorization: Bearer <SUPABASE_TOKEN>
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "video_id": "ID_DO_VIDEO_DO_YOUTUBE",
    "user_id": "ID_DO_USUARIO",
    "item_id": "ID_DO_ITEM"
  }
  ```
- **Respostas**: Similar ao endpoint básico de download

### Limitações
- Tamanho máximo do arquivo: 40MB
- Formato de saída: MP3
- Requer autenticação via token do Supabase

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

## Exemplos de Uso

### Requisição de Download
```bash
curl -X POST \
  -H "Authorization: Bearer SEU_TOKEN_DO_SUPABASE" \
  -H "Content-Type: application/json" \
  -d '{"video_id": "dQw4w9WgXcQ"}' \
  http://localhost:8080/api/download
```

### Requisição de Listagem de Arquivos
```bash
curl -X GET \
  -H "Authorization: Bearer SEU_TOKEN_DO_SUPABASE" \
  http://localhost:8080/api/info
```

### Requisição de Verificação de Saúde
```bash
curl -X GET http://localhost:8080/health
```

### Exemplos de Respostas de Erro
**Arquivo muito grande (413):**
```json
{
  "error": "Arquivo muito grande",
  "size": "45.23 MB",
  "max_size": "40 MB"
}
```

**Vídeo não encontrado (404):**
```json
{
  "error": "Vídeo não encontrado no YouTube"
}
```

### Exemplo de Resposta de Listagem de Arquivos
```json
{
  "files": [
    {
      "name": "video1.mp3",
      "size": "12.3 MB",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Exemplo de Resposta de Verificação de Saúde
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Limitações Adicionais
- Limite de requisições: 100 requisições por 15 minutos por IP
- Tempo máximo de download: 10 minutos
- Formato de saída: MP3
- Requer autenticação via token do Supabase

## Versionamento
A API está atualmente na versão 1.0.0