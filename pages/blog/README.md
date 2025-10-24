# 📝 Blog MATUASD - Estructura de Archivos

Este directorio contiene la nueva estructura del blog de MATUASD con artículos individuales.

## 📁 Estructura de Archivos

```
pages/blog/
├── index.html                    # Página principal del blog (lista de artículos)
├── plantilla-articulo.html       # Plantilla para crear nuevos artículos
├── ecuaciones-diferenciales.html # Artículo: La Belleza de las Ecuaciones Diferenciales
├── analisis-real.html           # Artículo: Introducción al Análisis Real
├── matematicas-ia.html          # Artículo: Matemáticas en la Inteligencia Artificial
├── geometria-no-euclidiana.html # Artículo: Geometría No Euclidiana
├── problemas-milenio.html       # Artículo: Los Grandes Problemas del Milenio
└── teorema-fundamental-calculo.html # Artículo: El Teorema Fundamental del Cálculo
```

## 🎯 Categorías del Blog

- **Matemáticas**: Artículos sobre conceptos matemáticos fundamentales
- **Inteligencia Artificial**: Matemáticas aplicadas a IA y Machine Learning
- **Bolsa de Valores**: Análisis matemático de mercados financieros

## 📝 Cómo Crear un Nuevo Artículo

### 1. Usar la Plantilla
1. Copia `plantilla-articulo.html`
2. Renómbralo con el nombre del artículo (ej: `mi-nuevo-articulo.html`)
3. Reemplaza todos los campos marcados con `[CAMPO]`

### 2. Campos a Completar

#### Meta Tags
- `[DESCRIPCIÓN DEL ARTÍCULO]`: Descripción para SEO (máximo 160 caracteres)
- `[TÍTULO DEL ARTÍCULO]`: Título completo del artículo

#### Contenido
- `[FECHA]`: Fecha de publicación (ej: "15 de octubre, 2024")
- `[CATEGORIA]`: Una de las categorías válidas
- `[AUTOR]`: Nombre del autor (ej: "M.Sc. Robert Muñoz")
- `[NOMBRE_DEL_ARTICULO]`: Nombre para el breadcrumb
- `[TITULO_IMAGEN]`: Texto para la imagen SVG
- `[ALT_TEXT]`: Texto alternativo para la imagen

#### Contenido del Artículo
- `[RESUMEN_PRINCIPAL_DEL_ARTICULO]`: Resumen destacado
- `[PÁRRAFO_DE_INTRODUCCIÓN]`: Introducción del artículo
- `[TÍTULO_SECCIÓN_X]`: Títulos de secciones
- `[SUBTÍTULO_X]`: Subtítulos con emojis
- `[CONTENIDO_SUBTÍTULO_X]`: Contenido de cada subtítulo
- `[CONCLUSIÓN_DEL_ARTICULO]`: Conclusión final

### 3. Actualizar el Blog Principal
Después de crear el artículo, agrégalo a `index.html`:

```html
<article class="card blog-post" data-category="[CATEGORIA]">
    <img src="data:image/svg+xml,..." alt="[ALT_TEXT]" class="card__image">
    <div class="card__content">
        <div class="card__meta">
            <span>📅 [FECHA]</span>
            <span class="badge badge--primary">[CATEGORIA]</span>
        </div>
        <h2 class="card__title">[TÍTULO DEL ARTÍCULO]</h2>
        <p class="card__description">
            [RESUMEN_BREVE_PARA_LISTA]
        </p>
        <div class="card__footer">
            <span style="color: var(--color-gray-dark); font-size: var(--font-size-sm);">Por: [AUTOR]</span>
            <a href="./[NOMBRE_ARCHIVO].html" class="btn btn--primary" style="margin-top: var(--spacing-md);">Leer más</a>
        </div>
    </div>
</article>
```

## 🎨 Estilos Disponibles

### Badges de Categoría
- `badge--primary`: Para categoría "Matemáticas"
- `badge--secondary`: Para categoría "Inteligencia Artificial"
- `badge--success`: Para categoría "Bolsa de Valores"
- `badge--warning`: Para artículos especiales
- `badge--error`: Para artículos históricos

### Elementos de Contenido
- **Cajas destacadas**: Usar `background: var(--color-gray-light)` con `border-left: 4px solid var(--color-secondary)`
- **Conclusión**: Usar `background: var(--color-primary)` con texto blanco
- **Código matemático**: Usar `font-family: monospace` en divs con fondo gris

## 🔗 Enlaces y Navegación

### Rutas Relativas
- Desde artículos: `../../` para llegar a la raíz
- Desde artículos: `../` para llegar a la carpeta `pages/`
- Desde artículos: `./` para otros artículos del blog

### Breadcrumbs
Todos los artículos incluyen breadcrumbs automáticos:
```
Inicio > Blog > [Nombre del Artículo]
```

## 📱 Responsive Design

Todos los artículos son completamente responsive:
- **Mobile First**: Diseño optimizado para móviles
- **Grid Adaptativo**: Se ajusta automáticamente
- **Tipografía Escalable**: Usa `clamp()` para tamaños de fuente
- **Imágenes Responsive**: Se adaptan al contenedor

## 🚀 Optimización SEO

### Meta Tags Incluidos
- `description`: Para motores de búsqueda
- `title`: Título específico del artículo
- `viewport`: Para dispositivos móviles
- `charset`: UTF-8 para caracteres especiales

### Estructura Semántica
- `<article>`: Para el contenido principal
- `<header>`: Para metadatos del artículo
- `<footer>`: Para enlaces de navegación
- `<h1>`, `<h2>`, `<h3>`: Jerarquía de títulos

## 📊 Estadísticas del Blog

- **Total de artículos**: 6
- **Categorías**: 3 (Matemáticas, IA, Bolsa de Valores)
- **Autores**: Equipo MATUASD, M.Sc. Robert Muñoz, M.Sc. Joel Macea
- **Fechas**: Septiembre - Octubre 2024

## 🔧 Mantenimiento

### Actualizaciones Regulares
- Revisar enlaces rotos
- Actualizar fechas de publicación
- Verificar compatibilidad móvil
- Optimizar imágenes SVG

### Nuevas Funcionalidades Futuras
- Sistema de comentarios
- Búsqueda de artículos
- RSS feed
- Compartir en redes sociales funcional
- Sistema de tags adicionales

---

**Última actualización**: Octubre 2024  
**Mantenido por**: Equipo MATUASD
