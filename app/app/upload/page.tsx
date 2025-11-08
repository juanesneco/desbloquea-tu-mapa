// Added by AI Monorepo Setup

'use client';

import { useState } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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
        category: analysis.category,
        description: analysis.description,
        tags: analysis.tags,
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Sube tu Imagen Simbólica
        </h1>
        <p className="text-lg text-primary-light max-w-2xl mx-auto">
          Comparte una imagen que resuene contigo. La IA la interpretará desde la 
          filosofía de Desbloquea tu Mapa.
        </p>
      </div>

      {status === 'success' && result ? (
        // Success State
        <div className="card space-y-6">
          <div className="flex items-center justify-center text-green-600 mb-4">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-semibold text-center">
            ¡Imagen Procesada!
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img 
                src={result.file_url} 
                alt={result.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Título</label>
                <p className="text-lg font-medium">{result.title}</p>
              </div>
              <div>
                <label className="label">Categoría</label>
                <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-sm">
                  {result.category}
                </span>
              </div>
              <div>
                <label className="label">Descripción</label>
                <p className="text-primary-light">{result.description}</p>
              </div>
              {result.tags.length > 0 && (
                <div>
                  <label className="label">Etiquetas</label>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-primary-light px-2 py-1 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <button onClick={resetForm} className="btn-secondary">
              Subir Otra Imagen
            </button>
            <a href="/gallery" className="btn-primary">
              Ver Galería Completa
            </a>
          </div>
        </div>
      ) : (
        // Upload Form
        <div className="card space-y-6">
          {/* File Input */}
          <div>
            <label className="label">Selecciona una Imagen</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors">
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
                    className="text-sm text-accent hover:text-accent-dark"
                  >
                    Cambiar imagen
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto text-accent mb-4" size={48} />
                  <p className="text-primary-light mb-2">
                    Haz clic para seleccionar una imagen
                  </p>
                  <p className="text-sm text-primary-light">
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
                <label
                  htmlFor="file-upload"
                  className="btn-primary inline-block mt-4 cursor-pointer"
                >
                  Seleccionar Archivo
                </label>
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
            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle size={24} />
              <div>
                <p className="font-medium">Error al procesar imagen</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {file && status !== 'uploading' && status !== 'analyzing' && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Procesando...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Subir y Analizar
                </>
              )}
            </button>
          )}

          {/* Info */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 text-sm text-primary-light">
            <p className="font-medium text-primary mb-2">¿Qué sucederá?</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>La imagen se almacenará de forma segura en Supabase</li>
              <li>La IA analizará el contenido simbólico y emocional</li>
              <li>Recibirás un título, categoría y descripción filosófica</li>
              <li>Podrás editar cualquier detalle después</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

