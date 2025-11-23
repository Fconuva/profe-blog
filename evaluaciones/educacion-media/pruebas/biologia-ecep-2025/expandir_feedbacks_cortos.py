#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Expandir feedbacks cortos de opciones C en P40, P48, P49, P51"""

import json

with open('plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Feedbacks expandidos para opciones C (ahora incorrectas tras balanceo)
FEEDBACKS_EXPANDIDOS = {
    40: "❌ Incorrecta. Esta opción no explica correctamente cómo el splicing alternativo permite generar diversidad proteómica a partir de un único gen mediante combinación variable de exones. La respuesta correcta debe mencionar el mecanismo molecular (selección diferencial de exones durante procesamiento ARN) y su implicación biológica (múltiples isoformas proteicas funcionales desde un solo gen, ejemplo: Drosophila DSCAM genera 38000 variantes).",
    
    48: "❌ Incorrecta. Esta respuesta no explica adecuadamente cómo la degeneración del código genético (múltiples codones codifican mismo aminoácido) protege contra mutaciones puntuales en tercera posición del codón. Las mutaciones silenciosas no alteran proteína resultante gracias a redundancia del código (ej: CUU/CUC/CUA/CUG→Leucina), mecanismo evolutivo de protección contra errores replicación.",
    
    49: "❌ Incorrecta. Esta opción no describe correctamente el mecanismo de regulación negativa inducible del operón lac en E. coli. La explicación correcta debe incluir: ausencia lactosa → represor activo bloquea promotor → sin transcripción; presencia lactosa → alolactosa inactiva represor → transcripción genes β-galactosidasa y permeasa. Modelo Jacob-Monod (Nobel 1965) fundamental para regulación génica procariota.",
    
    51: "❌ Incorrecta. Esta respuesta no explica correctamente conjugación bacteriana como mecanismo transferencia horizontal de genes. Debe incluir: bacteria F+ transfiere plásmido → F- vía pilus sexual, permitiendo propagación resistencia antibióticos. Diferente de transformación (DNA libre) y transducción (virus). Conjugación es problema crítico salud pública por diseminación resistencia antibiótica entre especies bacterianas."
}

for pid, feedback_expandido in FEEDBACKS_EXPANDIDOS.items():
    idx = pid - 1
    for opt in data['questions'][idx]['options']:
        if opt['id'] == 'c':
            opt['feedback'] = feedback_expandido
            print(f"✅ P{pid} opción C: feedback expandido ({len(feedback_expandido)} caracteres)")

# Guardar
with open('plan.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("\n✅ Guardado plan.json con todos los feedbacks expandidos")
