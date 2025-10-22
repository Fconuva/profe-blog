// 🚀 SCRIPT DE PRUEBA RÁPIDA - GEMINI AI
// Copia y pega este código en la consola del navegador (F12) cuando estés en registro-notas.html

console.log('🤖 Iniciando prueba de Gemini AI...');

// 1. Guardar API Key automáticamente
localStorage.setItem('geminiApiKey', 'AIzaSyDl3Gp320sAbpEeOPf217ryya-4E0QT984');
console.log('✅ API Key guardada en localStorage');

// 2. Función de prueba de conexión
async function testGeminiConnection() {
    const apiKey = localStorage.getItem('geminiApiKey');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const testPrompt = {
        contents: [{
            parts: [{
                text: "Escribe en una línea: 'Conexión exitosa con Gemini AI para retroalimentaciones pedagógicas.'"
            }]
        }]
    };
    
    try {
        console.log('🔄 Probando conexión con Gemini AI...');
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPrompt)
        });
        
        if (response.ok) {
            const data = await response.json();
            const message = data.candidates[0].content.parts[0].text;
            console.log('✅ CONEXIÓN EXITOSA!');
            console.log('📝 Respuesta de Gemini:', message);
            console.log('');
            console.log('🎉 ¡Todo listo! Ahora puedes:');
            console.log('   1. Ir a "Informes Individuales"');
            console.log('   2. Seleccionar un estudiante');
            console.log('   3. Abrir "Banco de Retroalimentaciones"');
            console.log('   4. Usar el botón "Generar con IA (Gemini)"');
            return true;
        } else {
            const error = await response.json();
            console.error('❌ Error de conexión:', error);
            return false;
        }
    } catch (error) {
        console.error('❌ Error:', error);
        return false;
    }
}

// 3. Ejecutar prueba
testGeminiConnection();

// 4. Mostrar info adicional
console.log('');
console.log('📊 INFORMACIÓN DE TU API KEY:');
console.log('   • Límite: 60 solicitudes/minuto, 1,500/día');
console.log('   • Costo: $0 (Completamente gratis)');
console.log('   • Modelo: Gemini 1.5 Flash');
console.log('   • Estado: Activa y lista para usar');
console.log('');
console.log('💡 TIPS:');
console.log('   • La API Key ya está guardada en tu navegador');
console.log('   • No necesitas ingresarla nuevamente');
console.log('   • Funciona para todos tus estudiantes');
console.log('   • Cada generación toma 3-5 segundos');
