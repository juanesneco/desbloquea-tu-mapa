// Added by AI Monorepo Setup

import { createClient } from '@supabase/supabase-js';
import { ImageData } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
 * Save image metadata to database
 */
export async function saveImageMetadata(imageData: Omit<ImageData, 'id' | 'created_at'>): Promise<ImageData> {
  const { data, error } = await supabase
    .from('images')
    .insert([imageData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save image metadata: ${error.message}`);
  }

  return data;
}

/**
 * Fetch all images with optional category filter
 */
export async function fetchImages(category?: string): Promise<ImageData[]> {
  let query = supabase
    .from('images')
    .select('*')
    .order('created_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
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
  updates: Partial<Pick<ImageData, 'title' | 'category' | 'description' | 'tags'>>
): Promise<ImageData> {
  const { data, error } = await supabase
    .from('images')
    .update(updates)
    .eq('id', id)
    .select()
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
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to search images: ${error.message}`);
  }

  return data || [];
}

