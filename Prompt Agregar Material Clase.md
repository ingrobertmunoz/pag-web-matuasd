# Agregar Material/Presentación a [NOMBRE_DE_LA_CLASE]

---

## 📋 **INFORMACIÓN DEL MATERIAL**

- **Título del Material:** "[TÍTULO_COMPLETO_DEL_MATERIAL]"
- **Clase:** "[NOMBRE_DE_LA_CLASE]"
  - Opciones: Matemática Básica, Cálculo I, Cálculo II, Matemática Financiera, Matemática y Tecnología
- **Tipo de Archivo:** "[PDF|Jupyter|Notebook|PPTX|DOCX]"
- **Fecha de Publicación:** "[YYYY-MM-DD]" (ej: "2024-10-25")
- **Tamaño Aproximado:** "[X.X MB]" o "[XXX KB]"
- **Descripción:** "[Descripción breve del contenido del material]"

---

## 📁 **VERIFICACIÓN DE ARCHIVO**

### ✅ **PASO 0: Confirmar Ubicación del Archivo**

**IMPORTANTE:** El archivo ya debe estar en el directorio correcto antes de continuar.

**Rutas de Directorios por Clase:**
- **Matemática Básica:** `resources/Matematica-Basica/`
- **Cálculo I:** `resources/Calculo-I/`
- **Cálculo II:** `resources/Calculo-II/`
- **Matemática Financiera:** `resources/Matematica-Financiera/`
- **Matemática y Tecnología:** `resources/Matematica-y-Tecnologia/`

**Verificar que el archivo existe:**
```bash
# Ejemplo para Cálculo I
ls resources/Calculo-I/[NOMBRE_DEL_ARCHIVO]
```

**Consideraciones sobre el Nombre del Archivo:**
- ✅ Usar nombres descriptivos y claros
- ✅ Mantener numeración si aplica (ej: "1. ", "2. ", "0.1 ", etc.)
- ✅ Evitar caracteres especiales problemáticos (usar guiones en lugar de espacios si es necesario)
- ✅ Mantener extensión correcta (.pdf, .ipynb, .pptx, etc.)
- ✅ Si el archivo tiene nombre con espacios, mantenerlo así (las rutas en JSON soportan espacios)

---

## 🔧 **TAREA 1: Identificar Página HTML de la Clase**

**Mapeo de Clases a Páginas HTML:**

| Clase | Archivo HTML | Ruta desde raíz |
|-------|--------------|-----------------|
| Matemática Básica | `pages/matematica-basica.html` | `./pages/matematica-basica.html` |
| Cálculo I | `pages/calculo-1.html` | `./pages/calculo-1.html` |
| Cálculo II | `pages/calculo-2.html` | `./pages/calculo-2.html` |
| Matemática Financiera | `pages/matematica-financiera.html` | `./pages/matematica-financiera.html` |
| Matemática y Tecnología | `pages/matematica-tecnologia.html` | `./pages/matematica-tecnologia.html` |

**Localizar el contenedor `data-resources`:**
```html
<div id="resources-container" 
     data-resources='[
       // Array JSON con recursos existentes
     ]'>
</div>
```

---

## 📝 **TAREA 2: Crear Entrada JSON del Nuevo Material**

### Formato de Entrada JSON:

```json
{
  "title": "[TÍTULO_COMPLETO_DEL_MATERIAL]",
  "type": "[PDF|Jupyter|Notebook|PPTX|DOCX]",
  "date": "[YYYY-MM-DD]",
  "size": "[X.X MB] o [XXX KB]",
  "url": "../resources/[CARPETA_CLASE]/[NOMBRE_ARCHIVO_COMPLETO]",
  "description": "[Descripción breve del contenido]"
}
```

### Ejemplo Real:

```json
{
  "title": "Límites y Sus Propiedades Parte I",
  "type": "PDF",
  "date": "2024-10-20",
  "size": "1.5 MB",
  "url": "../resources/Calculo-I/1. Límites y Sus Propiedades Parte I.pdf",
  "description": "Conceptos fundamentales de límites y sus propiedades básicas"
}
```

### Consideraciones Importantes:

1. **Título (`title`):**
   - Debe ser claro y descriptivo
   - Puede diferir del nombre del archivo (más legible)
   - Máximo ~60 caracteres recomendado

2. **Tipo (`type`):**
   - **PDF:** Para presentaciones y documentos PDF
   - **Jupyter:** Para notebooks de Jupyter (.ipynb)
   - **Notebook:** Alternativa a "Jupyter" (consistencia)
   - **PPTX:** Para presentaciones PowerPoint (si se agregan)
   - **DOCX:** Para documentos Word (si se agregan)

3. **Fecha (`date`):**
   - Formato: `YYYY-MM-DD` (ISO 8601)
   - Usar fecha de creación o publicación del material
   - Mantener orden cronológico si es relevante

