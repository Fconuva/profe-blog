#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador de Audios TTS para Prueba de Inglés Media
Genera archivos MP3 usando gTTS (Google Text-to-Speech)
"""

from gtts import gTTS
import os

# Directorio de salida
OUTPUT_DIR = "audios"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Definir todos los audios a generar
audios = {
    "audio_16_hikers.mp3": {
        "text": """Woman: I can't believe we've finally made it! Just look at that breathtaking view - it was absolutely worth the climb, don't you think?
Man: Couldn't agree more! Although, I must admit, I'm completely knackered after that steep ascent. Shall we have some lunch before we head back down?
Woman: Definitely - I'm absolutely famished! Plus, we should probably rest a bit. By the way, did you bring the trail map? I want to check the alternative route down.
Man: Good thinking. Yeah, it's in my backpack. Give me a sec.""",
        "lang": "en",
        "accent": "co.uk",  # British accent
        "slow": False
    },
    
    "audio_18_airport.mp3": {
        "text": """Good afternoon, passengers. This is a service announcement for British Airways flight BA 203 to London Heathrow. Unfortunately, due to unforeseen technical difficulties with the aircraft, boarding will now be delayed by approximately 45 minutes. The revised departure time is 14:45. We sincerely apologize for any inconvenience this may cause and kindly request your patience. Further updates will be provided via the information screens and public address system as soon as additional information becomes available. Thank you for your understanding.""",
        "lang": "en",
        "accent": "co.uk",  # British accent for airport announcement
        "slow": False
    },
    
    "audio_20_technician.mp3": {
        "text": """Customer: The screen keeps freezing every few minutes.
Technician: Have you tried restarting it? That usually fixes most software glitches.
Customer: Yes, several times. It doesn't help.
Technician: In that case, we should run a diagnostic test.""",
        "lang": "en",
        "accent": "com",  # American accent
        "slow": False
    },
    
    "audio_22_meeting.mp3": {
        "text": "I'm afraid I won't be able to make it to the meeting tomorrow.",
        "lang": "en",
        "accent": "com",
        "slow": False
    },
    
    "audio_23_pullTogether.mp3": {
        "text": "Come on, you can do this. Just pull yourself together and try again.",
        "lang": "en",
        "accent": "com",
        "slow": False
    },
    
    "audio_24_energy.mp3": {
        "text": """Speaker A: We should invest in renewable energy.
Speaker B: On the contrary, fossil fuels are more reliable.""",
        "lang": "en",
        "accent": "com",
        "slow": False
    },
    
    "audio_25_advice.mp3": {
        "text": "If I were you, I'd reconsider that decision. You might regret it later.",
        "lang": "en",
        "accent": "com",
        "slow": False
    }
}

def generar_audio(filename, config):
    """Genera un archivo de audio usando gTTS"""
    print(f"Generando: {filename}")
    
    try:
        # Crear objeto gTTS
        tts = gTTS(
            text=config["text"],
            lang=config["lang"],
            tld=config["accent"],
            slow=config["slow"]
        )
        
        # Guardar archivo
        filepath = os.path.join(OUTPUT_DIR, filename)
        tts.save(filepath)
        print(f"  ✅ Guardado: {filepath}")
        
        # Mostrar tamaño del archivo
        size = os.path.getsize(filepath)
        print(f"  📦 Tamaño: {size / 1024:.2f} KB")
        
    except Exception as e:
        print(f"  ❌ Error: {e}")

def main():
    print("🎙️ Generador de Audios TTS - Prueba de Inglés Media")
    print("=" * 60)
    print(f"Directorio de salida: {OUTPUT_DIR}/")
    print(f"Total de audios a generar: {len(audios)}")
    print("=" * 60)
    print()
    
    # Verificar si gTTS está instalado
    try:
        from gtts import gTTS
    except ImportError:
        print("❌ ERROR: gTTS no está instalado")
        print("Instala con: pip install gtts")
        return
    
    # Generar cada audio
    for filename, config in audios.items():
        generar_audio(filename, config)
        print()
    
    print("=" * 60)
    print("✅ Generación completada")
    print(f"📁 Archivos generados en: {os.path.abspath(OUTPUT_DIR)}/")
    print()
    
    # Listar archivos generados
    print("Archivos creados:")
    for filename in sorted(os.listdir(OUTPUT_DIR)):
        if filename.endswith('.mp3'):
            filepath = os.path.join(OUTPUT_DIR, filename)
            size = os.path.getsize(filepath) / 1024
            print(f"  • {filename} ({size:.2f} KB)")

if __name__ == "__main__":
    main()
