// Added by AI Monorepo Setup

'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Loader2, Image as ImageIcon } from 'lucide-react';
import { fetchImages, searchImages } from '@/lib/supabaseClient';
import { ImageData, ImageCategory } from '@/types';
import ImageCard from '@/components/ImageCard';
import CategoryFilter from '@/components/CategoryFilter';

const CATEGORIES: (ImageCategory | 'all')[] = [
  'all',
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

export default function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (searchMode && searchQuery.trim()) {
      performSearch();
    } else {
      filterByCategory();
    }
  }, [selectedCategory, images]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await fetchImages();
      setImages(data);
      setFilteredImages(data);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = () => {
    if (selectedCategory === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === selectedCategory));
    }
    setSearchMode(false);
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      filterByCategory();
      return;
    }

    try {
      setLoading(true);
      const results = await searchImages(searchQuery);
      setFilteredImages(results);
      setSearchMode(true);
    } catch (error) {
      console.error('Error searching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const handleImageUpdate = () => {
    loadImages();
  };

  const handleImageDelete = () => {
    loadImages();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Tu Galería Simbólica
        </h1>
        <p className="text-lg text-primary-light">
          Explora y reflexiona sobre tus símbolos personales
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-light" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título o descripción..."
              className="input pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">
            Buscar
          </button>
        </form>

        {/* Category Filter */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 text-primary-light whitespace-nowrap">
            <Filter size={20} />
            <span className="font-medium">Filtrar:</span>
          </div>
          <CategoryFilter
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center text-sm text-primary-light">
          <span>
            {searchMode && searchQuery ? (
              <>Resultados para "{searchQuery}": {filteredImages.length}</>
            ) : (
              <>{filteredImages.length} {filteredImages.length === 1 ? 'imagen' : 'imágenes'}</>
            )}
          </span>
          {searchMode && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchMode(false);
                filterByCategory();
              }}
              className="text-accent hover:text-accent-dark"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-accent" size={48} />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredImages.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon className="mx-auto text-primary-light mb-4" size={64} />
          <h3 className="text-xl font-semibold text-primary mb-2">
            {searchMode ? 'No se encontraron resultados' : 'Aún no hay imágenes'}
          </h3>
          <p className="text-primary-light mb-6">
            {searchMode 
              ? 'Intenta con otros términos de búsqueda' 
              : 'Comienza subiendo tu primera imagen simbólica'}
          </p>
          {!searchMode && (
            <a href="/upload" className="btn-primary inline-block">
              Subir Primera Imagen
            </a>
          )}
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && filteredImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onUpdate={handleImageUpdate}
              onDelete={handleImageDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

