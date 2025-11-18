// Updated for new Fases/Sub-etapas/Mapas structure

import { createClient } from '@supabase/supabase-js';
import { ImageData, Fase, SubEtapa, Mapa, UserRole } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name for images
export const IMAGES_BUCKET = 'symbolic-images';

/**
 * Upload an image file to Supabase storage
 */
export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(IMAGES_BUCKET)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

/**
 * Fetch all fases
 */
export async function fetchFases(): Promise<Fase[]> {
  const { data, error } = await supabase
    .from('fases')
    .select('*')
    .order('numero', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch fases: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch all sub-etapas, optionally filtered by fase
 */
export async function fetchSubEtapas(faseId?: string): Promise<SubEtapa[]> {
  let query = supabase
    .from('sub_etapas')
    .select('*')
    .order('codigo', { ascending: true });

  if (faseId) {
    query = query.eq('fase_id', faseId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch sub-etapas: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch all mapas
 */
export async function fetchMapas(): Promise<Mapa[]> {
  const { data, error } = await supabase
    .from('mapas')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch mapas: ${error.message}`);
  }

  return data || [];
}

/**
 * Get sub-etapa by codigo (e.g., '1.1', '2.3')
 */
export async function getSubEtapaByCodigo(codigo: string): Promise<SubEtapa | null> {
  const { data, error } = await supabase
    .from('sub_etapas')
    .select('*')
    .eq('codigo', codigo)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Get mapa by nombre
 */
export async function getMapaByNombre(nombre: string): Promise<Mapa | null> {
  const { data, error } = await supabase
    .from('mapas')
    .select('*')
    .eq('nombre', nombre)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Get user role
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) {
    return null;
  }

  return data?.role || null;
}

/**
 * Save image metadata to database
 */
export async function saveImageMetadata(imageData: Omit<ImageData, 'id' | 'created_at' | 'fase' | 'sub_etapa' | 'mapa'>): Promise<ImageData> {
  const { data, error } = await supabase
    .from('images')
    .insert([imageData])
    .select(`
      *,
      fase:fases(*),
      sub_etapa:sub_etapas(*),
      mapa:mapas(*)
    `)
    .single();

  if (error) {
    throw new Error(`Failed to save image metadata: ${error.message}`);
  }

  return data;
}

/**
 * Fetch all images with optional filters
 */
export async function fetchImages(filters?: {
  faseId?: string;
  subEtapaId?: string;
  mapaId?: string;
}): Promise<ImageData[]> {
  let query = supabase
    .from('images')
    .select(`
      *,
      fase:fases(*),
      sub_etapa:sub_etapas(*),
      mapa:mapas(*)
    `)
    .order('created_at', { ascending: false });

  if (filters?.faseId) {
    query = query.eq('fase_id', filters.faseId);
  }
  if (filters?.subEtapaId) {
    query = query.eq('sub_etapa_id', filters.subEtapaId);
  }
  if (filters?.mapaId) {
    query = query.eq('mapa_id', filters.mapaId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch images: ${error.message}`);
  }

  return data || [];
}

/**
 * Update image metadata
 */
export async function updateImageMetadata(
  id: string,
  updates: Partial<Pick<ImageData, 'title' | 'description' | 'tags' | 'fase_id' | 'sub_etapa_id' | 'mapa_id'>>
): Promise<ImageData> {
  const { data, error } = await supabase
    .from('images')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      fase:fases(*),
      sub_etapa:sub_etapas(*),
      mapa:mapas(*)
    `)
    .single();

  if (error) {
    throw new Error(`Failed to update image: ${error.message}`);
  }

  return data;
}

/**
 * Delete an image and its metadata
 */
export async function deleteImage(id: string, fileUrl: string): Promise<void> {
  // Extract file path from URL
  const urlParts = fileUrl.split('/');
  const filePath = `uploads/${urlParts[urlParts.length - 1]}`;

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(IMAGES_BUCKET)
    .remove([filePath]);

  if (storageError) {
    console.error('Storage deletion error:', storageError);
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from('images')
    .delete()
    .eq('id', id);

  if (dbError) {
    throw new Error(`Failed to delete image: ${dbError.message}`);
  }
}

/**
 * Search images by title or description
 */
export async function searchImages(query: string): Promise<ImageData[]> {
  const { data, error } = await supabase
    .from('images')
    .select(`
      *,
      fase:fases(*),
      sub_etapa:sub_etapas(*),
      mapa:mapas(*)
    `)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to search images: ${error.message}`);
  }

  return data || [];
}
