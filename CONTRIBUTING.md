# Guía de Contribución - MATUASD

¡Gracias por tu interés en contribuir a MATUASD! Este documento proporciona directrices para contribuir al proyecto.

---

## 🎯 Formas de Contribuir

Puedes contribuir de las siguientes maneras:

1. **Reportar errores** o problemas
2. **Sugerir nuevas funcionalidades**
3. **Mejorar la documentación**
4. **Agregar recursos educativos**
5. **Contribuir con código**
6. **Mejorar el diseño UI/UX**

---

## 📋 Antes de Empezar

1. Lee el [README.md](README.md) para entender el proyecto
2. Revisa los [Issues](../../issues) existentes para evitar duplicados
3. Familiarízate con la estructura del proyecto

---

## 🐛 Reportar Errores

### Plantilla para Reportar Errores

Al reportar un error, incluye:

```markdown
**Descripción del error:**
Descripción clara y concisa del problema.

**Pasos para reproducir:**
1. Ve a '...'
2. Haz click en '...'
3. Scroll hasta '...'
4. Observa el error

**Comportamiento esperado:**
Descripción de lo que esperabas que sucediera.

**Capturas de pantalla:**
Si es aplicable, agrega capturas de pantalla.

**Información del navegador:**
 - Navegador: [ej. Chrome, Firefox]
 - Versión: [ej. 118]
 - SO: [ej. Windows 10, macOS]

**Contexto adicional:**
Cualquier otra información relevante.
```

---

## 💡 Sugerir Funcionalidades

### Plantilla para Sugerencias

```markdown
**Descripción de la funcionalidad:**
Descripción clara de la funcionalidad sugerida.

**Problema que resuelve:**
¿Qué problema o necesidad resuelve esta funcionalidad?

**Solución propuesta:**
Descripción de cómo implementarías la solución.

**Alternativas consideradas:**
Otras soluciones que consideraste.

**Contexto adicional:**
Capturas, mockups o ejemplos.
```

---

## 📚 Agregar Recursos Educativos

### Requisitos para Recursos

Los recursos deben:

- Ser **educativos** y relacionados con matemáticas
- Tener **calidad académica**
- Estar en español (preferiblemente)
- No violar **derechos de autor**
- Estar en formatos compatibles (PDF, PPT, DOCX, etc.)

### Proceso

1. **Fork** del repositorio
2. Agrega el recurso a la carpeta correspondiente en `/resources/`
3. Actualiza el archivo HTML correspondiente con la metadata:
   ```json
   {
     "title": "Nombre del Recurso",
     "type": "PDF",
     "date": "2024-10-20",
     "size": "1.5 MB",
     "url": "../resources/Carpeta/archivo.pdf",
     "description": "Descripción breve"
   }
   ```
4. Crea un **Pull Request**

> **Si el recurso es un programa de estudio**, no edites el JSON a mano: `resources/Programas/` está organizado en ocho subcarpetas por cátedra y la metadata se genera. Nombra el PDF `Mat-XXXX Nombre de la Asignatura.pdf`, déjalo en `resources/Programas/`, ejecuta `python3 tools/organizar-programas.py` y pega el `tools/programas.json` resultante en `pages/programas.html`.

---

## 🔧 Contribuir con Código

### Configuración del Entorno

```bash
# 1. Fork el repositorio en GitHub

# 2. Clona tu fork
git clone https://github.com/TU-USUARIO/MATUASD.git
cd MATUASD

# 3. Agrega el repositorio original como remote
git remote add upstream https://github.com/USUARIO-ORIGINAL/MATUASD.git

# 4. Crea una rama para tu feature
git checkout -b feature/nombre-descriptivo
```

### Estándares de Código

#### HTML
- Usa **HTML5 semántico**
- Indentación: **4 espacios**
- Atributos en comillas dobles
- Alt text en todas las imágenes
- ARIA labels cuando sea necesario

```html
<!-- ✅ Correcto -->
<img src="./img/logo.png" alt="Logo MATUASD" class="header__logo-img">

<!-- ❌ Incorrecto -->
<img src=./img/logo.png class=logo>
```

#### CSS
- Usa **BEM** para nomenclatura de clases
- Variables CSS para valores reutilizables
- Mobile First (min-width en media queries)
- Comentarios para secciones grandes

```css
/* ✅ Correcto */
.card__title {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
}

/* ❌ Incorrecto */
.cardTitle {
  font-size: 24px;
  color: #003B73;
}
```

