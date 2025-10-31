# Agregar artículo "Curso de Técnicas de DL aplicadas a Problemas en Ciencias de la Salud”

---

## **INFORMACIÓN DEL ARTÍCULO**
- **Título:** "Curso de Técnicas de DL aplicadas a Problemas en Ciencias de la Salud"  
- **Categoría:** "Inteligencia Artificial"  
- **Autor:** "M.Sc. Robert Muñoz"  
- **Fecha:** "24 de Octubre, 2025"  
- **Descripción:** "Un curso, impartido por el Dr. Antonio Peñalver, cubre los fundamentos de DL aplicados en Ciencias de la Salud."

---

## **ARCHIVOS NECESARIOS**
- **Infografía:** `pages/img/info Curso Técnicas DL.png`  
- **Video:** [https://youtu.be/iEHpTAnQ-h0?si=38IUFyjjkG-_wJUj](https://youtu.be/iEHpTAnQ-h0?si=38IUFyjjkG-_wJUj)  
- **Artículo:** `pages/blog/curso-dl-medicina.html`

---

## **TAREA 0: Actualizar `index.html` (Home) – Últimas Entradas del Blog**
- Agregar la nueva tarjeta en la sección "Últimas Entradas del Blog" (`section#blog-preview`), manteniendo 3 tarjetas visibles (reemplazar la más antigua si es necesario).
- Usar la misma estructura de card que existe en `index.html`.
- Rutas relativas desde la raíz (usar `./pages/...`).
- Badge de categoría según el artículo (para "Inteligencia Artificial" usar `badge--secondary`).

Ejemplo de card a insertar:

```html
<article class="card">
    <img src="./pages/img/info Curso Técnicas DL.png" alt="Infografía: Curso Técnicas DL en Medicina" class="card__image">
    <div class="card__content">
        <div class="card__meta">
            <span>📅 24 de octubre, 2025</span>
            <span class="badge badge--secondary">Inteligencia Artificial</span>
        </div>
        <h3 class="card__title">Curso de Técnicas de DL aplicadas a Problemas en Ciencias de la Salud</h3>
        <p class="card__description">
            Un curso impartido por el Dr. Antonio Peñalver sobre fundamentos de DL aplicados en Ciencias de la Salud.
        </p>
        <div class="card__footer">
            <a href="./pages/blog/curso-dl-medicina.html" class="btn btn--outline">Leer más</a>
        </div>
    </div>
    
</article>
```

Notas:
- Mantener el estilo BEM y el botón `btn btn--outline` como en `index.html`.
- Si no hay infografía disponible, usar el SVG placeholder del home.

---

## **TAREA 1: Actualizar `pages/blog/index.html`**
- Agregar entrada más reciente.  
- Usar infografía real: `pages/img/info Curso Técnicas DL.png`  
- **Alt text:** "Infografía: Curso Técnicas DL en Medicina"  
- **Enlace:** `./curso-dl-medicina.html`

---

## **TAREA 2: Crear `pages/blog/curso-dl-medicina.html`**
Estructura del artículo:
- Header, navegación y breadcrumbs.  
- Infografía en caja con borde **naranja** (`border: 4px solid var(--color-secondary)`).
- Video de YouTube embebido en contenedor **responsive**.
- **Contenido estructurado:**
  - Ejemplos prácticos  
  - Conclusión educativa  
- Enlaces de redes sociales funcionales.  
- Footer consistente con otros artículos.

---

## **REQUISITOS TÉCNICOS**
- Diseño **responsive** (móvil + desktop).  
- **Video:** aspect ratio `16:9`, `max-width: 800px`.  
- **Infografía:** `width: 100%`, `height: auto`.  
- **Alt text** descriptivo para accesibilidad.  
- **Meta tags SEO** optimizados.

---

## **RESULTADO**
Nuevo artículo completo con **infografía educativa**, **video explicativo** y **contenido estructurado**, manteniendo la calidad y consistencia del blog **MATUASD**.
