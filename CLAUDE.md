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

### Verifying a bulk edit
There is no test suite, so when a script edits many HTML files at once, confirm the diff touched only what it should:

```bash
# Debe listar SOLO las líneas que esperabas cambiar
git diff -U0 -- '*.html' | grep '^[+-]' | grep -v '^[+-][+-]' | grep -viE '<patrón esperado>'

# Integridad estructural: un solo <head> y un solo <title> por archivo
for f in index.html pages/*.html pages/blog/*.html; do
  [ "$(grep -c '</head>' "$f")" = 1 ] && [ "$(grep -c '<title>' "$f")" = 1 ] || echo "ROTO $f"
done
```

Scripts that rewrite HTML must be **idempotent** — running twice produces no second diff. Verify it; a non-idempotent script is a bug (it usually means the removal regex doesn't fully match what the insertion writes).

## Architecture

### CSS System
- `css/variables.css` — all design tokens (colors, fonts, spacing). Edit here first when changing visual style.
- `css/style.css` — global styles and BEM components.
- `css/responsive.css` — media queries (Mobile First approach).

Primary brand colors: `--color-primary: #003B73` (UASD blue), `--color-secondary: #FF6F00` (orange/CTA).
Extended palette: `--color-primary-subtle: #E8F0F8` (section backgrounds), `--color-accent-warm: #FFF3E0`, `--gradient-primary` (hero/page-hero).
Fonts: `--font-heading` (DM Serif Display), `--font-body` (Source Sans 3), `--font-mono` (JetBrains Mono — used in badges).

### JavaScript
- `js/navigation.js` — responsive hamburger menu and dropdown logic.
- `js/main.js` — smooth scroll, back-to-top button, lazy loading, scroll animations.
- `js/resources.js` — reads `data-resources` JSON attribute from `#resources-container` and dynamically renders downloadable resource cards with search/filter.

### Asset naming
Name every file in `img/` and `pages/img/` in lowercase `kebab-case`, ASCII only — no spaces, no accents (`analisis-real.png`, not `info Analisis Real.png`). Spaces and accents must be percent-encoded in any absolute URL; unencoded, social scrapers and some CDNs fail to fetch the file and the preview silently falls back to the logo. Several legacy filenames still violate this and are handled by encoding at generation time.

### Tooling
`tools/` holds maintenance scripts. They are the only "build" the project has — everything else is hand-authored. Run them from the repo root. See "Social sharing previews" for what they do.

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
- Wrap card images in `<div class="card__image-wrapper">` for hover zoom effect.
- Every new HTML file must include Google Fonts in `<head>`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Sans+3:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  ```
- Every subpage must have a `page-hero` section after the header:
  ```html
  <section class="page-hero">
      <div class="container">
          <h1 class="page-hero__title">Page Title</h1>
          <p class="page-hero__subtitle">Page subtitle</p>
      </div>
  </section>
  ```
- Do **not** hand-write Open Graph tags — they are generated. See "Social sharing previews" below.

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

## Social sharing previews (Open Graph)

Social platforms only read `<meta property="og:*">` from the `<head>`. A page without them falls back to the header logo, which is why every link used to preview as the logo. These tags are **generated, never hand-written**.

Two scripts own this, and both are idempotent — safe to re-run:

```bash
python3 tools/generate-og-images.py     # crea las imágenes sociales faltantes
python3 tools/sync-og-tags.py --check   # reporta qué falta, sin escribir
python3 tools/sync-og-tags.py           # aplica las etiquetas
```

**`tools/generate-og-images.py`** renders `tools/og/template.html` with headless Chrome into branded 1200×630 PNGs in `pages/img/og/`. Pages that have no cover image of their own get one here. Add a `slug: (eyebrow, título, subtítulo, motivo)` entry to the `PAGES` dict, then run it. Use `--force` to regenerate, `--only <slug>` for one.

**`tools/sync-og-tags.py`** rewrites the `og:`/`twitter:` block in every page, taking `<title>` and `<meta name="description">` as the source of truth. It picks the image in this order:
1. the page's existing `og:image`, if it isn't the logo;
2. `pages/img/og/<slug>.png` (the branded image);
3. the first real `<img>` in the body.

It always emits **absolute, URL-encoded** URLs — filenames with spaces or accents (`info Analisis Real.png`) break scrapers unless encoded as `%20`.

### Workflow when adding any new page
1. Write the page with a good `<title>` and `<meta name="description">` — these become the preview text.
2. If it has no cover image, add its slug to `PAGES` in `generate-og-images.py` and run it.
3. Run `python3 tools/sync-og-tags.py`.

### After deploying
Facebook and WhatsApp cache previews aggressively. Refresh each changed URL in the [Sharing Debugger](https://developers.facebook.com/tools/debug/) or the old preview persists.

## Component conventions (BEM)

All UI uses BEM naming. Key shared components:
- `.card` / `.card__image-wrapper` / `.card__image` / `.card__content` / `.card__meta` / `.card__title` / `.card__description` / `.card__footer`
- `.btn btn--outline` for secondary CTA buttons
- `.badge badge--primary` / `.badge badge--secondary` for category labels
- `.breadcrumb` for page navigation trails
- `.page-hero` / `.page-hero__title` / `.page-hero__subtitle` for inner page headers
- `.scroll-progress` — SVG circle progress indicator around back-to-top button
- Navigation is copy-pasted identically across all pages (no templating engine)

## Deployment

Pushes to `main` automatically deploy via GitHub Pages. The `CNAME` file contains the custom domain. No CI/CD pipeline exists.

## Available Skills (slash commands)

- `/frontend-design` — Create distinctive, production-grade frontend interfaces (websites, landing pages, dashboards, components).
- `/notebooklm` — Programmatic access to Google NotebookLM: create notebooks, add sources, generate podcasts/videos/quizzes/reports, download results. (Solo disponible en este proyecto).
