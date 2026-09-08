# MATUASD - Portal de Matemáticas UASD

![MATUASD](./img/logo.png)

Portal educativo de la **Escuela de Matemática de la Universidad Autónoma de Santo Domingo (UASD)**. Un sitio web de divulgación científica matemática dirigido a profesores y estudiantes universitarios.

---

## 📋 Descripción del Proyecto

MATUASD es un portal web educativo que ofrece:

- 📚 **Recursos educativos** organizados por asignatura
- 📝 **Blog de divulgación científica** con artículos matemáticos
- 🧮 **Herramientas interactivas** (en desarrollo)
- 📊 **Materiales descargables** (PDFs, presentaciones, ejercicios)
- 👨‍🏫 **Información del equipo** académico

---

## 🚀 Características Principales

### ✅ Implementado

- ✔️ Diseño responsive 100% (Mobile First)
- ✔️ Navegación completa entre todas las páginas
- ✔️ Sistema de recursos descargables
- ✔️ Blog con categorías y filtros
- ✔️ Páginas de información institucional
- ✔️ Optimizado para GitHub Pages
- ✔️ Sin dependencias externas (Vanilla JavaScript)

### 🚧 En Desarrollo

- ⏳ Calculadora Financiera interactiva
- ⏳ Noticias de Bolsa en tiempo real
- ⏳ Monibot014 (Chatbot educativo con IA)
- ⏳ Integración de formulario de contacto

---

## 📁 Estructura del Proyecto

```
MATUASD/
├── index.html                      # Página principal
├── css/
│   ├── variables.css              # Variables CSS (colores, fuentes, etc.)
│   ├── style.css                  # Estilos globales
│   └── responsive.css             # Media queries y responsive
├── js/
│   ├── main.js                    # JavaScript principal
│   ├── navigation.js              # Lógica de navegación
│   └── resources.js               # Gestor de recursos
├── img/
│   └── logo.png                   # Logo del proyecto
├── pages/
│   ├── blog.html                  # Blog de divulgación
│   ├── programas.html             # Programas de estudio
│   ├── matematica-basica.html     # Recursos de Matemática Básica
│   ├── calculo-1.html             # Recursos de Cálculo I
│   ├── calculo-2.html             # Recursos de Cálculo II
│   ├── matematica-financiera.html # Recursos de Mat. Financiera
│   ├── matematica-tecnologia.html # Recursos de Mat. y Tecnología
│   ├── calculadora-financiera.html # Plantilla de calculadora
│   ├── monibot014.html            # Plantilla de chatbot
│   ├── acerca.html                # Acerca de nosotros
│   └── contacto.html              # Página de contacto
├── resources/
│   ├── Programas/                 # Programas de estudio (PDFs), en 8 subcarpetas por cátedra
│   ├── Matematica-Basica/         # Materiales de Matemática Básica
│   ├── Calculo-I/                 # Materiales de Cálculo I
│   ├── Calculo-II/                # Materiales de Cálculo II
│   ├── Matematica-Financiera/     # Materiales de Mat. Financiera
│   └── Matematica-y-Tecnologia/   # Materiales de Mat. y Tecnología
├── README.md                       # Este archivo
├── .gitignore                      # Archivos ignorados por Git
└── autores.md                      # Información de los autores
```

---

## 🛠️ Tecnologías Utilizadas

### Frontend

- **HTML5** - Estructura semántica y accesible
- **CSS3** - Diseño moderno con Flexbox y Grid
- **JavaScript (Vanilla)** - Sin frameworks para máxima compatibilidad

### Características Técnicas

- Variables CSS para fácil personalización
- Sistema de grid responsive
- Navegación con hamburger menu en móviles
- Lazy loading de imágenes
- Smooth scrolling
- Back to top button
- Sistema de filtrado y búsqueda de recursos

---

## 📦 Instalación Local

### Opción 1: Servidor Local con Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Luego abre tu navegador en `http://localhost:8000`

### Opción 2: Extensión de VS Code

1. Instala la extensión **Live Server**
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

### Opción 3: Abrir directamente

Simplemente abre el archivo `index.html` en tu navegador preferido.

---

## 🌐 Despliegue en GitHub Pages

### Pasos para Desplegar

1. **Crea un repositorio en GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MATUASD"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/MATUASD.git
   git push -u origin main
   ```

2. **Activa GitHub Pages**
   - Ve a tu repositorio en GitHub
   - Click en **Settings** → **Pages**
   - En **Source**, selecciona la rama `main` y carpeta `/ (root)`
   - Click en **Save**

3. **Accede a tu sitio**
   - Tu sitio estará disponible en: `https://TU-USUARIO.github.io/MATUASD/`
   - Puede tardar unos minutos en estar disponible

### Dominio Personalizado (Opcional)

Si deseas usar un dominio personalizado:

1. Crea un archivo `CNAME` en la raíz del proyecto con tu dominio:
   ```
   www.MATUASD.edu.do
   ```

2. Configura los DNS de tu dominio apuntando a GitHub Pages:
   ```
   A Record: 185.199.108.153
   A Record: 185.199.109.153
   A Record: 185.199.110.153
   A Record: 185.199.111.153
   ```

---

## 📝 Guía de Contribución

### Agregar Nuevos Recursos

1. **Añade el archivo** a la carpeta correspondiente en `/resources/`

