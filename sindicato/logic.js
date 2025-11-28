// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCzN4xNEE_hKshXbsVqLhWSnzet1pHwRh8",
    authDomain: "profe-blog.firebaseapp.com",
    databaseURL: "https://profe-blog-default-rtdb.firebaseio.com",
    projectId: "profe-blog",
    storageBucket: "profe-blog.firebasestorage.app",
    messagingSenderId: "305920739217",
    appId: "1:305920739217:web:2e08c7469d2988d8b3bc30"
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const COLLECTION_NAME = "inscripciones_cumpleanos_2025";

// Referencias DOM
const form = document.getElementById('inscriptionForm');
const selectDia = document.getElementById('diaSeleccionado');
const diaInfo = document.getElementById('diaInfo');
const actividadDia = document.getElementById('actividadDia');
const contadorInscritos = document.getElementById('contadorInscritos');
const listaInscritosPreview = document.getElementById('listaInscritosPreview');
const resumenDias = document.getElementById('resumenDias');

// Datos de bloqueo
const BLOCKED_RANGES = [
    { start: 1, end: 19, reason: "Clases y Capacitación" },
    { start: 22, end: 22, reason: "Foto Oficial" }
];

// Estado global de inscripciones
let allInscriptions = [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    generateDecemberDates();
    setupRealtimeListener();
    
    // Event Listeners
    selectDia.addEventListener('change', handleDateSelection);
    form.addEventListener('submit', handleFormSubmit);
});

function isDateBlocked(day) {
    for (const range of BLOCKED_RANGES) {
        if (day >= range.start && day <= range.end) {
            return range.reason;
        }
    }
    return null;
}

function generateDecemberDates() {
    const year = 2025;
    const month = 11; // Diciembre es 11 en JS (0-indexed)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Limpiar opciones
    selectDia.innerHTML = '<option value="">-- Selecciona una fecha --</option>';

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
        
        // Excluir fines de semana (opcional, pero común en días laborales)
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        const blockedReason = isDateBlocked(day);
        const option = document.createElement('option');
        const dateStr = `2025-12-${day.toString().padStart(2, '0')}`;
        
        option.value = dateStr;
        
        if (blockedReason) {
            option.disabled = true;
            option.textContent = `${day} Dic - ${blockedReason} (Bloqueado)`;
        } else {
            option.textContent = `${day} de Diciembre (Disponible)`;
        }
        
        selectDia.appendChild(option);
    }
}

function handleDateSelection(e) {
    const selectedDate = e.target.value;
    if (!selectedDate) {
        diaInfo.classList.add('hidden');
        return;
    }

    diaInfo.classList.remove('hidden');
    
    // Filtrar inscritos para este día
    const inscritosDia = allInscriptions.filter(i => i.fechaSeleccionada === selectedDate);
    
    actividadDia.textContent = "Día habilitado para beneficio";
    contadorInscritos.textContent = inscritosDia.length;
    
    if (inscritosDia.length > 0) {
        const nombres = inscritosDia.map(i => i.nombre.split(' ')[0]).join(', ');
        listaInscritosPreview.textContent = `Inscritos: ${nombres}...`;
    } else {
        listaInscritosPreview.textContent = "Sé el primero en inscribirte este día.";
    }
}

function setupRealtimeListener() {
    db.collection(COLLECTION_NAME).onSnapshot((snapshot) => {
        allInscriptions = [];
        snapshot.forEach((doc) => {
            allInscriptions.push({ id: doc.id, ...doc.data() });
        });
        
        updateDashboard();
        
        // Actualizar info del día seleccionado si hay uno
        if (selectDia.value) {
            selectDia.dispatchEvent(new Event('change'));
        }
    });
}

function updateDashboard() {
    resumenDias.innerHTML = '';
    
    // Agrupar por fecha
    const counts = {};
    allInscriptions.forEach(ins => {
        counts[ins.fechaSeleccionada] = (counts[ins.fechaSeleccionada] || 0) + 1;
    });

    // Ordenar fechas
    const sortedDates = Object.keys(counts).sort();

    if (sortedDates.length === 0) {
        resumenDias.innerHTML = '<p class="text-center text-gray-500 py-4">Aún no hay inscripciones.</p>';
        return;
    }

    sortedDates.forEach(date => {
        const count = counts[date];
        const [y, m, d] = date.split('-');
        
        const item = document.createElement('div');
        item.className = 'flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200';
        item.innerHTML = `
            <span class="font-medium text-gray-700"><i class="fas fa-calendar-alt mr-2 text-blue-500"></i>${d}/${m}/${y}</span>
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">${count} inscritos</span>
        `;
        resumenDias.appendChild(item);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const sede = document.getElementById('sede').value;
    const cumpleanos = document.getElementById('cumpleanos').value;
    const fechaSeleccionada = document.getElementById('diaSeleccionado').value;

    if (!fechaSeleccionada) {
        alert("Por favor selecciona una fecha válida.");
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Guardando...';

    try {
        await db.collection(COLLECTION_NAME).add({
            nombre,
            sede,
            cumpleanos,
            fechaSeleccionada,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("¡Inscripción realizada con éxito!");
        form.reset();
        diaInfo.classList.add('hidden');
        
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Hubo un error al guardar tu inscripción. Inténtalo de nuevo.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function generarPDF() {
    if (allInscriptions.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text("Reporte de Inscripciones - Beneficio Cumpleaños", 14, 20);
    doc.setFontSize(12);
    doc.text("Sindicato N°1 Trabajadores Salesianos - Diciembre 2025", 14, 28);

    // Preparar datos para la tabla
    // Ordenar por Sede y luego por Fecha
    const sortedData = [...allInscriptions].sort((a, b) => {
        if (a.sede === b.sede) {
            return a.fechaSeleccionada.localeCompare(b.fechaSeleccionada);
        }
        return a.sede.localeCompare(b.sede);
    });

    const tableData = sortedData.map(item => [
        item.nombre,
        item.sede,
        item.cumpleanos,
        item.fechaSeleccionada
    ]);

    doc.autoTable({
        head: [['Nombre', 'Sede', 'Fecha Cumpleaños', 'Día Libre Solicitado']],
        body: tableData,
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save('reporte-inscripciones-sindicato.pdf');
}
