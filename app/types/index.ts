// Added by AI Monorepo Setup

export interface ImageData {
  id: string;
  created_at: string;
  file_url: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  user_id?: string;
}

export type ImageCategory = 
  | 'Infancia'
  | 'Cuerpo'
  | 'Relaciones'
  | 'Miedo'
  | 'Propósito'
  | 'Presencia'
  | 'Transformación'
  | 'Identidad'
  | 'Poder'
  | 'Otro';

export interface ImageAnalysis {
  title: string;
  category: ImageCategory;
  description: string;
  tags: string[];
}

export interface UploadResponse {
  success: boolean;
  data?: ImageData;
  error?: string;
}

