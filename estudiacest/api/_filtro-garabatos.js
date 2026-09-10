// api/_filtro-garabatos.js
// Filtro de garabatos del chat de las salas de Mi espacio.
//
// Corre en el servidor: un filtro en el navegador se salta abriendo la consola.
//
// Tres decisiones que vienen de errores clásicos de estos filtros:
//
// 1. Se compara por PALABRA normalizada, no por "contiene". Buscar "puta" dentro
//    del texto bloquea "computador", "disputa", "reputación" y "diputado" (el
//    problema de Scunthorpe). Solo unas pocas formas largas y sin ambigüedad se
//    buscan dentro de la palabra ("conchetumare" escrito junto).
// 2. Se normaliza igual el mensaje y la lista: sin tildes, sin letras repetidas,
//    con las sustituciones típicas para esquivar (w3ón, hue.ón, q.l, weeeeón) y
//    con las equivalencias del habla chilena (huevón / weón, culiao / qliao).
// 3. Lo que alerta NO se bloquea. Si un estudiante escribe "me quiero morir",
//    esconder el mensaje esconde también el pedido de ayuda: pasa, y queda
//    marcado para que lo vea el profesor.

'use strict';

const LEET = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '8': 'b' };

function normalizarPalabra(p) {
  let s = String(p || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[01345784@$]/g, c => LEET[c] || c)
    .replace(/[^a-zñ]/g, '');
  s = s.replace(/(.)\1+/g, '$1');                  // weeeeon -> weon
  s = s.replace(/^(hu|gu)e/, 'we').replace(/^hua/, 'wa');
  s = s.replace(/qu/g, 'k').replace(/q/g, 'k').replace(/c(?=[aou])/g, 'k').replace(/c(?=[ei])/g, 's');
  s = s.replace(/v/g, 'b').replace(/z/g, 's');
  return s;
}

// Une letras sueltas separadas por espacios o puntos: "w e o n", "c.t.m" -> "weon", "ctm"
function unirDeletreos(texto) {
  return String(texto || '').replace(/\b(?:[A-Za-zÁÉÍÓÚÑáéíóúñ0-9@$][\s.\-_*]){2,}[A-Za-zÁÉÍÓÚÑáéíóúñ0-9@$]\b/g,
    m => m.replace(/[\s.\-_*]/g, ''));
}

function palabras(texto) {
  return unirDeletreos(texto)
    .split(/[\s,;:!?¡¿()"'«»\[\]{}<>\/\\|+=~^`]+/)
    .map(normalizarPalabra)
    .filter(Boolean);
}

// Palabra exacta, ya normalizada con la misma función.
const EXACTAS = [
  'wn', 'wna', 'ctm', 'csm', 'ql', 'qlo', 'kulo', 'tula', 'pene', 'pichula', 'raja',
  'puta', 'putas', 'puto', 'putos', 'maraka', 'marako', 'marakon', 'hueco', 'huecos',
  'perra', 'perras', 'sorra', 'sorras', 'mierda', 'mierdas', 'chucha', 'chuchas', 'kaka'
].map(normalizarPalabra);

// Comienzo de palabra: cubre plurales y derivados (weón, weona, weones, weonada).
const PREFIJOS = [
  'weon', 'webon', 'wea', 'aweon', 'aweb', 'kulia', 'klia', 'putam', 'pajer', 'marik',
  'mongol', 'mongo', 'chupal', 'chupen', 'konchetu', 'konchesu', 'konchatu',
  'kaga', 'kagon', 'kulead', 'bastard', 'imbesil', 'prostitut', 'pendej'
].map(normalizarPalabra);

// Dentro de la palabra (o del mensaje con las palabras pegadas), solo formas
// largas imposibles de confundir.
const DENTRO = [
  'konchetumare', 'konchetumadre', 'konchesumare', 'konchesumadre', 'konchatumare',
  'konchatumadre', 'hijodeputa', 'hijueputa', 'hijuetuta'
].map(normalizarPalabra);

// Palabras legítimas que un prefijo podría atrapar.
const EXCEPCIONES = new Set(['putatib', 'putatiba', 'putatibo', 'mongolia', 'mongoles', 'weapon', 'wean']
  .map(normalizarPalabra));

// Frases que no se bloquean, pero se marcan para el profesor.
const ALERTAS = [
  /\bme\s+quiero\s+morir\b/i, /\bmatarme\b/i, /\bme\s+voy\s+a\s+matar\b/i, /\bsuicid/i,
  /\bno\s+quiero\s+vivir\b/i, /\bquitarme\s+la\s+vida\b/i,
  /\bme\s+(corto|cort[eé])\b/i, /\bme\s+pegan\b/i, /\bviol(ar|aron|acion|ación)\b/i
];

function revisar(texto) {
  const original = String(texto || '');
  const lista = palabras(original);
  const pegado = lista.join('');

  for (let i = 0; i < lista.length; i++) {
    const w = lista[i];
    if (EXCEPCIONES.has(w)) continue;
    // "pico" es garabato, salvo la hora: "las 3 y pico".
    if (w === 'piko') {
      if (lista[i - 1] === 'y') continue;
      return { ok: false, motivo: 'garabato', palabra: w };
    }
    if (EXACTAS.includes(w)) return { ok: false, motivo: 'garabato', palabra: w };
    if (PREFIJOS.some(p => w.startsWith(p))) return { ok: false, motivo: 'garabato', palabra: w };
  }
  if (DENTRO.some(d => pegado.includes(d))) return { ok: false, motivo: 'garabato', palabra: 'compuesto' };

  const alerta = ALERTAS.some(r => r.test(original));
  return { ok: true, alerta };
}

module.exports = { revisar, normalizarPalabra, palabras };