2. **Actualiza el data-resources** en el HTML correspondiente:

   ```html
   <div id="resources-container" 
        data-resources='[
          {
            "title": "Nombre del Recurso",
            "type": "PDF",
            "date": "2024-10-20",
            "size": "1.5 MB",
            "url": "../resources/Carpeta/archivo.pdf",
            "description": "Descripción breve"
          }
        ]'>
   </div>
   ```

3. Los tipos de archivo soportados: `PDF`, `PPT`, `PPTX`, `DOC`, `DOCX`, `XLS`, `XLSX`, `ZIP`, `MP4`, etc.

> **Excepción: los programas de estudio.** `resources/Programas/` está dividido en ocho subcarpetas por cátedra y su `data-resources` se genera, no se escribe a mano. Coloca el PDF nombrado `Mat-XXXX Nombre de la Asignatura.pdf`, ejecuta `python3 tools/organizar-programas.py` (él lo mueve a la carpeta de su cátedra leyéndola del propio PDF y regenera `tools/programas.json`) y pega ese JSON en `pages/programas.html`.

### Agregar Nuevas Entradas al Blog

1. Edita el archivo `pages/blog.html`

2. Agrega un nuevo `<article>` en el grid:

   ```html
   <article class="card blog-post" data-category="CATEGORIA">
       <img src="../img/blog-imagen.jpg" alt="Título" class="card__image">
       <div class="card__content">
           <div class="card__meta">
               <span>📅 Fecha</span>
               <span class="badge badge--primary">Categoría</span>
           </div>
           <h2 class="card__title">Título del Artículo</h2>
           <p class="card__description">Contenido...</p>
       </div>
   </article>
   ```

3. Categorías disponibles: `algebra`, `calculo`, `geometria`, `aplicaciones`, `historia`

---

## 🎨 Personalización

### Colores

Edita las variables en `css/variables.css`:

```css
:root {
  --color-primary: #003B73;      /* Azul UASD */
  --color-secondary: #FF6F00;    /* Naranja/Dorado */
  --color-white: #FFFFFF;
  --color-gray-light: #F5F5F5;
  --color-black: #333333;
}
```

### Tipografía

Cambia las fuentes en `css/variables.css`:

```css
:root {
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Open Sans', sans-serif;
}
```

### Logo

Reemplaza el archivo `img/logo.png` con tu propio logo (recomendado: 200x200px, fondo transparente).

---

## 🔌 Integraciones Recomendadas

### Formulario de Contacto

**Opción 1: Formspree** (Recomendado)

1. Registrate en [formspree.io](https://formspree.io)
2. Crea un nuevo formulario
3. Actualiza el `<form>` en `pages/contacto.html`:
   ```html
   <form action="https://formspree.io/f/TU-ID" method="POST">
   ```

**Opción 2: EmailJS**

1. Registrate en [emailjs.com](https://www.emailjs.com)
2. Configura tu servicio de email
3. Integra el SDK de EmailJS

### Google Analytics (Opcional)

Agrega antes del cierre de `</head>` en todas las páginas:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TU-ID');
</script>
```

---

## 👥 Equipo

### M.Sc. Robert Antonio Muñoz Rivera
- **Maestría:** Matemática Pura
- **Especialización:** Inteligencia Artificial, Ciencia de Datos, Metrología
- **Rol:** Desarrollo del proyecto, contenido académico

### M.Sc. Joel Abel Macea Selmo
- **Maestría:** Ciencias Matemáticas Puras
- **Especialización:** Ciencia de Datos, Gestión de Proyectos
- **Rol:** Contenido académico, revisión técnica

---

## 📄 Licencia

Este proyecto es desarrollado por la **Escuela de Matemática de la UASD** con fines educativos.

Todos los materiales educativos son de libre acceso para la comunidad universitaria.

---

## 🐛 Reporte de Errores

Si encuentras algún error o tienes sugerencias:

1. Abre un **Issue** en GitHub
2. Usa el formulario de contacto en el sitio web
3. Contacta directamente al equipo de desarrollo

---

## 🗺️ Roadmap

### Versión 1.0 (Actual)
- [x] Estructura base del sitio
- [x] Páginas de recursos
- [x] Blog de divulgación
- [x] Páginas institucionales

### Versión 1.1 (Próxima)
- [ ] Calculadora Financiera funcional
- [ ] Integración con APIs de noticias financieras
- [ ] Sistema de búsqueda global
- [ ] Modo oscuro/claro

### Versión 2.0 (Futuro)
- [ ] Monibot014 - Chatbot con IA
- [ ] Sistema de usuarios y progreso
- [ ] Ejercicios interactivos
- [ ] Foro de discusión

---

## 📞 Contacto

**Escuela de Matemática - UASD**
- 📧 Email: info@MATUASD.edu.do
- 📍 Dirección: Ciudad Universitaria, Santo Domingo, RD
- 🌐 Web: [MATUASD.edu.do](https://MATUASD.edu.do) (ejemplo)

---

## 🙏 Agradecimientos

- A la **Universidad Autónoma de Santo Domingo (UASD)** por su apoyo institucional
- A la **Escuela de Matemática** por facilitar este proyecto
- A todos los estudiantes y profesores que utilizan esta plataforma

---

**Desarrollado con ❤️ por el equipo de MATUASD**

*Última actualización: Octubre 2024*

