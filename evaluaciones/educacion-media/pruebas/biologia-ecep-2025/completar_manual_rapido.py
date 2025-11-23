import json

# Cargar plan.json
with open('plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Preguntas 13-52: Voy a completarlas manualmente con contenido conciso pero pedagógico

preguntas_completadas = {
    13: {
        "stem": "Una profesora de 2° Medio explica el ciclo celular y presenta el siguiente diagrama con puntos de control (checkpoints):\n\n<img src='/imagenes/ciencias-naturales/biologia/fases-ciclo-celular.png' class='my-4 mx-auto max-w-lg shadow-lg rounded'/>\n\nUna estudiante pregunta: 'Si una célula tiene un error en su ADN durante G1, ¿qué hace el checkpoint? ¿La repara automáticamente o la destruye?'\n\n¿Cuál de las siguientes explicaciones del profesor es conceptualmente correcta sobre los checkpoints del ciclo celular?",
        "options": [
            {
                "id": "a",
                "text": "El checkpoint destruye inmediatamente cualquier célula con ADN dañado mediante apoptosis. No hay reparación posible.",
                "isCorrect": False,
                "feedback": "❌ <strong>Incorrecta.</strong><br><br>Los checkpoints PRIMERO intentan REPARAR (p53 activa enzimas de reparación), SOLO si falla → apoptosis. La mayoría de células con daño leve se reparan exitosamente."
            },
            {
                "id": "b",
                "text": "El checkpoint solo verifica que el ADN esté completo, pero no detecta mutaciones o errores.",
                "isCorrect": False,
                "feedback": "❌ <strong>Incorrecta.</strong><br><br>Los checkpoints SÍ detectan daño (roturas, bases mal apareadas). ATM/ATR detectan integridad estructural. Cánceres ocurren por MUTACIÓN en genes checkpoint (p53), no porque checkpoints no detecten."
            },
            {
                "id": "c",
                "text": "El checkpoint DETIENE el ciclo celular y activa enzimas de reparación. Si repara exitosamente, continúa; si falla, p53 activa apoptosis para evitar transmitir mutaciones.",
                "isCorrect": True,
                "feedback": "✅ <strong>Correcta.</strong><br><br><strong>Secuencia:</strong> 1) Detección (ATM/ATR) → 2) Pausa (p53 induce p21 que bloquea CDK) → 3) Reparación (enzimas GADD45, XPC) → 4) Decisión: exitosa=continúa / falla=apoptosis. p53 es 'guardián del genoma'."
            },
            {
                "id": "d",
                "text": "El checkpoint acelera la replicación para compensar el tiempo perdido reparando.",
                "isCorrect": False,
                "feedback": "❌ <strong>Incorrecta.</strong><br><br>Checkpoints NUNCA aceleran, siempre RETRASAN o DETIENEN. Prioridad es FIDELIDAD, no velocidad. Células con daño se pausan horas-días, algunas mueren (apoptosis)."
            }
        ]
    }
}

# Actualizar pregunta 13
for pid, contenido in preguntas_completadas.items():
    idx = pid - 1
    data['questions'][idx]['stem'] = contenido['stem']
    data['questions'][idx]['options'] = contenido['options']

# Guardar
with open('plan.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Pregunta 13 completada")
