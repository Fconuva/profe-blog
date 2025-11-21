# -*- coding: utf-8 -*-
from PIL import Image
import os
import shutil

image_dir = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\imagenes\ciencias-naturales\biologia\correccion"
output_dir = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\imagenes\ciencias-naturales\biologia"

# Mapeo de imágenes según dimensiones y página (inferencia basada en contexto del PDF)
image_mapping = {
    # PÁGINA 2 - Transcripción/Traducción
    "biologia_correccion_pag2_img1.jpeg": {
        "nuevo_nombre": "transcripcion-detallada.jpeg",
        "descripcion": "Proceso de transcripción - ARN polimerasa",
        "tema": "Transcripción"
    },
    "biologia_correccion_pag2_img2.jpeg": {
        "nuevo_nombre": "traduccion-ribosomas.jpeg",
        "descripcion": "Proceso de traducción en ribosomas",
        "tema": "Traducción"
    },
    
    # PÁGINA 3 - Código genético
    "biologia_correccion_pag3_img1.jpeg": {
        "nuevo_nombre": "aminoacidos-estructura.jpeg",
        "descripcion": "Estructura de aminoácidos",
        "tema": "Código genético"
    },
    "biologia_correccion_pag3_img2.jpeg": {
        "nuevo_nombre": "codigo-genetico-tabla.jpeg",
        "descripcion": "Tabla del código genético con codones",
        "tema": "Código genético"
    },
    
    # PÁGINA 4 - ARN tipos
    "biologia_correccion_pag4_img1.png": {
        "nuevo_nombre": "tipos-arn.png",
        "descripcion": "Tipos de ARN (ARNm, ARNt, ARNr)",
        "tema": "ARN"
    },
    
    # PÁGINA 5 - Ciclo celular (imagen grande 800x1000)
    "biologia_correccion_pag5_img1.png": {
        "nuevo_nombre": "ciclo-celular-completo.png",
        "descripcion": "Ciclo celular con checkpoints y regulación",
        "tema": "Ciclo celular"
    },
    
    # PÁGINA 6 - Fases
    "biologia_correccion_pag6_img1.png": {
        "nuevo_nombre": "fases-ciclo-celular.png",
        "descripcion": "Fases del ciclo celular G1-S-G2-M",
        "tema": "Ciclo celular"
    },
    
    # PÁGINA 7 - Mitosis
    "biologia_correccion_pag7_img1.png": {
        "nuevo_nombre": "mitosis-fases.png",
        "descripcion": "Fases de la mitosis detalladas",
        "tema": "Mitosis"
    },
    
    # PÁGINA 8 - Célula
    "biologia_correccion_pag8_img1.jpeg": {
        "nuevo_nombre": "celula-animal-vegetal-comparacion.jpeg",
        "descripcion": "Comparación célula animal y vegetal",
        "tema": "Célula"
    },
    "biologia_correccion_pag8_img2.png": {
        "nuevo_nombre": "organelos-celulares.png",
        "descripcion": "Organelos celulares y funciones",
        "tema": "Célula"
    },
    
    # PÁGINA 9 - Pequeña
    "biologia_correccion_pag9_img1.png": {
        "nuevo_nombre": "checkpoint-celular.png",
        "descripcion": "Checkpoint del ciclo celular",
        "tema": "Ciclo celular"
    },
    
    # PÁGINA 10 - Meiosis
    "biologia_correccion_pag10_img1.jpeg": {
        "nuevo_nombre": "meiosis-fases.jpeg",
        "descripcion": "Fases de la meiosis I y II",
        "tema": "Meiosis"
    },
    
    # PÁGINA 11 - Comparación
    "biologia_correccion_pag11_img1.jpeg": {
        "nuevo_nombre": "mitosis-meiosis-diferencias.jpeg",
        "descripcion": "Comparación mitosis vs meiosis",
        "tema": "Mitosis/Meiosis"
    },
    
    # PÁGINA 12
    "biologia_correccion_pag12_img1.png": {
        "nuevo_nombre": "icono-pequeño.png",
        "descripcion": "Icono decorativo (15x15px - descartar)",
        "tema": "Descartable"
    },
    "biologia_correccion_pag12_img2.png": {
        "nuevo_nombre": "crossing-over-diagrama.png",
        "descripcion": "Crossing-over en profase I",
        "tema": "Meiosis"
    },
    
    # PÁGINA 13 - Genética
    "biologia_correccion_pag13_img1.jpeg": {
        "nuevo_nombre": "genetica-mendeliana.jpeg",
        "descripcion": "Leyes de Mendel",
        "tema": "Genética"
    },
    
    # PÁGINA 14 - ADN
    "biologia_correccion_pag14_img1.jpeg": {
        "nuevo_nombre": "adn-estructura.jpeg",
        "descripcion": "Estructura del ADN",
        "tema": "ADN"
    },
    "biologia_correccion_pag14_img2.png": {
        "nuevo_nombre": "replicacion-adn.png",
        "descripcion": "Replicación del ADN",
        "tema": "ADN"
    },
    
    # PÁGINA 15 - Fotosíntesis (imagen grande)
    "biologia_correccion_pag15_img1.jpeg": {
        "nuevo_nombre": "fotosintesis-completa.jpeg",
        "descripcion": "Fotosíntesis fases lumínica y oscura",
        "tema": "Fotosíntesis"
    },
    
    # PÁGINA 16 - Ecosistemas
    "biologia_correccion_pag16_img1.jpeg": {
        "nuevo_nombre": "cadena-trofica.jpeg",
        "descripcion": "Cadena trófica",
        "tema": "Ecología"
    },
    "biologia_correccion_pag16_img2.jpeg": {
        "nuevo_nombre": "piramide-energetica.jpeg",
        "descripcion": "Pirámide energética",
        "tema": "Ecología"
    },
    
    # PÁGINA 17 - Ecosistemas Chile
    "biologia_correccion_pag17_img1.jpeg": {
        "nuevo_nombre": "ecosistemas-chile-mapa.jpeg",
        "descripcion": "Ecosistemas de Chile",
        "tema": "Ecología Chile"
    },
    
    # PÁGINA 18 - Evolución
    "biologia_correccion_pag18_img1.jpeg": {
        "nuevo_nombre": "seleccion-natural.jpeg",
        "descripcion": "Selección natural",
        "tema": "Evolución"
    },
    "biologia_correccion_pag18_img2.png": {
        "nuevo_nombre": "especiacion-diagrama.png",
        "descripcion": "Proceso de especiación",
        "tema": "Evolución"
    },
    
    # PÁGINA 19 - Mutaciones
    "biologia_correccion_pag19_img1.png": {
        "nuevo_nombre": "mutaciones-tipos.png",
        "descripcion": "Tipos de mutaciones génicas",
        "tema": "Mutaciones"
    },
    
    # PÁGINA 20 - Hormonas
    "biologia_correccion_pag20_img1.jpeg": {
        "nuevo_nombre": "sistema-endocrino.jpeg",
        "descripcion": "Sistema endocrino",
        "tema": "Hormonas"
    },
    
    # PÁGINA 21 - Reproducción
    "biologia_correccion_pag21_img1.jpeg": {
        "nuevo_nombre": "reproduccion-humana.jpeg",
        "descripcion": "Sistema reproductor humano",
        "tema": "Reproducción"
    }
}

print("🔍 ANÁLISIS DE IMÁGENES DEL PDF DE CORRECCIÓN\n")
print("="*80)

for old_name, info in image_mapping.items():
    old_path = os.path.join(image_dir, old_name)
    
    if os.path.exists(old_path):
        # Verificar dimensiones
        with Image.open(old_path) as img:
            width, height = img.size
        
        print(f"\n📄 {old_name}")
        print(f"   ✏️  Nuevo nombre: {info['nuevo_nombre']}")
        print(f"   📝 Descripción: {info['descripcion']}")
        print(f"   🏷️  Tema: {info['tema']}")
        print(f"   📐 Tamaño: {width}x{height}px")
    else:
        print(f"\n❌ No encontrado: {old_name}")

print("\n" + "="*80)
print(f"\n✅ Total imágenes analizadas: {len(image_mapping)}")
print("\n📋 TEMAS IDENTIFICADOS:")
temas = set(info['tema'] for info in image_mapping.values())
for tema in sorted(temas):
    count = sum(1 for info in image_mapping.values() if info['tema'] == tema)
    print(f"   • {tema}: {count} imagen(es)")
