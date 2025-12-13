#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Transcriptor de audios de Inglés ECEP 2023
Usa OpenAI Whisper para transcribir los 6 audios originales
"""

import whisper
import os
import json
from pathlib import Path

# Directorio de audios
AUDIO_DIR = Path(r"evaluaciones\educacion-media\pruebas\ingles-media\audios\audios v2")
OUTPUT_DIR = Path(r"evaluaciones\educacion-media\pruebas\ingles-media")

def transcribir_audios():
    """Transcribe todos los audios de la prueba de inglés"""
    
    print("=" * 60)
    print("TRANSCRIPTOR DE AUDIOS - INGLÉS ECEP 2023")
    print("=" * 60)
    
    # Cargar modelo Whisper (base es un buen balance velocidad/calidad)
    print("\nCargando modelo Whisper 'base'...")
    model = whisper.load_model("base")
    print("Modelo cargado correctamente!")
    
    # Buscar archivos de audio
    audio_files = sorted(AUDIO_DIR.glob("*.mp3"))
    print(f"\nEncontrados {len(audio_files)} archivos de audio:")
    for f in audio_files:
        print(f"  - {f.name}")
    
    transcripciones = {}
    
    for audio_file in audio_files:
        print(f"\n{'='*40}")
        print(f"Transcribiendo: {audio_file.name}")
        print("="*40)
        
        # Transcribir con detección automática de idioma (debería ser inglés)
        result = model.transcribe(
            str(audio_file),
            language="en",  # Forzar inglés
            verbose=False
        )
        
        # Extraer número del audio
        audio_num = audio_file.stem.split()[0]  # "01", "02", etc.
        
        transcripciones[audio_num] = {
            "archivo": audio_file.name,
            "texto": result["text"],
            "idioma_detectado": result.get("language", "en"),
            "segmentos": [
                {
                    "inicio": seg["start"],
                    "fin": seg["end"],
                    "texto": seg["text"]
                }
                for seg in result.get("segments", [])
            ]
        }
        
        print(f"\nTexto transcrito:")
        print("-" * 40)
        print(result["text"][:500] + "..." if len(result["text"]) > 500 else result["text"])
        print("-" * 40)
    
    # Guardar transcripciones en JSON
    output_json = OUTPUT_DIR / "transcripciones_audios.json"
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(transcripciones, f, indent=2, ensure_ascii=False)
    print(f"\n✅ Transcripciones guardadas en: {output_json}")
    
    # Guardar también en formato texto plano
    output_txt = OUTPUT_DIR / "transcripciones_audios.txt"
    with open(output_txt, "w", encoding="utf-8") as f:
        f.write("TRANSCRIPCIONES DE AUDIOS - INGLÉS ECEP 2023\n")
        f.write("=" * 60 + "\n\n")
        
        for num, data in sorted(transcripciones.items()):
            f.write(f"AUDIO {num}: {data['archivo']}\n")
            f.write("-" * 40 + "\n")
            f.write(data["texto"] + "\n\n")
            f.write("Segmentos con tiempos:\n")
            for seg in data["segmentos"]:
                f.write(f"  [{seg['inicio']:.1f}s - {seg['fin']:.1f}s] {seg['texto']}\n")
            f.write("\n" + "=" * 60 + "\n\n")
    
    print(f"✅ Transcripciones en texto guardadas en: {output_txt}")
    
    return transcripciones

if __name__ == "__main__":
    transcribir_audios()
