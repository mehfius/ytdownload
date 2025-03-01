export interface DownloadRequest {
  video_id: string;
}

export interface FileInfo {
  t: string; // título
  a: string; // autor
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
}