# Prompt para Cursor IDE: Proyecto MATUASD

## Contexto del Proyecto
Eres un experto **Full Stack Developer** especializado en desarrollo web moderno y despliegue en **GitHub Pages**. Vas a crear un sitio web educativo para la **Escuela de Matemática de la Universidad Autónoma de Santo Domingo (UASD)**.

## Objetivo Principal
Desarrollar **MATUASD**: un portal web de divulgación científica matemática dirigido a profesores y estudiantes universitarios.

---

## Requisitos Técnicos

### Stack Tecnológico
- **HTML5 semántico** (estructura limpia y accesible)
- **CSS3 moderno** (Flexbox, Grid, variables CSS)
- **JavaScript vanilla** (sin dependencias externas para máxima compatibilidad con GitHub Pages)
- **Diseño 100% responsive** (Mobile First - adaptable a todos los dispositivos)
- **Optimizado para GitHub Pages** (rutas relativas, sin backend)

### Estructura de Archivos Esperada
```
MATUASD/
├── index.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── variables.css
├── js/
│   ├── main.js
│   └── navigation.js
├── img/
│   └── logo.png
├── pages/
│   ├── blog.html
│   ├── programas.html
│   ├── matematica-basica.html
│   ├── calculo-1.html
│   ├── calculo-2.html
│   ├── matematica-financiera.html
│   ├── matematica-tecnologia.html
│   ├── calculadora-financiera.html
│   ├── noticias-bolsa.html
│   ├── monibot014.html
│   ├── acerca.html
│   └── contacto.html
├── resources/
│   ├── Programas/
│   ├── Matematica-Basica/
│   ├── Calculo-I/
│   ├── Calculo-II/
│   ├── Matematica-Financiera/
│   └── Matematica-y-Tecnologia/
└── README.md
```

---

## Estructura de Navegación

### Menú Principal (presente en todas las páginas)
1. **Inicio**
2. **Blog de Divulgación Científica**
3. **Programas de Matemáticas**
4. **Matemática Básica**
5. **Cálculo I**
6. **Cálculo II**
7. **Matemática Financiera**
8. **Matemática y Tecnología**
9. **Calculadora Financiera**
10. **Noticias Bolsa de Valores**
11. **Monibot014**
12. **Acerca de Nosotros**
13. **Contacto**

---

## Especificaciones Detalladas por Página

### 1. Página de Inicio (`index.html`)
**Componentes obligatorios:**
- **Header fijo** con logo (`img/logo.png`) y menú de navegación responsive
- **Hero Section** con:
  - Título principal: "MATUASD - Portal de Matemáticas UASD"
  - Subtítulo explicando la temática
  - Público objetivo claramente definido
  - Call-to-action destacado
- **Sección de Propósito:**
  - ¿Qué ofrece el sitio?
  - ¿A quién está dirigido? (estudiantes y profesores universitarios)
  - Objetivos de aprendizaje esperados
- **Sección de Video:**
  - Placeholder para video principal (iframe con dimensiones responsive)
  - Texto temporal: "Próximamente: Video introductorio"
- **Preview del Blog:**
  - Últimas 2-3 entradas con miniatura
  - Cada entrada debe mostrar: título, fecha, extracto breve, botón "Leer más"
- **Footer** con enlaces rápidos y créditos

### 2. Blog de Divulgación Científica (`pages/blog.html`)
**Estructura:**
- Sistema de entradas tipo blog con:
  - **Entrada Tipo 1:** Contenido textual + espacio para infografía/presentación embebida
  - **Entrada Tipo 2:** Contenido textual + espacio para video embebido (YouTube/Vimeo)
- Grid responsive de artículos
- Filtros o categorías (Álgebra, Cálculo, Geometría, Aplicaciones, etc.)
- Sistema de paginación básico
- Plantilla reutilizable para nuevas entradas

