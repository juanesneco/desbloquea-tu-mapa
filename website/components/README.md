# Componentes Globales - Desbloquea Tu Mapa

Esta carpeta contiene componentes HTML reutilizables que se incluyen en todas las páginas del sitio para mantener consistencia.

---

## 📁 Archivos

### `header.html`
**Header/Navegación global**

Incluye:
- Logo con link al inicio
- Menú de navegación principal
- Menú móvil responsivo
- CTA "Inicia" destacado
- Estilos y scripts necesarios

**Uso:**
```html
<!-- Incluir en cada página después de <body> -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    $(function(){
        $("#header-placeholder").load("/components/header.html");
    });
</script>

<div id="header-placeholder"></div>
```

**O con JavaScript vanilla:**
```html
<div id="header-placeholder"></div>
<script>
    fetch('/components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });
</script>
```

---

### `footer.html`
**Footer global**

Incluye:
- Logo y tagline
- Links de navegación principal
- Links a herramientas
- Links de redes sociales
- Copyright y créditos
- Estilos responsive

**Uso:**
```html
<!-- Incluir antes de </body> -->
<div id="footer-placeholder"></div>
<script>
    fetch('/components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
</script>
```

---

## 🎨 Variables CSS Compartidas

Ambos componentes usan las mismas variables CSS:

```css
:root {
    --primary: #3F4447;
    --primary-light: #6B7174;
    --navy: #1B2838;
    --navy-light: #2C3E50;
    --blue: #4A90A4;
    --background: #E8E6E3;
    --white: #FFFFFF;
}
```

---

## 📱 Responsive

- **Desktop:** Navegación horizontal completa
- **Tablet/Mobile (<968px):** Menú hamburguesa con overlay

---

## ✅ Mantenimiento

**Para actualizar la navegación en todo el sitio:**
1. Edita `header.html`
2. Los cambios se reflejarán automáticamente en todas las páginas que incluyan el componente

**Para actualizar el footer:**
1. Edita `footer.html`
2. Los cambios se reflejarán automáticamente en todas las páginas

---

## 🔗 Rutas

Los componentes usan rutas absolutas desde la raíz `/`:
- `/index.html`
- `/secciones/filosofia.html`
- `/prompts.html`
- etc.

**Importante:** Ajusta las rutas según tu estructura de deployment si es necesario.

---

## 📋 Páginas que deben incluir estos componentes

✅ index.html
✅ /secciones/filosofia.html
✅ /secciones/mapas.html
✅ /secciones/historia.html
✅ /secciones/realizacion.html
✅ /secciones/herramientas.html
✅ /secciones/inicia.html
✅ /mapas/mapa-*.html
✅ trajectory.html
✅ prompts.html
✅ Todas las páginas de prompts individuales

---

**Última actualización:** 2025-01-09

