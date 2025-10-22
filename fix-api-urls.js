const fs = require('fs');
const path = require('path');

// Leer el archivo
const filePath = path.join(__dirname, 'privado', 'registro-notas.html');
let content = fs.readFileSync(filePath, 'utf8');

// Corregir todas las URLs de API
const corrections = [
    {
        old: '/api/courses?username=',
        new: '/.netlify/functions/get-courses-Francisco?username='
    },
    {
        old: '/api/courses/save',
        new: '/.netlify/functions/save-courses-Francisco'
    },
    {
        old: '/api/courses/delete',
        new: '/.netlify/functions/delete-course-Francisco'
    },
    {
        old: '/api/courses/check-updates?username=',
        new: '/.netlify/functions/check-updates-Francisco?username='
    }
];

corrections.forEach(correction => {
    const regex = new RegExp(correction.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
        console.log(`✅ Corrigiendo ${matches.length} ocurrencias de: ${correction.old}`);
        content = content.replace(regex, correction.new);
    } else {
        console.log(`⚠️  No se encontraron ocurrencias de: ${correction.old}`);
    }
});

// Guardar el archivo corregido
fs.writeFileSync(filePath, content, 'utf8');
console.log('🎉 ¡Correcciones aplicadas exitosamente!');