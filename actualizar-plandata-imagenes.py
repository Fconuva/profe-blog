"""
Actualizar planData con las preguntas que tienen imágenes
"""

import json
import re

# Cargar preguntas con imágenes
with open("preguntas-con-imagenes-ep2023.json", "r", encoding="utf-8") as f:
    data = json.load(f)
    preguntas_nuevas = data["preguntas"]

# Leer archivo
with open("evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk", "r", encoding="utf-8") as f:
    content = f.read()

# Función para actualizar una pregunta en planData
def actualizar_pregunta_plandata(content, pregunta):
    """Actualiza los datos de una pregunta en planData"""
    
    numero = pregunta["numero"]
    id_pregunta = f"parv-{numero:02d}"
    
    # Buscar la pregunta en planData
    patron = f'"id": "{id_pregunta}"'
    pos_inicio = content.find(patron)
    
    if pos_inicio == -1:
        print(f"⚠️  No se encontró {id_pregunta} en planData")
        return content
    
    # Buscar el final del objeto de la pregunta (siguiente "id": o final del array)
    pos_fin = content.find('"id": "parv-', pos_inicio + 10)
    if pos_fin == -1:
        # Es la última pregunta
        pos_fin = content.find(']', pos_inicio)
    
    # Extraer la pregunta actual
    pregunta_actual = content[pos_inicio-10:pos_fin]
    
    # Crear nuevo objeto de pregunta
    nuevo_objeto = f'''{{
        "id": "{id_pregunta}",
        "numero": {numero},
        "contexto": "{escapar_comillas(pregunta['contexto'])}",
        "imagen": "{pregunta['imagen']}",
        "alt_imagen": "{pregunta['alt_imagen']}",
        "ambito": "{pregunta['ambito']}",
        "nucleo": "{pregunta['nucleo']}",
        "habilidad": "{pregunta['habilidad']}",
        "enunciado": "{escapar_comillas(pregunta['enunciado'])}",
        "alternativas": [
          {{
            "letra": "A",
            "texto": "{escapar_comillas(pregunta['alternativas']['A'])}"
          }},
          {{
            "letra": "B",
            "texto": "{escapar_comillas(pregunta['alternativas']['B'])}"
          }},
          {{
            "letra": "C",
            "texto": "{escapar_comillas(pregunta['alternativas']['C'])}"
          }},
          {{
            "letra": "D",
            "texto": "{escapar_comillas(pregunta['alternativas']['D'])}"
          }}
        ],
        "respuesta_correcta": "{pregunta['respuesta_correcta']}",
        "explicacion": "{escapar_comillas(pregunta['explicacion'])}",
        "temas_relacionados": {json.dumps(pregunta['temas_relacionados'], ensure_ascii=False)}
      }}'''
    
    # Reemplazar
    content = content[:pos_inicio-10] + nuevo_objeto + content[pos_fin:]
    print(f"✅ Actualizado planData para pregunta {numero}")
    
    return content

def escapar_comillas(texto):
    """Escapa comillas dobles en el texto"""
    return texto.replace('"', '\\"').replace('\n', ' ')

# Actualizar cada pregunta
print("🔄 Actualizando planData con preguntas que tienen imágenes...\n")

# Solo actualizar las 8 preguntas que se integraron exitosamente (5, 11, 17, 23, 29, 35, 41, 47)
preguntas_exitosas = [p for p in preguntas_nuevas if p["numero"] <= 50]

for pregunta in sorted(preguntas_exitosas, key=lambda x: x["numero"]):
    content = actualizar_pregunta_plandata(content, pregunta)

# Guardar
with open("evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk", "w", encoding="utf-8") as f:
    f.write(content)

print(f"\n✅ planData actualizado con {len(preguntas_exitosas)} preguntas")
print(f"🖼️  Todas las preguntas ahora incluyen campo 'imagen' y 'alt_imagen'")
print(f"\n🎯 Próximo paso: Compilar sitio y verificar")
