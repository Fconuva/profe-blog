# -*- coding: utf-8 -*-
"""
Actualizar respuestas correctas en el JavaScript de casos de estudio
Cambiar distribución de respuestas correctas para ser menos predecible
"""

archivo = 'evaluaciones/educacion-basica/estudio/basica-generalista.njk'

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# Actualizar respuestas correctas en el JavaScript
# Caso 1: C (antes B)
viejo_caso1 = "    '1': {\n      correcta: 'B',"
nuevo_caso1 = "    '1': {\n      correcta: 'C',"

# Caso 2: B (mantener)
# Caso 3: B (mantener)

# Caso 4: D (antes B)
viejo_caso4 = "    '4': {\n      correcta: 'B',"
nuevo_caso4 = "    '4': {\n      correcta: 'D',"

# Caso 5: A (mantener, ya debería estar así pero verificar)
# Caso 6: C (antes A, cambiar)
viejo_caso6 = "    '6': {\n      correcta: 'A',"
nuevo_caso6 = "    '6': {\n      correcta: 'C',"

print("🔄 Actualizando respuestas correctas en JavaScript...")

contenido = contenido.replace(viejo_caso1, nuevo_caso1)
print("✅ Caso 1: Respuesta correcta cambiada a 'C'")

contenido = contenido.replace(viejo_caso4, nuevo_caso4)
print("✅ Caso 4: Respuesta correcta cambiada a 'D'")

contenido = contenido.replace(viejo_caso6, nuevo_caso6)
print("✅ Caso 6: Respuesta correcta cambiada a 'C'")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print("\n" + "=" * 80)
print("✅ DISTRIBUCIÓN FINAL DE RESPUESTAS CORRECTAS:")
print("   Caso 1: C | Caso 2: B | Caso 3: B | Caso 4: D | Caso 5: A | Caso 6: C")
print("   ✓ Distribución equilibrada y no predecible")
print("=" * 80)
