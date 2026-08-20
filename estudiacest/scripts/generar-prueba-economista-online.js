// Genera la version en linea de la prueba de Plan Lector "El economista
// callejero" a partir del archivo impreso que ya existe.
//
// Se genera y no se transcribe a proposito: asi la prueba de la pagina es
// literalmente la misma que la de papel. Si manana cambia el original, se
// vuelve a correr esto y no hay dos versiones distintas dando vueltas.
//
// Uso: node scripts/generar-prueba-economista-online.js

const fs = require('fs');
const path = require('path');

const ORIGEN = path.join(
  'C:', 'Users', 'franc', 'OneDrive', 'Desktop', '2026', '2026',
  'Lengua y Literatura 2026', 'NM4 - Lengua y Literatura',
  '02 - Pruebas y Evaluaciones', 'Unidad 3',
  'Prueba_PlanLector_Economista_Callejero_NM4_Version_A_2026.html'
);
const DESTINO = path.join(__dirname, '..', 'nm4', 'prueba-economista-callejero.html');

const html = fs.readFileSync(ORIGEN, 'utf8');

const limpiar = (s) => String(s || '')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/p>/gi, '\n\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/[ \t]+/g, ' ')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const escapar = (s) => String(s || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// --- Casos (los tres textos de lectura) ---------------------------------
const lecturas = [...html.matchAll(/<div class="reading-box">([\s\S]*?)<div class="source">/g)]
  .map((m) => limpiar(m[1]));
if (lecturas.length !== 3) throw new Error(`Se esperaban 3 casos y se encontraron ${lecturas.length}`);

const encabezados = [...html.matchAll(/<div class="case-title">([\s\S]*?)<\/div>/g)].map((m) => limpiar(m[1]));
const focos = [...html.matchAll(/<div class="case-focus">([\s\S]*?)<\/div>/g)].map((m) => limpiar(m[1]));

// --- Preguntas ----------------------------------------------------------
const bloques = [...html.matchAll(/<div class="question">([\s\S]*?)(?=<div class="question">|<div class="answer-plan"|<div class="footer")/g)];
if (bloques.length !== 9) throw new Error(`Se esperaban 9 preguntas y se encontraron ${bloques.length}`);

