"""Videos modelo de NM3 · Unidad 3 · Clase 3 (situaciones 1, 2 y 3).

Narración con voces de HeyGen (CLI `heygen`, sesión OAuth de Francisco). Las
aprobó Francisco el 24-09-2026: las de edge-tts sonaban robóticas.

  1 · Vlogger  -> Energetic Male 20s
  2 · Testigo  -> Trendy Influencer
  3 · Oficial  -> Sarcastic LatAm Male

HeyGen devuelve el tiempo de cada palabra. Con eso se calculan los cortes de
cámara y los subtítulos, así que calzan exactamente con la voz.

Uso:  py -3 scripts/build-nm3-u3-videos.py [1 2 3]
"""
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.request

ROOT = r"C:\dev\profe-blog\estudiacest"
IMG = os.path.join(ROOT, "nm3", "u3-clase3-enunciador-audiencia", "img")
SIZE = "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1,fps=30"

VIDEOS = {
    1: {
        "voice": "CtOQZfX9jwJIP9IVgjFs",  # Energetic Male 20s
        "out": "video-situacion1-vlogger",
        "title": "Situación 1: Modelo Vlogger Salesianos Talca",
        # Cada toma: (imagen, frases que narra mientras está en pantalla).
        "shots": [
            ("vlogger-saludo.jpg", ["¡Buena, cabros de Salesianos!", "Les traigo una primicia antes que nadie:"]),
            ("vlogger-senala.jpg", ["desde este lunes se abre la nueva sala de lectura del segundo piso."]),
            ("mensaje-c-institucion.jpg", ["Va a estar abierta en todos los recreos, con computadores y libros nuevos.",
                                           "La recorrí completa y quedó bacán: sillones cómodos, enchufes y harto espacio."]),
            ("vlogger-pulgar.jpg", ["¿Vale la pena ir a estudiar o prefieren quedarse en el patio?",
                                    "Déjenme en los comentarios qué les pareció.", "¡Nos vemos en el recreo!"]),
        ],
    },
    2: {
        "voice": "fXOaoSqzElAA4CDP1DrO",  # Trendy Influencer
        "out": "video-situacion2-testigo",
        "title": "Situación 2: Modelo Testigo",
        "shots": [
            ("testigo-estudiante.jpg", ["Hola... les quería contar que pasé a ver la nueva sala de lectura del segundo piso,",
                                        "y en verdad superó todas mis expectativas."]),
            ("mensaje-a-estudiante.jpg", ["Por fin vamos a tener un lugar tranquilo y sin bulla para leer o estudiar en los recreos."]),
            ("testigo-estudiante.jpg", ["Quedó súper cómoda y los libros están geniales.", "Ojalá la cuidemos entre todos."]),
        ],
    },
    3: {
        "voice": "tIPBJU22CN1lApmnlmmZ",  # Sarcastic LatAm Male
        "out": "video-situacion3-oficial",
        "title": "Situación 3: Modelo Comunicado Oficial",
        "shots": [
            ("oficial-inspector.jpg", ["Estimada comunidad educativa del Centro Educativo Salesianos Talca:",
                                       "informamos que a partir de este lunes comenzará a funcionar la nueva sala de lectura en el segundo piso de nuestro establecimiento."]),
            ("mensaje-c-institucion.jpg", ["El horario de atención y las normas de uso responsable serán publicados en nuestros canales oficiales."]),
            ("oficial-inspector.jpg", ["Los invitamos a aprovechar este espacio formativo y a cuidar sus dependencias."]),
        ],
    },
}

norm = lambda w: re.sub(r"[^\wáéíóúüñ]", "", w.lower())


def speech(voice, text):
    env = dict(os.environ, HEYGEN_NO_ANALYTICS="1")
    # HeyGen a veces responde vacío; se reintenta antes de rendirse.
    for attempt in range(1, 4):
        run = subprocess.run(["heygen", "voice", "speech", "create", "--voice-id", voice, "--text", text, "--locale", "es-CL"],
                             capture_output=True, text=True, encoding="utf-8", env=env)
        try:
            data = json.loads(run.stdout)["data"]
            if data.get("word_timestamps"):
                return data
        except (ValueError, KeyError):
            pass
        print(f"HeyGen falló (intento {attempt}): {(run.stderr or run.stdout)[:200]}")
        time.sleep(5 * attempt)
    raise SystemExit("HeyGen no devolvió audio con tiempos por palabra.")


