-- Migration: Add Fases, Sub-etapas, Mapas tables and update images schema
-- This migration implements the new categorization system with separate tables

-- Create fases table (3 main categories)
CREATE TABLE IF NOT EXISTS fases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero INTEGER NOT NULL UNIQUE, -- 1, 2, 3
  nombre TEXT NOT NULL UNIQUE, -- 'Inconsciencia', 'Consciencia', 'Creación'
  descripcion TEXT,
  caracteristicas TEXT[],
  territorio_visual TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sub_etapas table (subcategories within each fase)
CREATE TABLE IF NOT EXISTS sub_etapas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fase_id UUID NOT NULL REFERENCES fases(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL, -- '1.1', '1.2', '2.1', etc.
  nombre TEXT NOT NULL, -- 'Distracción y Vacío', 'Mortalidad e Impermanencia', etc.
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fase_id, codigo)
);

-- Create mapas table (4 territories - required tagging)
CREATE TABLE IF NOT EXISTS mapas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL UNIQUE, -- 'Mental', 'Físico', 'Familiar', 'Financiero'
  territorio TEXT,
  proposito TEXT,
  color_asociado TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update images table - remove old category column, add new foreign keys
ALTER TABLE images 
  DROP COLUMN IF EXISTS category;

ALTER TABLE images
  ADD COLUMN IF NOT EXISTS fase_id UUID REFERENCES fases(id),
  ADD COLUMN IF NOT EXISTS sub_etapa_id UUID REFERENCES sub_etapas(id),
  ADD COLUMN IF NOT EXISTS mapa_id UUID REFERENCES mapas(id);

