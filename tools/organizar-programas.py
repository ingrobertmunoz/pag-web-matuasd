#!/usr/bin/env python3
"""Organiza resources/Programas/ en carpetas por cátedra y regenera el JSON
de `data-resources` que consume pages/programas.html.

La cátedra se lee del campo "Cátedra:" de la primera página de cada PDF.
Los PDFs escaneados (sin capa de texto) y los que no traen ese campo se
resuelven con la tabla OVERRIDES.

Es idempotente: encuentra los PDFs estén sueltos o ya dentro de su carpeta,
y volver a ejecutarlo no produce un segundo diff.

    python3 tools/organizar-programas.py --dry-run   # qué haría
    python3 tools/organizar-programas.py             # mueve los archivos
    python3 tools/organizar-programas.py --json      # solo imprime el JSON
"""

import argparse
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
PROGRAMAS = ROOT / "resources" / "Programas"

# Código de cátedra -> nombre de la carpeta (deben existir ya en disco).
CARPETAS = {
    "AA": "1. Cátedra Matemática Básica (MAT-AA)",
    "AC": "2. Cátedra Análisis Matemático I (MAT-AC)",
    "AD": "3. Cátedra Análisis Matemático II (MAT-AD)",
    "AB": "4. Cátedra Matemática Moderna (MAT-AB)",
    "AE": "5. Cátedra Álgebra (MAT-AE)",
    "AF": "6. Cátedra Matemática para Financieros y Economistas (MAT-AF)",
    "AH": "7. Cátedra Ecuaciones Diferenciales (MAT-AH)",
    "AI": "8. Cátedra Matemática Avanzada (MAT-AI)",
}

# Nombre corto para los chips de filtro de la página.
NOMBRES = {
    "AA": "Matemática Básica",
    "AC": "Análisis Matemático I",
    "AD": "Análisis Matemático II",
    "AB": "Matemática Moderna",
    "AE": "Álgebra",
    "AF": "Mat. Financieros y Economistas",
    "AH": "Ecuaciones Diferenciales",
    "AI": "Matemática Avanzada",
}

# Casos que el PDF no resuelve por sí solo (clave del programa -> cátedra).
OVERRIDES = {
    # El PDF dice solo "Cátedra: Análisis Matemático", sin el ordinal.
    "3570": "AD",
    # No traen campo "Cátedra:" o dicen una cátedra sin carpeta propia.
    "3710": "AI",  # Métodos Matemáticos para Ingenieros (sin campo Cátedra)
    "3920": "AC",  # el PDF dice "Matemáticas Aplicadas"; ubicación indicada por la Escuela
    "3940": "AF",  # el PDF dice "Matemáticas Aplicadas"; ubicación indicada por la Escuela
    # El PDF dice "Ecuaciones Diferenciales", pero la Escuela lo ubica en Análisis II.
    "3650": "AD",
    # Escaneados sin capa de texto (cátedra leída de la imagen).
    "255": "AC",
    "2500": "AC",
    "2570": "AC",
    "2580": "AD",
}

# Reglas sobre el texto del campo "Cátedra:", en orden. La primera que
# coincide gana, por eso los ordinales van antes que el nombre pelado.
REGLAS = [
    (r"\(\s*A\s*([ABCDEFHI])\s*\)", None),  # código explícito: "(A C)", "(AD)" -> AC/AD
    (r"an[áa]lisis\s+(?:matem[áa]tico\s+)?(?:II|2)\b", "AD"),
    (r"an[áa]lisis\s+(?:matem[áa]tico\s+)?(?:I|1)\b", "AC"),
    (r"matem[áa]tica\s+b[áa]sica", "AA"),
    (r"matem[áa]tica\s+moderna", "AB"),
    (r"[áa]lgebra", "AE"),
    (r"matem[áa]tica\s+financiera", "AF"),
    (r"ecuaciones\s+diferenciales", "AH"),
    (r"matem[áa]ticas?\s+avanzadas?", "AI"),
]


def clave(nombre: str) -> str:
    """'Mat-3570 Calculo II.pdf' -> '3570'."""
    m = re.match(r"Mat-(\d+)", nombre, re.I)
    return m.group(1) if m else ""


def catedra_del_pdf(pdf: Path) -> str:
    """Texto crudo del campo 'Cátedra:' de la página 1, o '' si no hay."""
    try:
        texto = subprocess.run(
            ["pdftotext", "-layout", "-f", "1", "-l", "1", str(pdf), "-"],
            capture_output=True, text=True, timeout=30,
        ).stdout
    except (OSError, subprocess.SubprocessError):
        return ""
    m = re.search(r"C[ÁA]TEDRA\s*:?\s*(.*)", texto, re.I)
    if not m:
        return ""
    return re.split(r"\s{3,}", m.group(1).strip())[0].strip()


