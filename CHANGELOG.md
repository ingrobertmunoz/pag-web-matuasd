# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.0.0] - 2024-10-20

### 🎉 Lanzamiento Inicial

Primera versión pública de MATHUASD - Portal de Matemáticas UASD.

### ✨ Agregado

#### Páginas Principales
- **Página de Inicio** con hero section, propósito y preview del blog
- **Blog de Divulgación Científica** con sistema de categorías y filtros
- **Página Acerca de Nosotros** con perfiles del equipo y misión/visión
- **Página de Contacto** con formulario y mapa (placeholder)

#### Repositorios de Recursos
- **Programas de Matemáticas** - Programas de estudio oficiales
- **Matemática Básica** - Recursos fundamentales
- **Cálculo I** - Límites y derivadas
- **Cálculo II** - Integrales y ecuaciones diferenciales
- **Matemática Financiera** - Interés, anualidades e inversiones
- **Matemática y Tecnología** - Herramientas computacionales

#### Plantillas (En Desarrollo)
- **Calculadora Financiera** - Diseño base para futuras funcionalidades
- **Noticias Bolsa de Valores** - Plantilla para integración con APIs
- **Monibot014** - Página teaser para chatbot educativo

#### Sistema de Recursos
- Gestor dinámico de recursos con JavaScript
- Vista en grid y lista toggleable
- Sistema de búsqueda en tiempo real
- Filtros por fecha, nombre y tipo
- Metadata de recursos (título, tipo, tamaño, fecha)
- Iconos automáticos según tipo de archivo

#### Diseño y UI
- Diseño responsive 100% (Mobile First)
- Sistema de variables CSS para fácil personalización
- Navegación con hamburger menu en móviles
- Header fijo con auto-hide al scroll
- Back to top button
- Breadcrumbs en páginas internas
- Cards con hover effects
- Loading skeletons para mejor UX

#### JavaScript
- Navegación responsive
- Smooth scrolling
- Lazy loading de imágenes
- Scroll animations
- Sistema de filtrado del blog
- Gestor de recursos educativos
- Actualización automática de año en footer
- Theme toggle preparado (modo oscuro)

#### Documentación
- README.md completo con instrucciones
- CONTRIBUTING.md con guía de contribución
- CHANGELOG.md para registro de cambios
- .gitignore configurado
- LICENSE MIT

#### Optimizaciones
- Sin dependencias externas (Vanilla JavaScript)
- Optimizado para GitHub Pages
- Rutas relativas para máxima compatibilidad
- SEO básico implementado (meta tags)
- Accesibilidad WCAG AA
- Favicons configurados

### 🎨 Diseño

#### Paleta de Colores
- Primario: `#003B73` (Azul UASD)
- Secundario: `#FF6F00` (Naranja/Dorado)
- Neutros: Grises y blanco

#### Tipografía
- Headings: Poppins
- Body: Open Sans
- Tamaños responsive con clamp()

#### Componentes
- Cards consistentes
- Botones con múltiples variantes
- Badges para categorías
- Placeholders para contenido futuro
- Grid system responsive

### 📚 Contenido

#### Blog (6 entradas iniciales)
1. La Belleza de las Ecuaciones Diferenciales
2. Introducción al Análisis Real
3. Matemáticas en la Inteligencia Artificial
4. Geometría No Euclidiana
5. Los Grandes Problemas del Milenio
6. El Teorema Fundamental del Cálculo

#### Recursos Educativos
- 6 programas de estudio
- 6 recursos de Matemática Básica
- 6 recursos de Cálculo I
- 6 recursos de Cálculo II
- 6 recursos de Matemática Financiera
- 6 recursos de Matemática y Tecnología

### 🏗️ Infraestructura

#### Estructura del Proyecto
- Organización modular de archivos
- Separación de concerns (HTML, CSS, JS)
- Carpetas de recursos organizadas por materia
- Sistema de rutas relativas

#### Compatibilidad
- Compatible con todos los navegadores modernos
- Funciona sin servidor (HTML estático)
- Listo para GitHub Pages
- Sin necesidad de build process

### 📖 Equipo

#### Autores
- M.Sc. Robert Antonio Muñoz Rivera
- M.Sc. Joel Abel Macea Selmo

---

## [Unreleased]

### 🚀 Próximas Funcionalidades

#### En Desarrollo
- Calculadora Financiera interactiva
  - Calculadora de interés compuesto
  - Tabla de amortización
  - Análisis de inversiones (VAN, TIR)
  
- Noticias de Bolsa en Tiempo Real
  - Integración con APIs financieras
  - Gráficos interactivos
  - Análisis cuantitativo
  
- Monibot014
  - Chatbot educativo con IA
  - Resolución de problemas paso a paso
  - Recomendación de recursos

#### Planificado para v1.1
- [ ] Sistema de búsqueda global
- [ ] Modo oscuro/claro
- [ ] Formulario de contacto funcional (Formspree/EmailJS)
- [ ] Google Maps embebido
- [ ] Más entradas de blog
- [ ] Más recursos educativos
- [ ] Newsletter subscription
- [ ] RSS feed del blog

#### Planificado para v1.2
- [ ] Sistema de comentarios en blog
- [ ] Compartir en redes sociales
- [ ] Impresión optimizada
- [ ] PWA (Progressive Web App)
- [ ] Offline support
- [ ] Analytics integrado

#### Planificado para v2.0
- [ ] Backend para usuarios registrados
- [ ] Sistema de progreso del estudiante
- [ ] Ejercicios interactivos
- [ ] Evaluaciones y quizzes
- [ ] Foro de discusión
- [ ] Sistema de notificaciones

---

## Tipos de Cambios

- **Agregado** - Para nuevas funcionalidades
- **Cambiado** - Para cambios en funcionalidades existentes
- **Deprecado** - Para funcionalidades que serán removidas
- **Removido** - Para funcionalidades removidas
- **Corregido** - Para corrección de bugs
- **Seguridad** - Para vulnerabilidades de seguridad

---

## Versionado

Este proyecto usa [Semantic Versioning](https://semver.org/lang/es/):

- **MAJOR** version para cambios incompatibles con versiones anteriores
- **MINOR** version para nuevas funcionalidades compatibles
- **PATCH** version para correcciones de bugs compatibles

Formato: `MAJOR.MINOR.PATCH` (ej: 1.0.0)

---

**Última actualización:** 20 de octubre, 2024

