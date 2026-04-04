# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MATUASD is a static educational portal for the Escuela de Matemática de the Universidad Autónoma de Santo Domingo (UASD). It is deployed on GitHub Pages with no backend, no build step, and no external JS frameworks — pure HTML5, CSS3, and Vanilla JavaScript.

## Local Development

```bash
# Serve locally with Python
python -m http.server 8000
# Then open http://localhost:8000
```

No build, lint, or test commands exist — this is a static site.

## Architecture

### CSS System
- `css/variables.css` — all design tokens (colors, fonts, spacing). Edit here first when changing visual style.
- `css/style.css` — global styles and BEM components.
- `css/responsive.css` — media queries (Mobile First approach).

Primary brand colors: `--color-primary: #003B73` (UASD blue), `--color-secondary: #FF6F00` (orange/CTA).

### JavaScript
- `js/navigation.js` — responsive hamburger menu and dropdown logic.
- `js/main.js` — smooth scroll, back-to-top button, lazy loading, scroll animations.
- `js/resources.js` — reads `data-resources` JSON attribute from `#resources-container` and dynamically renders downloadable resource cards with search/filter.

### Path conventions
- From `index.html` (root): use `./pages/...`, `./css/...`, `./img/...`
- From `pages/*.html`: use `../css/...`, `../img/...`, `./blog/...`
- From `pages/blog/*.html`: use `../../css/...`, `../../img/...`, `../img/...` for blog images

### Blog system
- Blog articles live in `pages/blog/*.html`.
- `pages/blog/index.html` is the blog listing page.
- `pages/blog/plantilla-articulo.html` is the canonical template for new articles.
- When adding a new article, three files must be updated:
  1. Create `pages/blog/<slug>.html` from the template.
  2. Add a card to `pages/blog/index.html`.
  3. Update the "Últimas Entradas del Blog" section in `index.html` (keep 3 cards max; drop the oldest).

### Adding a new blog article
Follow the pattern in `Ejemplo Prompt Nueva Entrada.md`:
- Cover image goes in `pages/img/`.
- Use `badge--primary` for math categories, `badge--secondary` for AI/tech categories.
- Infographic box uses `border: 4px solid var(--color-secondary)`.
- YouTube embeds need a responsive 16:9 container with `max-width: 800px`.
- Breadcrumbs, header, and footer must match existing articles exactly.

### Adding downloadable resources
In the subject page (`pages/calculo-1.html`, etc.), update the `data-resources` JSON on `#resources-container`:
```html
<div id="resources-container" data-resources='[
  {
    "title": "Nombre del Recurso",
    "type": "PDF",
    "date": "2025-01-15",
    "size": "1.5 MB",
    "url": "../resources/Calculo-I/archivo.pdf",
    "description": "Descripción breve"
  }
]'>
</div>
```
Supported types: `PDF`, `PPT`, `PPTX`, `DOC`, `DOCX`, `XLS`, `XLSX`, `ZIP`, `MP4`.

## Component conventions (BEM)

All UI uses BEM naming. Key shared components:
- `.card` / `.card__image` / `.card__content` / `.card__meta` / `.card__title` / `.card__description` / `.card__footer`
- `.btn btn--outline` for secondary CTA buttons
- `.badge badge--primary` / `.badge badge--secondary` for category labels
- `.breadcrumb` for page navigation trails
- Navigation is copy-pasted identically across all pages (no templating engine)

## Deployment

Pushes to `main` automatically deploy via GitHub Pages. The `CNAME` file contains the custom domain. No CI/CD pipeline exists.
