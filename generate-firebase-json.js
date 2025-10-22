const fs = require('fs');

const csvPath = './paseo-admin/paseo_docentes_reservas (1).csv';
const csvData = fs.readFileSync(csvPath, 'utf8');
const lines = csvData.split('\n').slice(1); // Skip header

const firebaseData = {};

// Parser CSV que maneja campos vacíos
function parseCSVLine(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            fields.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    fields.push(current);
    
    return fields;
}

lines.forEach((line, index) => {
    if (!line.trim()) return;

    const fields = parseCSVLine(line);
    if (fields.length < 9) {
        console.log(`⚠️ Línea ${index + 2} omitida - solo ${fields.length} campos`);
        return;
    }

    const [id, nombre, apellido, email, telefono, asistira, transporte, asiento, created_at] = fields;

    // Usar el ID original como key para mantener consistencia
    firebaseData[`reserva_${id}`] = {
        nombre,
        apellido,
        email,
        telefono,
        asistira,
        transporte,
        asiento: asiento || null,
        created_at,
        original_id: id
    };

    if (asiento) {
        console.log(`✅ ID ${id}: ${nombre} ${apellido} - Asiento ${asiento}`);
    } else {
        console.log(`✅ ID ${id}: ${nombre} ${apellido} - Transporte propio`);
    }
});

// Solo paseo_docentes para importar en la ruta específica
const output = {
    reservas: firebaseData
};

fs.writeFileSync('firebase-import-paseo.json', JSON.stringify(output, null, 2));
console.log(`\n📁 Archivo 'firebase-import-paseo.json' creado con ${Object.keys(firebaseData).length} registros`);
console.log('\n📋 INSTRUCCIONES PARA IMPORTAR A FIREBASE (SIN BORRAR OTROS DATOS):');
console.log('1. Ve a https://console.firebase.google.com/');
console.log('2. Selecciona tu proyecto "profe-blog"');
console.log('3. Ve a Realtime Database → pestaña "Datos"');
console.log('4. Haz clic en el nodo raíz "profe-blog-default-rtdb"');
console.log('5. Haz clic en el botón "+" para AGREGAR HIJO');
console.log('6. Nombre: "paseo_docentes"');
console.log('7. Ahora haz clic en el nuevo nodo "paseo_docentes"');
console.log('8. Haz clic en los 3 puntos (⋮) → "Import JSON"');
console.log('9. Selecciona "firebase-import-paseo.json"');
console.log('10. Confirma la importación');
console.log('\n⚠️ IMPORTANTE: Importa en el nodo "paseo_docentes", NO en la raíz');
