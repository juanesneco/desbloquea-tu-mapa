-- ============================================
-- DESBLOQUEA TU MAPA - ESQUEMA INICIAL
-- Fecha: 2025-01-09
-- Descripción: Configuración inicial de base de datos
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nombre TEXT,
  fecha_registro TIMESTAMP DEFAULT NOW(),
  ultima_actividad TIMESTAMP,
  preferencias JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_fecha_registro ON usuarios(fecha_registro);

-- ============================================
-- TABLA: mapas
-- ============================================
CREATE TABLE IF NOT EXISTS mapas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('mental', 'fisico', 'familiar', 'financiero')),
  nombre TEXT,
  descripcion TEXT,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'archivado', 'eliminado')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mapas
CREATE INDEX idx_mapas_usuario ON mapas(usuario_id);
CREATE INDEX idx_mapas_tipo ON mapas(tipo);
CREATE INDEX idx_mapas_estado ON mapas(estado);

-- ============================================
-- TABLA: reflexiones
-- ============================================
CREATE TABLE IF NOT EXISTS reflexiones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  mapa_id UUID REFERENCES mapas(id) ON DELETE SET NULL,
  tipo_mapa TEXT CHECK (tipo_mapa IN ('mental', 'fisico', 'familiar', 'financiero')),
  titulo TEXT,
  contenido TEXT NOT NULL,
  sentimiento TEXT,
  etiquetas TEXT[],
  imagen_url TEXT,
  es_privado BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para reflexiones
CREATE INDEX idx_reflexiones_usuario ON reflexiones(usuario_id);
CREATE INDEX idx_reflexiones_mapa ON reflexiones(mapa_id);
CREATE INDEX idx_reflexiones_tipo ON reflexiones(tipo_mapa);
CREATE INDEX idx_reflexiones_fecha ON reflexiones(created_at);
CREATE INDEX idx_reflexiones_etiquetas ON reflexiones USING GIN(etiquetas);

-- ============================================
-- TABLA: imagenes
-- ============================================
CREATE TABLE IF NOT EXISTS imagenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  reflexion_id UUID REFERENCES reflexiones(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url_publica TEXT,
  titulo TEXT,
  descripcion TEXT,
  categoria TEXT,
  etiquetas TEXT[],
  analisis_ia JSONB,
  es_publica BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para imágenes
CREATE INDEX idx_imagenes_usuario ON imagenes(usuario_id);
CREATE INDEX idx_imagenes_reflexion ON imagenes(reflexion_id);
CREATE INDEX idx_imagenes_categoria ON imagenes(categoria);
CREATE INDEX idx_imagenes_fecha ON imagenes(created_at);

-- ============================================
-- TABLA: prompts
-- ============================================
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo_mapa TEXT NOT NULL CHECK (tipo_mapa IN ('mental', 'fisico', 'familiar', 'financiero', 'universal')),
  categoria TEXT,
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  orden INTEGER DEFAULT 0,
  es_activo BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para prompts
CREATE INDEX idx_prompts_tipo ON prompts(tipo_mapa);
CREATE INDEX idx_prompts_categoria ON prompts(categoria);
CREATE INDEX idx_prompts_orden ON prompts(orden);

-- ============================================
-- TABLA: suscriptores_newsletter
-- ============================================
CREATE TABLE IF NOT EXISTS suscriptores_newsletter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nombre TEXT,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'cancelado')),
  fuente TEXT,
  fecha_suscripcion TIMESTAMP DEFAULT NOW(),
  fecha_confirmacion TIMESTAMP,
  preferencias JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para suscriptores
CREATE INDEX idx_suscriptores_email ON suscriptores_newsletter(email);
CREATE INDEX idx_suscriptores_estado ON suscriptores_newsletter(estado);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflexiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para mapas
CREATE POLICY "Los usuarios pueden ver sus propios mapas"
  ON mapas FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Los usuarios pueden crear sus propios mapas"
  ON mapas FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios mapas"
  ON mapas FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios mapas"
  ON mapas FOR DELETE
  USING (auth.uid() = usuario_id);