4. **Tamaño (`size`):**
   - Formato: "X.X MB" o "XXX KB"
   - Aproximado está bien (no es crítico)
   - Usar un decimal para MB (ej: "1.5 MB")
   - Usar entero para KB (ej: "980 KB")

5. **URL (`url`):**
   - **CRÍTICO:** Ruta relativa desde la página HTML
   - Desde `pages/*.html` → `../resources/[CARPETA]/[ARCHIVO]`
   - Verificar que el nombre del archivo coincida EXACTAMENTE (incluyendo espacios y mayúsculas)
   - Si el archivo tiene espacios, mantenerlos en la URL

6. **Descripción (`description`):**
   - Breve (1-2 líneas)
   - Descriptiva del contenido
   - Sin puntos finales (opcional, pero consistente)

---

## 🎯 **TAREA 3: Determinar Posición en el Array**

### Orden de Recursos:

**Estrategias de Ordenamiento:**

1. **Por Numeración (Recomendado):**
   - Si los archivos tienen números (ej: "1. ", "2. ", "0.1 "), mantener orden numérico
   - Ejemplo: 0.1, 0.2, 1, 2, 3...

2. **Por Cronología:**
   - Materiales más recientes primero (si se ordenan por fecha)
   - O materiales más antiguos primero (fundamentos primero)

3. **Por Tema/Unidad:**
   - Agrupar por temas relacionados
   - Ejemplo: Fundamentos primero, luego aplicaciones

**Ejemplo de Array Ordenado (Cálculo I):**
```json
[
  {"title": "Coordenadas Cartesianas...", "date": "2024-10-20"},  // 0.
  {"title": "Funciones y sus Gráficas", "date": "2024-10-20"},    // 0.1
  {"title": "Límites... Parte I", "date": "2024-10-20"},          // 1.
  {"title": "Continuidad...", "date": "2024-10-20"},              // 2.
  // ... más recursos
]
```

**Insertar el nuevo material en la posición correcta según el orden elegido.**

---

## ✏️ **TAREA 4: Actualizar el HTML**

### Pasos:

1. **Abrir el archivo HTML de la clase** (ej: `pages/calculo-1.html`)

2. **Localizar el contenedor `data-resources`** (línea ~88-98)

3. **Agregar la nueva entrada JSON** al array:
   - Agregar coma (`,`) después de la última entrada existente
   - Agregar la nueva entrada en formato JSON
   - Mantener sintaxis JSON válida (comas, comillas, etc.)

4. **Verificar sintaxis JSON:**
   - Todas las comillas deben ser dobles (`"`)
   - Coma después de cada entrada (excepto la última)
   - Sin comas finales (trailing commas)
   - Brackets `[]` correctamente cerrados

### Ejemplo de Actualización:

**ANTES:**
```html
<div id="resources-container" 
     data-resources='[
       {"title": "Material 1", "type": "PDF", "date": "2024-10-20", "size": "1.2 MB", "url": "../resources/Calculo-I/1. Material 1.pdf", "description": "Descripción 1"},
       {"title": "Material 2", "type": "PDF", "date": "2024-10-20", "size": "1.3 MB", "url": "../resources/Calculo-I/2. Material 2.pdf", "description": "Descripción 2"}
     ]'>
</div>
```

**DESPUÉS (agregando Material 3):**
```html
<div id="resources-container" 
     data-resources='[
       {"title": "Material 1", "type": "PDF", "date": "2024-10-20", "size": "1.2 MB", "url": "../resources/Calculo-I/1. Material 1.pdf", "description": "Descripción 1"},
       {"title": "Material 2", "type": "PDF", "date": "2024-10-20", "size": "1.3 MB", "url": "../resources/Calculo-I/2. Material 2.pdf", "description": "Descripción 2"},
       {"title": "Material 3", "type": "PDF", "date": "2024-10-25", "size": "1.4 MB", "url": "../resources/Calculo-I/3. Material 3.pdf", "description": "Descripción 3"}
     ]'>
</div>
```

**Nota:** Se agregó coma después de "Material 2" y la nueva entrada "Material 3".

---

## ✅ **TAREA 5: Verificaciones Post-Implementación**

### Checklist de Verificación:

- [ ] **Archivo existe en el directorio correcto**
  - Verificar: `resources/[CARPETA_CLASE]/[NOMBRE_ARCHIVO]`

- [ ] **Ruta en JSON es correcta**
  - Desde `pages/*.html` → `../resources/[CARPETA]/[ARCHIVO]`
  - Nombre del archivo coincide EXACTAMENTE (case-sensitive)

- [ ] **Sintaxis JSON válida**
  - Sin errores de sintaxis
  - Comas correctas
  - Comillas dobles
  - Brackets cerrados

- [ ] **Formato de fecha correcto**
  - `YYYY-MM-DD` (ej: "2024-10-25")

- [ ] **Tipo de archivo correcto**
  - PDF, Jupyter, Notebook, PPTX, DOCX

- [ ] **Descripción clara y concisa**

