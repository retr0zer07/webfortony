# Tony Studio — Portfolio de Diseño Gráfico

Portafolio profesional minimalista para diseñador gráfico. Construido con HTML, CSS y JavaScript vanilla, sin dependencias externas ni frameworks.

---

## Vista rápida

```
webfortony/
├── index.html   → Estructura HTML (una sola página, navegación por anclas)
├── css/
│   └── styles.css   → Estilos: paleta, tipografía, grid, responsivo, animaciones
├── js/
│   └── script.js    → Interactividad: menú móvil, modal, scroll spy, reveal
└── README.md    → Este archivo
```

---

## Cómo abrir localmente

1. Clona o descarga el repositorio.
2. Abre el archivo `index.html` directamente en tu navegador (doble clic o arrastrar).
3. No requiere servidor, build, ni instalación de dependencias.

```bash
git clone https://github.com/retr0zer07/webfortony.git
cd webfortony
# Abre index.html en tu navegador preferido
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

---

## Personalización rápida

### Cambiar el nombre de la marca

En `index.html`, busca y reemplaza todas las ocurrencias de `Tony Studio` por el nombre que prefieras. Las encontrarás en:
- `<title>` y etiquetas `<meta>`
- `.header__logo` (`<a>` del header)
- `.footer__brand`
- El SVG de la sección "Sobre mí"

### Cambiar colores

Abre `css/styles.css` y edita las **custom properties** al inicio del archivo (sección `1. Custom Properties`):

```css
:root {
  --c-bg:          #FAFAF8;   /* Fondo principal */
  --c-text:        #111111;   /* Texto principal */
  --c-accent:      #B8976A;   /* Color acento (dorado cálido) */
  --c-text-muted:  #767676;   /* Texto secundario */
  /* ... */
}
```

Cambia `--c-accent` para modificar el color de acento en todo el sitio (línea bajo el logo, número de servicios, etc.).

### Cambiar tipografías

1. Elige dos fuentes en [Google Fonts](https://fonts.google.com): una **display** (para títulos) y una **sans-serif** (para cuerpo).
2. Reemplaza el `<link>` de Google Fonts en `<head>` de `index.html`.
3. En `css/styles.css`, actualiza:

```css
--font-display: 'NuevaFuente', Georgia, serif;
--font-body:    'OtraFuente', system-ui, sans-serif;
```

### Agregar o editar proyectos

**Paso 1 — Añadir la tarjeta en `index.html`:**

Copia una `<article class="project-card">` existente dentro del `div.projects__grid`, cambia el `data-project-id` a un número nuevo (p.ej. `7`) y personaliza el SVG o reemplázalo con una etiqueta `<img>`.

**Paso 2 — Añadir los datos en `js/script.js`:**

Dentro del objeto `projectData`, añade una entrada con el mismo ID:

```js
7: {
  title:       'Mi Proyecto',
  category:    'Categoría',
  year:        '2025',
  client:      'Nombre del cliente',
  description: 'Descripción del proyecto...',
  tags:        ['Tag 1', 'Tag 2'],
},
```

### Usar imágenes reales en lugar de SVGs

En las tarjetas, reemplaza el `<svg>` dentro de `.project-card__image` por una etiqueta `<img>`:

```html
<div class="project-card__image">
  <img src="assets/images/proyecto-nombre.jpg" alt="Descripción del proyecto" loading="lazy">
</div>
```

Recuerda añadir `loading="lazy"` y un `alt` descriptivo. Crea la carpeta `assets/images/` en la raíz del proyecto.

### Editar textos de la página

Todos los textos están en `index.html`. Las secciones principales son:

| Sección | Qué editar |
|---|---|
| **Hero** | `.hero__heading`, `.hero__subtext`, `.hero__label` |
| **Sobre mí** | `.about__bio` (dos párrafos), `.about__skills` (lista) |
| **Servicios** | `.service-item__title` y `.service-item__desc` de cada ítem |
| **Contacto** | `.contact__text`, `.contact__email` (`href` y texto), enlaces sociales |
| **Footer** | `.footer__copy` |

### Cambiar el email de contacto

En `index.html`, busca:
```html
<a href="mailto:hola@tonystudio.com" ...>hola@tonystudio.com</a>
```
Reemplaza la dirección en el atributo `href` y en el texto visible.

### Cambiar los enlaces sociales

En la sección `#contacto`, edita los `href` de los tres enlaces:

```html
<a href="https://instagram.com/tuusuario" ...>Instagram</a>
<a href="https://behance.net/tuusuario"   ...>Behance</a>
<a href="https://linkedin.com/in/tuusuario" ...>LinkedIn</a>
```

---

## Estructura de archivos

```
webfortony/
├── index.html          Página principal (HTML semántico, accesible)
├── css/
│   └── styles.css      Hoja de estilos (mobile-first, custom properties)
├── js/
│   └── script.js       Lógica JS (IIFE, sin dependencias)
└── README.md           Instrucciones de uso y personalización
```

### Opcional — assets recomendados

```
assets/
├── images/             Imágenes de proyectos (jpg/webp)
├── fonts/              Fuentes locales (si prefieres no usar Google Fonts)
└── og-image.jpg        Imagen Open Graph (1200×630 px)
```

---

## Funcionalidades incluidas

- **Header fijo** con efecto de fondo al hacer scroll
- **Menú hamburguesa** para móvil (toggle + animación X)
- **Scroll suave** por anclas con `scroll-behavior: smooth` y fallback JS
- **Scroll spy**: resalta el enlace activo según la sección visible
- **Animaciones de entrada** al viewport (`IntersectionObserver`)
- **Modal de proyectos**: abre/cierra con clic, ESC y clic fuera
- **Focus trap** en el modal para accesibilidad de teclado
- **Responsive** mobile-first: 1 col (móvil) → 2 col (tablet) → 3 col (escritorio)
- **Accesibilidad**: landmarks, aria labels, foco visible, contraste WCAG AA
- **SEO básico**: title, meta description, Open Graph

---

## Requisitos del navegador

Funciona en todos los navegadores modernos (Chrome, Firefox, Safari, Edge). No requiere transpilación ni build. Usa `IntersectionObserver` (soportado desde 2018+).

---

## Licencia

Uso personal y comercial libre. Personaliza y adapta según tus necesidades.