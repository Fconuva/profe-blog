const fs = require('fs');

// ===== PARSEAR CSV PASEO DOCENTES =====
const paseoCsvPath = './paseo-admin/paseo_docentes_reservas (1).csv';
const paseoCsvData = fs.readFileSync(paseoCsvPath, 'utf8');
const paseoLines = paseoCsvData.split('\n').slice(1);

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

const paseoReservas = {};

paseoLines.forEach((line, index) => {
    if (!line.trim()) return;
    const fields = parseCSVLine(line);
    if (fields.length < 9) return;

    const [id, nombre, apellido, email, telefono, asistira, transporte, asiento, created_at] = fields;
    
    paseoReservas[`reserva_${id}`] = {
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
});

console.log(`✅ Procesadas ${Object.keys(paseoReservas).length} reservas de paseo docentes`);

// ===== PARSEAR CSV SINDICATO =====
const sindicatoCsvPath = './sindicato-admin/evento_sindicato_asistentes_2025-10-20.csv';
const sindicatoCsvData = fs.readFileSync(sindicatoCsvPath, 'utf8');
const sindicatoLines = sindicatoCsvData.split('\n').slice(1);

const sindicatoAsistentes = {};

sindicatoLines.forEach((line, index) => {
    if (!line.trim()) return;
    const fields = parseCSVLine(line);
    if (fields.length < 8) return;

    const [numero, nombre, rut, correo, sexo, sede, menuVegetariano, fechaRegistro] = fields;
    
    // Generar un ID único basado en el correo
    const key = `asistente_${numero}`;
    
    sindicatoAsistentes[key] = {
        nombre,
        rut,
        correo,
        sexo,
        sede,
        menuVegetariano,
        fechaRegistro,
        numero
    };
});

console.log(`✅ Procesados ${Object.keys(sindicatoAsistentes).length} asistentes de evento sindicato`);

// ===== CREAR JSON COMPLETO PARA FIREBASE =====
const firebaseCompleto = {
    paseo_docentes: {
        reservas: paseoReservas
    },
    sindicato_evento_aniversario: {
        asistentes: sindicatoAsistentes
    }
};

fs.writeFileSync('firebase-completo.json', JSON.stringify(firebaseCompleto, null, 2));

console.log(`\n📁 Archivo 'firebase-completo.json' creado`);
console.log(`   - ${Object.keys(paseoReservas).length} reservas paseo docentes`);
console.log(`   - ${Object.keys(sindicatoAsistentes).length} asistentes evento sindicato`);
console.log('\n📋 INSTRUCCIONES:');
console.log('1. Ve a Firebase Console → Realtime Database');
console.log('2. En la pestaña "Datos", haz clic en el nodo raíz');
console.log('3. Haz clic en los 3 puntos (⋮) → "Import JSON"');
console.log('4. Selecciona "firebase-completo.json"');
console.log('5. IMPORTANTE: Selecciona la opción "Merge" (Combinar) si aparece');
console.log('6. Confirma la importación');
console.log('\n✅ Esto restaurará ambas bases de datos sin perder nada');
