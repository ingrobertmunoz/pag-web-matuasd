# Fotos de la presentación

Cada lámina busca su foto en esta carpeta por nombre. La extensión puede ser `.jpg`, `.jpeg`, `.png` o `.webp`. Para cambiar una foto, sustituye el archivo conservando el nombre y recarga; no hay que tocar el HTML.

| Archivo | Lámina | Qué muestra | Formato |
|---|---|---|---|
| `equipo.jpg` | 3 · El proyecto | El equipo en un arrozal de Mao | Horizontal 4:3 |
| `dron_mavic3m.jpg` | 4 · Dos drones | DJI Mavic 3 Multispectral | Horizontal 16:9 |
| `dron_agras_t50.jpg` | 4 · Dos drones | DJI Agras T50 (ver nota) | Horizontal 16:9 |
| `visita_1.jpg` | 5 · Visitas a campo | Revisión de plántulas en campo | Horizontal 4:3 |

Notas:

- **Agras T40:** no encontré una foto del T40 con licencia libre, así que la lámina muestra un T50 y el pie lo dice. Si tienes una foto propia del T40, guárdala como `dron_agras_t40.jpg` y en `index.html` cambia `data-foto="dron_agras_t50"` por `data-foto="dron_agras_t40"` y ajusta el pie.
- Las fotos de los drones vienen de Wikimedia Commons; autor y licencia están en `CREDITOS.md` y en el pie de cada foto. La licencia CC BY-SA del Mavic exige mantener ese crédito.
- Las fotos se recortan al centro para llenar el recuadro; conviene que el motivo principal esté centrado.
- Un ancho de 1600 px es suficiente. Fotos de más de 2 MB hacen más lenta la carga en la web.
- No uses imágenes de catálogo del fabricante: tienen derechos de autor.