- [ ] **Orden del array lógico**
  - Numeración, cronología o temático

### Probar Localmente:

1. **Abrir el archivo HTML** en un navegador
2. **Verificar que el recurso aparece** en la lista
3. **Probar la descarga** del archivo
4. **Verificar búsqueda** (si el título es buscable)
5. **Verificar ordenamiento** (por fecha, nombre, etc.)

---

## 🚨 **CONSIDERACIONES ESPECIALES**

### 1. **Archivos con Espacios en el Nombre:**

Si el archivo tiene espacios (ej: "Material Nuevo.pdf"):
- ✅ **Mantener espacios en la URL JSON**
- ✅ **No usar %20** (no es necesario en JSON)
- ✅ **Verificar que el nombre del archivo coincide exactamente**

```json
{
  "url": "../resources/Calculo-I/Material Nuevo.pdf"  // ✅ Correcto
}
```

### 2. **Archivos con Caracteres Especiales:**

Si el archivo tiene caracteres especiales (ej: "Material: Parte I.pdf"):
- ✅ **Mantener caracteres especiales en la URL**
- ✅ **Verificar compatibilidad del sistema de archivos**

### 3. **Notebooks de Jupyter (.ipynb):**

Para notebooks de Jupyter:
- ✅ **Tipo:** "Jupyter" o "Notebook"
- ✅ **URL:** Ruta completa con extensión `.ipynb`
- ✅ **Verificar que el navegador puede descargar .ipynb**

```json
{
  "title": "Introducción a Python - Notebook",
  "type": "Jupyter",
  "url": "../resources/Matematica-y-Tecnologia/1. Introducción a Python.ipynb"
}
```

### 4. **Múltiples Archivos del Mismo Tema:**

Si hay múltiples archivos relacionados (ej: "Parte I", "Parte II"):
- ✅ **Mantener numeración consistente** en títulos
- ✅ **Agrupar en el array** (uno después del otro)
- ✅ **Usar descripciones que indiquen la relación**

### 5. **Archivos Grandes (>10 MB):**

Si el archivo es muy grande:
- ⚠️ **Considerar comprimir** el PDF
- ⚠️ **Verificar límites de GitHub Pages** (100 MB por archivo)
- ⚠️ **Avisar al usuario sobre tamaño** en la descripción

### 6. **Actualización de Material Existente:**

Si se actualiza un material existente:
- ✅ **Actualizar la fecha** en el JSON
- ✅ **Actualizar el tamaño** si cambió
- ✅ **Mantener el mismo título** (o actualizar si es relevante)
- ✅ **Considerar versionado** (ej: "v2", "Rev 2") en el nombre del archivo

---

## 📊 **ESTRUCTURA DE CARPETAS DE RECURSOS**

```
resources/
├── Calculo-I/
│   ├── 0. Coordenadas Cartesianas y Linea Recta.pdf
│   ├── 0.1 Funciones y sus gráficas.pdf
│   ├── 1. Límites y Sus Propiedades Parte I.pdf
│   └── ...
├── Calculo-II/
│   ├── 0.1 Funciones Trascendentes Parte I.pdf
│   └── ...
├── Matematica-Basica/
│   ├── Unidad I. Números Reales Parte I.pdf
│   └── ...
├── Matematica-Financiera/
│   ├── 0.1 Fundamento I.pdf
│   └── ...
└── Matematica-y-Tecnologia/
    ├── 1. Introducción a Python Parte I.pdf
    ├── 1. Introducción a Python.ipynb
    └── ...
```

---

## 🎯 **RESULTADO ESPERADO**

Después de completar todas las tareas:

1. ✅ El nuevo material aparece en la página de la clase
2. ✅ Se puede buscar por título
3. ✅ Se puede ordenar (por fecha, nombre, tipo)
4. ✅ El enlace de descarga funciona correctamente
5. ✅ La descripción es clara y útil
6. ✅ El orden del array es lógico y consistente

---

## 📝 **EJEMPLO COMPLETO**

### Información del Material:
- **Título:** "Integrales Definidas y Teorema Fundamental"
- **Clase:** Cálculo I
- **Tipo:** PDF
- **Fecha:** 2024-10-25
- **Tamaño:** 1.8 MB
- **Descripción:** "Integrales definidas, teorema fundamental del cálculo y aplicaciones"
- **Archivo:** `resources/Calculo-I/6. Integrales Definidas.pdf`

### Entrada JSON:
```json
{
  "title": "Integrales Definidas y Teorema Fundamental",
  "type": "PDF",
  "date": "2024-10-25",
  "size": "1.8 MB",
  "url": "../resources/Calculo-I/6. Integrales Definidas.pdf",
  "description": "Integrales definidas, teorema fundamental del cálculo y aplicaciones"
}
```

### Ubicación en Array:
Agregar después de "Aplicaciones de la Derivada Parte 1" (último recurso actual).

---

**Última actualización:** Octubre 2024  
**Mantenido por:** Equipo MATUASD

