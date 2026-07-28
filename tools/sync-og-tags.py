#!/usr/bin/env python3
"""
Sincroniza las etiquetas Open Graph / Twitter Card de todo el sitio MATUASD.

Que hace en cada archivo .html:
  1. Toma el <title> y el <meta name="description"> como fuente de verdad.
  2. Resuelve la imagen social (og:image):
       - la que ya declare el archivo, si no es el logo;
       - si no, pages/img/og/<slug>.png, la imagen de marca generada
         por tools/generate-og-images.py.
  3. Reescribe el bloque og:/twitter: completo, con URLs ABSOLUTAS y
     correctamente codificadas (los espacios y acentos rompen los scrapers).

Uso:
    python3 tools/sync-og-tags.py --check   # solo reporta, no escribe
    python3 tools/sync-og-tags.py           # aplica los cambios

Correr despues de agregar cualquier pagina nueva.
"""

import argparse
import html
import re
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.matuasd.com"

# Imagenes que NO sirven como vista previa: si una pagina apunta aqui,
# se sustituye por su imagen de marca generada.
PLACEHOLDER_IMAGES = {"img/logo.png"}

# Plantillas y borradores: no son paginas publicadas.
EXCLUDE = {"pages/blog/plantilla-articulo.html"}

CONTENT_IMG_RE = re.compile(r'<img[^>]+src=["\'](.*?)["\']', re.I)

TITLE_RE = re.compile(r"<title>(.*?)</title>", re.S | re.I)
DESC_RE = re.compile(
    r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']\s*/?>', re.S | re.I
)
# Una linea que sea unicamente un <meta og:*/twitter:*>.
OG_LINE_RE = re.compile(
    r'^[ \t]*<meta\s+(?:property|name)=["\'](?:og|twitter):[^"\']*["\'][^>]*>[ \t]*$', re.I
)
# Comentario que solo rotula el bloque social; queda huerfano al borrar las metas.
SOCIAL_COMMENT_RE = re.compile(
    r"^[ \t]*<!--\s*(?:Open Graph|Twitter|Social)[^>]*-->[ \t]*$", re.I
)
BLANK_RUN_RE = re.compile(r"\n{3,}")


def strip_social_tags(markup: str) -> tuple[str, int]:
    """Elimina metas og:/twitter: y los comentarios que las rotulaban."""
    kept: list[str] = []
    removed = 0
    for line in markup.split("\n"):
        if OG_LINE_RE.match(line) or SOCIAL_COMMENT_RE.match(line):
            removed += 1
            continue
        kept.append(line)
    return BLANK_RUN_RE.sub("\n\n", "\n".join(kept)), removed
HEAD_END_RE = re.compile(r"</head>", re.I)


def site_url(path: str) -> str:
    """URL absoluta con cada segmento codificado (espacios, acentos)."""
    return f"{SITE}/" + "/".join(quote(seg) for seg in path.split("/"))


def rel_to_site(file: Path) -> str:
    return file.relative_to(ROOT).as_posix()


def canonical_path(file: Path) -> str:
    """URL canonica: los index.html se anuncian como su directorio."""
    rel = rel_to_site(file)
    return rel[: -len("index.html")] if rel.endswith("index.html") else rel


def existing_og_image(markup: str) -> str | None:
    m = re.search(
        r'<meta\s+property=["\']og:image["\']\s+content=["\'](.*?)["\']', markup, re.I
    )
    return m.group(1).strip() if m else None


def to_site_path(raw: str, page: Path) -> str | None:
    """Normaliza un og:image existente (absoluto o relativo) a ruta del sitio."""
    if not raw:
        return None
    value = html.unescape(raw)
    if value.startswith(("http://", "https://")):
        for prefix in (f"{SITE}/", "https://matuasd.com/", "http://www.matuasd.com/"):
            if value.startswith(prefix):
                from urllib.parse import unquote

                return unquote(value[len(prefix):])
        return None  # imagen externa: se respeta tal cual
    resolved = (page.parent / value).resolve()
    try:
        return resolved.relative_to(ROOT).as_posix()
    except ValueError:
        return None


