// Added by AI Monorepo Setup

'use client';

import { ImageCategory } from '@/types';

interface CategoryFilterProps {
  categories: (ImageCategory | 'all')[];
  selectedCategory: ImageCategory | 'all';
  onSelectCategory: (category: ImageCategory | 'all') => void;
}

const CATEGORY_LABELS: Record<ImageCategory | 'all', string> = {
  all: 'Todas',
  Infancia: 'Infancia',
  Cuerpo: 'Cuerpo',
  Relaciones: 'Relaciones',
  Miedo: 'Miedo',
  Propósito: 'Propósito',
  Presencia: 'Presencia',
  Transformación: 'Transformación',
  Identidad: 'Identidad',
  Poder: 'Poder',
  Otro: 'Otro',
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            selectedCategory === category
              ? 'bg-accent text-white shadow-md'
              : 'bg-white text-primary-light border border-border hover:border-accent hover:text-accent'
          }`}
        >
          {CATEGORY_LABELS[category]}
        </button>
      ))}
    </div>
  );
}

