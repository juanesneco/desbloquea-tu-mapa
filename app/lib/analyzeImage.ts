// Added by AI Monorepo Setup

import OpenAI from 'openai';
import { ImageAnalysis, ImageCategory } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

const PHILOSOPHY_CONTEXT = `
Desbloquea tu Mapa es una filosofía de autoconocimiento y transformación personal.
Las imágenes representan símbolos, arquetipos y territorios emocionales del ser.

Categorías disponibles:
- Infancia: Patrones, heridas y memorias de la niñez
- Cuerpo: Conexión somática, sensaciones, presencia física
- Relaciones: Vínculos, amor, conexión con otros
- Miedo: Resistencias, sombras, bloqueos emocionales
- Propósito: Ikigai, misión, dirección vital
- Presencia: Consciencia, ser, momento presente
- Transformación: Cambio, muerte-renacimiento, evolución
- Identidad: Máscaras, ego, autenticidad
- Poder: Agencia, soberanía, capacidad de acción
- Otro: Elementos que no encajan claramente en las categorías anteriores

Tu tarea es interpretar la imagen desde esta filosofía espiritual y existencial.
`;

/**
 * Analyze an image using OpenAI Vision API
 * Returns title, category, description, and tags
 */
export async function analyzeImage(imageUrl: string): Promise<ImageAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: PHILOSOPHY_CONTEXT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analiza esta imagen desde la filosofía de Desbloquea tu Mapa.

Responde EXACTAMENTE en este formato JSON (sin markdown):
{
  "title": "Un título evocador y simbólico (máximo 60 caracteres)",
  "category": "Una de las categorías exactas: ${CATEGORIES.join(', ')}",
  "description": "Una descripción profunda que conecta la imagen con la filosofía de autoconocimiento (2-3 oraciones)",
  "tags": ["3 a 5 palabras clave relevantes"]
}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    let analysis: ImageAnalysis;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate category
    if (!CATEGORIES.includes(analysis.category)) {
      console.warn(`Invalid category "${analysis.category}", defaulting to "Otro"`);
      analysis.category = 'Otro';
    }

    return analysis;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

/**
 * Generate a title for an image based on its content
 */
export async function generateTitle(imageUrl: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Genera un título corto y evocador para esta imagen (máximo 60 caracteres). Solo el título, sin explicaciones.',
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    max_tokens: 50,
  });

  return response.choices[0]?.message?.content?.trim() || 'Imagen sin título';
}

/**
 * Generate a philosophical description for an image
 */
export async function generateDescription(
  imageUrl: string,
  category: ImageCategory
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: PHILOSOPHY_CONTEXT,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Esta imagen pertenece a la categoría "${category}". Escribe una descripción de 2-3 oraciones que conecte la imagen con esta dimensión de la filosofía de Desbloquea tu Mapa. Sé profundo, poético y reflexivo.`,
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    max_tokens: 200,
  });

  return (
    response.choices[0]?.message?.content?.trim() ||
    'Una imagen que invita a la reflexión sobre tu camino interior.'
  );
}

