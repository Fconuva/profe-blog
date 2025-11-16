#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador de Audios TTS MEJORADOS para Prueba de Inglés Media
Usa pyttsx3 para generar voces diferentes por hablante (hombre/mujer)
Alternativa: Si pyttsx3 no funciona bien, genera archivos separados con gTTS
"""

from gtts import gTTS
import os
import sys

# Configurar ruta de ffmpeg para pydub
ffmpeg_path = r"C:\Users\fconu\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0-full_build\bin"
os.environ["PATH"] += os.pathsep + ffmpeg_path

# Intentar importar pyttsx3 para voces offline diferenciadas
try:
    import pyttsx3
    HAS_PYTTSX3 = True
    print("✓ pyttsx3 disponible - se usarán voces diferentes por género")
except ImportError:
    HAS_PYTTSX3 = False
    print("⚠ pyttsx3 no disponible - se generarán archivos separados con gTTS")

# Directorio de salida
OUTPUT_DIR = "audios"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Definir todos los audios a generar con DIÁLOGOS SEPARADOS
audios_dialogos = {
    "audio_16_hikers.mp3": {
        "speakers": [
            {"gender": "female", "text": "I can't believe we've finally made it! Just look at that breathtaking view - it was absolutely worth the climb, don't you think?", "accent": "co.uk"},
            {"gender": "male", "text": "Couldn't agree more! Although, I must admit, I'm completely knackered after that steep ascent. Shall we have some lunch before we head back down?", "accent": "co.uk"},
            {"gender": "female", "text": "Definitely - I'm absolutely famished! Plus, we should probably rest a bit. By the way, did you bring the trail map? I want to check the alternative route down.", "accent": "co.uk"},
            {"gender": "male", "text": "Good thinking. Yeah, it's in my backpack. Give me a sec.", "accent": "co.uk"}
        ]
    },
    
    "audio_18_airport.mp3": {
        "speakers": [
            {"gender": "female", "text": "Good afternoon, passengers. This is a service announcement for British Airways flight BA 203 to London Heathrow. Unfortunately, due to unforeseen technical difficulties with the aircraft, boarding will now be delayed by approximately 45 minutes. The revised departure time is 14:45. We sincerely apologize for any inconvenience this may cause and kindly request your patience. Further updates will be provided via the information screens and public address system as soon as additional information becomes available. Thank you for your understanding.", "accent": "co.uk"}
        ]
    },
    
    "audio_20_technician.mp3": {
        "speakers": [
            {"gender": "female", "text": "The screen keeps freezing every few minutes.", "accent": "com"},
            {"gender": "male", "text": "Have you tried restarting it? That usually fixes most software glitches.", "accent": "com"},
            {"gender": "female", "text": "Yes, several times. It doesn't help.", "accent": "com"},
            {"gender": "male", "text": "In that case, we should run a diagnostic test.", "accent": "com"}
        ]
    },
    
    "audio_22_meeting.mp3": {
        "speakers": [
            {"gender": "male", "text": "I'm afraid I won't be able to make it to the meeting tomorrow.", "accent": "com"}
        ]
    },
    
    "audio_23_pullTogether.mp3": {
        "speakers": [
            {"gender": "female", "text": "Come on, you can do this. Just pull yourself together and try again.", "accent": "com"}
        ]
    },
    
    "audio_24_energy.mp3": {
        "speakers": [
            {"gender": "male", "text": "We should invest in renewable energy.", "accent": "com"},
            {"gender": "male", "text": "On the contrary, fossil fuels are more reliable.", "accent": "com"}
        ]
    },
    
    "audio_25_advice.mp3": {
        "speakers": [
            {"gender": "female", "text": "If I were you, I'd reconsider that decision. You might regret it later.", "accent": "com"}
        ]
    }
}

def generar_con_pyttsx3(filename, speakers):
    """Genera audio con pyttsx3 usando diferentes voces"""
    print(f"  Usando pyttsx3 con {len(speakers)} hablantes...")
    
    engine = pyttsx3.init()
    voices = engine.getProperty('voices')
    
    # Buscar voces masculina y femenina
    male_voice = None
    female_voice = None
    
    for voice in voices:
        if 'female' in voice.name.lower() or 'zira' in voice.name.lower():
            female_voice = voice.id
        elif 'male' in voice.name.lower() or 'david' in voice.name.lower():
            male_voice = voice.id
    
    # Archivo temporal para cada hablante
    temp_files = []
    for i, speaker in enumerate(speakers):
        # Seleccionar voz según género
        if speaker["gender"] == "female" and female_voice:
            engine.setProperty('voice', female_voice)
        elif speaker["gender"] == "male" and male_voice:
            engine.setProperty('voice', male_voice)
        
        # Ajustar velocidad y volumen
        engine.setProperty('rate', 150)  # Velocidad de habla
        engine.setProperty('volume', 0.9)
        
        temp_file = f"temp_{i}.mp3"
        engine.save_to_file(speaker["text"], temp_file)
        temp_files.append(temp_file)
    
    engine.runAndWait()
    
    # Combinar archivos (esto requeriría pydub o similar)
    # Por ahora, solo guardar el primero o concatenar manualmente
    print(f"  ⚠ pyttsx3 requiere combinar manualmente. Generando con gTTS...")
    return False

def generar_con_gtts_separado(filename, speakers):
    """Genera archivos separados con gTTS y los combina con ffmpeg aplicando pitch shift"""
    import subprocess
    
    print(f"  Generando {len(speakers)} fragmentos con gTTS + pitch shifting...")
    
    temp_files = []
    processed_files = []
    
    for i, speaker in enumerate(speakers):
        # Generar cada fragmento
        tts = gTTS(
            text=speaker["text"],
            lang="en",
            tld=speaker["accent"],
            slow=False
        )
        
        temp_file = f"temp_{i}.mp3"
        tts.save(temp_file)
        temp_files.append(temp_file)
        
        # Aplicar pitch shift según género usando ffmpeg
        processed_file = f"processed_{i}.mp3"
        
        if speaker["gender"] == "female":
            # Aumentar pitch para voz femenina (+4% ≈ 0.7 semitonos, más natural)
            pitch_shift = "asetrate=48000*1.04,aresample=48000"
        elif speaker["gender"] == "male":
            # Disminuir pitch para voz masculina (-5% ≈ 0.8 semitonos, más natural)
            pitch_shift = "asetrate=48000*0.95,aresample=48000"
        else:
            pitch_shift = None
        
        if pitch_shift:
            try:
                result = subprocess.run(
                    ["ffmpeg", "-i", temp_file, "-af", pitch_shift, "-y", processed_file],
                    capture_output=True,
                    text=True
                )
                
                if result.returncode == 0:
                    processed_files.append(processed_file)
                else:
                    # Si falla el pitch shift, usar archivo original
                    processed_files.append(temp_file)
            except Exception as e:
                print(f"  ⚠ Error en pitch shift: {e}")
                processed_files.append(temp_file)
        else:
            processed_files.append(temp_file)
    
    # Crear archivo de lista para ffmpeg
    with open("file_list.txt", "w", encoding="utf-8") as f:
        for processed_file in processed_files:
            f.write(f"file '{processed_file}'\n")
    
    # Usar ffmpeg para concatenar
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    try:
        # Concatenar con ffmpeg
        result = subprocess.run(
            ["ffmpeg", "-f", "concat", "-safe", "0", "-i", "file_list.txt", "-c", "copy", "-y", filepath],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            # Limpiar archivos temporales
            for temp_file in temp_files:
                if os.path.exists(temp_file):
                    os.remove(temp_file)
            for processed_file in processed_files:
                if os.path.exists(processed_file) and processed_file not in temp_files:
                    os.remove(processed_file)
            os.remove("file_list.txt")
            return True
        else:
            print(f"  ⚠ Error con ffmpeg: {result.stderr}")
            return False
            
    except FileNotFoundError:
        print(f"  ⚠ ffmpeg no encontrado - usando modo simple")
        # Limpiar temporales
        for temp_file in temp_files:
            if os.path.exists(temp_file):
                os.remove(temp_file)
        for processed_file in processed_files:
            if os.path.exists(processed_file) and processed_file not in temp_files:
                os.remove(processed_file)
        if os.path.exists("file_list.txt"):
            os.remove("file_list.txt")
        return False

def generar_con_gtts_simple(filename, speakers):
    """Genera audio simple con gTTS (sin diferenciar voces)"""
    print(f"  Generando con gTTS (modo simple)...")
    
    # Concatenar todos los textos
    full_text = " ... ".join([s["text"] for s in speakers])
    accent = speakers[0]["accent"]
    
    tts = gTTS(
        text=full_text,
        lang="en",
        tld=accent,
        slow=False
    )
    
    filepath = os.path.join(OUTPUT_DIR, filename)
    tts.save(filepath)
    
    return True

def generar_audio(filename, speakers):
    """Genera un archivo de audio con múltiples hablantes"""
    print(f"Generando: {filename} ({len(speakers)} hablante(s))")
    
    try:
        # Intentar generar con ffmpeg si está disponible
        import subprocess
        
        # Verificar si ffmpeg está disponible
        try:
            subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
            ffmpeg_available = True
        except (FileNotFoundError, subprocess.CalledProcessError):
            ffmpeg_available = False
        
        if ffmpeg_available and len(speakers) > 1:
            # Usar ffmpeg para concatenar archivos
            success = generar_con_gtts_separado(filename, speakers)
            if success:
                print(f"  ✅ Guardado con múltiples fragmentos concatenados")
                filepath = os.path.join(OUTPUT_DIR, filename)
                size = os.path.getsize(filepath)
                print(f"  📦 Tamaño: {size / 1024:.2f} KB")
                return
        else:
            if not ffmpeg_available:
                print(f"  ⚠ ffmpeg no disponible - usando modo simple")
        
        # Fallback: generar con gTTS simple
        success = generar_con_gtts_simple(filename, speakers)
        if success:
            print(f"  ✅ Guardado (modo simple)")
            filepath = os.path.join(OUTPUT_DIR, filename)
            size = os.path.getsize(filepath)
            print(f"  📦 Tamaño: {size / 1024:.2f} KB")
        
    except Exception as e:
        print(f"  ❌ Error: {e}")

def main():
    print("🎙️ Generador de Audios TTS MEJORADOS - Prueba de Inglés Media")
    print("=" * 60)
    print(f"Directorio de salida: {OUTPUT_DIR}/")
    print(f"Total de audios a generar: {len(audios_dialogos)}")
    
    # Verificar ffmpeg
    import subprocess
    try:
        result = subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        print("✓ ffmpeg disponible - se usará pitch shifting para voces diferentes")
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("⚠ ffmpeg NO disponible - se generará audio simple")
        print("  Los diálogos con múltiples hablantes sonarán con la misma voz")
    
    print("=" * 60)
    print()
    
    # Generar cada audio
    for filename, config in audios_dialogos.items():
        generar_audio(filename, config["speakers"])
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
