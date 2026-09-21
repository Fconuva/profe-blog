"""Construye la dramatización audiovisual de la entrevista de NM4 U3 C5.

Lee el diálogo canónico desde la clase. Las imágenes son una toma real de
Mixkit (licencia Stock Video Free); las voces son una recreación sintética.
Requiere edge-tts, ffmpeg, ffprobe y Pillow. No almacena claves.
"""

import asyncio
import html
import re
import subprocess
import tempfile
import urllib.request
import wave
from pathlib import Path

import edge_tts
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
CLASS = ROOT / "nm4" / "u3-clase5-entrevista-laboral"
ASSETS = CLASS / "assets"
FOOTAGE = "https://assets.mixkit.co/videos/30010/30010-720.mp4"
SOURCE = "https://mixkit.co/free-stock-video/two-office-men-approving-data-with-a-handshake-30010/"
LICENSE = "https://mixkit.co/license/"
RATE = 44100


def run(*args, **kwargs):
    return subprocess.run(args, check=True, **kwargs)


def timestamp(seconds, sep="."):
    milliseconds = round(seconds * 1000)
    hours, milliseconds = divmod(milliseconds, 3600000)
    minutes, milliseconds = divmod(milliseconds, 60000)
    secs, milliseconds = divmod(milliseconds, 1000)
    return f"{hours:02}:{minutes:02}:{secs:02}{sep}{milliseconds:03}"


def ass_time(seconds):
    centiseconds = round(seconds * 100)
    hours, centiseconds = divmod(centiseconds, 360000)
    minutes, centiseconds = divmod(centiseconds, 6000)
    secs, centiseconds = divmod(centiseconds, 100)
    return f"{hours}:{minutes:02}:{secs:02}.{centiseconds:02}"


def clean(fragment):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()


def transcript():
    source = (CLASS / "index.html").read_text(encoding="utf-8")
    pattern = (r'<li><p><strong>Entrevistador:</strong>(.*?)</p>'
               r'<p class="applicant"><strong>Postulante:</strong>(.*?)</p></li>')
    pairs = [(clean(question), clean(answer)) for question, answer
             in re.findall(pattern, source, flags=re.DOTALL)]
    if len(pairs) != 13:
        raise ValueError(f"Se esperaban 13 preguntas con respuesta; hay {len(pairs)}")
    return [(number, role, text) for number, pair in enumerate(pairs, 1)
            for role, text in zip(("Entrevistador", "Postulante"), pair)]


async def synthesize(segments, temp):
    gate = asyncio.Semaphore(3)

    async def one(index, number, role, text):
        async with gate:
            voice = "es-MX-JorgeNeural" if role == "Entrevistador" else "es-CL-LorenzoNeural"
            output = temp / f"line-{index:02}.mp3"
            await edge_tts.Communicate(text, voice, rate="+6%").save(str(output))
            return output

    return await asyncio.gather(*(one(i, *segment) for i, segment in enumerate(segments)))


def subtitle_chunks(text):
    chunks = []
    current = ""
    for word in text.split():
        proposal = f"{current} {word}".strip()
        if len(proposal) <= 84:
            current = proposal
        else:
            if current:
                chunks.append(current)
            current = word
    if current:
        chunks.append(current)
    return chunks


def wrap(text, width=44):
    words = text.split()
    lines = []
    line = ""
    for word in words:
        proposal = f"{line} {word}".strip()
        if len(proposal) > width and line:
            lines.append(line)
            line = word
        else:
            line = proposal
    if line:
        lines.append(line)
    return "\\N".join(lines)


def ass_escape(text):
    return text.replace("\\", r"\\").replace("{", r"\{").replace("}", r"\}")


