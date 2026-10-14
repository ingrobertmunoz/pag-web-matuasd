#!/usr/bin/env bash
# Copia la presentación Reveal.js desde su repo de trabajo a la carpeta que publica el sitio.
# Idempotente: si no hay cambios en el origen, no toca nada.
#
#   tools/sync-presentacion.sh            # sincroniza
#   tools/sync-presentacion.sh --dry-run  # muestra qué cambiaría
set -euo pipefail

ORIGEN="${PRESENTACION_ORIGEN:-$HOME/Proyectos_Ubuntu/presentacion-cnn/presentacion}"
DESTINO="pages/blog/presentacion-drones-ia"

[ -f "$ORIGEN/index.html" ] || { echo "No encuentro $ORIGEN/index.html" >&2; exit 1; }
[ -d "$DESTINO" ] || { echo "Ejecuta el script desde la raíz del repo" >&2; exit 1; }

# Los archivos de trabajo no se publican (también están en .gitignore).
rsync -a --delete --itemize-changes "$@" \
    --exclude 'guion.md' \
    --exclude 'LEEME.md' \
    --exclude 'preparar_*.py' \
    --exclude '__pycache__' \
    "$ORIGEN/" "$DESTINO/"