#### JavaScript
- **ES6+** syntax
- Usa `const` y `let` (no `var`)
- Funciones con nombres descriptivos
- Comentarios para lógica compleja
- Evita dependencias externas

```javascript
// ✅ Correcto
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ❌ Incorrecto
function calc(x) {
  var total = 0;
  for (var i = 0; i < x.length; i++) {
    total += x[i].price;
  }
  return total;
}
```

### Proceso de Pull Request

1. **Asegúrate de que tu código funciona**
   - Prueba en múltiples navegadores
   - Verifica el responsive design
   - Sin errores en consola

2. **Commit con mensajes descriptivos**
   ```bash
   git add .
   git commit -m "feat: Agrega calculadora de interés compuesto"
   ```

   **Prefijos de commit:**
   - `feat:` - Nueva funcionalidad
   - `fix:` - Corrección de error
   - `docs:` - Cambios en documentación
   - `style:` - Cambios de formato (no afectan código)
   - `refactor:` - Refactorización de código
   - `test:` - Agregar tests
   - `chore:` - Tareas de mantenimiento

3. **Push a tu fork**
   ```bash
   git push origin feature/nombre-descriptivo
   ```

4. **Crea el Pull Request**
   - Ve a tu fork en GitHub
   - Click en "New Pull Request"
   - Describe claramente los cambios
   - Referencia issues relacionados

### Plantilla de Pull Request

```markdown
## Descripción
Descripción clara de los cambios realizados.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Mejora de funcionalidad existente
- [ ] Cambios en documentación
- [ ] Refactorización

## ¿Cómo se ha probado?
Describe las pruebas realizadas.

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He comentado el código cuando es necesario
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan warnings
- [ ] He probado en múltiples navegadores
- [ ] El diseño es responsive

## Capturas de pantalla (si aplica)
```

---

## 🎨 Contribuir al Diseño

### Herramientas Recomendadas
- **Figma** - Para mockups y prototipos
- **Adobe XD** - Alternativa a Figma
- **Sketch** - Para diseño de interfaces

### Directrices de Diseño

1. **Colores:**
   - Primario: `#003B73` (Azul UASD)
   - Secundario: `#FF6F00` (Naranja/Dorado)
   - Neutros: Grises y blanco

2. **Tipografía:**
   - Headings: Poppins
   - Body: Open Sans

3. **Espaciado:**
   - Sistema de 8px grid
   - Usa variables CSS predefinidas

4. **Accesibilidad:**
   - Contraste WCAG AA mínimo
   - Tamaños de fuente legibles
   - Interacciones claras

---

## 📄 Documentación

### Mejorar la Documentación

La documentación es tan importante como el código. Puedes contribuir:

- Corrigiendo errores tipográficos
- Mejorando explicaciones
- Agregando ejemplos
- Traduciendo contenido

### Estilo de Documentación

- Usa **Markdown** para formato
- Títulos claros y descriptivos
- Ejemplos de código cuando sea relevante
- Screenshots o GIFs para procesos complejos

---

## ✅ Checklist antes de Contribuir

- [ ] He leído esta guía de contribución
- [ ] He revisado issues existentes
- [ ] Mi contribución sigue los estándares del proyecto
- [ ] He probado mis cambios
- [ ] He actualizado la documentación si es necesario
- [ ] Mi código es responsive
- [ ] No hay errores en consola

---

## 🤝 Código de Conducta

### Nuestros Compromisos

- Ser respetuoso con todos los contribuidores
- Aceptar críticas constructivas
- Enfocarse en lo mejor para la comunidad
- Mostrar empatía hacia otros miembros

### Comportamiento Inaceptable

- Lenguaje o imágenes ofensivas
- Ataques personales o políticos
- Acoso público o privado
- Compartir información privada sin permiso

---

## 📞 ¿Necesitas Ayuda?

Si tienes preguntas sobre cómo contribuir:

1. Revisa la [documentación](README.md)
2. Abre un [Issue](../../issues) con la etiqueta "question"
3. Contacta al equipo: info@MATUASD.edu.do

---

## 🏆 Reconocimiento

Todos los contribuidores serán reconocidos en el proyecto. Tu nombre aparecerá en la sección de contribuidores.

---

**¡Gracias por contribuir a MATUASD!** 🎉

*Tu apoyo ayuda a mejorar la educación matemática en la República Dominicana.*

