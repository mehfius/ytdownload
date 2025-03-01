export interface DownloadRequest {
  video_id: string;
}

export interface AdvancedDownloadRequest {
  video_id: string;
  user_id: string;
  item_id: string;
}

export interface FileInfo {
  t: string; // título
  a: string; // autor
  s?: string; // tamanho em MB (opcional)
}

export interface DownloadResponse {
  message: string;
  file_name: string;
  download_url: string;
}

export interface ErrorResponse {
  error: string;
  supabase_error?: any;
  status_code?: number;
  size?: string;
  max_size?: string;
}