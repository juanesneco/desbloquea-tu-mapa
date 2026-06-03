// Supabase client for mobile app

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { File } from 'expo-file-system';
import { ImageData, Fase, SubEtapa, Mapa, UserRole } from '../types';

const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  '';
const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  '';

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

function getStoragePathFromPublicUrl(publicUrl: string): string {
  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${IMAGES_BUCKET}/`;
    const index = url.pathname.indexOf(marker);
    if (index === -1) {
      throw new Error('Invalid storage URL');
    }
    return decodeURIComponent(url.pathname.slice(index + marker.length));
  } catch (error) {
    // Fallback for already relative paths
    if (publicUrl.includes(`${IMAGES_BUCKET}/`)) {
      return publicUrl.split(`${IMAGES_BUCKET}/`)[1];
    }
    throw new Error('Unable to determine storage path from URL');
  }
}

/**
 * List all images from Supabase storage
 */
export async function listUploadedImages(): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .list('uploads', {
      limit: 100,
      offset: 0,
    });

  if (error) {
    throw new Error(`Failed to list images: ${error.message}`);
  }

  // Filter for image files and get public URLs
  // Sort by name (which includes timestamp) in descending order
  const imageFiles = (data || [])
    .filter((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
    })
    .sort((a, b) => b.name.localeCompare(a.name)) // Sort descending (newest first)
    .map((file) => {
      const { data: urlData } = supabase.storage
        .from(IMAGES_BUCKET)
        .getPublicUrl(`uploads/${file.name}`);
      return urlData.publicUrl;
    });

  return imageFiles;
}

/**
 * Upload an image file to Supabase storage (React Native compatible)
 */
export async function uploadImage(uri: string, mimeType?: string): Promise<string> {
  // Validate inputs
  if (!uri || typeof uri !== 'string') {
    throw new Error('Invalid image URI provided');
  }

  // Validate Supabase client
  if (!hasValidKeys) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
  }

  try {
    // Read file info first to get size
    const file = new File(uri);
    const fileInfo = file.info();
    if (!fileInfo.exists) {
      throw new Error('Image file does not exist');
    }

    // Check file size (limit to 10MB to prevent memory issues)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const fileSize = fileInfo.size ?? file.size ?? 0;
    if (fileSize > MAX_FILE_SIZE) {
      throw new Error(`Image file is too large (${Math.round(fileSize / 1024 / 1024)}MB). Maximum size is 10MB.`);
    }

    // Read file bytes using the new File API to avoid deprecated legacy methods
    const fileBytes = await file.bytes();
    if (!fileBytes || fileBytes.length === 0) {
      throw new Error('Failed to read image file. File may be corrupted or empty.');
    }

    // Determine file extension and MIME type from URI or provided mimeType
    let fileExt = 'jpg';
    let contentType = 'image/jpeg';
    
    if (mimeType) {
      // Use provided mimeType
      contentType = mimeType;
      const mimeToExt: { [key: string]: string } = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
      };
      fileExt = mimeToExt[mimeType] || 'jpg';
    } else {
      // Try to extract from URI
      const uriLower = uri.toLowerCase();
      if (uriLower.includes('.png')) {
        fileExt = 'png';
        contentType = 'image/png';
      } else if (uriLower.includes('.gif')) {
        fileExt = 'gif';
        contentType = 'image/gif';
      } else if (uriLower.includes('.webp')) {
        fileExt = 'webp';
        contentType = 'image/webp';
      } else {
        // Default to jpg/jpeg
        fileExt = 'jpg';
        contentType = 'image/jpeg';
      }
    }
    
    const filePath = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload using Uint8Array (works in React Native)
    const { error: uploadError } = await supabase.storage
      .from(IMAGES_BUCKET)
      .upload(filePath, fileBytes, {
        cacheControl: '3600',
        upsert: false,
        contentType: contentType,
      });

    if (uploadError) {
      // Provide more specific error messages
      if (uploadError.message.includes('Bucket not found')) {
        throw new Error('Storage bucket not found. Please check your Supabase configuration.');
      } else if (uploadError.message.includes('new row violates row-level security')) {
        throw new Error('Permission denied. Please check your storage policies.');
      } else {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(IMAGES_BUCKET)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Upload succeeded but failed to get public URL');
    }

    return urlData.publicUrl;
  } catch (error: any) {
    // Re-throw with context if it's not already an Error
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Upload failed: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Delete an image file and its metadata entry
 */
export async function deleteImageRecord(imageId: string, fileUrl: string): Promise<void> {
  if (!imageId) {
    throw new Error('Image ID is required for deletion');
  }
  if (!fileUrl) {
    throw new Error('File URL is required for deletion');
  }

  const filePath = getStoragePathFromPublicUrl(fileUrl);

  const { error: storageError } = await supabase.storage
    .from(IMAGES_BUCKET)
    .remove([filePath]);

  if (storageError && !storageError.message.includes('Object not found')) {
    throw new Error(`Failed to delete storage file: ${storageError.message}`);
  }

  const { error: deleteError } = await supabase
    .from('images')
    .delete()
    .eq('id', imageId);

  if (deleteError) {
    throw new Error(`Failed to delete image metadata: ${deleteError.message}`);
  }
}

/**
 * Delete by URL (used in gallery when we only have the public path)
 * Attempts to remove storage object and matching metadata row (best-effort for metadata).
 */
export async function deleteImageByUrl(fileUrl: string): Promise<void> {
  if (!fileUrl) {
    throw new Error('File URL is required for deletion');
  }

  const filePath = getStoragePathFromPublicUrl(fileUrl);

  const { error: storageError } = await supabase.storage
    .from(IMAGES_BUCKET)
    .remove([filePath]);

  if (storageError) {
    throw new Error(`Failed to delete storage file: ${storageError.message}`);
  }

  const { error: metadataError } = await supabase
    .from('images')
    .delete()
    .eq('file_url', fileUrl);

  if (metadataError) {
    console.warn('Failed to delete metadata entry for image:', metadataError.message);
  }
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
