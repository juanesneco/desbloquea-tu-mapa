// Updated for new Fases/Sub-etapas/Mapas structure

// Reference data types
export interface Fase {
  id: string;
  numero: number;
  nombre: 'Inconsciencia' | 'Consciencia' | 'Creación';
  descripcion?: string;
  caracteristicas?: string[];
  territorio_visual?: string;
  created_at: string;
}

export interface SubEtapa {
  id: string;
  fase_id: string;
  codigo: string; // '1.1', '1.2', '2.1', etc.
  nombre: string;
  descripcion?: string;
  created_at: string;
}

export interface Mapa {
  id: string;
  nombre: 'Mental' | 'Físico' | 'Familiar' | 'Financiero' | 'Emocional';
  territorio?: string;
  proposito?: string;
  color_asociado?: string;
  created_at: string;
}

// Main image data type
export interface ImageData {
  id: string;
  created_at: string;
  file_url: string;
  title: string;
  description: string;
  tags: string[];
  user_id?: string;
  // New required fields (null until classified)
  fase_id?: string | null;
  sub_etapa_id?: string | null;
  mapa_id?: string | null;
  // Joined data (optional, populated when fetching with joins)
  fase?: Fase;
  sub_etapa?: SubEtapa;
  mapa?: Mapa;
}

// AI analysis result
export interface ImageAnalysis {
  title: string;
  description: string;
  tags: string[];
  // Required classifications
  fase_id: string;
  sub_etapa_id: string;
  mapa_id: string;
}

// User role type
export type UserRole = 'viewer' | 'contributor';

export interface UserRoleData {
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface UploadResponse {
  success: boolean;
  data?: ImageData;
  error?: string;
}