def build_audio_and_captions(segments, files, temp):
    pcm = bytearray(b"\x00\x00" * RATE * 2)
    records = []
    for (number, role, utterance), path in zip(segments, files):
        start = len(pcm) / 2 / RATE
        decoded = subprocess.check_output([
            "ffmpeg", "-v", "error", "-i", str(path), "-f", "s16le",
            "-ar", str(RATE), "-ac", "1", "pipe:1"
        ])
        pcm.extend(decoded)
        end = len(pcm) / 2 / RATE
        records.append((start, end, number, role, utterance))
        pcm.extend(b"\x00\x00" * round(RATE * .33))
    pcm.extend(b"\x00\x00" * RATE * 2)
    total = len(pcm) / 2 / RATE
    wav = temp / "dialogue.wav"
    with wave.open(str(wav), "wb") as audio:
        audio.setnchannels(1)
        audio.setsampwidth(2)
        audio.setframerate(RATE)
        audio.writeframes(pcm)

    vtt = ["WEBVTT", ""]
    ass = [
        "[Script Info]", "ScriptType: v4.00+", "PlayResX: 1280", "PlayResY: 720", "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        "Style: Role,Arial,28,&H00F7C671,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,0,0,7,48,48,515,1",
        "Style: Text,Arial,34,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,48,48,555,1",
        "Style: Note,Arial,19,&H00DCE8F4,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,9,42,42,16,1",
        "", "[Events]",
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"
    ]
    ass.append(f"Dialogue: 0,{ass_time(0)},{ass_time(total)},Note,,0,0,0,,IMÁGENES DE ARCHIVO · VOCES RECREADAS")
    ass.append(f"Dialogue: 0,{ass_time(0)},{ass_time(2)},Role,,0,0,0,,ENTREVISTA LABORAL · EJEMPLO FICTICIO")
    ass.append(f"Dialogue: 0,{ass_time(0)},{ass_time(2)},Text,,0,0,0,,Escucha primero. Después analizaremos las respuestas.")
    for start, end, number, role, utterance in records:
        ass.append(f"Dialogue: 0,{ass_time(start)},{ass_time(end)},Role,,0,0,0,,{role.upper()} · {number:02}/13")
        chunks = subtitle_chunks(utterance)
        weights = [max(len(chunk), 1) for chunk in chunks]
        position = start
        for index, (chunk, weight) in enumerate(zip(chunks, weights)):
            finish = end if index == len(chunks) - 1 else position + (end-start) * weight / sum(weights[index:])
            text = wrap(ass_escape(chunk))
            ass.append(f"Dialogue: 0,{ass_time(position)},{ass_time(finish)},Text,,0,0,0,,{text}")
            vtt.append(f"{timestamp(position)} --> {timestamp(finish)}")
            vtt.append(f"{role}: {chunk}")
            vtt.append("")
            position = finish
    (ASSETS / "video-entrevista.vtt").write_text("\n".join(vtt), encoding="utf-8")
    (temp / "dialogue.ass").write_text("\n".join(ass), encoding="utf-8")
    (ASSETS / "video-entrevista-guion.txt").write_text(
        "ENTREVISTA LABORAL · RECREACIÓN DIDÁCTICA\n\n"
        "Dos personajes masculinos. Cargo ficticio: ayudante de mantenimiento.\n"
        "El diálogo se toma íntegro de index.html (13 preguntas y 13 respuestas).\n"
        "Voces sintéticas masculinas: es-MX-JorgeNeural (entrevistador) y "
        "es-CL-LorenzoNeural (postulante).\n"
        "Las personas filmadas son actores de archivo y no pronunciaron este guion.\n\n"
        f"Toma de archivo: {SOURCE}\nLicencia: {LICENSE}\n"
        "Edición didáctica: Estudia CEST, 21 de septiembre de 2026.\n\n"
        + "\n\n".join(f"{n}. {role}: {text}" for n, role, text in segments) + "\n",
        encoding="utf-8"
    )
    return wav, total


def make_poster(footage, temp):
    frame = temp / "frame.jpg"
    run("ffmpeg", "-y", "-v", "error", "-ss", "3", "-i", str(footage), "-frames:v", "1", str(frame))
    image = Image.open(frame).convert("RGB")
    image = image.resize((1280, 720), Image.Resampling.LANCZOS)
    pen = ImageDraw.Draw(image)
    pen.rectangle((0, 486, 1280, 720), fill="#102c42")
    font = Path("C:/Windows/Fonts/arialbd.ttf")
    big = ImageFont.truetype(str(font), 48)
    small = ImageFont.truetype(str(font), 28)
    pen.text((54, 525), "ENTREVISTA LABORAL", font=big, fill="#ffffff")
    pen.text((54, 604), "Dos hombres · 13 preguntas y respuestas", font=small, fill="#f7c671")
    image.save(ASSETS / "video-entrevista-poster.jpg", quality=95, subsampling=0)


def main():
    segments = transcript()
    with tempfile.TemporaryDirectory(prefix="nm4-interview-") as directory:
        temp = Path(directory)
        footage = temp / "actors.mp4"
        request = urllib.request.Request(FOOTAGE, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, timeout=60) as response, footage.open("wb") as output:
            while chunk := response.read(1024 * 1024):
                output.write(chunk)
        make_poster(footage, temp)
        files = asyncio.run(synthesize(segments, temp))
        wav, total = build_audio_and_captions(segments, files, temp)
        run(
            "ffmpeg", "-y", "-v", "error", "-stream_loop", "-1", "-i", str(footage),
            "-i", str(wav), "-t", f"{total:.3f}",
            "-vf", "scale=1280:720,drawbox=x=0:y=495:w=1280:h=225:color=0x102c42:t=fill,ass=dialogue.ass",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "28", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-shortest",
            str(ASSETS / "video-entrevista.mp4"), cwd=temp
        )
        print(f"Entrevista: {len(segments)//2} preguntas, {total:.1f} segundos")
        print(f"Video: {ASSETS / 'video-entrevista.mp4'}")


if __name__ == "__main__":
    main()
