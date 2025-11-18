// Updated for new Fases/Sub-etapas/Mapas structure

import OpenAI from 'openai';
import { ImageAnalysis } from '@/types';
import { fetchFases, fetchSubEtapas, fetchMapas, getSubEtapaByCodigo, getMapaByNombre } from './supabaseClient';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PHILOSOPHY_CONTEXT = `
Desbloquea tu Mapa es una filosofía de autoconocimiento y transformación personal basada en 3 Fases y 4 Mapas.

LAS 3 FASES DEL VIAJE:

1. INCONSCIENCIA (Dormido)
   - Vivir en piloto automático
   - Reactividad emocional
   - Identificación con el ego
   - Sub-etapas:
     * 1.1 Distracción y Vacío - Falta de propósito, modo automático
     * 1.2 Creencias Limitantes y Mentales - Miedo, duda, voz saboteadora
     * 1.3 Confusión de Identidad y Ego - Identificación con etiquetas

2. CONSCIENCIA (Despertar)
   - Observación sin juicio
   - Reconocimiento de patrones
   - Desarrollo del testigo interno
   - Sub-etapas:
     * 2.1 Mortalidad e Impermanencia - Primer contacto con la finitud
     * 2.2 Observación de la Mente y el Tiempo - Desarrollo del observador interno
     * 2.3 Recuperar el Control y la Intención - Transición reacción → intención
     * 2.4 Integración Cuerpo-Mente - Reconciliar pensamiento y acción
     * 2.5 Descanso y Flujo - Equilibrio hacer/ser

3. CREACIÓN (Maestría)
   - Acción desde presencia
   - Manifestación consistente
   - Poder interno alineado
   - Sub-etapas:
     * 3.1 Acción y Materialización - Transformar consciencia en resultados
     * 3.2 Poder Interior y Confianza - Integración de fuerza interna
     * 3.3 Creación y Servicio - Expansión hacia el mundo

LOS 5 MAPAS (Territorios):

- MENTAL: Pensamientos, creencias, código mental. Liberar la mente del ruido.
- FÍSICO: Cuerpo, energía, presencia somática. Reconectar con el cuerpo.
- FAMILIAR: Relaciones, raíces, patrones heredados. Honrar las raíces.
- FINANCIERO: Valor, abundancia, propósito materializado. Transformar relación con dinero.
- EMOCIONAL: Sentimientos, estados emocionales, inteligencia emocional. Reconocer y nombrar emociones. Transformar reactividad en respuesta consciente.

Tu tarea es interpretar la imagen desde esta filosofía y clasificarla en:
1. Una Fase (1, 2, o 3)
2. Una Sub-etapa específica dentro de esa Fase (usar el código como "1.1", "2.3", etc.)
3. Un Mapa (Mental, Físico, Familiar, Financiero, o Emocional)
`;

/**
 * Analyze an image using OpenAI Vision API
 * Returns title, description, tags, and classifications (fase_id, sub_etapa_id, mapa_id)
 */
export async function analyzeImage(imageUrl: string): Promise<ImageAnalysis> {
  try {
    // Fetch reference data to build context for AI
    const [fases, subEtapas, mapas] = await Promise.all([
      fetchFases(),
      fetchSubEtapas(),
      fetchMapas(),
    ]);

    // Build structured context for AI
    const fasesContext = fases.map(f => 
      `Fase ${f.numero}: ${f.nombre} - ${f.descripcion || ''}`
    ).join('\n');

    const subEtapasContext = subEtapas.map(se => 
      `${se.codigo}: ${se.nombre} - ${se.descripcion || ''}`
    ).join('\n');

    const mapasContext = mapas.map(m => 
      `${m.nombre}: ${m.territorio || ''} - ${m.proposito || ''}`
    ).join('\n');

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

Contexto disponible:
${fasesContext}

Sub-etapas disponibles:
${subEtapasContext}

Mapas disponibles:
${mapasContext}

Responde EXACTAMENTE en este formato JSON (sin markdown):
{
  "title": "Un título evocador y simbólico (máximo 60 caracteres)",
  "description": "Una descripción profunda que conecta la imagen con la filosofía de autoconocimiento (2-3 oraciones)",
  "tags": ["3 a 5 palabras clave relevantes"],
  "sub_etapa_codigo": "El código de la sub-etapa (ej: '1.1', '2.3', '3.2') - DEBE ser uno de los códigos disponibles arriba",
  "mapa_nombre": "El nombre del mapa (Mental, Físico, Familiar, Financiero, o Emocional) - DEBE ser uno de los 5 mapas"
}

IMPORTANTE: 
- El sub_etapa_codigo DEBE existir en la lista de sub-etapas disponibles
- El mapa_nombre DEBE ser exactamente: Mental, Físico, Familiar, Financiero, o Emocional
- Analiza profundamente la imagen para elegir la clasificación más precisa`,
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
      max_tokens: 600,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    let rawAnalysis: {
      title: string;
      description: string;
      tags: string[];
      sub_etapa_codigo: string;
      mapa_nombre: string;
    };

    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      rawAnalysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    // Look up IDs from codigo and nombre
    const subEtapa = await getSubEtapaByCodigo(rawAnalysis.sub_etapa_codigo);
    if (!subEtapa) {
      throw new Error(`Invalid sub-etapa codigo: ${rawAnalysis.sub_etapa_codigo}`);
    }

    const mapa = await getMapaByNombre(rawAnalysis.mapa_nombre);
    if (!mapa) {
      throw new Error(`Invalid mapa nombre: ${rawAnalysis.mapa_nombre}`);
    }

    // Return with IDs
    return {
      title: rawAnalysis.title,
      description: rawAnalysis.description,
      tags: rawAnalysis.tags,
      fase_id: subEtapa.fase_id,
      sub_etapa_id: subEtapa.id,
      mapa_id: mapa.id,
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}
