// Added by AI Monorepo Setup

'use client';

import { useState } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle, Sparkles, ArrowUpRight } from 'lucide-react';
import { uploadImage, saveImageMetadata } from '@/lib/supabaseClient';
import { analyzeImage } from '@/lib/analyzeImage';
import { ImageData } from '@/types';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<ImageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus('idle');
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      // Step 1: Upload image to Supabase
      setStatus('uploading');
      const fileUrl = await uploadImage(file);

      // Step 2: Analyze with AI
      setStatus('analyzing');
      const analysis = await analyzeImage(fileUrl);

      // Step 3: Save to database
      const imageData = await saveImageMetadata({
        file_url: fileUrl,
        title: analysis.title,
        description: analysis.description,
        tags: analysis.tags,
        fase_id: analysis.fase_id,
        sub_etapa_id: analysis.sub_etapa_id,
        mapa_id: analysis.mapa_id,
      });

      setResult(imageData);
      setStatus('success');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setStatus('idle');
    setResult(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12 flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-light">Experimento guiado</p>
        <h1 className="text-4xl font-semibold text-primary md:text-5xl">Sube un símbolo y recibe un mapa accionable</h1>
        <p className="text-sm text-primary-light md:text-base">
          Imágenes personales, arte o fotos del día. El motor visionario de DTM cruza la filosofía con IA para ubicarte en una fase,
          sub-etapa y mapa específicos. Resultado: claridad radical y siguiente movimiento.
        </p>
      </div>

      {status === 'success' && result ? (
        // Success State
        <div className="glass-panel space-y-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="rounded-full border border-border bg-white/70 p-3 text-green-600">
              <CheckCircle size={28} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-light">Registro guardado</p>
              <h2 className="text-3xl font-semibold">Imagen analizada con éxito</h2>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/70">
              <img 
                src={result.file_url} 
                alt={result.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <div>
                <p className="label">Título</p>
                <p className="text-xl font-semibold">{result.title}</p>
              </div>
              <div className="rounded-2xl border border-border bg-white/70 p-4">
                <p className="label mb-3">Clasificación</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="uppercase tracking-[0.3em] text-primary-light">Fase</span>
                    <span className="font-semibold">{result.fase?.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="uppercase tracking-[0.3em] text-primary-light">Sub-etapa</span>
                    <span className="text-right font-semibold">
                      {result.sub_etapa?.codigo} · {result.sub_etapa?.nombre}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="uppercase tracking-[0.3em] text-primary-light">Mapa</span>
                    <span className="font-semibold">{result.mapa?.nombre}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="label">Descripción</p>
                <p className="text-sm text-primary-light">{result.description}</p>
              </div>
              {result.tags?.length ? (
                <div>
                  <p className="label">Etiquetas</p>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-primary-light">
                    {result.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="rounded-full border border-border px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <button onClick={resetForm} className="btn-secondary">
              Subir otra imagen
            </button>
            <a href="/gallery" className="btn-primary">
              Ver galería
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      ) : (
        // Upload Form
        <div className="glass-panel space-y-6">
          {/* File Input */}
          <div>
            <label className="label">Selecciona una Imagen</label>
            <div className="rounded-3xl border-2 border-dashed border-border bg-white/70 p-10 text-center transition-colors hover:border-primary">
              {preview ? (
                <div className="space-y-4">
                  <img 
                    src={preview} 
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button 
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="text-xs font-semibold uppercase tracking-[0.4em] text-primary hover:text-primary-light"
                  >
                    Cambiar imagen
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto mb-4 text-primary" size={40} />
                  <p className="text-primary mb-2 font-semibold">
                    Haz clic para seleccionar una imagen
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary-light">
                    JPG, PNG, GIF o WEBP (máx. 10MB)
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={loading}
              />
              {!preview && (
                <div className="flex justify-center">
                  <label
                    htmlFor="file-upload"
                    className="btn-primary mt-6 cursor-pointer"
                  >
                    Seleccionar Archivo
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Status Messages */}
          {status === 'uploading' && (
            <div className="flex items-center justify-center gap-3 text-accent">
              <Loader2 className="animate-spin" size={24} />
              <span>Subiendo imagen...</span>
            </div>
          )}

          {status === 'analyzing' && (
            <div className="flex items-center justify-center gap-3 text-accent">
              <Loader2 className="animate-spin" size={24} />
              <span>Analizando con IA...</span>
            </div>
          )}

          {status === 'error' && error && (
            <div className="rounded-2xl border border-red-100 bg-red-50/80 p-4 text-left text-sm text-red-600">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle size={18} /> Error al procesar imagen
              </div>
              <p className="mt-2">{error}</p>
            </div>
          )}

          {/* Upload Button */}
          {file && status !== 'uploading' && status !== 'analyzing' && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Procesando
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analizar con IA
                </>
              )}
            </button>
          )}

          {/* Info */}
          <div className="rounded-3xl border border-border bg-white/70 p-6 text-sm text-primary-light">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-light">Cadena de precisión</p>
            <ol className="mt-3 space-y-2 text-sm">
              <li>1 · Subimos tu imagen a almacenamiento seguro.</li>
              <li>2 · La IA visionaria evalúa símbolos, texturas y energía.</li>
              <li>3 · Clasificamos en fase, sub-etapa y mapa oficiales.</li>
              <li>4 · Guardamos el insight editable para tu galería.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
