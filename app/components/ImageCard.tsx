// Refined gallery card with new metadata display

'use client';

import { useState } from 'react';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { ImageData } from '@/types';
import { updateImageMetadata, deleteImage } from '@/lib/supabaseClient';

interface ImageCardProps {
  image: ImageData;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export default function ImageCard({ image, onUpdate, onDelete }: ImageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(image.title);
  const [editedDescription, setEditedDescription] = useState(image.description);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateImageMetadata(image.id, {
        title: editedTitle,
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
    setEditedDescription(image.description);
    setIsEditing(false);
  };

  const meta = [
    { label: 'Fase', value: image.fase?.nombre ?? '—' },
    { label: 'Sub-etapa', value: image.sub_etapa ? `${image.sub_etapa.codigo} · ${image.sub_etapa.nombre}` : '—' },
    { label: 'Mapa', value: image.mapa?.nombre ?? '—' },
  ];

  return (
    <div className="glass-panel group flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/60">
        <img src={image.file_url} alt={image.title} className="h-64 w-full object-cover" />
        {!isEditing && (
          <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-full border border-white/80 bg-white/90 p-2 text-primary shadow"
              title="Editar"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="rounded-full border border-white/80 bg-white/90 p-2 text-red-500 shadow"
              title="Eliminar"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="label">Título</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={4}
              className="input"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-primary flex-1 justify-center"
            >
              <Save size={16} />
              Guardar
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="btn-secondary flex-1 justify-center"
            >
              <X size={16} />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">
              {new Date(image.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h3 className="mt-2 text-2xl font-semibold">{image.title}</h3>
          </div>
          <div className="rounded-2xl border border-border bg-white/70 p-4 text-sm text-primary">
            <p className="label mb-2">Coordenadas</p>
            <div className="space-y-2">
              {meta.map((item) => (
                <div key={item.label} className="flex justify-between text-xs uppercase tracking-[0.3em] text-primary-light">
                  <span>{item.label}</span>
                  <span className="text-right text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-primary-light">{image.description}</p>
          {image.tags && image.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-primary-light">
              {image.tags.map((tag, index) => (
                <span key={tag + index} className="rounded-full border border-border px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
*** End Patch
