#!/usr/bin/env python3
"""
Genera las imagenes sociales (Open Graph) 1200x630 del sitio MATUASD.

Cada pagina que no tiene una portada propia recibe una imagen de marca
generada a partir de tools/og/template.html y renderizada con Chrome.

Uso:
    python3 tools/generate-og-images.py            # genera las que faltan
    python3 tools/generate-og-images.py --force    # regenera todas

Al agregar una pagina nueva, anadir su entrada en PAGES y volver a correr.
"""

import argparse
import html
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "tools" / "og" / "template.html"
OUT_DIR = ROOT / "pages" / "img" / "og"
LOGO = ROOT / "img" / "logo.png"

# slug -> (eyebrow, titulo, subtitulo, motivo de fondo)
PAGES = {
    "home": (
        "Portal educativo",
        "Matemáticas UASD",
        "Recursos, programas y divulgación de la Escuela de Matemática.",
        "∑",
    ),
    "calculo-1": (
        "Asignatura",
        "Cálculo I",
        "Límites, derivadas y sus aplicaciones. Materiales y guías de estudio.",
        "∂",
    ),
    "calculo-2": (
        "Asignatura",
        "Cálculo II",
        "Integrales, series y técnicas de integración. Recursos descargables.",
        "∫",
    ),
    "matematica-basica": (
        "Asignatura",
        "Matemática Básica",
        "Fundamentos de álgebra, funciones y trigonometría.",
        "√",
    ),
    "matematica-financiera": (
        "Asignatura",
        "Matemática Financiera",
        "Interés, anualidades y amortización aplicados a las finanzas.",
        "%",
    ),
    "matematica-tecnologia": (
        "Asignatura",
        "Matemática y Tecnología",
        "Herramientas digitales para la enseñanza de las matemáticas.",
        "⌘",
    ),
    "programas": (
        "Documentos",
        "Programas de Estudio",
        "Programas oficiales por competencias de la Escuela de Matemática.",
        "≡",
    ),
    "contacto": (
        "Institucional",
        "Acerca y Contacto",
        "Conoce al equipo detrás de MATUASD y escríbenos.",
        "@",
    ),
    "aviso-legal": (
        "Institucional",
        "Aviso Legal",
        "Política de licencias y condiciones de uso del portal.",
        "§",
    ),
    "monibot014": (
        "Herramienta",
        "Monibot014",
        "Asistente inteligente para estudiantes de matemática.",
        "◆",
    ),
    "calculadora-financiera": (
        "Herramienta",
        "Calculadora Financiera",
        "Calcula interés, anualidades y amortizaciones en línea.",
        "±",
    ),
    "blog": (
        "Divulgación",
        "Blog MATUASD",
        "Artículos de divulgación científica sobre matemática e IA.",
        "π",
    ),
    # Artículos del blog que no tienen portada propia
    "geometria-no-euclidiana": (
        "Artículo",
        "Geometría No Euclidiana",
        "Cuando el quinto postulado de Euclides deja de cumplirse.",
        "∡",
    ),
    "matematicas-ia": (
        "Artículo",
        "Matemáticas detrás de la IA",
        "Álgebra lineal, cálculo y probabilidad como motor del aprendizaje automático.",
        "∇",
    ),
    "problemas-milenio": (
        "Artículo",
        "Los Problemas del Milenio",
        "Los siete desafíos abiertos que definen la matemática contemporánea.",
        "?",
    ),
    "teorema-fundamental-calculo": (
        "Artículo",
        "Teorema Fundamental del Cálculo",
        "El puente entre la derivada y la integral.",
        "∫",
    ),
}


def size_class(title: str) -> str:
    """Reduce el tamano del titulo segun su longitud para que no desborde."""
    n = len(title)
    if n <= 16:
        return ""
    if n <= 26:
        return "long"
    return "longer"


def find_chrome() -> str:
    for name in ("google-chrome", "chromium", "chromium-browser", "google-chrome-stable"):
        path = shutil.which(name)
        if path:
            return path
    sys.exit("No se encontró Chrome/Chromium. Instálalo para generar las imágenes.")


def render(chrome: str, slug: str, data: tuple, workdir: Path) -> Path:
    eyebrow, title, subtitle, motif = data

    markup = TEMPLATE.read_text(encoding="utf-8")
    for token, value in {
        "{{EYEBROW}}": html.escape(eyebrow),
        "{{TITLE}}": html.escape(title),
        "{{SUBTITLE}}": html.escape(subtitle),
        "{{MOTIF}}": html.escape(motif),
        "{{SIZE}}": size_class(title),
        "{{LOGO}}": LOGO.as_uri(),
    }.items():
        markup = markup.replace(token, value)

    page = workdir / f"{slug}.html"
    page.write_text(markup, encoding="utf-8")

    out = OUT_DIR / f"{slug}.png"
    subprocess.run(
        [
            chrome,
            "--headless",
            "--disable-gpu",
            "--no-sandbox",
            "--hide-scrollbars",
            "--force-device-scale-factor=1",
            "--window-size=1200,630",
            "--virtual-time-budget=6000",
            f"--screenshot={out}",
            page.as_uri(),
        ],
        check=True,
        capture_output=True,
    )
    optimize(out)
    return out


def optimize(png: Path) -> None:
    """Reduce el peso ~70%. Son degradados planos y texto: 256 colores bastan."""
    try:
        from PIL import Image
    except ImportError:
        return  # sin Pillow se sube la imagen sin optimizar, no es fatal
    image = Image.open(png).convert("RGB")
    image.quantize(
        colors=256, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG
    ).save(png, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="regenerar imágenes existentes")
    parser.add_argument("--only", help="generar solo este slug")
    args = parser.parse_args()

    chrome = find_chrome()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    targets = PAGES
    if args.only:
        if args.only not in PAGES:
            sys.exit(f"Slug desconocido: {args.only}")
        targets = {args.only: PAGES[args.only]}

    with tempfile.TemporaryDirectory() as tmp:
        workdir = Path(tmp)
        for slug, data in targets.items():
            out = OUT_DIR / f"{slug}.png"
            if out.exists() and not args.force:
                print(f"  omitida  {slug}.png (ya existe)")
                continue
            render(chrome, slug, data, workdir)
            kb = out.stat().st_size / 1024
            print(f"  generada {slug}.png ({kb:.0f} KB)")

    print(f"\nImágenes en {OUT_DIR.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