-- Políticas para reflexiones
CREATE POLICY "Los usuarios pueden ver sus propias reflexiones"
  ON reflexiones FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Los usuarios pueden crear sus propias reflexiones"
  ON reflexiones FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias reflexiones"
  ON reflexiones FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias reflexiones"
  ON reflexiones FOR DELETE
  USING (auth.uid() = usuario_id);

-- Políticas para imágenes
CREATE POLICY "Los usuarios pueden ver sus propias imágenes"
  ON imagenes FOR SELECT
  USING (auth.uid() = usuario_id OR es_publica = true);

CREATE POLICY "Los usuarios pueden subir sus propias imágenes"
  ON imagenes FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias imágenes"
  ON imagenes FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias imágenes"
  ON imagenes FOR DELETE
  USING (auth.uid() = usuario_id);

-- Políticas para prompts (lectura pública)
CREATE POLICY "Todos pueden leer prompts activos"
  ON prompts FOR SELECT
  USING (es_activo = true);

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

-- Función para actualizar timestamp de updated_at
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER trigger_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_mapas_updated_at
  BEFORE UPDATE ON mapas
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_reflexiones_updated_at
  BEFORE UPDATE ON reflexiones
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_imagenes_updated_at
  BEFORE UPDATE ON imagenes
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

-- ============================================
-- DATOS INICIALES (SEED)
-- ============================================

-- Insertar prompts iniciales
INSERT INTO prompts (tipo_mapa, categoria, titulo, contenido, orden) VALUES
  ('mental', 'observacion', '¿Qué pensamientos se repiten?', 'Observa tu mente durante un día completo. ¿Qué pensamientos aparecen una y otra vez sin que los llames? Escríbelos sin juzgarlos.', 1),
  ('mental', 'creencias', '¿Qué creencias heredaste?', 'Piensa en las creencias sobre ti mismo, el dinero, las relaciones, el éxito. ¿Cuáles vienen de tu familia o cultura? ¿Cuáles son realmente tuyas?', 2),
  ('fisico', 'sensaciones', '¿Qué siente tu cuerpo ahora?', 'Detente. Cierra los ojos. ¿Qué sensaciones físicas estás experimentando en este momento? ¿Dónde hay tensión? ¿Dónde hay relajación?', 1),
  ('fisico', 'energia', '¿Cómo gestionas tu energía?', 'Observa tu energía a lo largo del día. ¿Cuándo te sientes más vivo? ¿Qué actividades te drenan? ¿Qué te recarga?', 2),
  ('familiar', 'patrones', '¿Qué patrones repites?', 'Observa tus relaciones actuales. ¿Qué dinámicas de tu familia de origen estás repitiendo inconscientemente?', 1),
  ('familiar', 'limites', '¿Dónde necesitas límites?', '¿En qué relaciones te sientes agotado, resentido o invadido? ¿Qué límites necesitas establecer?', 2),
  ('financiero', 'creencias', '¿Qué crees sobre el dinero?', 'Completa esta frase rápidamente sin pensar: "El dinero es..." ¿Qué surgió? ¿De dónde viene esa creencia?', 1),
  ('financiero', 'valor', '¿Cuál es tu valor único?', 'Si pudieras ofrecer algo al mundo que solo tú puedes ofrecer, ¿qué sería? ¿Cómo podrías monetizarlo?', 2);

-- ============================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================

COMMENT ON TABLE usuarios IS 'Usuarios registrados en la plataforma DTM';
COMMENT ON TABLE mapas IS 'Los cuatro mapas de cada usuario: mental, físico, familiar, financiero';
COMMENT ON TABLE reflexiones IS 'Entradas de diario y reflexiones de los usuarios';
COMMENT ON TABLE imagenes IS 'Imágenes subidas y analizadas por IA';
COMMENT ON TABLE prompts IS 'Prompts guiados para reflexión';
COMMENT ON TABLE suscriptores_newsletter IS 'Suscriptores al newsletter de DTM';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

