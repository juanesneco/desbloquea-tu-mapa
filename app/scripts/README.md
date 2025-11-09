# Scripts de Base de Datos - DTM

Este directorio contiene todos los scripts de migración y configuración de base de datos para el proyecto Desbloquea Tu Mapa.

## Convención de Nombres

Los scripts de migración siguen el formato: `YYYY-MM-DD_descripcion.sql`

Ejemplo: `2025-01-09_init_db.sql`

## Orden de Ejecución

1. `2025-01-09_init_db.sql` — Esquema inicial
2. Scripts adicionales en orden cronológico

## Cómo Aplicar Migraciones

### Opción 1: Supabase Dashboard
1. Ve a tu proyecto en Supabase
2. Navega a "SQL Editor"
3. Copia y pega el contenido del script
4. Ejecuta

### Opción 2: CLI (Próximamente)
```bash
./migrate.sh
```

## Esquema Actual

### Tablas Principales

#### `usuarios`
- Información de usuarios registrados
- Perfiles y preferencias

#### `mapas`
- Tipos de mapas: mental, físico, familiar, financiero
- Metadata de cada mapa

#### `reflexiones`
- Entradas de diario del usuario
- Asociadas a un mapa específico
- Incluyen imágenes opcionales

#### `prompts`
- Prompts guiados por categoría
- Preguntas de reflexión estructuradas

#### `imagenes`
- Imágenes subidas por usuarios
- Análisis AI y categorización
- Almacenadas en Supabase Storage

## Storage Buckets

- `symbolic-images` — Imágenes de usuarios (público)
- `user-content` — Contenido privado de usuarios

## Políticas RLS

Todas las tablas utilizan Row Level Security (RLS) para garantizar que:
- Los usuarios solo pueden ver y editar su propio contenido
- Los datos están protegidos a nivel de base de datos

## Migraciones Futuras

Documentar aquí los cambios pendientes o planeados:
- [ ] Sistema de tags para reflexiones
- [ ] Compartir reflexiones públicamente
- [ ] Integración con newsletter
- [ ] Gamificación y progreso

---

**Última actualización:** 2025-01-09

