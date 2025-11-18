// Supabase client for mobile app

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { ImageData, Fase, SubEtapa, Mapa, UserRole } from '../types';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate keys are set and not placeholders
const hasValidKeys = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_ANON_KEY_HERE' && 
  supabaseAnonKey !== 'YOUR_ANON_KEY_HERE' &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey.length > 20
);

if (!hasValidKeys) {
  console.warn('⚠️ Missing Supabase environment variables. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env file');
}

// Create client with valid keys or use a safe fallback
let supabaseClient;
try {
  if (hasValidKeys) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    // Use a minimal valid client to avoid initialization errors
    supabaseClient = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Fallback to a minimal client
  supabaseClient = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder');
}

export const supabase = supabaseClient;

// Storage bucket name
export const IMAGES_BUCKET = 'symbolic-images';

/**
 * Upload an image file to Supabase storage
 */
export async function uploadImage(uri: string, fileName: string): Promise<string> {
  // Convert URI to blob
  const response = await fetch(uri);
  const blob = await response.blob();
  
  const fileExt = fileName.split('.').pop() || 'jpg';
  const filePath = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(filePath, blob, {
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
 * Save image metadata to database
 */
export async function saveImageMetadata(
  imageData: Omit<ImageData, 'id' | 'created_at' | 'fase' | 'sub_etapa' | 'mapa'>
): Promise<ImageData> {
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
 * Call the analyze API endpoint
 */
export async function analyzeImage(imageUrl: string): Promise<{
  title: string;
  description: string;
  tags: string[];
  fase_id: string;
  sub_etapa_id: string;
  mapa_id: string;
}> {
  // Get the API URL - adjust this to match your Next.js app URL
  const apiUrl = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
  
  const response = await fetch(`${apiUrl}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze image');
  }

  const result = await response.json();
  return result.data;
}