def cue_time(seconds):
    h, rem = divmod(max(0.0, seconds), 3600)
    m, s = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"


def align(sentences, words):
    """Devuelve (inicio, fin) de cada frase recorriendo los tiempos de HeyGen.

    Se compara por letras, no por cantidad de palabras: HeyGen a veces separa
    o une palabras y signos de otra forma que el texto original."""
    spoken = [w for w in words if norm(w["word"]) and not re.fullmatch(r"<[^>]*>", w["word"].strip())]
    targets, acc = [], 0
    for sentence in sentences:
        acc += len(norm(sentence.replace(" ", "")))
        targets.append(acc)
    spans, pos, i = [], 0, 0
    for target in targets:
        start = spoken[i]["start"]
        while i < len(spoken) and pos < target:
            pos += len(norm(spoken[i]["word"]))
            i += 1
        spans.append((start, spoken[i - 1]["end"]))
    if pos != targets[-1] or i != len(spoken):
        raise SystemExit(f"El audio ({pos} letras) no calza con el texto ({targets[-1]} letras); revisa el texto.")
    return spans


def build(n):
    cfg = VIDEOS[n]
    sentences = [s for _, group in cfg["shots"] for s in group]
    data = speech(cfg["voice"], " ".join(sentences))
    tmp = tempfile.mkdtemp()
    audio = os.path.join(tmp, "voz.mp3")
    urllib.request.urlretrieve(data["audio_url"], audio)
    total = float(data["duration"])
    spans = align(sentences, data["word_timestamps"])

    # Subtítulos: una frase por cue; las largas se parten en dos mitades por tiempo de palabra.
    cues = []
    for sentence, (a, b) in zip(sentences, spans):
        parts = sentence.split()
        if len(parts) > 12:
            half = len(parts) // 2
            words = [w for w in data["word_timestamps"] if norm(w["word"]) and not w["word"].startswith("<") and a - 0.01 <= w["start"] <= b]
            mid = words[min(half, len(words) - 1)]["start"] if words else (a + b) / 2
            cues += [(a, mid, " ".join(parts[:half])), (mid, b, " ".join(parts[half:]))]
        else:
            cues.append((a, b, sentence))
    vtt = [f"WEBVTT - {cfg['title']}", ""]
    for k, (a, b, t) in enumerate(cues, 1):
        # Margen de lectura de 0,15 s, sin montarse sobre el subtítulo siguiente.
        end = min(b + 0.15, cues[k][0]) if k < len(cues) else b + 0.15
        vtt += [str(k), f"{cue_time(a)} --> {cue_time(end)}", t, ""]
    with open(os.path.join(IMG, cfg["out"] + ".vtt"), "w", encoding="utf-8") as f:
        f.write("\n".join(vtt))

    # Cortes: cada toma dura desde su primera frase hasta la primera frase de la siguiente.
    starts, k = [], 0
    for _, group in cfg["shots"]:
        starts.append(0.0 if not starts else spans[k][0])
        k += len(group)
    durations = [(starts[j + 1] if j + 1 < len(starts) else total + 0.4) - starts[j] for j in range(len(starts))]

    inputs, filters = [], []
    for j, ((image, _), dur) in enumerate(zip(cfg["shots"], durations)):
        inputs += ["-loop", "1", "-t", f"{dur:.3f}", "-i", os.path.join(IMG, image)]
        zoom = "zoompan=z='min(zoom+0.0006,1.08)':d=1:s=720x1280:fps=30," if image.startswith("mensaje") else ""
        filters.append(f"[{j}:v]{SIZE},{zoom}trim=duration={dur:.3f},setpts=PTS-STARTPTS[v{j}]")
    filters.append("".join(f"[v{j}]" for j in range(len(durations))) + f"concat=n={len(durations)}:v=1:a=0[vout]")
    out = os.path.join(IMG, cfg["out"] + ".mp4")
    subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-i", audio, "-filter_complex", ";".join(filters),
                    "-map", "[vout]", "-map", f"{len(durations)}:a", "-c:v", "libx264", "-preset", "medium", "-crf", "23",
                    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", "-shortest", out], check=True)
    print(f"Video {n}: {total:.1f} s, {len(cues)} subtítulos, cortes en {[round(s, 2) for s in starts]}")


if __name__ == "__main__":
    for n in [int(a) for a in sys.argv[1:]] or [1, 2, 3]:
        build(n)
