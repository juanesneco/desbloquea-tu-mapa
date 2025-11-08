// Added by AI Monorepo Setup

import Link from 'next/link';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-primary mb-6">
          Desbloquea Tu Mapa
        </h1>
        <p className="text-xl text-primary-light max-w-2xl mx-auto mb-8">
          Una herramienta de IA para interpretar tus imágenes simbólicas y explorar 
          los territorios emocionales de tu ser.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/upload" className="btn-primary inline-flex items-center gap-2">
            <Upload size={20} />
            Subir Primera Imagen
          </Link>
          <Link href="/gallery" className="btn-secondary inline-flex items-center gap-2">
            <ImageIcon size={20} />
            Ver Galería
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="card text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="text-accent" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-3">Sube tu Imagen</h3>
          <p className="text-primary-light">
            Comparte una fotografía, dibujo o símbolo que resuene contigo.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-accent" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-3">Análisis Inteligente</h3>
          <p className="text-primary-light">
            La IA interpreta el contenido simbólico y emocional de tu imagen.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="text-accent" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-3">Construye tu Galería</h3>
          <p className="text-primary-light">
            Organiza y reflexiona sobre tus símbolos personales en un solo lugar.
          </p>
        </div>
      </div>

      {/* Philosophy Connection */}
      <div className="card bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Conecta con la Filosofía
        </h2>
        <p className="text-primary-light text-center max-w-3xl mx-auto mb-6">
          Esta aplicación es el primer módulo funcional de <strong>Desbloquea tu Mapa</strong>, 
          una filosofía de autoconocimiento que usa símbolos, arquetipos y territorios emocionales 
          para ayudarte a encontrar tu poder auténtico.
        </p>
        <div className="text-center">
          <a 
            href="../website/index.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-dark font-medium underline"
          >
            Explorar la filosofía completa →
          </a>
        </div>
      </div>

      {/* Categories Preview */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Categorías de Exploración
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            'Infancia',
            'Cuerpo',
            'Relaciones',
            'Miedo',
            'Propósito',
            'Presencia',
            'Transformación',
            'Identidad',
            'Poder',
          ].map((category) => (
            <div
              key={category}
              className="bg-white border border-border rounded-lg p-4 text-center hover:border-accent hover:shadow-md transition-all duration-200"
            >
              <span className="text-primary font-medium">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

