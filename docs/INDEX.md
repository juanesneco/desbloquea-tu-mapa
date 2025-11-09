# 📚 Índice de Documentación - DTM

Guía para navegar toda la documentación del proyecto.

---

## 🎯 DOCUMENTOS PRINCIPALES (Raíz del Proyecto)

### 📄 README.md
**Qué es:** Visión general del proyecto  
**Para quién:** Todos (punto de entrada)  
**Contenido:** Organización del repo, quick start, links clave

### 📄 DESIGN.md
**Qué es:** Documento maestro de filosofía y contenido  
**Para quién:** Creadores de contenido, diseñadores  
**Contenido:**
- Filosofía completa (3 fases, 4 mapas, 6 botones)
- Sistema de categorías visuales
- Navegación propuesta
- Paleta de colores
- Tono y voz
- Flujo de usuario

### 📄 NUEVA_ESTRUCTURA_FASES.md
**Qué es:** Referencia rápida del sistema de fases  
**Para quién:** Todos  
**Contenido:** 3 fases con sub-etapas, justificación, narrativa

---

## 📁 /docs/reports/ — Reportes Técnicos

Documentación de implementaciones y cambios técnicos.

### REPORTE_IMPLEMENTACION_DTM.md
- Implementación inicial completa
- Estructura creada
- Archivos generados
- Estado: Histórico (referencia)

### MAPAS_REORGANIZACION.md
- Reorganización de archivos de mapas
- Carpeta `/mapas/` creada
- Referencias actualizadas

### LIMPIEZA_PROMPTS.md
- Consolidación de prompts
- Carpetas antiguas eliminadas
- Nueva estructura unificada

### RESUMEN_CAMBIOS_UNIFICACION.md
- Unificación de header/footer
- Checklist de implementación
- Próximos pasos

---

## 📁 /meta/ — Meta-documentación

### glosario.md
**Qué es:** Diccionario completo de términos DTM  
**Uso:** Referencia cuando necesitas definiciones

### hoja_ruta.md
**Qué es:** Roadmap 2025-2026  
**Uso:** Planificación y prioridades futuras

---

## 📁 /contenido/ — Contenido en Markdown

### /filosofia/
- `resumen_filosofia.md` — Las 3 fases resumidas

### /mapas/
- `index.md` — Los 4 mapas explicados

### /manifestos/
- `manifiesto_del_mapa.md` — Documento fundacional

---

## 📁 /website/ — Documentación del Sitio

### /components/README.md
**Qué es:** Guía de uso de header/footer globales  
**Uso:** Al actualizar navegación o footer

### /prompts/README.md
**Qué es:** Organización de prompts (.html + .md)  
**Uso:** Al crear o editar prompts

### /assets/images/README.md
**Qué es:** Sistema de categorías visuales  
**Uso:** Al organizar imágenes nuevas

---

## 📁 /app/ — Documentación de la App

### /app/README.md
Guía completa de la aplicación Next.js

### /app/ENV_SETUP.md
Setup de variables de entorno

### /app/scripts/README.md
Migraciones de base de datos

---

## 🗺️ MAPA DE LECTURA RECOMENDADO

### Para Entender el Proyecto
1. README.md (raíz)
2. DESIGN.md
3. NUEVA_ESTRUCTURA_FASES.md

### Para Implementar Cambios
1. DESIGN.md (filosofía y estructura)
2. /website/components/README.md (si actualizas header/footer)
3. /docs/reports/ (para ver qué se hizo antes)

### Para Crear Contenido
1. DESIGN.md (tono, voz, filosofía)
2. /meta/glosario.md (términos correctos)
3. NUEVA_ESTRUCTURA_FASES.md (referencia rápida)

### Para Desarrollo Técnico
1. README.md (setup)
2. /app/README.md (app específica)
3. /app/scripts/README.md (base de datos)

---

## 🔍 BÚSQUEDA RÁPIDA

**¿Necesitas información sobre...?**

- **Filosofía completa** → DESIGN.md
- **Las 3 fases** → NUEVA_ESTRUCTURA_FASES.md
- **Organización del repo** → README.md
- **Términos y conceptos** → /meta/glosario.md
- **Roadmap futuro** → /meta/hoja_ruta.md
- **Cambios técnicos** → /docs/reports/
- **Navegación del sitio** → DESIGN.md (sección: Estructura de Navegación)
- **Colores y diseño** → DESIGN.md (sección: Paleta de Colores)
- **Header/Footer** → /website/components/README.md
- **Prompts** → /website/prompts/README.md
- **Imágenes** → /website/assets/images/README.md

---

## 🧹 DOCUMENTOS ELIMINADOS/CONSOLIDADOS

Estos archivos ya no existen (consolidados en DESIGN.md):

- ❌ Múltiples reportes fragmentados → `/docs/reports/`
- ❌ Documentación duplicada → Consolidada

---

## ✅ MANTENIMIENTO DE DOCS

**Cuándo actualizar:**

| Documento | Frecuencia | Trigger |
|-----------|------------|---------|
| README.md | Cambios mayores | Nueva estructura |
| DESIGN.md | Trimestral | Cambios filosofía |
| NUEVA_ESTRUCTURA_FASES.md | Raramente | Solo si cambian fases |
| /meta/glosario.md | Según necesidad | Nuevos términos |
| /meta/hoja_ruta.md | Mensual | Review de progreso |
| /docs/reports/*.md | Post-implementación | Cambios técnicos |

---

**Última actualización:** 2025-01-09