### 3. Repositorios de Recursos (páginas de programas y materiales)
**Páginas afectadas:**
- `pages/programas.html` → Carpeta: `resources/Programas/`
- `pages/matematica-basica.html` → Carpeta: `resources/Matematica-Basica/`
- `pages/calculo-1.html` → Carpeta: `resources/Calculo-I/`
- `pages/calculo-2.html` → Carpeta: `resources/Calculo-II/`
- `pages/matematica-financiera.html` → Carpeta: `resources/Matematica-Financiera/`
- `pages/matematica-tecnologia.html` → Carpeta: `resources/Matematica-y-Tecnologia/`

**Características de cada repositorio:**
- Lista de recursos en cards/tarjetas con:
  - Icono representativo del tipo de archivo
  - Título descriptivo del recurso
  - Tipo de archivo (PDF, PPT, DOCX, etc.)
  - Tamaño del archivo
  - Fecha de publicación
  - Botón de descarga directo
- Barra de búsqueda para filtrar recursos
- Sistema de categorización o etiquetas
- Vista en lista o grid (toggleable)

**Nota importante:** Generar lógica JavaScript para escanear automáticamente las carpetas y generar los enlaces (o instrucciones para agregar manualmente los archivos en un JSON de configuración)

### 4. Calculadora Financiera (`pages/calculadora-financiera.html`)
**Estado:** PLANTILLA INICIAL
- Diseño visual completo pero funcionalidad deshabilitada
- Secciones placeholder para:
  - Calculadora de interés compuesto
  - Calculadora de amortización
  - Calculadora de inversiones
- Mensaje: "En desarrollo - Próximamente"
- Mantener espacio para futuras funcionalidades

### 5. Noticias Bolsa de Valores (`pages/noticias-bolsa.html`)
**Estado:** PLANTILLA INICIAL
- Layout estilo blog financiero
- Cards para noticias con:
  - Título de noticia
  - Fecha
  - Extracto
  - Imagen placeholder
- Preparado para integración futura de API financiera
- Mensaje temporal: "Próximamente: Noticias en tiempo real"

### 6. Monibot014 (`pages/monibot014.html`)
**Estado:** PLANTILLA INICIAL
- Página misteriosa/teaser
- Diseño minimalista
- Espacio para futura integración de chatbot o herramienta interactiva
- Mensaje: "Proyecto en desarrollo - Mantente atento"

### 7. Acerca de Nosotros (`pages/acerca.html`)
**Contenido:**
- Importar y formatear contenido desde `autores.md`
- Grid de perfiles del equipo con:
  - Espacio para foto de perfil (placeholder circular)
  - Nombre y rol
  - Biografía breve
  - Correo electrónico (con protección anti-spam: texto plano NO enlazado o con `[at]` en lugar de `@`)
  - Enlaces opcionales a perfiles académicos
- Historia y misión del proyecto
- Valores y objetivos educativos

### 8. Contacto (`pages/contacto.html`)
**Elementos:**
- Formulario de contacto (visual, sin backend - con instrucciones para Formspree/EmailJS)
- Sección de redes sociales con iconos enlazados:
  - Instagram
  - YouTube
  - LinkedIn
  - Email
- Información de la Escuela de Matemática UASD
- Mapa embebido de Google Maps (ubicación de la UASD)

---

## Requerimientos de Diseño

