// Gallery redesigned for phase/map filters

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Loader2, Image as ImageIcon } from 'lucide-react';
import {
  fetchImages,
  searchImages,
  fetchFases,
  fetchSubEtapas,
  fetchMapas,
} from '@/lib/supabaseClient';
import { Fase, ImageData, Mapa, SubEtapa } from '@/types';
import ImageCard from '@/components/ImageCard';
import FilterPills from '@/components/FilterPills';
import Link from 'next/link';

export default function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [baseList, setBaseList] = useState<ImageData[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageData[]>([]);
  const [fases, setFases] = useState<Fase[]>([]);
  const [subEtapas, setSubEtapas] = useState<SubEtapa[]>([]);
  const [mapas, setMapas] = useState<Mapa[]>([]);
  const [selectedFase, setSelectedFase] = useState<string>('all');
  const [selectedSubEtapa, setSelectedSubEtapa] = useState<string>('all');
  const [selectedMapa, setSelectedMapa] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const [imageData, fasesData, subEtapasData, mapasData] = await Promise.all([
          fetchImages(),
          fetchFases(),
          fetchSubEtapas(),
          fetchMapas(),
        ]);
        setImages(imageData);
        setBaseList(imageData);
        setFilteredImages(imageData);
        setFases(fasesData);
        setSubEtapas(subEtapasData);
        setMapas(mapasData);
      } catch (error) {
        console.error('Error initializing gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    applyFilters(baseList);
  }, [selectedFase, selectedSubEtapa, selectedMapa, baseList]);

  const availableSubEtapas = useMemo(() => {
    if (selectedFase === 'all') return subEtapas;
    return subEtapas.filter((se) => se.fase_id === selectedFase);
  }, [selectedFase, subEtapas]);

  const applyFilters = (list: ImageData[]) => {
    const filtered = list.filter((img) => {
      if (selectedFase !== 'all' && img.fase_id !== selectedFase) return false;
      if (selectedSubEtapa !== 'all' && img.sub_etapa_id !== selectedSubEtapa) return false;
      if (selectedMapa !== 'all' && img.mapa_id !== selectedMapa) return false;
      return true;
    });
    setFilteredImages(filtered);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setBaseList(images);
      setSearchMode(false);
      applyFilters(images);
      return;
    }

    try {
      setLoading(true);
      const results = await searchImages(searchQuery);
      setBaseList(results);
      setSearchMode(true);
      applyFilters(results);
    } catch (error) {
      console.error('Error searching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchMode(false);
    setSearchQuery('');
    setBaseList(images);
    applyFilters(images);
  };

  const refreshImages = async () => {
    const fresh = await fetchImages();
    setImages(fresh);
    setBaseList(fresh);
    applyFilters(fresh);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12 flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-light">Memoria simbólica</p>
        <h1 className="text-4xl font-semibold text-primary md:text-5xl">Tu galería de mapas conscientes</h1>
        <p className="text-sm text-primary-light md:text-base">
          Observa patrones por fase, sub-etapa y mapa. Edita títulos, refina descripciones y encuentra la narrativa que estás construyendo.
        </p>
      </div>

      <div className="glass-panel mb-12 space-y-6">
        <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-light" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título o descripción..."
              className="input h-14 rounded-full pl-12"
            />
          </div>
          <button type="submit" className="btn-primary h-14 justify-center">
            Buscar
          </button>
        </form>

        <div className="space-y-6">
          <div>
            <p className="label">Fase</p>
            <FilterPills
              value={selectedFase}
              onChange={(value) => {
                setSelectedFase(value);
                setSelectedSubEtapa('all');
              }}
              options={fases.map((fase) => ({
                label: fase.nombre,
                value: fase.id,
              }))}
            />
          </div>
          <div>
            <p className="label">Sub-etapa</p>
            <FilterPills
              value={selectedSubEtapa}
              onChange={setSelectedSubEtapa}
              options={availableSubEtapas.map((sub) => ({
                label: `${sub.codigo} ${sub.nombre}`,
                value: sub.id,
              }))}
              allLabel={selectedFase === 'all' ? 'Todas' : 'Todas en esta fase'}
            />
          </div>
          <div>
            <p className="label">Mapa</p>
            <FilterPills
              value={selectedMapa}
              onChange={setSelectedMapa}
              options={mapas.map((mapa) => ({
                label: mapa.nombre,
                value: mapa.id,
              }))}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">
          <span>
            {searchMode && searchQuery
              ? `Resultados para "${searchQuery}" · ${filteredImages.length}`
              : `${filteredImages.length} registros`}
          </span>
          <div className="flex gap-4">
            {searchMode && (
              <button onClick={clearSearch} className="text-primary hover:text-primary-dark">
                Limpiar búsqueda
              </button>
            )}
            <Link href="/upload" className="btn-secondary">
              Añadir imagen
            </Link>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      )}

      {!loading && filteredImages.length === 0 && (
        <div className="glass-panel text-center">
          <ImageIcon className="mx-auto mb-4 text-primary-light" size={48} />
          <h3 className="text-2xl font-semibold text-primary">
            {searchMode ? 'Sin coincidencias' : 'Aún no hay símbolos'}
          </h3>
          <p className="mt-2 text-sm text-primary-light">
            {searchMode ? 'Prueba con otra palabra clave o limpia los filtros.' : 'Sube tu primera imagen para comenzar tu archivo simbólico.'}
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/upload" className="btn-primary">
              Subir imagen
            </Link>
          </div>
        </div>
      )}

      {!loading && filteredImages.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredImages.map((image) => (
            <ImageCard key={image.id} image={image} onUpdate={refreshImages} onDelete={refreshImages} />
          ))}
        </div>
      )}
    </div>
  );
}
