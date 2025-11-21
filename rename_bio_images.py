# -*- coding: utf-8 -*-
import os
import shutil

source_dir = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\imagenes\ciencias-naturales\biologia\correccion"
dest_dir = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\imagenes\ciencias-naturales\biologia"

# Mapeo completo
image_mapping = {
    "biologia_correccion_pag2_img1.jpeg": "transcripcion-detallada.jpeg",
    "biologia_correccion_pag2_img2.jpeg": "traduccion-ribosomas.jpeg",
    "biologia_correccion_pag3_img1.jpeg": "aminoacidos-estructura.jpeg",
    "biologia_correccion_pag3_img2.jpeg": "codigo-genetico-tabla.jpeg",
    "biologia_correccion_pag4_img1.png": "tipos-arn.png",
    "biologia_correccion_pag5_img1.png": "ciclo-celular-completo.png",
    "biologia_correccion_pag6_img1.png": "fases-ciclo-celular.png",
    "biologia_correccion_pag7_img1.png": "mitosis-fases.png",
    "biologia_correccion_pag8_img1.jpeg": "celula-animal-vegetal-comparacion.jpeg",
    "biologia_correccion_pag8_img2.png": "organelos-celulares.png",
    "biologia_correccion_pag9_img1.png": "checkpoint-celular.png",
    "biologia_correccion_pag10_img1.jpeg": "meiosis-fases.jpeg",
    "biologia_correccion_pag11_img1.jpeg": "mitosis-meiosis-diferencias.jpeg",
    # Descartamos pag12_img1 (15x15px)
    "biologia_correccion_pag12_img2.png": "crossing-over-diagrama.png",
    "biologia_correccion_pag13_img1.jpeg": "genetica-mendeliana.jpeg",
    "biologia_correccion_pag14_img1.jpeg": "adn-estructura.jpeg",
    "biologia_correccion_pag14_img2.png": "replicacion-adn.png",
    "biologia_correccion_pag15_img1.jpeg": "fotosintesis-completa.jpeg",
    "biologia_correccion_pag16_img1.jpeg": "cadena-trofica.jpeg",
    "biologia_correccion_pag16_img2.jpeg": "piramide-energetica.jpeg",
    "biologia_correccion_pag17_img1.jpeg": "ecosistemas-chile-mapa.jpeg",
    "biologia_correccion_pag18_img1.jpeg": "seleccion-natural.jpeg",
    "biologia_correccion_pag18_img2.png": "especiacion-diagrama.png",
    "biologia_correccion_pag19_img1.png": "mutaciones-tipos.png",
    "biologia_correccion_pag20_img1.jpeg": "sistema-endocrino.jpeg",
    "biologia_correccion_pag21_img1.jpeg": "reproduccion-humana.jpeg",
}

print("🔄 RENOMBRANDO Y MOVIENDO IMÁGENES\n")
print("="*80)

moved = 0
errors = []

for old_name, new_name in image_mapping.items():
    source_path = os.path.join(source_dir, old_name)
    dest_path = os.path.join(dest_dir, new_name)
    
    if os.path.exists(source_path):
        try:
            # Copiar con nuevo nombre
            shutil.copy2(source_path, dest_path)
            print(f"✅ {old_name}")
            print(f"   → {new_name}")
            moved += 1
        except Exception as e:
            print(f"❌ Error: {old_name} - {e}")
            errors.append(old_name)
    else:
        print(f"⚠️  No encontrado: {old_name}")

print("\n" + "="*80)
print(f"\n📊 Resumen:")
print(f"   ✅ Imágenes movidas: {moved}")
print(f"   ❌ Errores: {len(errors)}")

if moved > 0:
    print(f"\n✅ Todas las imágenes están ahora en:")
    print(f"   {dest_dir}")
    print(f"\n📝 Archivos antiguos a eliminar:")
    
    # Listar imágenes antiguas que pueden ser reemplazadas
    old_images = [
        "ciclo celular.svg",
        "celula vegeta y celula animal.png",
        "mitosis-meiosis-comparacion.svg",
        "ecosistemas-chile.png",
        "ejemplo-genetica-mendeliana.svg",
        "fotosintesis-diagrama.svg"
    ]
    
    for old_img in old_images:
        old_path = os.path.join(dest_dir, old_img)
        if os.path.exists(old_path):
            print(f"   🗑️  {old_img}")
