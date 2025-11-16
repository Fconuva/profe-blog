#!/usr/bin/env python3
"""
Generador de Audios TTS con Edge-TTS (Microsoft Neural Voices)
Voces profesionales de alta calidad - GRATIS
"""

import os
import asyncio
import edge_tts
from pathlib import Path

# ============================================
# CONFIGURACIÓN
# ============================================
OUTPUT_DIR = "audios"

# Crear directorio de salida si no existe
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================
# VOCES EDGE-TTS DISPONIBLES
# ============================================
# Voces británicas (UK):
# - "en-GB-RyanNeural" (hombre, británico, profesional)
# - "en-GB-SoniaNeural" (mujer, británica, cálida)
# - "en-GB-LibbyNeural" (mujer, británica, joven)
# - "en-GB-ThomasNeural" (hombre, británico, maduro)

# Voces americanas (US):
# - "en-US-GuyNeural" (hombre, americano, profesional)
# - "en-US-JennyNeural" (mujer, americana, cálida)
# - "en-US-AriaNeural" (mujer, americana, natural)
# - "en-US-ChristopherNeural" (hombre, americano, maduro)

# ============================================
# DIÁLOGOS Y AUDIOS
# ============================================
audios_dialogos = {
    "audio_16_hikers.mp3": {
        "speakers": [
            {
                "voice": "en-GB-SoniaNeural",  # Mujer británica
                "text": "I can't believe we've finally made it! The view from here is absolutely breathtaking. Look at those mountains stretching as far as the eye can see!"
            },
            {
                "voice": "en-GB-RyanNeural",  # Hombre británico
                "text": "Couldn't agree more! After six hours of hiking, this makes it all worthwhile. Did you bring the camera? We need to capture this moment."
            },
            {
                "voice": "en-GB-SoniaNeural",
                "text": "Of course! Already taken about fifty photos. But honestly, no picture could do this justice. The fresh air, the silence, being surrounded by nature... it's pure magic."
            },
            {
                "voice": "en-GB-RyanNeural",
                "text": "True. This is exactly what I needed to disconnect from the city chaos. Say, shall we have lunch here before heading back down?"
            }
        ]
    },
    
    "audio_18_airport.mp3": {
        "speakers": [
            {
                "voice": "en-US-AriaNeural",  # Mujer americana (anuncio)
                "text": "Attention passengers: Flight BA 2157 to Edinburgh has been delayed due to technical issues. The new departure time is 3:45 PM. We apologize for any inconvenience caused. Passengers should proceed to gate B12 for further updates."
            }
        ]
    },
    
    "audio_20_technician.mp3": {
        "speakers": [
            {
                "voice": "en-US-JennyNeural",  # Cliente mujer americana
                "text": "Good morning, I'm calling about my internet connection. It's been down since yesterday afternoon and I work from home."
            },
            {
                "voice": "en-US-GuyNeural",  # Técnico hombre americano
                "text": "I understand your concern, ma'am. Let me check your account. Can you please provide your customer ID number?"
            },
            {
                "voice": "en-US-JennyNeural",
                "text": "Sure, it's X-K-7-4-2-9-1."
            },
            {
                "voice": "en-US-GuyNeural",
                "text": "Thank you. I can see there's a service outage in your area. Our technicians are working on it and service should be restored within two hours."
            }
        ]
    },
    
    "audio_22_meeting.mp3": {
        "speakers": [
            {
                "voice": "en-GB-ThomasNeural",  # Hombre británico maduro
                "text": "Good afternoon everyone. Let's begin today's meeting by reviewing last month's sales figures and discussing our quarterly targets."
            }
        ]
    },
    
    "audio_23_pullTogether.mp3": {
        "speakers": [
            {
                "voice": "en-GB-LibbyNeural",  # Mujer británica joven
                "text": "We need to pull together as a team if we want to meet the deadline. Everyone's contribution is essential for this project's success."
            }
        ]
    },
    
    "audio_24_energy.mp3": {
        "speakers": [
            {
                "voice": "en-US-ChristopherNeural",  # Speaker A - Hombre americano
                "text": "The investment in renewable energy is crucial for our future."
            },
            {
                "voice": "en-US-GuyNeural",  # Speaker B - Hombre americano diferente
                "text": "Absolutely. Solar and wind power have become increasingly cost-effective alternatives."
            }
        ]
    },
    
    "audio_25_advice.mp3": {
        "speakers": [
            {
                "voice": "en-US-AriaNeural",  # Mujer americana
                "text": "My advice would be to start saving early and invest wisely in your future. Time is your greatest asset when it comes to financial planning."
            }
        ]
    }
}