-- Note: Columns are nullable initially to allow migration
-- In application logic, these are required for new images
-- Can add NOT NULL constraints later once all images have been classified

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_images_fase_id ON images(fase_id);
CREATE INDEX IF NOT EXISTS idx_images_sub_etapa_id ON images(sub_etapa_id);
CREATE INDEX IF NOT EXISTS idx_images_mapa_id ON images(mapa_id);
CREATE INDEX IF NOT EXISTS idx_sub_etapas_fase_id ON sub_etapas(fase_id);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('viewer', 'contributor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper function to check user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT role FROM user_roles WHERE user_id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER;

-- Insert initial data: Fases
INSERT INTO fases (numero, nombre, descripcion, caracteristicas, territorio_visual) VALUES
(1, 'Inconsciencia', 'Vivir en la Matrix sin saberlo', 
 ARRAY['Piloto automático', 'Reactividad emocional', 'Identificación con el ego', 'Búsqueda de validación externa', 'Confundir el mapa con el territorio'],
 'Inocencia, Primeros Mundos, Distracción')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO fases (numero, nombre, descripcion, caracteristicas, territorio_visual) VALUES
(2, 'Consciencia', 'Neo tomando la píldora roja',
 ARRAY['Observación sin juicio', 'Reconocimiento de patrones', 'Desarrollo del testigo interno', 'Integración progresiva', 'Recuperación del control'],
 'Despertar, Observador, Patrones, Espejos')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO fases (numero, nombre, descripcion, caracteristicas, territorio_visual) VALUES
(3, 'Creación', 'El arquitecto de tu realidad',
 ARRAY['Acción desde presencia', 'Manifestación consistente', 'Poder interno alineado', 'Servicio y contribución', 'Vida como acto creativo'],
 'Acción, Expansión, Presencia, Creación')
ON CONFLICT (nombre) DO NOTHING;

-- Insert Sub-etapas for Fase 1: Inconsciencia
INSERT INTO sub_etapas (fase_id, codigo, nombre, descripcion)
SELECT f.id, '1.1', 'Distracción y Vacío', 'Falta de propósito o sentido profundo. Modo automático: trabajo, placer, reconocimiento.'
FROM fases f WHERE f.numero = 1
ON CONFLICT (fase_id, codigo) DO NOTHING;

INSERT INTO sub_etapas (fase_id, codigo, nombre, descripcion)
SELECT f.id, '1.2', 'Creencias Limitantes y Mentales', 'Aparición del miedo y la duda. Voz interna saboteadora. Comparación constante.'
FROM fases f WHERE f.numero = 1
ON CONFLICT (fase_id, codigo) DO NOTHING;

INSERT INTO sub_etapas (fase_id, codigo, nombre, descripcion)
SELECT f.id, '1.3', 'Confusión de Identidad y Ego', 'Identificación con etiquetas. "Soy lo que hago/tengo/parezco". Expectativas externas como brújula.'
FROM fases f WHERE f.numero = 1
ON CONFLICT (fase_id, codigo) DO NOTHING;

-- Insert Sub-etapas for Fase 2: Consciencia
INSERT INTO sub_etapas (fase_id, codigo, nombre, descripcion)
SELECT f.id, '2.1', 'Mortalidad e Impermanencia', 'Primer contacto con la finitud. La muerte como espejo. Urgencia, gratitud, dirección.'
FROM fases f WHERE f.numero = 2
ON CONFLICT (fase_id, codigo) DO NOTHING;

INSERT INTO sub_etapas (fase_id, codigo, nombre, descripcion)
SELECT f.id, '2.2', 'Observación de la Mente y el Tiempo', 'Desarrollo del observador interno. Pensamientos ≠ identidad. Emociones como fenómenos pasajeros.'
FROM fases f WHERE f.numero = 2
ON CONFLICT (fase_id, codigo) DO NOTHING;

INSERT INTO sub_etapas (fase_id, codigo, nombre, descripcion)
SELECT f.id, '2.3', 'Recuperar el Control y la Intención', 'Transición: reacción → intención. Actuar con propósito. Dirigir energía conscientemente.'
FROM fases f WHERE f.numero = 2
ON CONFLICT (fase_id, codigo) DO NOTHING;

INSERT INTO sub_etapas (fase_id, codigo, nombre, descripcion)
SELECT f.id, '2.4', 'Integración Cuerpo-Mente', 'Reconciliar pensamiento y acción. Cuerpo como extensión del alma. Sabiduría somática.'
FROM fases f WHERE f.numero = 2
ON CONFLICT (fase_id, codigo) DO NOTHING;

INSERT INTO sub_etapas (fase_id, codigo, nombre, descripcion)
SELECT f.id, '2.5', 'Descanso y Flujo', 'Equilibrio hacer/ser. Contemplación como práctica. Presencia en quietud.'
FROM fases f WHERE f.numero = 2
ON CONFLICT (fase_id, codigo) DO NOTHING;

-- Insert Sub-etapas for Fase 3: Creación
INSERT INTO sub_etapas (fase_id, codigo, nombre, descripcion)
SELECT f.id, '3.1', 'Acción y Materialización', 'Transformar consciencia en resultados. Consistencia y disciplina. Curiosidad activa.'
FROM fases f WHERE f.numero = 3
ON CONFLICT (fase_id, codigo) DO NOTHING;

INSERT INTO sub_etapas (fase_id, codigo, nombre, descripcion)
SELECT f.id, '3.2', 'Poder Interior y Confianza', 'Integración de fuerza interna. Alineación con propósito. Autoconfianza arraigada.'
FROM fases f WHERE f.numero = 3
ON CONFLICT (fase_id, codigo) DO NOTHING;

INSERT INTO sub_etapas (fase_id, codigo, nombre, descripcion)
SELECT f.id, '3.3', 'Creación y Servicio', 'Expansión hacia el mundo. Contribución significativa. Liderazgo consciente.'
FROM fases f WHERE f.numero = 3
ON CONFLICT (fase_id, codigo) DO NOTHING;

-- Insert Mapas
INSERT INTO mapas (nombre, territorio, proposito, color_asociado) VALUES
('Mental', 'Pensamientos, creencias, código mental', 'Liberar la mente del ruido. Observar sin ser lo observado. Elegir pensamientos conscientemente.', 'Azul')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO mapas (nombre, territorio, proposito, color_asociado) VALUES
('Físico', 'Cuerpo, energía, presencia somática', 'Reconectar con el cuerpo. Escuchar señales somáticas. Liberar tensión almacenada.', 'Verde')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO mapas (nombre, territorio, proposito, color_asociado) VALUES
('Familiar', 'Relaciones, raíces, patrones heredados', 'Honrar las raíces. Reconocer patrones transgeneracionales. Establecer límites saludables.', 'Cálido/Tierra')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO mapas (nombre, territorio, proposito, color_asociado) VALUES
('Financiero', 'Valor, abundancia, propósito materializado', 'Transformar relación con dinero. Reconocer valor propio. Crear abundancia sostenible.', 'Dorado')
ON CONFLICT (nombre) DO NOTHING;

-- Update RLS policies for images
DROP POLICY IF EXISTS "Public can view images" ON images;
DROP POLICY IF EXISTS "Public can insert images" ON images;
DROP POLICY IF EXISTS "Public can update images" ON images;
DROP POLICY IF EXISTS "Public can delete images" ON images;

-- Authenticated users can view all images
CREATE POLICY "Authenticated users can view images"
  ON images FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only contributors can insert
CREATE POLICY "Contributors can insert images"
  ON images FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    get_user_role(auth.uid()) = 'contributor'
  );

-- Users can update/delete their own images
CREATE POLICY "Users can update own images"
  ON images FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own images"
  ON images FOR DELETE
  USING (auth.uid() = user_id);

-- RLS for reference tables (read-only for authenticated users)
ALTER TABLE fases ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view fases"
  ON fases FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view sub_etapas"
  ON sub_etapas FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view mapas"
  ON mapas FOR SELECT
  USING (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON TABLE fases IS 'The 3 main phases of the DTM journey';
COMMENT ON TABLE sub_etapas IS 'Sub-stages within each phase (11 total)';
COMMENT ON TABLE mapas IS 'The 4 territories/maps (Mental, Físico, Familiar, Financiero)';
COMMENT ON COLUMN images.fase_id IS 'Required: Which phase the image belongs to';
COMMENT ON COLUMN images.sub_etapa_id IS 'Required: Which sub-stage within the phase';
COMMENT ON COLUMN images.mapa_id IS 'Required: Which territory/map the image relates to';