const preguntas = bloques.map((m, i) => {
  const bruto = m[1];
  const titulo = limpiar((bruto.match(/<div class="q-title">([\s\S]*?)<\/div>/) || [])[1] || '');
  const pista = limpiar((bruto.match(/<div class="hint">([\s\S]*?)<\/div>/) || [])[1] || '');
  const ptsM = titulo.match(/(\d+)\s*pts/);
  // El numero de lineas del papel marca cuanto se espera que escriba: se
  // traduce a la altura del cuadro de texto para no cambiar la exigencia.
  const lineas = (bruto.match(/write-line/g) || []).length;
  const etiqueta = (titulo.match(/^(Diagn.stico conceptual|An.lisis causal|Decisi.n argumentada)/) || [])[1] || '';
  const enunciado = titulo
    .replace(/^(Diagn.stico conceptual|An.lisis causal|Decisi.n argumentada)\s*/, '')
    .replace(/^\d+\s*pts\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
  return {
    id: `p${i + 1}`,
    numero: i + 1,
    caso: Math.floor(i / 3),
    etiqueta,
    puntos: ptsM ? Number(ptsM[1]) : 0,
    enunciado,
    pista,
    lineas
  };
});

const puntajeTotal = preguntas.reduce((s, p) => s + p.puntos, 0);

// --- Armado de la pagina ------------------------------------------------
const casosHtml = lecturas.map((texto, i) => {
  const qs = preguntas.filter((p) => p.caso === i);
  const parrafos = texto.split(/\n\n+/).map((p) => `<p>${escapar(p.trim())}</p>`).join('\n            ');
  const puntosCaso = qs.reduce((s, q) => s + q.puntos, 0);
  return `
      <section class="caso" id="caso${i + 1}">
        <header class="caso-head">
          <div>
            <span class="caso-badge">Caso ${i + 1} de 3</span>
            <h2>${escapar(encabezados[i] || `Caso ${i + 1}`)}</h2>
            <p class="caso-foco">${escapar(focos[i] || '')}</p>
          </div>
          <span class="caso-pts">${puntosCaso} pts</span>
        </header>

        <div class="lectura">
            ${parrafos}
        </div>

${qs.map((q) => `        <div class="pregunta">
          <h3><span class="num">${q.numero}</span> ${escapar(q.etiqueta)} <span class="pts">${q.puntos} pts</span></h3>
          <p class="enunciado">${escapar(q.enunciado)}</p>
          <p class="pista">${escapar(q.pista)}</p>
          <label class="sr-only" for="${q.id}">Respuesta a la pregunta ${q.numero}</label>
          <textarea id="${q.id}" data-pregunta="${q.id}" rows="${Math.max(4, Math.round(q.lineas * 0.8))}"
                    placeholder="Escribe aquí tu respuesta."></textarea>
          <div class="contador" data-contador="${q.id}">0 palabras</div>
        </div>`).join('\n\n')}
      </section>`;
}).join('\n');

const pagina = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Prueba Plan Lector · El economista callejero · NM4</title>
<style>
  :root{
    --navy:#1a3a6b; --navy-claro:#eef4fc; --tinta:#172033; --gris:#5b6472;
    --borde:#c8d2e0; --fondo:#f2f4f8; --blanco:#fff; --ambar:#b45309; --verde:#166534;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{
    font-family:'Segoe UI',system-ui,-apple-system,Arial,sans-serif;
    color:var(--tinta); background:var(--fondo); line-height:1.55; font-size:16px;
  }
  .barra{
    position:sticky; top:0; z-index:20; background:var(--navy); color:#fff;
    padding:10px 16px; display:flex; gap:12px; align-items:center; justify-content:space-between;
    flex-wrap:wrap; box-shadow:0 1px 6px rgba(0,0,0,.2);
  }
  .barra strong{font-size:15px; letter-spacing:.2px}
  .barra .estado{font-size:13px; opacity:.95}
  main{max-width:820px; margin:0 auto; padding:18px 16px 90px}
  .tarjeta{background:var(--blanco); border:1px solid var(--borde); border-radius:8px; padding:18px; margin-bottom:18px}
  h1{font-size:21px; color:var(--navy); margin:0 0 4px}
  .sub{color:var(--gris); font-size:14px; margin:0 0 14px}
  .datos{display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; margin-bottom:12px}
  label{display:block; font-size:13px; font-weight:600; color:var(--navy); margin-bottom:4px}
  select,input,textarea{
    width:100%; font:inherit; color:var(--tinta); background:var(--blanco);
    border:1px solid var(--borde); border-radius:6px; padding:9px 10px;
  }
  textarea{resize:vertical; min-height:90px; line-height:1.55}
  select:focus,input:focus,textarea:focus{outline:2px solid var(--navy); outline-offset:1px; border-color:var(--navy)}
  button{
    font:inherit; font-weight:600; border-radius:6px; padding:11px 18px; cursor:pointer;
    border:1px solid var(--navy); background:var(--navy); color:#fff;
  }
  button.secundario{background:var(--blanco); color:var(--navy)}
  button[disabled]{opacity:.55; cursor:not-allowed}
  .aviso{background:var(--navy-claro); border-left:4px solid var(--navy); padding:11px 14px; border-radius:5px; margin-bottom:14px; font-size:14.5px}
  .aviso.ambar{background:#fff7ed; border-left-color:var(--ambar)}
  .error{color:#991b1b; background:#fef2f2; border-left:4px solid #991b1b; padding:10px 13px; border-radius:5px; margin:10px 0; font-size:14.5px}
  .caso{background:var(--blanco); border:1px solid var(--borde); border-radius:8px; padding:18px; margin-bottom:18px}
  .caso-head{display:flex; justify-content:space-between; align-items:flex-start; gap:14px; border-bottom:2px solid var(--navy); padding-bottom:10px; margin-bottom:14px}
  .caso-head h2{font-size:18px; color:var(--navy); margin:6px 0 2px}
  .caso-badge{display:inline-block; background:var(--navy); color:#fff; font-size:11.5px; font-weight:700; letter-spacing:.4px; text-transform:uppercase; padding:3px 9px; border-radius:3px}
  .caso-foco{color:var(--gris); font-size:13px; margin:0}
  .caso-pts{white-space:nowrap; border:1px solid var(--navy); color:var(--navy); font-size:12.5px; font-weight:700; padding:3px 9px; border-radius:3px}
  .lectura{background:#fafbff; border:1px solid var(--borde); border-radius:6px; padding:13px 15px; margin-bottom:18px; font-family:Georgia,'Times New Roman',serif; font-size:15.5px; text-align:justify}
  .lectura p{margin:0 0 10px} .lectura p:last-child{margin-bottom:0}
  .pregunta{margin:0 0 22px; padding-top:4px}
  .pregunta h3{font-size:15.5px; color:var(--navy); margin:0 0 6px; display:flex; align-items:center; gap:8px; flex-wrap:wrap}
  .num{display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; background:var(--navy); color:#fff; border-radius:50%; font-size:13.5px}
  .pts{border:1px solid var(--navy); color:var(--navy); font-size:11.5px; font-weight:700; padding:1px 7px; border-radius:3px}
  .enunciado{margin:0 0 5px}
  .pista{color:var(--gris); font-size:13.5px; font-style:italic; margin:0 0 9px}
  .contador{text-align:right; font-size:12.5px; color:var(--gris); margin-top:4px}
  .sr-only{position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0}
  .pie{position:fixed; left:0; right:0; bottom:0; background:var(--blanco); border-top:1px solid var(--borde); padding:11px 16px; display:flex; gap:12px; align-items:center; justify-content:space-between; flex-wrap:wrap; z-index:15}
  .pie .info{font-size:13.5px; color:var(--gris)}
  .modal{position:fixed; inset:0; background:rgba(15,23,42,.6); display:flex; align-items:center; justify-content:center; padding:18px; z-index:40}
  .modal[hidden]{display:none}
  .modal .caja{background:var(--blanco); border-radius:10px; padding:22px; max-width:430px; width:100%}
  .modal h2{margin:0 0 8px; font-size:19px; color:var(--verde)}
  .oculto{display:none}
  @media (max-width:520px){
    body{font-size:15.5px}
    main{padding:14px 12px 96px}
    .tarjeta,.caso{padding:14px}
    .caso-head{flex-direction:column; gap:8px}
  }
</style>
</head>
<body>

<div class="barra" id="inicio">
  <strong>Plan Lector · El economista callejero</strong>
  <span class="estado" id="estadoGuardado" role="status" aria-live="polite">Sin empezar</span>
</div>

<main>

  <section class="tarjeta" id="identidad">
    <h1>Prueba de Plan Lector · Versión A</h1>
    <p class="sub"><em>El economista callejero: 15 lecciones de economía para sobrevivir a políticos y demagogos</em>, de Axel Kaiser · Lengua y Literatura NM4 · ${puntajeTotal} puntos</p>

    <div class="aviso">
      Esta es la misma prueba que rindió tu curso, con espacio para responder aquí mismo.
      Se guarda sola mientras escribes, así que puedes cerrar y volver después.
    </div>

    <div class="datos">
      <div>
        <label for="curso">Tu curso</label>
        <select id="curso">
          <option value="">Selecciona…</option>
          <option value="4ATP">4°A TP</option>
          <option value="4BTP">4°B TP</option>
          <option value="4CTP">4°C TP</option>
          <option value="4DTP">4°D TP</option>
          <option value="4ETP">4°E TP</option>
        </select>
      </div>
      <div>
        <label for="numero">Tu número de lista</label>
        <input id="numero" type="number" min="1" max="50" inputmode="numeric" placeholder="Ej: 5">
      </div>
      <div style="display:flex; align-items:flex-end">
        <button type="button" id="entrar" class="secundario">Continuar</button>
      </div>
    </div>
    <div id="errorIdentidad" class="error oculto"></div>
    <div id="saludo" class="aviso oculto"></div>
  </section>

  <div id="prueba" class="oculto">

    <section class="tarjeta">
      <h2 style="font-size:17px;color:var(--navy);margin:0 0 6px">Antes de empezar</h2>
      <p style="margin:0 0 8px">Lee los tres casos completos antes de responder. Todos son ficticios y traen la información que necesitas: no tienes que buscar nada por fuera.</p>
      <p style="margin:0 0 8px">Cada caso vale 12 puntos, repartidos en diagnóstico conceptual (3), análisis causal (4) y decisión argumentada (5). Estructura que conviene seguir: concepto del libro → evidencia del caso → explicación de la relación → consecuencia o decisión.</p>
      <div class="aviso ambar" style="margin-bottom:0">
        <strong>Criterio de pensamiento crítico.</strong> No se califica que estés de acuerdo con Axel Kaiser, sino que expliques sus ideas con fidelidad, las apliques a los datos del caso y formules un juicio propio coherente, aunque señales límites o llegues a otra conclusión.
      </div>
    </section>

${casosHtml}

    <section class="tarjeta">
      <p style="margin:0 0 12px">Cuando termines, revisa tus respuestas y entrega. Después de entregar ya no podrás editar.</p>
      <div id="errorEnvio" class="error oculto"></div>
      <button type="button" id="submit">Entregar prueba</button>
    </section>

  </div>
</main>

<div class="pie" id="pie" hidden>
  <span class="info" id="infoPie">Se guarda automáticamente</span>
  <button type="button" class="secundario" id="guardarAhora">Guardar ahora</button>
</div>

<div class="modal" id="modalOk" role="dialog" aria-modal="true" aria-labelledby="tituloOk" hidden>
  <div class="caja">
    <h2 id="tituloOk">Entrega confirmada</h2>
    <p id="detalleOk">Tu prueba quedó entregada y registrada. El profesor la revisará y la nota se publicará en Lirmi.</p>
    <p style="margin-bottom:0"><a href="#inicio" id="cerrarOk">Volver al inicio de la prueba</a></p>
  </div>
</div>

<script>
(function () {
  'use strict';

  var API = '/api/economista';
  var QUESTIONS = ${JSON.stringify(preguntas.map((p) => ({ id: p.id, n: p.numero, pts: p.puntos })))};
  var PUNTAJE_TOTAL = ${puntajeTotal};

  var alumno = null;
  var entregada = false;
  var enviando = false;
  var temporizador = null;
  // Cola serializada: dos autoguardados no pueden competir entre si.
  var saveQueue = Promise.resolve();

  var $ = function (id) { return document.getElementById(id); };
  var estado = $('estadoGuardado');
  var pie = $('pie');

  function marcarEstado(texto) { estado.textContent = texto; }

  function mostrarError(caja, mensaje) {
    var el = $(caja);
    el.textContent = mensaje;
    el.classList.remove('oculto');
  }
  function limpiarError(caja) { $(caja).classList.add('oculto'); }

  function recolectar() {
    var out = {};
    QUESTIONS.forEach(function (q) {
      var el = $(q.id);
      if (el) out[q.id] = el.value;
    });
    return out;
  }

  function contarPalabras(texto) {
    var t = String(texto || '').trim();
    return t ? t.split(/\\s+/).length : 0;
  }

  function pintarContadores() {
    QUESTIONS.forEach(function (q) {
      var el = $(q.id);
      var c = document.querySelector('[data-contador="' + q.id + '"]');
      if (el && c) c.textContent = contarPalabras(el.value) + ' palabras';
    });
  }

  function pedir(accion, cuerpo) {
    return fetch(API + '?action=' + accion, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo)
    }).then(function (r) {
      return r.json().then(function (data) {
        if (!r.ok) throw new Error(data && data.error ? data.error : 'Error ' + r.status);
        return data;
      });
    });
  }

  function guardarBorrador() {
    if (!alumno || entregada || enviando) return saveQueue;
    saveQueue = saveQueue.then(function () {
      marcarEstado('Guardando…');
      return pedir('save', { curso: alumno.curso, n: alumno.n, answers: recolectar() })
        .then(function () { marcarEstado('Avance guardado'); })
        .catch(function (e) { marcarEstado('Error al guardar'); $('infoPie').textContent = 'No se pudo guardar: ' + e.message + '. Tus respuestas siguen en pantalla.'; });
    });
    return saveQueue;
  }

  function programarGuardado() {
    if (entregada || enviando) return;
    marcarEstado('Sin guardar');
    if (temporizador) clearTimeout(temporizador);
    temporizador = setTimeout(guardarBorrador, 2500);
  }

  function bloquearFormulario() {
    QUESTIONS.forEach(function (q) {
      var el = $(q.id);
      if (el) el.readOnly = true;
    });
    var b = $('submit');
    b.disabled = true;
    b.textContent = 'Prueba entregada';
    $('guardarAhora').disabled = true;
    marcarEstado('Entregada');
  }

  function restaurar(attempt) {
    if (!attempt) return;
    var a = attempt.answers || {};
    QUESTIONS.forEach(function (q) { if ($(q.id) && typeof a[q.id] === 'string') $(q.id).value = a[q.id]; });
    pintarContadores();
    // Si ya estaba entregada, se vuelve a abrir en estado entregado.
    if (attempt.completada === true) {
      entregada = true;
      bloquearFormulario();
      $('detalleOk').textContent = 'Esta prueba ya estaba entregada. El profesor la revisará y la nota se publicará en Lirmi.';
      return;
    }
    // Solo se anuncia avance si de verdad hay algo escrito: un registro vacio
    // no es un avance y decir lo contrario confunde al que recien entra.
    var escrito = QUESTIONS.some(function (q) { return String(a[q.id] || '').trim(); });
    marcarEstado(escrito ? 'Avance guardado' : 'Sin empezar');
  }

  $('entrar').addEventListener('click', function () {
    limpiarError('errorIdentidad');
    var curso = $('curso').value;
    var n = $('numero').value;
    if (!curso || !n) { mostrarError('errorIdentidad', 'Elige tu curso y escribe tu número de lista.'); return; }
    var boton = this;
    boton.disabled = true;
    boton.textContent = 'Buscando…';
    fetch(API + '?action=get-guia-state&curso=' + encodeURIComponent(curso) + '&n=' + encodeURIComponent(n))
      .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || 'Error ' + r.status); return d; }); })
      .then(function (data) {
        alumno = data.alumno;
        $('saludo').textContent = alumno.nombre + ' · ' + alumno.curso.replace(/^4([A-E])TP$/, '4°$1 TP') + ' · N° ' + alumno.n;
        $('saludo').classList.remove('oculto');
        $('curso').disabled = true;
        $('numero').disabled = true;
        boton.classList.add('oculto');
        $('prueba').classList.remove('oculto');
        pie.hidden = false;
        restaurar(data.attempt);
      })
      .catch(function (e) {
        mostrarError('errorIdentidad', e.message + ' Revisa el curso y el número, o avísale al profesor.');
        boton.disabled = false;
        boton.textContent = 'Continuar';
      });
  });

  document.addEventListener('input', function (ev) {
    if (ev.target && ev.target.matches('textarea[data-pregunta]')) {
      pintarContadores();
      programarGuardado();
    }
  });

  $('guardarAhora').addEventListener('click', function () { guardarBorrador(); });

  $('submit').addEventListener('click', function () {
    if (entregada || enviando) return;
    limpiarError('errorEnvio');
    var vacias = QUESTIONS.filter(function (q) { var el = $(q.id); return !el || !el.value.trim(); });
    if (vacias.length) {
      var nums = vacias.map(function (q) { return q.n; }).join(', ');
      mostrarError('errorEnvio', 'Te faltan las preguntas ' + nums + '. Respóndelas antes de entregar.');
      return;
    }

    var boton = this;
    enviando = true;
    boton.disabled = true;
    boton.textContent = 'Entregando…';
    if (temporizador) clearTimeout(temporizador);

    (async function () {
      try {
        // Se espera a que termine todo borrador en curso antes de la entrega
        // final: si no, un autoguardado tardio pisaria la entrega.
        await saveQueue;
        var data = await pedir('submit', {
          curso: alumno.curso,
          n: alumno.n,
          answers: recolectar(),
          marca: {
            submitted: true,
            completada: true,
            submittedAt: Date.now(),
            completadaAt: Date.now(),
            score: null,
            total: QUESTIONS.length
          }
        });
        var attempt = data.attempt || {};
        if (attempt.completada !== true) throw new Error('La entrega no quedó confirmada. Inténtalo otra vez.');
        entregada = true;
        enviando = false;
        bloquearFormulario();
        $('modalOk').hidden = false;
        $('infoPie').textContent = 'Entrega confirmada · ' + PUNTAJE_TOTAL + ' puntos por corregir';
      } catch (e) {
        enviando = false;
        boton.disabled = false;
        boton.textContent = 'Entregar prueba';
        mostrarError('errorEnvio', 'No se pudo entregar: ' + e.message + ' Tus respuestas no se perdieron, vuelve a intentarlo.');
      }
    })();
  });

  $('cerrarOk').addEventListener('click', function () { $('modalOk').hidden = true; });

  window.addEventListener('beforeunload', function (ev) {
    if (!alumno || entregada) return;
    if (estado.textContent === 'Sin guardar' || estado.textContent === 'Guardando…') {
      ev.preventDefault();
      ev.returnValue = '';
    }
  });
})();
</script>
</body>
</html>
`;

fs.writeFileSync(DESTINO, pagina, 'utf8');
console.log(`Generada: ${path.relative(path.join(__dirname, '..'), DESTINO)}`);
console.log(`  casos: ${lecturas.length} · preguntas: ${preguntas.length} · puntaje: ${puntajeTotal}`);
console.log(`  bytes: ${fs.statSync(DESTINO).size}`);

// --- Pagina de revision para el profesor --------------------------------
// Se genera aqui mismo para que los enunciados sean los de la prueba y no una
// copia que se desactualice.
const REVISION = path.join(__dirname, '..', 'nm4', 'revision-economista.html');

const revision = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Revisión · Prueba El economista callejero · NM4</title>
<style>
  :root{--navy:#1a3a6b;--tinta:#172033;--gris:#5b6472;--borde:#c8d2e0;--fondo:#f2f4f8;--blanco:#fff;--verde:#166534}
  *{box-sizing:border-box}
  body{margin:0;font-family:'Segoe UI',system-ui,Arial,sans-serif;color:var(--tinta);background:var(--fondo);line-height:1.55}
  header{background:var(--navy);color:#fff;padding:12px 18px}
  header h1{margin:0;font-size:17px}
  main{max-width:900px;margin:0 auto;padding:18px 16px 60px}
  .caja{background:var(--blanco);border:1px solid var(--borde);border-radius:8px;padding:16px;margin-bottom:16px}
  label{display:block;font-size:13px;font-weight:600;color:var(--navy);margin-bottom:4px}
  input{font:inherit;padding:9px 10px;border:1px solid var(--borde);border-radius:6px;width:260px;max-width:100%}
  button{font:inherit;font-weight:600;background:var(--navy);color:#fff;border:1px solid var(--navy);border-radius:6px;padding:10px 16px;cursor:pointer}
  .alumno{border-left:4px solid var(--navy);padding-left:14px;margin-bottom:26px}
  .alumno h2{font-size:16px;color:var(--navy);margin:0 0 2px}
  .meta{font-size:13px;color:var(--gris);margin:0 0 12px}
  .entregada{color:var(--verde);font-weight:600}
  .p{margin:0 0 14px}
  .p .enun{font-size:14px;font-weight:600;color:var(--navy);margin:0 0 4px}
  .p .resp{white-space:pre-wrap;background:#fafbff;border:1px solid var(--borde);border-radius:6px;padding:10px 12px;font-size:15px}
  .p .vacia{color:#991b1b;font-style:italic}
  .err{color:#991b1b;background:#fef2f2;border-left:4px solid #991b1b;padding:10px 13px;border-radius:5px}
  .oculto{display:none}
</style>
</head>
<body>
<header><h1>Revisión · Prueba de Plan Lector «El economista callejero» · NM4</h1></header>
<main>
  <div class="caja" id="acceso">
    <label for="clave">Clave de revisión</label>
    <input id="clave" type="password" autocomplete="off" placeholder="Pégala aquí">
    <button type="button" id="ver">Ver entregas</button>
    <div id="error" class="err oculto" style="margin-top:10px"></div>
  </div>
  <div id="salida"></div>
</main>
<script>
(function () {
  'use strict';
  var PREGUNTAS = ${JSON.stringify(preguntas.map((p) => ({ id: p.id, n: p.numero, pts: p.puntos, etiqueta: p.etiqueta, enunciado: p.enunciado })))};
  var $ = function (id) { return document.getElementById(id); };

  function escapar(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function fecha(ms) {
    if (!ms) return 'sin fecha';
    var d = new Date(Number(ms));
    return d.toLocaleDateString('es-CL') + ' ' + d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  }

  $('ver').addEventListener('click', function () {
    var clave = $('clave').value.trim();
    $('error').classList.add('oculto');
    if (!clave) { $('error').textContent = 'Falta la clave.'; $('error').classList.remove('oculto'); return; }
    fetch('/api/economista?action=admin-list&key=' + encodeURIComponent(clave))
      .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || 'Error ' + r.status); return d; }); })
      .then(function (data) {
        var intentos = data.intentos || {};
        var claves = Object.keys(intentos).sort();
        if (!claves.length) { $('salida').innerHTML = '<div class="caja">Todavía no hay ninguna entrega.</div>'; return; }
        var html = claves.map(function (k) {
          var a = intentos[k];
          var resp = a.answers || {};
          var estado = a.completada === true
            ? '<span class="entregada">Entregada</span> · ' + fecha(a.submittedAt)
            : 'Borrador · última edición ' + fecha(a.updatedAt);
          var cuerpo = PREGUNTAS.map(function (q) {
            var texto = String(resp[q.id] || '').trim();
            var palabras = texto ? texto.split(/\\s+/).length : 0;
            return '<div class="p"><p class="enun">' + q.n + '. ' + escapar(q.etiqueta) + ' (' + q.pts + ' pts) · ' + palabras + ' palabras</p>'
              + '<p style="margin:0 0 4px;font-size:13.5px;color:#5b6472">' + escapar(q.enunciado) + '</p>'
              + (texto ? '<div class="resp">' + escapar(texto) + '</div>' : '<div class="resp vacia">Sin responder</div>')
              + '</div>';
          }).join('');
          return '<div class="caja"><div class="alumno"><h2>' + escapar(a.nombre || k) + '</h2>'
            + '<p class="meta">' + escapar(a.curso || '') + ' · N° ' + escapar(a.n) + ' · ' + estado + '</p>'
            + cuerpo + '</div></div>';
        }).join('');
        $('salida').innerHTML = html;
        $('acceso').classList.add('oculto');
      })
      .catch(function (e) {
        $('error').textContent = e.message;
        $('error').classList.remove('oculto');
      });
  });
})();
</script>
</body>
</html>
`;

fs.writeFileSync(REVISION, revision, 'utf8');
console.log(`Generada: ${path.relative(path.join(__dirname, '..'), REVISION)} (${fs.statSync(REVISION).size} bytes)`);
