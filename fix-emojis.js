const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'privado', 'registro-notas.html');

console.log('Leyendo archivo...');
let content = fs.readFileSync(filePath, 'utf8');

let changeCount = 0;

// Patrón 1: Reemplazar secuencias específicas de bytes corruptos
const patterns = [
    [/\u201e\u00b9\u00ef\u00b8/g, '\u2139\uFE0F'],  // „¹ï¸ → ℹ️
    [/\u00f0\u009f\u0093\u00a6/g, '\uD83D\uDCE6'], // ðŸ"¦ → 📦
    [/\u00f0\u009f\u0092\u00be/g, '\uD83D\uDCBE'], // ðŸ'¾ → 💾
    [/\u00f0\u009f\u0097\u0084\u00ef\u00b8/g, '\uD83D\uDDC4\uFE0F'], // ðŸ—„ï¸ → 🗄️
    [/\u00f0\u009f\u0094\u0084/g, '\uD83D\uDD04'], // ðŸ"„ → 🔄
    [/\u00f0\u009f\u0094\u008d/g, '\uD83D\uDD0D'], // ðŸ" → 🔍
    [/\u00f0\u009f\u0093\u00a4/g, '\uD83D\uDCE4'], // ðŸ"¤ → 📤
    [/\u0161\u00a0\u00ef\u00b8/g, '\u26A0\uFE0F'], // š ï¸ → ⚠️
    [/\u0152/g, '\u274C'],  // Œ → ❌
    [/\u00ef\u00bf\u00bd/g, '\uD83D\uDD04'], // ï¿½ → 🔄
    [/\u20ac\u00a2/g, '\u2022'], // €¢ → •
    [/\u2026/g, '\u2705'], // … → ✅
];

patterns.forEach(([pattern, replacement], idx) => {
    const matches = content.match(pattern);
    if (matches) {
        content = content.replace(pattern, replacement);
        changeCount += matches.length;
        console.log(`  Patron ${idx + 1}: ${matches.length} reemplazos`);
    }
});

// Guardar archivo corregido
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\nCompletado! ${changeCount} caracteres corruptos corregidos`);
console.log('Archivo actualizado: privado/registro-notas.html');