# ============================================
# FUNCIONES DE GENERACIÓN
# ============================================

async def generar_fragmento_edge(texto, voz, archivo_salida):
    """Genera un fragmento de audio con Edge-TTS"""
    communicate = edge_tts.Communicate(texto, voz)
    await communicate.save(archivo_salida)

async def generar_audio_multivoces(filename, speakers):
    """
    Genera audio con múltiples hablantes usando Edge-TTS
    Cada hablante usa una voz neural diferente
    """
    print(f"  Generando {len(speakers)} fragmento(s) con Edge-TTS Neural Voices...")
    
    temp_files = []
    
    # Generar cada fragmento por separado
    for i, speaker in enumerate(speakers):
        temp_file = f"temp_{i}.mp3"
        await generar_fragmento_edge(speaker["text"], speaker["voice"], temp_file)
        temp_files.append(temp_file)
    
    # Si solo hay un hablante, simplemente renombrar
    if len(temp_files) == 1:
        filepath = os.path.join(OUTPUT_DIR, filename)
        # Eliminar archivo existente si hay
        if os.path.exists(filepath):
            os.remove(filepath)
        os.rename(temp_files[0], filepath)
        return True
    
    # Si hay múltiples hablantes, concatenar con ffmpeg
    try:
        import subprocess
        
        # Crear archivo de lista para ffmpeg
        with open("file_list.txt", "w", encoding="utf-8") as f:
            for temp_file in temp_files:
                f.write(f"file '{temp_file}'\n")
        
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        # Concatenar archivos
        result = subprocess.run(
            ["ffmpeg", "-f", "concat", "-safe", "0", "-i", "file_list.txt", 
             "-c", "copy", "-y", filepath],
            capture_output=True,
            text=True
        )
        
        # Limpiar archivos temporales
        for temp_file in temp_files:
            if os.path.exists(temp_file):
                os.remove(temp_file)
        os.remove("file_list.txt")
        
        return result.returncode == 0
        
    except FileNotFoundError:
        print("  ⚠ ffmpeg no encontrado - solo se guardó primer fragmento")
        # Si ffmpeg no está disponible, usar solo el primer fragmento
        filepath = os.path.join(OUTPUT_DIR, filename)
        if temp_files:
            os.rename(temp_files[0], filepath)
            # Limpiar otros archivos
            for temp_file in temp_files[1:]:
                if os.path.exists(temp_file):
                    os.remove(temp_file)
        return True

async def generar_todos_los_audios():
    """Genera todos los audios definidos"""
    print("\n🎙️ Generador de Audios TTS con Edge-TTS (Microsoft Neural Voices)")
    print("=" * 70)
    print(f"Directorio de salida: {OUTPUT_DIR}/")
    print(f"Total de audios a generar: {len(audios_dialogos)}")
    print("🎯 Calidad: Voces neurales profesionales de Microsoft (GRATIS)")
    print("=" * 70)
    print()
    
    for filename, config in audios_dialogos.items():
        speakers = config["speakers"]
        print(f"Generando: {filename} ({len(speakers)} hablante(s))")
        
        # Mostrar voces usadas
        voces_usadas = list(set([s["voice"] for s in speakers]))
        print(f"  Voces: {', '.join(voces_usadas)}")
        
        success = await generar_audio_multivoces(filename, speakers)
        
        if success:
            filepath = os.path.join(OUTPUT_DIR, filename)
            size_kb = os.path.getsize(filepath) / 1024
            print(f"  ✅ Guardado exitosamente")
            print(f"  📦 Tamaño: {size_kb:.2f} KB")
        else:
            print(f"  ❌ Error al generar")
        print()
    
    print("=" * 70)
    print("✅ Generación completada")
    print(f"📁 Archivos generados en: {os.path.abspath(OUTPUT_DIR)}/")
    print("\nArchivos creados:")
    for filename in audios_dialogos.keys():
        filepath = os.path.join(OUTPUT_DIR, filename)
        if os.path.exists(filepath):
            size_kb = os.path.getsize(filepath) / 1024
            print(f"  • {filename} ({size_kb:.2f} KB)")

# ============================================
# MAIN
# ============================================
if __name__ == "__main__":
    # Ejecutar generación asíncrona
    asyncio.run(generar_todos_los_audios())