def brand_image_for(page: Path) -> str | None:
    """pages/img/og/<slug>.png si existe."""
    slug = "home" if page == ROOT / "index.html" else page.stem
    if page.name == "index.html" and page.parent.name == "blog":
        slug = "blog"
    candidate = ROOT / "pages" / "img" / "og" / f"{slug}.png"
    return rel_to_site(candidate) if candidate.exists() else None


def first_content_image(markup: str, page: Path) -> str | None:
    """Primera <img> real del cuerpo, ignorando el logo del header."""
    for raw in CONTENT_IMG_RE.findall(markup):
        path = to_site_path(raw, page)
        if path and path not in PLACEHOLDER_IMAGES and (ROOT / path).exists():
            return path
    return None


def build_block(title: str, desc: str, image_url: str, page_url: str, og_type: str) -> str:
    e = html.escape
    return (
        "    <!-- Open Graph / Social Media -->\n"
        f'    <meta property="og:type" content="{og_type}">\n'
        f'    <meta property="og:site_name" content="MATUASD">\n'
        f'    <meta property="og:locale" content="es_DO">\n'
        f'    <meta property="og:title" content="{e(title)}">\n'
        f'    <meta property="og:description" content="{e(desc)}">\n'
        f'    <meta property="og:image" content="{image_url}">\n'
        f'    <meta property="og:image:width" content="1200">\n'
        f'    <meta property="og:image:height" content="630">\n'
        f'    <meta property="og:image:alt" content="{e(title)}">\n'
        f'    <meta property="og:url" content="{page_url}">\n'
        f'    <meta name="twitter:card" content="summary_large_image">\n'
        f'    <meta name="twitter:title" content="{e(title)}">\n'
        f'    <meta name="twitter:description" content="{e(desc)}">\n'
        f'    <meta name="twitter:image" content="{image_url}">\n'
        f'    <meta name="twitter:image:alt" content="{e(title)}">\n'
    )


def process(page: Path, apply: bool) -> tuple[str, str]:
    markup = page.read_text(encoding="utf-8")

    tm = TITLE_RE.search(markup)
    if not tm:
        return "omitida", "sin <title>"
    title = " ".join(html.unescape(tm.group(1)).split())

    dm = DESC_RE.search(markup)
    desc = " ".join(html.unescape(dm.group(1)).split()) if dm else title

    # Imagen: la existente si es utilizable, si no la de marca.
    current = to_site_path(existing_og_image(markup) or "", page)
    if current and current not in PLACEHOLDER_IMAGES and (ROOT / current).exists():
        image_path = current
        origin = "propia"
    else:
        image_path = brand_image_for(page)
        origin = "marca"
        if not image_path:
            image_path = first_content_image(markup, page)
            origin = "contenido"
        if not image_path:
            return "omitida", "sin imagen disponible (añádela a generate-og-images.py)"

    og_type = "article" if page.parent.name == "blog" and page.name != "index.html" else "website"
    block = build_block(title, desc, site_url(image_path), site_url(canonical_path(page)), og_type)

    cleaned, removed = strip_social_tags(markup)
    updated = HEAD_END_RE.sub(block + "</head>", cleaned, count=1)

    if updated == markup:
        return "ok", f"ya correcta ({origin})"
    if apply:
        page.write_text(updated, encoding="utf-8")
    verb = "actualizada" if removed else "añadida"
    return verb, f"{origin} → {image_path}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="no escribir, solo reportar")
    args = parser.parse_args()

    pages = sorted(
        [ROOT / "index.html"]
        + list((ROOT / "pages").glob("*.html"))
        + list((ROOT / "pages" / "blog").glob("*.html"))
    )

    changed = 0
    problems = 0
    for page in pages:
        if rel_to_site(page) in EXCLUDE:
            continue
        status, detail = process(page, apply=not args.check)
        if status == "omitida":
            problems += 1
        elif status != "ok":
            changed += 1
        print(f"  {status:<12} {rel_to_site(page):<44} {detail}")

    print()
    if args.check:
        print(f"{changed} archivo(s) requieren cambios, {problems} sin resolver.")
        sys.exit(1 if changed or problems else 0)
    print(f"{changed} archivo(s) modificados, {problems} sin resolver.")


if __name__ == "__main__":
    main()