def clasificar(pdf: Path) -> tuple[str, str]:
    """Devuelve (código de cátedra, motivo)."""
    k = clave(pdf.name)
    if k in OVERRIDES:
        return OVERRIDES[k], "override"
    texto = catedra_del_pdf(pdf)
    if not texto:
        return "", "sin campo Cátedra"
    for patron, codigo in REGLAS:
        m = re.search(patron, texto, re.I)
        if m:
            return (codigo or "A" + m.group(1).upper()), f'"{texto}"'
    return "", f'no reconocida: "{texto}"'


def titulo(nombre: str) -> str:
    """Nombre de archivo -> título legible para la tarjeta."""
    t = nombre[:-4] if nombre.lower().endswith(".pdf") else nombre
    t = re.sub(r"\s+", " ", t.replace("_", " ")).strip()
    t = re.sub(r"\s+Programa$", "", t)
    return t


def codigo_de_carpeta(pdf: Path) -> str:
    """Código de cátedra según la carpeta que contiene al PDF, o ''."""
    return next((c for c, n in CARPETAS.items() if pdf.parent.name == n), "")


def pdfs_actuales() -> list[Path]:
    """Todos los PDFs, sueltos o ya dentro de una carpeta de cátedra."""
    return sorted(
        (p for p in PROGRAMAS.rglob("*.pdf") if p.is_file()),
        key=lambda p: (len(clave(p.name)), clave(p.name), p.name),
    )


def mover(pdf: Path, destino: Path, dry_run: bool) -> bool:
    if pdf.parent == destino:
        return False
    final = destino / pdf.name
    if final.exists():
        print(f"  ! ya existe, no se mueve: {final.relative_to(PROGRAMAS)}", file=sys.stderr)
        return False
    print(f"  {pdf.name}  ->  {destino.name}/")
    if not dry_run:
        r = subprocess.run(["git", "mv", str(pdf), str(final)], cwd=ROOT,
                           capture_output=True, text=True)
        if r.returncode != 0:  # sin seguimiento en git todavía
            pdf.rename(final)
    return True


def fechas_actuales() -> dict[str, str]:
    """Fechas ya publicadas en programas.html, por clave, para no perderlas."""
    html = (ROOT / "pages" / "programas.html").read_text()
    fechas = {}
    for m in re.finditer(r'"title":\s*"Mat-(\d+)[^"]*".*?"date":\s*"([\d-]+)"', html):
        fechas[m.group(1)] = m.group(2)
    return fechas


def construir_json(dry_run: bool) -> list[dict]:
    fechas = fechas_actuales()
    recursos = []
    # CARPETAS ya está en el orden 1..8 de los prefijos de carpeta; el JSON se
    # emite en ese mismo orden para que los acordeones de la página coincidan.
    orden = {c: i for i, c in enumerate(CARPETAS)}
    for pdf in sorted(pdfs_actuales(),
                      key=lambda p: (orden.get(codigo_de_carpeta(p), 99),
                                     len(clave(p.name)), clave(p.name))):
        codigo = codigo_de_carpeta(pdf)
        if not codigo:
            codigo, _ = clasificar(pdf)
        if not codigo:
            continue
        rel = f"{CARPETAS[codigo]}/{pdf.name}"
        size = pdf.stat().st_size
        recursos.append({
            "title": titulo(pdf.name),
            "type": "PDF",
            "date": fechas.get(clave(pdf.name), "2024-01-01"),
            "size": f"{size / 1024:.0f} KB" if size < 1024 * 1024 else f"{size / 1024 / 1024:.1f} MB",
            "url": "../resources/Programas/" + quote(rel),
            "description": f"Programa oficial · {NOMBRES[codigo]}",
            "catedra": NOMBRES[codigo],
            "catedraCode": f"MAT-{codigo}",
        })
    return recursos


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="no mueve nada")
    ap.add_argument("--json", action="store_true", help="solo imprime el JSON")
    args = ap.parse_args()

    faltantes = [n for n in CARPETAS.values() if not (PROGRAMAS / n).is_dir()]
    if faltantes:
        print("Faltan carpetas:\n  " + "\n  ".join(faltantes), file=sys.stderr)
        return 1

    if not args.json:
        pdfs = pdfs_actuales()
        print(f"{len(pdfs)} PDFs encontrados\n")
        movidos, sin_clasificar = 0, []
        for pdf in pdfs:
            codigo, motivo = clasificar(pdf)
            if not codigo:
                sin_clasificar.append((pdf.name, motivo))
                continue
            if mover(pdf, PROGRAMAS / CARPETAS[codigo], args.dry_run):
                movidos += 1
        print(f"\n{movidos} movidos, {len(pdfs) - movidos} ya en su sitio")
        if sin_clasificar:
            print("\nSIN CLASIFICAR:", file=sys.stderr)
            for nombre, motivo in sin_clasificar:
                print(f"  {nombre} ({motivo})", file=sys.stderr)
            return 1

    recursos = construir_json(args.dry_run)
    salida = PROGRAMAS.parent.parent / "tools" / "programas.json"
    salida.write_text(json.dumps(recursos, ensure_ascii=False, indent=2) + "\n")
    if not args.json:
        print(f"\nJSON de {len(recursos)} programas -> {salida.relative_to(ROOT)}")
    else:
        print(json.dumps(recursos, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
