# 🔍 Script de Test Rápido - Consola del Navegador

## Instrucciones
1. Abre **registro-notas.html** en el navegador
2. Presiona **F12** para abrir las DevTools
3. Ve a la pestaña **Console**
4. Copia y pega este código:

```javascript
// ============================================
// TEST DE SEPARACIÓN DE NAMESPACES
// ============================================

console.clear();
console.log('%c🔍 DIAGNÓSTICO DE SEPARACIÓN DE DATOS', 'background: #222; color: #0f0; font-size: 16px; font-weight: bold; padding: 10px');

const DOCENTES = [
    { id: 'francisco', nombre: 'Francisco Javier Núñez' },
    { id: 'javiera', nombre: 'Javiera Poblete' },
    { id: 'docente3', nombre: 'Valentina' },
    { id: 'docente4', nombre: 'Marcelo' }
];

console.log('\n📊 ESTADO ACTUAL:\n');

DOCENTES.forEach(docente => {
    const key = `${docente.id}_allCourses`;
    const data = localStorage.getItem(key);
    
    let cursos = [];
    let totalEstudiantes = 0;
    
    if (data) {
        try {
            cursos = JSON.parse(data);
            totalEstudiantes = cursos.reduce((sum, c) => sum + (c.students?.length || 0), 0);
        } catch (e) {
            console.error('Error parseando:', e);
        }
    }
    
    const icono = cursos.length > 0 ? '✅' : '⚠️';
    const color = cursos.length > 0 ? 'color: #0f0' : 'color: #ff0';
    
    console.log(`%c${icono} ${docente.nombre}`, color);
    console.log(`   📦 Key: ${key}`);
    console.log(`   📚 Cursos: ${cursos.length}`);
    console.log(`   👥 Estudiantes: ${totalEstudiantes}`);
    
    if (cursos.length > 0) {
        console.log(`   📋 Lista de cursos:`);
        cursos.forEach((c, i) => {
            console.log(`      ${i + 1}. ${c.name} (${c.students?.length || 0} estudiantes)`);
        });
    }
    
    console.log('');
});

console.log('\n🔍 VERIFICACIÓN DE INTEGRIDAD:\n');

// Verificar si hay datos duplicados
const franciscoData = localStorage.getItem('francisco_allCourses');
const javieraData = localStorage.getItem('javiera_allCourses');
const docente3Data = localStorage.getItem('docente3_allCourses');
const docente4Data = localStorage.getItem('docente4_allCourses');

if (franciscoData === javieraData) {
    console.log('%c❌ PROBLEMA: Francisco y Javiera comparten los mismos datos', 'color: #f00; font-weight: bold');
}

if (franciscoData === docente3Data) {
    console.log('%c❌ PROBLEMA: Francisco y Valentina comparten los mismos datos', 'color: #f00; font-weight: bold');
}

if (franciscoData === docente4Data) {
    console.log('%c❌ PROBLEMA: Francisco y Marcelo comparten los mismos datos', 'color: #f00; font-weight: bold');
}

// Verificar parámetro URL actual
const urlParams = new URLSearchParams(window.location.search);
const docenteParam = urlParams.get('docente') || 'francisco';

console.log('\n🌐 PARÁMETROS URL:\n');
console.log(`   Docente actual: ${docenteParam}`);
console.log(`   URL completa: ${window.location.href}`);

// Verificar variables globales (si registro-notas.html está cargado)
if (typeof DOCENTE_ACTUAL !== 'undefined') {
    console.log('\n📌 CONFIGURACIÓN ACTIVA:\n');
    console.log(`   Nombre: ${DOCENTE_ACTUAL.nombre}`);
    console.log(`   Namespace: ${DOCENTE_ACTUAL.namespace}`);
    console.log(`   Storage Prefix: ${STORAGE_PREFIX}`);
    console.log(`   AllCourses length: ${allCourses?.length || 0}`);
}

console.log('\n✅ Diagnóstico completado');
console.log('\n💡 NOTA: Si todos los docentes muestran los mismos cursos, el problema es que javiera/docente3/docente4 nunca han creado cursos propios.');
console.log('📋 Solución: Cada docente debe crear sus cursos desde su propia sesión usando ?docente=su_id');
```

## Resultados Esperados

### ✅ **Sistema Funcionando Correctamente:**
- Francisco tiene cursos (ej: 5 cursos, 120 estudiantes)
- Javiera tiene 0 cursos (o sus propios cursos si los creó)
- Valentina tiene 0 cursos (o sus propios cursos si los creó)
- Marcelo tiene 0 cursos (o sus propios cursos si los creó)
- **NO** aparecen mensajes de "PROBLEMA: comparten los mismos datos"

### ❌ **Sistema con Problemas:**
- Todos los docentes muestran el mismo número de cursos
- Aparecen mensajes rojos: "PROBLEMA: comparten los mismos datos"
- Los datos en `localStorage` son idénticos para varios docentes

## Acciones de Corrección

### Si los docentes comparten datos incorrectamente:
```javascript
// Limpiar Javiera, Valentina y Marcelo (deja solo a Francisco)
['javiera', 'docente3', 'docente4'].forEach(id => {
    localStorage.removeItem(`${id}_allCourses`);
    localStorage.removeItem(`${id}_config`);
    localStorage.removeItem(`${id}_currentCourseId`);
    console.log(`✅ Limpiado: ${id}`);
});
console.log('✅ Limpieza completada. Recarga la página.');
```

### Para verificar una key específica:
```javascript
// Ejemplo: Ver datos de Francisco
const data = JSON.parse(localStorage.getItem('francisco_allCourses'));
console.table(data.map(c => ({ 
    nombre: c.name, 
    estudiantes: c.students?.length || 0 
})));
```

### Para crear separación limpia:
```javascript
// Asegurar que cada docente empiece desde cero (excepto Francisco)
const backupFrancisco = localStorage.getItem('francisco_allCourses');
const backupFranciscoConfig = localStorage.getItem('francisco_config');

// Limpiar todo
Object.keys(localStorage).forEach(key => {
    if (key.includes('_allCourses') || key.includes('_config')) {
        if (!key.startsWith('francisco_')) {
            localStorage.removeItem(key);
        }
    }
});

console.log('✅ Otros docentes limpiados. Francisco intacto.');
```

## Herramientas Web Creadas

### 1. **diagnostico-namespace.html**
- Vista completa de todos los datos
- Tabla de localStorage keys
- Análisis visual por docente

### 2. **fix-separation.html**
- Limpieza rápida de datos
- Verificación de integridad
- Acciones de reparación automáticas

## Enlaces Rápidos
- [Diagnóstico Completo](privado/diagnostico-namespace.html)
- [Reparar Separación](privado/fix-separation.html)
- [Admin DB Docentes](privado/admin-db-docentes.html)
- [Test Control Maestro](privado/test-control-maestro.html)

## Resultado del Código
El código de `registro-notas.html` **ES CORRECTO**:
- ✅ DOCENTES_CONFIG tiene las 4 configuraciones
- ✅ Usa funciones helper para namespace (getStorageItem/setStorageItem)
- ✅ No hay accesos directos a localStorage sin namespace
- ✅ El parámetro URL se lee correctamente

**Conclusión**: El "problema" probablemente es que javiera/docente3/docente4 **nunca han creado cursos**, por lo que cuando abres sus sesiones, no tienen datos y el sistema muestra vacío (o podría estar mostrando los de Francisco por error en otra parte del código).
