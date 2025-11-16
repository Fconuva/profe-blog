#!/usr/bin/env python3
"""
Generador de Audios Edge-TTS para Dossier de Inglés Media
Voces neurales profesionales de Microsoft - GRATIS
"""

import os
import asyncio
import edge_tts

# ============================================
# CONFIGURACIÓN
# ============================================
OUTPUT_DIR = "audios-dossier"

# Crear directorio de salida si no existe
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================
# AUDIOS DEL DOSSIER
# ============================================
audios_dossier = {
    # Ejercicios de Listening - Comprensión Auditiva
    "ejercicio_01_conference.mp3": {
        "voice": "en-US-AriaNeural",  # Mujer americana profesional
        "text": "The conference will take place on October 15th at two thirty PM. The registration fee is 75 dollars per person."
    },
    
    "ejercicio_02_recycling.mp3": {
        "voice": "en-US-GuyNeural",  # Hombre americano
        "text": "Recycling is one of the most effective ways to reduce waste and protect our environment. By separating plastic, paper, and glass, we can significantly decrease pollution levels. Many cities have implemented programs to encourage citizens to recycle more."
    },
    
    "ejercicio_03a_disappointed.mp3": {
        "voice": "en-US-JennyNeural",  # Mujer con tono molesto
        "text": "I cannot believe you forgot our anniversary! This is so disappointing!",
        "rate": "+10%"  # Un poco más rápido para expresar molestia
    },
    
    "ejercicio_03b_happy.mp3": {
        "voice": "en-US-JennyNeural",  # Misma voz pero tono diferente
        "text": "Thank you so much for remembering our anniversary! I am so happy!",
        "rate": "+0%"  # Velocidad normal
    },
    
    "ejercicio_04_connectors.mp3": {
        "voice": "en-GB-RyanNeural",  # Hombre británico
        "text": "I wanted to go to the party. However, I had too much homework. Therefore, I decided to stay home and study.",
        "rate": "-15%"  # Más lento para que se escuchen bien los conectores
    },
}

# ============================================
# FUNCIONES
# ============================================

async def generar_audio_edge(filename, config):
    """Genera un audio con Edge-TTS con configuración personalizada"""
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    # Eliminar archivo existente si hay
    if os.path.exists(filepath):
        os.remove(filepath)
    
    # Configurar velocidad si se especifica
    rate = config.get("rate", "+0%")
    
    # Crear comunicación con opciones
    communicate = edge_tts.Communicate(
        config["text"],
        config["voice"],
        rate=rate
    )
    
    await communicate.save(filepath)
    return True

async def generar_todos_los_audios():
    """Genera todos los audios del dossier"""
    print("\n🎙️ Generador de Audios para Dossier de Inglés Media")
    print("=" * 70)
    print(f"Directorio de salida: {OUTPUT_DIR}/")
    print(f"Total de audios: {len(audios_dossier)}")
    print("🎯 Voces: Microsoft Edge-TTS Neural (Profesionales)")
    print("=" * 70)
    print()
    
    for filename, config in audios_dossier.items():
        print(f"Generando: {filename}")
        print(f"  Voz: {config['voice']}")
        print(f"  Velocidad: {config.get('rate', '+0%')}")
        
        success = await generar_audio_edge(filename, config)
        
        if success:
            filepath = os.path.join(OUTPUT_DIR, filename)
            size_kb = os.path.getsize(filepath) / 1024
            print(f"  ✅ Generado exitosamente ({size_kb:.2f} KB)")
        else:
            print(f"  ❌ Error")
        print()
    
    print("=" * 70)
    print("✅ Generación completada")
    print(f"📁 Archivos en: {os.path.abspath(OUTPUT_DIR)}/")
    print("\nArchivos creados:")
    for filename in audios_dossier.keys():
        filepath = os.path.join(OUTPUT_DIR, filename)
        if os.path.exists(filepath):
            size_kb = os.path.getsize(filepath) / 1024
            print(f"  • {filename} ({size_kb:.2f} KB)")

# ============================================
# MAIN
# ============================================
if __name__ == "__main__":
    asyncio.run(generar_todos_los_audios())
