"""
Generar PDFs usando Python y Playwright (más estable que Puppeteer)
Requiere: pip install playwright && playwright install chromium
"""
import asyncio
import os
from pathlib import Path

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("ERROR: Playwright no está instalado")
    print("Ejecuta: pip install playwright && playwright install chromium")
    exit(1)

DOSSIERES_FALTANTES = [
    ("DOSSIER_MATEMATICA_MEDIA_COMPLETO.html", "DOSSIER_MATEMATICA_MEDIA.pdf"),
    ("DOSSIER_CIENCIAS_NATURALES_MEDIA_COMPLETO.html", "DOSSIER_CIENCIAS_NATURALES_MEDIA.pdf"),
    ("DOSSIER_EDUCACION_BASICA_COMPLETO.html", "DOSSIER_EDUCACION_BASICA.pdf")
]

async def generar_pdf(html_file, pdf_file):
    print(f"\n  Generando: {pdf_file}")
    
    html_path = Path(html_file).absolute()
    pdf_path = Path("dossieres-pdf") / pdf_file
    
    if not html_path.exists():
        print(f"    ERROR: {html_file} no existe")
        return False
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            print(f"    Cargando HTML...")
            await page.goto(f"file://{html_path}", wait_until="domcontentloaded", timeout=180000)
            
            print(f"    Generando PDF...")
            await page.pdf(
                path=str(pdf_path),
                format="Letter",
                print_background=True,
                margin={"top": "20mm", "right": "15mm", "bottom": "20mm", "left": "15mm"}
            )
            
            await browser.close()
            
            size_mb = round(pdf_path.stat().st_size / (1024 * 1024), 2)
            print(f"    ✓ OK: {pdf_file} ({size_mb} MB)")
            return True
            
    except Exception as e:
        print(f"    ✗ ERROR: {str(e)}")
        return False

async def main():
    print("\n=== GENERADOR DE PDFs CON PLAYWRIGHT ===\n")
    
    # Crear carpeta si no existe
    Path("dossieres-pdf").mkdir(exist_ok=True)
    
    exitosos = 0
    for html_file, pdf_file in DOSSIERES_FALTANTES:
        if await generar_pdf(html_file, pdf_file):
            exitosos += 1
        await asyncio.sleep(2)
    
    print(f"\n=== RESUMEN: {exitosos}/{len(DOSSIERES_FALTANTES)} exitosos ===\n")
    
    # Mostrar todos los PDFs
    print("PDFs generados:")
    pdfs = list(Path("dossieres-pdf").glob("*.pdf"))
    for pdf in sorted(pdfs):
        size_mb = round(pdf.stat().st_size / (1024 * 1024), 2)
        print(f"  - {pdf.name} ({size_mb} MB)")
    
    print(f"\nTotal: {len(pdfs)}/8 dossieres\n")

if __name__ == "__main__":
    asyncio.run(main())
