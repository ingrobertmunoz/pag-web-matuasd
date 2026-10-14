# Presentación: IA y drones en arroz y musáceas — explorando la matemática

Presentación en Reveal.js: 38 láminas principales y 11 para profundizar. Funciona sin internet: Reveal.js, KaTeX y el generador de QR están copiados en `vendor/`.

## Abrirla

- **Rápido:** doble clic en `index.html`.
- **Recomendado para presentar** (habilita la vista del orador): desde esta carpeta,
  ```bash
  python3 -m http.server 8000
  ```
  y abrir <http://localhost:8000>.

## Teclas útiles

| Tecla | Acción |
|---|---|
| → / ← | Lámina siguiente / anterior |
| ↓ / ↑ | Láminas "para profundizar" (cuando aparece el aviso ámbar abajo a la izquierda) |
| `S` | Vista del orador con notas, reloj y lámina siguiente |
| `F` | Pantalla completa |
| `Esc` u `O` | Vista general de todas las láminas |
| `M` | Abrir o cerrar el contenido (lista de todas las láminas) |
| `B` | Pantalla en negro |

## Qué falta completar

1. **Datos del evento** → `js/config.js`: el ponente, el motivo de la charla, el asistente y el enlace del Colab ya están puestos.
2. **Fotos** → ya están en `assets/fotos/`. Para cambiarlas, ver `assets/fotos/LEEME.md`; las licencias de las fotos de los drones están en `assets/fotos/CREDITOS.md`.

## Demostración en Colab

El cuaderno ya está enlazado en `colabUrl` (`js/config.js`) y la lámina de la demostración muestra su código QR.

1. Comprueba que el archivo en Drive está compartido como "Cualquier persona con el enlace": ábrelo desde el QR en una ventana privada.
2. **Antes de la charla:** ejecuta todas las celdas una vez, para que el modelo (unos 100 MB) ya esté descargado en esa sesión.
3. Si falla la conexión, la lámina de la demostración tiene capturas de respaldo con la flecha ↓.

## Publicarla en la web

La carpeta `presentacion/` es un sitio estático completo. Opciones: GitHub Pages, Netlify Drop (arrastrar la carpeta) o cualquier hosting de archivos. Después, pegar la dirección en `presentacionUrl` de `js/config.js`.

Para exportar a PDF: abrir `index.html?print-pdf` en Chrome e imprimir a PDF.

## Estructura

```
presentacion/
├── index.html                      láminas y notas del orador
├── guion.md                        guion con tiempos por lámina
├── demo_clasificador_resnet.ipynb  cuaderno de Colab
├── preparar_assets.py              regenera las imágenes de campo desde data/raw/Mao (requiere el repo del proyecto)
├── preparar_gato.py                regenera las imágenes y datos del gato, el ejemplo de la parte matemática
├── css/tema.css                    estilo visual
├── js/config.js                    datos del evento (editar aquí)
├── js/interactivos.js              menú e índice, matriz de píxeles, convolución (a mano y con imagen), ReLU, max pooling, softmax, descenso del gradiente, QR
├── assets/                         imágenes derivadas de los vuelos
│   └── fotos/                      fotos del equipo, la visita y los drones (con CREDITOS.md)
└── vendor/                         Reveal.js 5.2.1, KaTeX 0.16.11, qrcode-generator 1.4.4
```
