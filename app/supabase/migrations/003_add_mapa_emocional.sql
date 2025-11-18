-- Migration: Add Mapa Emocional as 5th Mapa

-- Insert Mapa Emocional
INSERT INTO mapas (nombre, territorio, proposito, color_asociado) VALUES
('Emocional', 'Sentimientos, estados emocionales, inteligencia emocional', 'Reconocer y nombrar emociones. Desarrollar inteligencia emocional. Transformar reactividad en respuesta consciente. Integrar emociones como información valiosa.', 'Rojo/Naranja')
ON CONFLICT (nombre) DO NOTHING;

-- Add comment
COMMENT ON TABLE mapas IS 'The 5 territories/maps: Mental, Físico, Familiar, Financiero, Emocional';

