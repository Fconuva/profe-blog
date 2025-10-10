/**
 * 🧪 SCRIPT DE PRUEBAS AUTOMATIZADAS PARA EL FORMULARIO DE PASEO DOCENTES
 * 
 * Instrucciones:
 * 1. Abrir http://localhost:8080/paseo-docentes-demo/ en el navegador
 * 2. Abrir las herramientas de desarrollador (F12)
 * 3. Ir a la pestaña "Console"
 * 4. Copiar y pegar este script completo
 * 5. Presionar Enter para ejecutar
 */

console.log('🚀 Iniciando pruebas automatizadas del formulario...');

// Datos de prueba
const testUsers = [
    {
        nombre: 'María González Pérez',
        rut: '12.345.678-9',
        direccion: 'Los Profesores 123, Talca',
        telefono: '+56 9 8765 4321',
        edad: '35',
        genero: 'Femenino'
    },
    {
        nombre: 'Carlos Silva Morales',
        rut: '98.765.432-1',
        direccion: 'Av. Educación 456, Talca',
        telefono: '+56 9 1234 5678',
        edad: '42',
        genero: 'Masculino'
    },
    {
        nombre: 'Ana Torres López',
        rut: '11.222.333-4',
        direccion: 'Calle Docentes 789, Talca',
        telefono: '+56 9 9876 5432',
        edad: '28',
        genero: 'Femenino'
    }
];

let testIndex = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fillPersonalData(user) {
    console.log(`📝 Llenando datos para: ${user.nombre}`);
    
    document.getElementById('fullNameInput').value = user.nombre;
    document.getElementById('rutInput').value = user.rut;
    document.getElementById('addressInput').value = user.direccion;
    document.getElementById('emergencyPhoneInput').value = user.telefono;
    document.getElementById('ageInput').value = user.edad;
    document.getElementById('genderInput').value = user.genero;
    
    await sleep(500);
    console.log('✅ Datos personales llenados');
}

async function runSingleTest(userIndex = 0, seatNumber = null) {
    const user = testUsers[userIndex];
    console.log(`\n🧪 === INICIANDO PRUEBA ${userIndex + 1}: ${user.nombre} ===`);
    
    try {
        // Paso 1: Llenar datos personales
        await fillPersonalData(user);
        
        // Paso 2: Guardar datos
        console.log('💾 Guardando datos personales...');
        processPersonalData();
        await sleep(1000);
        
        // Paso 3: Confirmar asistencia
        console.log('✋ Confirmando asistencia...');
        handleAttendance(true);
        await sleep(1000);
        
        // Paso 4: Elegir transporte
        console.log('🚌 Eligiendo transporte en bus...');
        handleTransport(true);
        await sleep(1000);
        
        // Paso 5: Confirmar necesidad del cupo
        console.log('✅ Confirmando necesidad del cupo...');
        proceedToBusSelection();
        await sleep(1000);
        
        // Paso 6: Seleccionar asiento
        const availableSeats = [...document.querySelectorAll('.seat:not(.taken):not(.aisle)')];
        if (availableSeats.length > 0) {
            const targetSeat = seatNumber ? 
                document.querySelector(`[data-seat="${seatNumber}"]`) : 
                availableSeats[Math.floor(Math.random() * availableSeats.length)];
                
            if (targetSeat && !targetSeat.classList.contains('taken')) {
                const seatNum = targetSeat.dataset.seat;
                console.log(`🪑 Seleccionando asiento #${seatNum}...`);
                targetSeat.click();
                await sleep(500);
                
                // Confirmar reserva
                console.log('✅ Confirmando reserva...');
                reserveSeat();
                await sleep(1000);
                
                console.log(`🎉 ¡Prueba completada! ${user.nombre} reservó el asiento #${seatNum}`);
                return seatNum;
            } else {
                console.log('❌ El asiento seleccionado no está disponible');
                return null;
            }
        } else {
            console.log('❌ No hay asientos disponibles');
            return null;
        }
        
    } catch (error) {
        console.error('❌ Error en la prueba:', error);
        return null;
    }
}

async function runAllTests() {
    console.log('🔥 EJECUTANDO TODAS LAS PRUEBAS...\n');
    
    for (let i = 0; i < testUsers.length; i++) {
        const seatReserved = await runSingleTest(i);
        
        if (seatReserved) {
            console.log(`✅ Usuario ${i + 1} completado - Asiento: ${seatReserved}`);
        } else {
            console.log(`❌ Usuario ${i + 1} falló`);
        }
        
        // Reset para siguiente usuario
        if (i < testUsers.length - 1) {
            console.log('🔄 Reseteando para siguiente usuario...');
            resetPreference();
            await sleep(2000);
        }
    }
    
    console.log('\n🎊 ¡TODAS LAS PRUEBAS COMPLETADAS!');
    console.log('📊 Revisa el panel de debug y la lista de pasajeros para verificar los resultados');
}

async function testResetFunction() {
    console.log('\n🧪 === PROBANDO FUNCIÓN DE RESET ===');
    
    // Hacer una reserva rápida
    await runSingleTest(0, 5);
    await sleep(1000);
    
    console.log('🗑️ Probando reset...');
    resetPreference();
    await sleep(1000);
    
    console.log('✅ Reset completado - verificar que los datos se limpiaron');
}

// Funciones disponibles para ejecutar manualmente
window.testFormulario = {
    // Ejecutar una prueba individual
    single: (userIndex = 0, seatNumber = null) => runSingleTest(userIndex, seatNumber),
    
    // Ejecutar todas las pruebas
    all: runAllTests,
    
    // Probar función de reset
    reset: testResetFunction,
    
    // Llenar solo datos personales
    fillData: (userIndex = 0) => fillPersonalData(testUsers[userIndex]),
    
    // Limpiar todo
    clear: () => {
        clearAllData();
        console.log('🧹 Datos limpiados completamente');
    },
    
    // Ver usuarios de prueba
    users: () => {
        console.table(testUsers);
        return testUsers;
    }
};

console.log(`
🎯 PRUEBAS LISTAS PARA EJECUTAR:

Comandos disponibles:
• testFormulario.single(0, 5)     - Probar usuario 1, asiento 5
• testFormulario.all()            - Probar todos los usuarios
• testFormulario.reset()          - Probar función reset
• testFormulario.fillData(1)      - Solo llenar datos del usuario 2
• testFormulario.clear()          - Limpiar todo
• testFormulario.users()          - Ver usuarios de prueba

¡Ejecuta cualquiera de estos comandos para comenzar las pruebas!
`);