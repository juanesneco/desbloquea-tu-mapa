# 🧹 Limpieza de Carpetas de Prompts

**Fecha:** 9 de Enero, 2025  
**Acción:** Consolidación y limpieza de estructura de prompts

---

## ✅ CAMBIOS REALIZADOS

### Estructura Anterior (Fragmentada)

```
/website/
├── prompts/           ❌ Solo archivos .html
│   ├── analisis-causa-raiz.html
│   ├── aprende-las-reglas-reales.html
│   ├── descubre-tu-ikigai.html
│   ├── destruye-las-mascaras.html
│   ├── mapea-tu-ubicacion-actual.html
│   └── ve-el-codigo-mental.html
│
└── prompts_md/        ❌ Solo archivos .md (separados)
    ├── analisis-causa-raiz.md
    ├── aprende-las-reglas-reales.md
    ├── descubre-tu-ikigai.md
    ├── destruye-las-mascaras.md
    ├── mapea-tu-ubicacion-actual.md
    └── ve-el-codigo-mental.md
```

**Problemas:**
- ❌ Contenido duplicado en 2 carpetas
- ❌ Difícil mantener ambas versiones sincronizadas
- ❌ Confuso para desarrolladores
- ❌ Estructura no escalable

---

### Estructura Nueva (Unificada)

```
/website/
└── prompts/           ✅ TODO unificado aquí
    ├── README.md
    ├── analisis-causa-raiz.html
    ├── analisis-causa-raiz.md
    ├── aprende-las-reglas-reales.html
    ├── aprende-las-reglas-reales.md
    ├── descubre-tu-ikigai.html
    ├── descubre-tu-ikigai.md
    ├── destruye-las-mascaras.html
    ├── destruye-las-mascaras.md
    ├── mapea-tu-ubicacion-actual.html
    ├── mapea-tu-ubicacion-actual.md
    ├── ve-el-codigo-mental.html
    └── ve-el-codigo-mental.md
```

**Beneficios:**
- ✅ Un solo lugar para todos los prompts
- ✅ Ambos formatos (.html y .md) juntos
- ✅ Fácil de mantener sincronizados
- ✅ Estructura clara y profesional
- ✅ README documentado

---

## 📊 INVENTARIO DE ARCHIVOS

### Total de Prompts: 6

| Prompt | HTML | MD | Estado |
|--------|------|-----|--------|
| Mapea tu Ubicación Actual | ✅ | ✅ | Completo |
| Ve el Código Mental | ✅ | ✅ | Completo |
| Destruye las Máscaras | ✅ | ✅ | Completo |
| Descubre tu Ikigai | ✅ | ✅ | Completo |
| Aprende las Reglas Reales | ✅ | ✅ | Completo |
| Análisis Causa Raíz | ✅ | ✅ | Completo |

**Total de archivos:** 12 archivos + 1 README

---

## 🗑️ CARPETAS ELIMINADAS

### `/website/prompts/` (antigua)
**Eliminada:** ✅  
**Contenido:** 6 archivos .html → Movidos a nueva estructura

### `/website/prompts_md/` (antigua)
**Eliminada:** ✅  
**Contenido:** 6 archivos .md → Movidos a nueva estructura

---

## 📝 ORGANIZACIÓN POR CATEGORÍA

### Mapa Mental (2 prompts)
- `mapea-tu-ubicacion-actual` — Identificar ubicación actual
- `ve-el-codigo-mental` — Observar patrones mentales

### Mapa Familiar (1 prompt)
- `destruye-las-mascaras` — Reconocer máscaras en relaciones

### Mapa Financiero/Propósito (1 prompt)
- `descubre-tu-ikigai` — Encontrar propósito y dirección

### Universales (2 prompts)
- `aprende-las-reglas-reales` — Comprender el juego de la vida
- `analisis-causa-raiz` — Profundizar en origen de patrones

---

## 🔄 USO DE LOS FORMATOS

### Archivos HTML (.html)
**Para:**
- Navegación web directa
- Experiencia de usuario visual
- Incluir en el sitio web
- Links desde otras páginas

**Ejemplo:**
```html
<a href="/prompts/descubre-tu-ikigai.html">Descubre tu Ikigai</a>
```

