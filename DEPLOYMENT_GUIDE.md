# Guía de Despliegue - MATHUASD

Esta guía te ayudará a desplegar el sitio web MATHUASD en GitHub Pages paso a paso.

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta en [GitHub](https://github.com)
- ✅ [Git](https://git-scm.com/) instalado en tu computadora
- ✅ Los archivos del proyecto MATHUASD

---

## 🚀 Paso 1: Organizar los Recursos

Los recursos ya existen en tu directorio. Vamos a moverlos a las carpetas correctas:

### Mover Recursos de Cálculo I

Los PDFs en la carpeta `Calculo I\` deben moverse a `resources\Calculo-I\`:

```powershell
# En PowerShell (Windows)
Move-Item "Calculo I\*.pdf" "resources\Calculo-I\"
```

### Mover Recursos de Cálculo II

```powershell
Move-Item "Calculo 2\*.pdf" "resources\Calculo-II\"
```

### Mover Recursos de Matemática Básica

```powershell
Move-Item "Matematica Basica\*.pdf" "resources\Matematica-Basica\"
```

### Mover Recursos de Matemática Financiera

```powershell
Move-Item "Matematica Financiera\*.pdf" "resources\Matematica-Financiera\"
```

### Mover Recursos de Matemática y Tecnología

```powershell
Move-Item "Matematica y Tecnologia\*.pdf" "resources\Matematica-y-Tecnologia\"
Move-Item "Matematica y Tecnologia\notebooks\*.ipynb" "resources\Matematica-y-Tecnologia\"
```

### Mover Programas

```powershell
Move-Item "Programas Matemáticas\*.pdf" "resources\Programas\"
```

---

## 🗂️ Paso 2: Limpiar Carpetas Antiguas

Una vez movidos los recursos, elimina las carpetas vacías:

```powershell
Remove-Item "Calculo I" -Recurse -Force
Remove-Item "Calculo 2" -Recurse -Force
Remove-Item "Matematica Basica" -Recurse -Force
Remove-Item "Matematica Financiera" -Recurse -Force
Remove-Item "Matematica y Tecnologia" -Recurse -Force
Remove-Item "Programas Matemáticas" -Recurse -Force
```

---

## 📦 Paso 3: Inicializar Repositorio Git

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Hacer el commit inicial
git commit -m "Initial commit: MATHUASD v1.0.0"

# Crear rama main (si no existe)
git branch -M main
```

---

## 🌐 Paso 4: Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión

2. Haz click en el botón **"+"** (arriba a la derecha) → **"New repository"**

3. Configura el repositorio:
   - **Repository name:** `mathuasd` (o el nombre que prefieras)
   - **Description:** "Portal de Matemáticas de la UASD"
   - **Visibility:** Public (para GitHub Pages gratuito)
   - ❌ NO marques "Initialize with README" (ya tenemos uno)
   
4. Haz click en **"Create repository"**

---

## 📤 Paso 5: Conectar y Subir el Código

Copia los comandos que GitHub te muestra (o usa estos, reemplazando `TU-USUARIO`):

```bash
# Conectar con el repositorio remoto
git remote add origin https://github.com/TU-USUARIO/mathuasd.git

# Subir el código
git push -u origin main
```

Si te pide credenciales:
- **Username:** Tu usuario de GitHub
- **Password:** Usa un [Personal Access Token](https://github.com/settings/tokens) (no tu contraseña)

---

## 🚀 Paso 6: Activar GitHub Pages

1. Ve a tu repositorio en GitHub

2. Click en **Settings** (Configuración) → **Pages** (en el menú lateral)

3. En **Source**, selecciona:
   - **Branch:** `main`
   - **Folder:** `/ (root)`

4. Click en **Save**

5. Espera 1-3 minutos

6. Refresca la página y verás:
   ```
   ✅ Your site is published at https://TU-USUARIO.github.io/mathuasd/
   ```

---

## ✅ Paso 7: Verificar el Sitio

1. Abre la URL de tu sitio: `https://TU-USUARIO.github.io/mathuasd/`

2. Verifica que:
   - ✅ La página de inicio carga correctamente
   - ✅ La navegación funciona
   - ✅ Los recursos se pueden descargar
   - ✅ Las imágenes se muestran
   - ✅ El diseño es responsive

---

## 🔧 Paso 8: Configuraciones Adicionales (Opcional)

### Agregar un Logo

Si tienes un logo:

1. Guarda tu logo como `img/logo.png` (200x200px, fondo transparente)
2. Commit y push:
   ```bash
   git add img/logo.png
   git commit -m "Add official logo"
   git push
   ```

### Configurar Dominio Personalizado

Si tienes un dominio propio (ej: `www.mathuasd.edu.do`):

1. Crea un archivo `CNAME` en la raíz del proyecto:
   ```
   www.mathuasd.edu.do
   ```

2. Configura los DNS en tu proveedor de dominio:
   ```
   Tipo: A
   Host: @
   Valor: 185.199.108.153

   Tipo: A
   Host: @
   Valor: 185.199.109.153

   Tipo: A
   Host: @
   Valor: 185.199.110.153

   Tipo: A
   Host: @
   Valor: 185.199.111.153

   Tipo: CNAME
   Host: www
   Valor: TU-USUARIO.github.io
   ```

3. En GitHub Pages settings, ingresa tu dominio personalizado

4. Marca **"Enforce HTTPS"** cuando esté disponible

---

## 🔄 Paso 9: Actualizar el Sitio

Cada vez que hagas cambios:

```bash
# Ver cambios
git status

# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push

# Espera 1-2 minutos para que se actualice
```

---

## 🐛 Solución de Problemas

### Problema: "403 Error" o página en blanco

**Solución:**
- Verifica que `index.html` esté en la raíz del proyecto
- Asegúrate de que GitHub Pages esté activado
- Espera unos minutos más (puede tardar hasta 10 minutos)

### Problema: Recursos no se descargan

**Solución:**
- Verifica que los archivos PDF existan en las carpetas `resources/`
- Revisa las rutas en el HTML (deben ser relativas: `../resources/...`)
- Los archivos muy grandes (>100MB) no funcionan en GitHub Pages

### Problema: Imágenes no se muestran

**Solución:**
- Verifica que `img/logo.png` exista
- Las rutas deben ser relativas: `./img/logo.png` (desde raíz) o `../img/logo.png` (desde pages/)
- Nombres de archivo case-sensitive: `logo.png` ≠ `Logo.PNG`

### Problema: "Push rejected"

**Solución:**
```bash
# Obtener cambios remotos primero
git pull origin main

# Resolver conflictos si los hay
# Luego intentar push nuevamente
git push
```

---

## 📊 Paso 10: Monitorear el Sitio

### Google Analytics (Opcional)

1. Crea una cuenta en [Google Analytics](https://analytics.google.com)
2. Obtén tu ID de medición (ej: `G-XXXXXXXXXX`)
3. Agrega el código antes del `</head>` en todas las páginas HTML

### Search Console (Opcional)

1. Registra tu sitio en [Google Search Console](https://search.google.com/search-console)
2. Verifica la propiedad usando el método de etiqueta HTML
3. Envía el sitemap (opcional, GitHub Pages lo genera automáticamente)

---

## 📝 Checklist Final

Antes de anunciar el sitio, verifica:

- [ ] Todas las páginas cargan correctamente
- [ ] La navegación funciona en todas las páginas
- [ ] Los recursos se pueden descargar
- [ ] El sitio es responsive (prueba en móvil)
- [ ] No hay errores en la consola del navegador
- [ ] Los enlaces de redes sociales están configurados
- [ ] El formulario de contacto está integrado (o placeholder visible)
- [ ] El logo está actualizado
- [ ] Los colores y tipografía son correctos
- [ ] SEO básico configurado (meta tags)

---

## 🎉 ¡Listo!

Tu sitio MATHUASD está ahora en línea y accesible para toda la comunidad.

### Próximos Pasos

1. **Promociona el sitio:**
   - Comparte en redes sociales
   - Anuncia en la Escuela de Matemática
   - Envía email a estudiantes y profesores

2. **Mantén el contenido actualizado:**
   - Agrega nuevas entradas al blog regularmente
   - Actualiza recursos educativos
   - Responde a feedback de usuarios

3. **Monitorea el rendimiento:**
   - Revisa estadísticas de Google Analytics
   - Lee comentarios y sugerencias
   - Implementa mejoras continuas

---

## 📞 Soporte

Si necesitas ayuda:

- 📧 Email: info@mathuasd.edu.do
- 📖 [Documentación completa](README.md)
- 🐛 [Reportar problemas](https://github.com/TU-USUARIO/mathuasd/issues)

---

**¡Felicidades por lanzar MATHUASD!** 🎊

*Guía creada: Octubre 2024*