### Paleta de Colores Sugerida
- **Primario:** Azul académico (#003B73) - relacionado con UASD
- **Secundario:** Naranja/Dorado (#FF6F00) - para CTAs y acentos
- **Neutros:** Grises (#F5F5F5, #333333)
- **Fondo:** Blanco (#FFFFFF) con secciones alternadas en gris claro

### Tipografía
- **Headings:** Fuente moderna sans-serif (ej: Poppins, Montserrat)
- **Body:** Fuente legible (ej: Open Sans, Roboto)
- Tamaños responsive usando `clamp()` o media queries

### Componentes UI Esenciales
- **Navbar responsive** (hamburger menu en mobile)
- **Cards** consistentes para recursos/blog
- **Buttons** con hover effects
- **Loading states** para elementos que cargarán contenido
- **Breadcrumbs** en páginas internas
- **Back to top button**
- **Skeleton screens** o placeholders para contenido futuro

### Accesibilidad
- Contraste WCAG AA mínimo
- Labels en formularios
- Alt text en imágenes
- Navegación por teclado funcional
- Semántica HTML5 correcta

---

## Funcionalidades JavaScript Requeridas

1. **Menú de navegación responsive** (toggle mobile)
2. **Smooth scrolling** en navegación interna
3. **Generación dinámica de enlaces** a recursos (leer de estructura de carpetas o JSON)
4. **Filtros y búsqueda** en repositorios de recursos
5. **Lazy loading** de imágenes
6. **Modal/lightbox** para vistas previas de recursos
7. **Scroll animations** sutiles (opcional, no excesivo)
8. **Theme toggle** día/noche (opcional pero recomendado)

---

## Instrucciones de Implementación

### Fase 1: Estructura Base
1. Crear estructura de carpetas completa
2. Implementar `index.html` con layout base
3. Desarrollar CSS global con variables y reset
4. Crear componente de navegación reutilizable

### Fase 2: Páginas de Contenido
5. Implementar páginas de repositorios con lógica de enlaces
6. Crear templates de blog y sistema de entradas
7. Diseñar páginas "acerca" y "contacto"

### Fase 3: Páginas Plantilla
8. Crear shells/templates para:
   - Calculadora Financiera
   - Noticias Bolsa
   - Monibot014

### Fase 4: Optimización
9. Asegurar responsive design en todos los breakpoints
10. Optimizar imágenes y rendimiento
11. Validar accesibilidad
12. Documentar en README instrucciones de despliegue en GitHub Pages

---

## Criterios de Éxito

✅ **Sitio 100% funcional sin backend**
✅ **Todos los enlaces y navegación operativos**
✅ **Responsive perfecto** (mobile, tablet, desktop)
✅ **Carga rápida** (<3 segundos en conexión promedio)
✅ **Compatible con GitHub Pages** (rutas relativas, sin server-side)
✅ **Código limpio y comentado** (fácil de mantener)
✅ **README con instrucciones** de setup y despliegue
✅ **Preparado para expansión futura** (plantillas listas)

---

## Entregables Esperados

1. **Código fuente completo** con estructura de carpetas
2. **README.md** con:
   - Descripción del proyecto
   - Instrucciones de instalación local
   - Guía de despliegue en GitHub Pages
   - Estructura del proyecto explicada
   - Próximos pasos / roadmap
3. **Archivo `.gitignore`** apropiado
4. **Comentarios en código** explicando secciones complejas
5. **Guía de contribución** para agregar nuevos recursos/entradas de blog

---

## Notas Adicionales

- **Priorizar simplicidad y mantenibilidad** sobre complejidad innecesaria
- **No usar frameworks pesados** (React, Vue) - mantener vanilla para GitHub Pages
- **Optimizar para SEO básico** (meta tags, títulos descriptivos, estructura semántica)
- **Incluir favicon** relacionado con matemáticas/UASD
- **Probar en múltiples navegadores** (Chrome, Firefox, Safari, Edge)

---

## Recursos de Referencia

- Logo oficial: `img/logo.png`
- Información de autores: `autores.md`
- Carpetas de recursos:
  - `resources/Programas/`
  - `resources/Matematica-Basica/`
  - `resources/Calculo-I/`
  - `resources/Calculo-II/`
  - `resources/Matematica-Financiera/`
  - `resources/Matematica-y-Tecnologia/`

---

## Comenzar Desarrollo

**Primer paso:** Crea la estructura de carpetas base y el archivo `index.html` con el header, hero section y footer. Pregunta antes de proceder con cada sección para validar el diseño y enfoque.