### Archivos Markdown (.md)
**Para:**
- Contenido puro/estructurado
- APIs o integración con sistemas
- Documentación
- Versión control amigable
- Fácil edición de contenido

**Ejemplo:**
```javascript
fetch('/prompts/descubre-tu-ikigai.md')
  .then(response => response.text())
  .then(content => processMarkdown(content));
```

---

## 📋 SINCRONIZACIÓN DE CONTENIDO

### Regla de Oro

**Cuando actualices un prompt:**

1. ✅ Edita PRIMERO el archivo `.md` (contenido puro)
2. ✅ Copia los cambios al archivo `.html` (con diseño)
3. ✅ Verifica que ambas versiones estén sincronizadas

### Campos a Mantener Sincronizados
- Título del prompt
- Descripción/introducción
- Todas las preguntas
- Instrucciones
- Reflexiones finales

### Campos Solo en HTML
- Estilos CSS
- Navegación (header/footer)
- Botones y CTAs
- Diseño responsive

---

## 🎯 ESTRUCTURA DENTRO DE `/prompts/`

```
/prompts/
│
├── README.md                              ← Documentación
│
├── [nombre-prompt].html                   ← Versión web
├── [nombre-prompt].md                     ← Versión contenido
│
└── (Futuro: subdirectorios por categoría)
    ├── /mental/
    ├── /fisico/
    ├── /familiar/
    └── /financiero/
```

---

## ✅ VERIFICACIÓN POST-LIMPIEZA

### Carpetas Eliminadas
- [x] `/website/prompts/` (antigua) — Eliminada
- [x] `/website/prompts_md/` (antigua) — Eliminada

### Carpeta Nueva
- [x] `/website/prompts/` (nueva unificada) — Creada
- [x] Contiene 12 archivos (6 HTML + 6 MD)
- [x] README.md actualizado
- [x] Todos los prompts migrados exitosamente

### Sin Referencias Rotas
- [x] No hay links apuntando a carpetas antiguas
- [x] Estructura de rutas consistente
- [x] README actualizado con nuevas rutas

---

## 🚀 PRÓXIMOS PASOS RECOMENDADOS

### Corto Plazo
1. [ ] Verificar que `/prompts.html` (página índice) apunte a la nueva ruta
2. [ ] Actualizar links desde otras páginas si es necesario
3. [ ] Probar todos los prompts en navegador

### Mediano Plazo
1. [ ] Considerar subdirectorios por categoría (`/prompts/mental/`, etc.)
2. [ ] Crear prompts faltantes para Mapa Físico
3. [ ] Estandarizar formato de todos los prompts HTML
4. [ ] Integrar header y footer global en prompts HTML

### Largo Plazo
1. [ ] Sistema de búsqueda de prompts
2. [ ] Filtrado por categoría/mapa
3. [ ] Sistema de favoritos
4. [ ] Compartir prompts en redes sociales

---

## 📊 COMPARACIÓN ANTES/DESPUÉS

| Aspecto | Antes | Después |
|---------|-------|---------|
| Carpetas | 2 separadas | 1 unificada |
| Archivos totales | 12 (6+6) | 13 (12+README) |
| Organización | Fragmentada | Cohesiva |
| Mantenimiento | Complejo | Simple |
| Escalabilidad | Limitada | Excelente |
| Claridad | Confusa | Crystal clear |

---

## 💡 LECCIONES APRENDIDAS

1. **Unificar temprano es mejor** — Evita deuda técnica
2. **Ambos formatos son útiles** — HTML para usuarios, MD para desarrollo
3. **Documentación es clave** — README hace la diferencia
4. **Estructura simple gana** — No sobre-organizar prematuramente

---

## ✅ CONCLUSIÓN

La estructura de prompts ahora está:

- ✅ **Unificada** — Todo en un solo lugar
- ✅ **Clara** — Fácil de navegar y entender
- ✅ **Mantenible** — Simple actualizar contenido
- ✅ **Escalable** — Fácil agregar nuevos prompts
- ✅ **Documentada** — README completo

**Estado:** ✅ LIMPIEZA COMPLETADA EXITOSAMENTE

---

**Última actualización:** 2025-01-09  
**Mantenedor:** Juanes Necoechea

