const fs = require('fs');
const https = require('https');

const FIREBASE_URL = 'https://profe-blog-default-rtdb.firebaseio.com';
const csvPath = './paseo-admin/paseo_docentes_reservas (1).csv';

// Leer y parsear CSV
const csvData = fs.readFileSync(csvPath, 'utf8');
const lines = csvData.split('\n').slice(1); // Skip header

let imported = 0;
let skipped = 0;

function importReservation(line, index) {
    return new Promise((resolve) => {
        if (!line.trim()) {
            skipped++;
            return resolve();
        }

        // Parse CSV line (simple approach)
        const match = line.match(/"([^"]*)"/g);
        if (!match || match.length < 9) {
            console.log(`⚠️ Línea ${index + 2} formato incorrecto: ${line.substring(0, 50)}...`);
            skipped++;
            return resolve();
        }

        const [id, nombre, apellido, email, telefono, asistira, transporte, asiento, created_at] = match.map(s => s.replace(/"/g, ''));

        const reservation = {
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

        const postData = JSON.stringify(reservation);
        const options = {
            hostname: 'profe-blog-default-rtdb.firebaseio.com',
            path: '/paseo_docentes/reservas.json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    imported++;
                    const result = JSON.parse(responseData);
                    console.log(`✅ Importado ID ${id}: ${nombre} ${apellido} ${asiento ? `(asiento ${asiento})` : '(transporte propio)'} → Firebase key: ${result.name}`);
                } else {
                    console.error(`❌ Error en ID ${id}: ${res.statusCode}`);
                    skipped++;
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            console.error(`❌ Error importando ID ${id}:`, error.message);
            skipped++;
            resolve();
        });

        req.write(postData);
        req.end();
    });
}

// Importar de forma secuencial para no saturar Firebase
async function importAll() {
    console.log(`📦 Iniciando importación de ${lines.length} registros a Firebase...\n`);
    
    for (let i = 0; i < lines.length; i++) {
        await importReservation(lines[i], i);
        // Pequeña pausa entre requests
        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`\n✅ Importación completada:`);
    console.log(`   - ${imported} registros importados`);
    console.log(`   - ${skipped} registros omitidos`);
}

importAll().catch(console.error);
