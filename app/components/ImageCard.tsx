// Added by AI Monorepo Setup

'use client';

import { useState } from 'react';
import { ImageData, ImageCategory } from '@/types';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { updateImageMetadata, deleteImage } from '@/lib/supabaseClient';

interface ImageCardProps {
  image: ImageData;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const CATEGORIES: ImageCategory[] = [
  'Infancia',
  'Cuerpo',
  'Relaciones',
  'Miedo',
  'Propósito',
  'Presencia',
  'Transformación',
  'Identidad',
  'Poder',
  'Otro',
];

export default function ImageCard({ image, onUpdate, onDelete }: ImageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(image.title);
  const [editedCategory, setEditedCategory] = useState<ImageCategory>(image.category as ImageCategory);
  const [editedDescription, setEditedDescription] = useState(image.description);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateImageMetadata(image.id, {
        title: editedTitle,
        category: editedCategory,
        description: editedDescription,
      });
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Error al actualizar la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteImage(image.id, image.file_url);
      onDelete?.();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error al eliminar la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(image.title);
    setEditedCategory(image.category as ImageCategory);
    setEditedDescription(image.description);
    setIsEditing(false);
  };

  return (
    <div className="card group hover:shadow-lg transition-all duration-200">
      {/* Image */}
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-video bg-gray-100">
        <img
          src={image.file_url}
          alt={image.title}
          className="w-full h-full object-cover"
        />
        {/* Action Buttons */}
        {!isEditing && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
              title="Editar"
            >
              <Edit2 size={16} className="text-accent" />
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
              title="Eliminar"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        // Edit Mode
        <div className="space-y-3">
          <div>
            <label className="label text-xs">Título</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="input text-sm"
            />
          </div>
          <div>
            <label className="label text-xs">Categoría</label>
            <select
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value as ImageCategory)}
              className="input text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label text-xs">Descripción</label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={3}
              className="input text-sm resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-accent hover:bg-accent-dark text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save size={14} />
              Guardar
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <X size={14} />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        // View Mode
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-primary line-clamp-2 flex-1">
              {image.title}
            </h3>
          </div>
          <span className="inline-block bg-accent/10 text-accent px-2 py-1 rounded text-xs font-medium mb-3">
            {image.category}
          </span>
          <p className="text-sm text-primary-light line-clamp-3 mb-3">
            {image.description}
          </p>
          {image.tags && image.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {image.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-primary-light px-2 py-0.5 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-primary-light">
            {new Date(image.created_at).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
}

