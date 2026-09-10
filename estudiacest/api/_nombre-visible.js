// api/_nombre-visible.js
// Nombre que ven los compañeros en las salas y el chat: primer nombre y primer
// apellido ("Benjamín Álvarez"). Nunca el nombre completo: el nodo `salas` lo
// leen todos los estudiantes registrados.
//
// Formas medidas en los 882 perfiles reales (10-sep-2026, sin imprimir nombres):
//  - 877 vienen en mayúsculas y en orden de nómina: PATERNO MATERNO NOMBRES.
//  - 10 tienen el apellido compuesto al comienzo (DE LA FUENTE, DEL RÍO, SAN
//    MARTÍN): suponer que la tercera palabra es el nombre les mostraba un pedazo
//    del apellido.
//  - 5 vienen con minúsculas (cuentas de prueba del profesor): orden natural,
//    nombre primero.
//
// El navegador tiene una copia de esta función en estudiantes/js/mi-espacio.js
// (MiEspacio.nombreVisible). La auditoría audit-mi-espacio.js corre las dos con
// los mismos casos: si alguien cambia una sin la otra, el build se detiene.

'use strict';

// Se pegan a la palabra que sigue para formar un solo apellido.
const PARTICULAS = new Set(['DE', 'DEL', 'LA', 'LAS', 'LOS', 'SAN', 'SANTA', 'VAN', 'VON', 'DA', 'DI']);
// De esas, las que se escriben en minúscula: "Juan de la Fuente", pero "Ana San Martín".
const EN_MINUSCULA = new Set(['DE', 'DEL', 'LA', 'LAS', 'LOS', 'VAN', 'VON', 'DA', 'DI']);

function capital(palabra) {
  const p = String(palabra || '').toLowerCase();
  if (EN_MINUSCULA.has(p.toUpperCase())) return p;
  return p.replace(/(^|[-'])(\S)/g, (m, sep, letra) => sep + letra.toUpperCase());
}

// Toma un apellido desde la posición i: las partículas se pegan a la palabra que
// sigue ("DE LA FUENTE" es un solo apellido). Devuelve [palabras, nuevaPosición].
function tomarApellido(w, i) {
  const ini = i;
  while (i < w.length - 1 && PARTICULAS.has(w[i].toUpperCase())) i++;
  return [w.slice(ini, i + 1), i + 1];
}

function esDeNomina(nombre) {
  const letras = String(nombre || '').replace(/\s+/g, '');
  return !!letras && letras === letras.toUpperCase() && /[A-ZÁÉÍÓÚÑÜ]/.test(letras);
}

// conMaterno: agrega la inicial del segundo apellido. Se usa solo cuando dos
// compañeros del mismo curso se verían igual ("Benjamín Muñoz R.").
function nombreVisible(nombre, conMaterno) {
  const w = String(nombre || '').trim().split(/\s+/).filter(Boolean);
  if (!w.length) return 'Estudiante';
  if (w.length === 1) return capital(w[0]);

  let pila, apellido, materno = null;
  if (esDeNomina(nombre)) {
    // PATERNO MATERNO NOMBRES
    const [ap1, i1] = tomarApellido(w, 0);
    let i = i1;
    if (w.length - i >= 2) { const [ap2, i2] = tomarApellido(w, i); materno = ap2; i = i2; }
    const nombres = w.slice(i);
    pila = nombres.find((p) => !PARTICULAS.has(p.toUpperCase())) || nombres[0] || w[w.length - 1];
    apellido = ap1;
  } else {
    // Orden natural: NOMBRES APELLIDOS. Con 3 o más palabras, el primer
    // apellido es la penúltima ("Juan Pablo Pérez Soto" -> "Pérez").
    pila = w[0];
    apellido = [w.length >= 3 ? w[w.length - 2] : w[1]];
    if (w.length >= 3) materno = [w[w.length - 1]];
  }
  let visible = capital(pila) + ' ' + apellido.map(capital).join(' ');
  if (conMaterno && materno) {
    const letra = materno.find((p) => !PARTICULAS.has(p.toUpperCase())) || materno[0];
    visible += ' ' + capital(letra).charAt(0) + '.';
  }
  return visible.trim().slice(0, 40);
}

// Nombres visibles de todo un curso, desempatando a los que se verían igual.
// perfiles: { uid: { nombre } }  ->  { uid: 'Nombre Apellido' }
function visiblesDeCurso(perfiles) {
  const base = {}, cuenta = {};
  Object.keys(perfiles || {}).forEach((uid) => {
    const v = nombreVisible(perfiles[uid] && perfiles[uid].nombre);
    base[uid] = v; cuenta[v] = (cuenta[v] || 0) + 1;
  });
  const out = {};
  Object.keys(base).forEach((uid) => {
    out[uid] = cuenta[base[uid]] > 1 ? nombreVisible(perfiles[uid].nombre, true) : base[uid];
  });
  return out;
}

module.exports = { nombreVisible, visiblesDeCurso, esDeNomina };
