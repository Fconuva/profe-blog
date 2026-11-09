/* ====================================================================
   NOTAS DE PROCESO · 3.º A, B y D TP
   Planilla editable: una fila por estudiante y una columna por tarea.
   Datos en plataforma_lecturas/notas_proceso (regla existente: solo
   administradores leen y escriben). Cada cambio queda en el historial
   del curso para poder deshacerlo.
   Depende del script principal del admin: db, currentUser, studentsMap,
   LECTURAS_BASE, htmlEsc, norm, toast y showSection.
   ==================================================================== */
(function () {
  'use strict';

  var ROOT = LECTURAS_BASE + '/notas_proceso';
  var CURSOS = [
    { id: '3A-TP', label: '3.º A TP' },
    { id: '3B-TP', label: '3.º B TP' },
    { id: '3D-TP', label: '3.º D TP' }
  ];
  // Secuencia de noviembre compartida por los tres cursos (planificación NM3).
  var SUGERIDAS = [
    { titulo: 'Guía de planos y ángulos', fecha: '2026-11-06' },
    { titulo: 'Libreto en Canva', fecha: '2026-11-13' },
    { titulo: 'Grabación y edición', fecha: '2026-11-20' },
    { titulo: 'Presentación del video', fecha: '2026-11-27' }
  ];
  var PREF_KEY = 'estudiacest.notasProceso.prefs';
  var TS = firebase.database.ServerValue.TIMESTAMP;

  var st = {
    curso: CURSOS[0].id,
    all: null,            // plataforma_lecturas/notas_proceso/cursos
    loadError: '',
    listening: false,
    histRef: null,
    hist: [],
    showArchived: false,
    blankAsOne: false,
    lirmiCol: 'promedio',
    sig: '',
    pending: {},          // "uid|tid" -> valor en vuelo
    editingTask: null,
    mounted: false,
    hashHandled: false
  };

  /* ---------- utilidades ---------- */
  function esc(v) { return htmlEsc(v == null ? '' : v); }
  function fmt(n) { return (n == null || !isFinite(n)) ? '' : Number(n).toFixed(1).replace('.', ','); }
  function round1(x) { return Math.round(x * 10 + 1e-7) / 10; }
  function cursoLabel(id) { var c = CURSOS.find(function (x) { return x.id === id; }); return c ? c.label : id; }
  function fmtFecha(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? m[3] + '-' + m[2] : '';
  }
  function hoy() {
    var d = new Date(), p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  function newTaskId() { return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function loadPrefs() {
    try {
      var p = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
      if (CURSOS.some(function (c) { return c.id === p.curso; })) st.curso = p.curso;
      st.blankAsOne = p.blankAsOne === true;
    } catch (ignore) {}
  }
  function savePrefs() {
    try { localStorage.setItem(PREF_KEY, JSON.stringify({ curso: st.curso, blankAsOne: st.blankAsOne })); } catch (ignore) {}
  }

  // '' -> null (borrar); '5,5' '5.5' '55' '6' -> número; otro -> undefined (inválido)
  function parseNota(raw) {
    var s = String(raw == null ? '' : raw).trim().replace(',', '.');
    if (s === '') return null;
    var n;
    if (/^\d{2}$/.test(s)) n = Number(s) / 10;
    else if (/^\d(\.\d+)?$/.test(s)) n = Number(s);
    else return undefined;
    n = round1(n);
    if (!(n >= 1 && n <= 7)) return undefined;
    return n;
  }

  /* ---------- lectura del estado ---------- */
  function cursoData(c) { return (st.all && st.all[c || st.curso]) || {}; }
  function tareasDe(c, incluirArchivadas) {
    var t = cursoData(c).tareas || {};
    return Object.keys(t).map(function (id) { return Object.assign({ id: id }, t[id]); })
      .filter(function (x) { return incluirArchivadas || !x.archivada; })
      .sort(function (a, b) {
        return (Number(a.orden) || 0) - (Number(b.orden) || 0) || String(a.fecha || '').localeCompare(String(b.fecha || '')) || a.id.localeCompare(b.id);
      });
  }
  function tareasVisibles() { return tareasDe(st.curso, st.showArchived); }
  function tareasActivas() { return tareasDe(st.curso, false); }
  function notaDe(uid, tid, c) {
    var n = ((cursoData(c).notas || {})[uid] || {})[tid];
    return n && isFinite(Number(n.n)) ? Number(n.n) : null;
  }
  function roster(c) {
    var curso = c || st.curso;
    return Object.keys(studentsMap || {}).map(function (uid) { return Object.assign({ uid: uid }, studentsMap[uid]); })
      .filter(function (s) { return s.curso === curso && s.activo !== false; })
      .sort(function (a, b) { return String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es'); });
  }
  function promedio(uid) {
    var ts = tareasActivas(), sum = 0, n = 0, con = 0;
    ts.forEach(function (t) {
      var v = notaDe(uid, t.id);
      if (v != null) { sum += v; n++; con++; }
      else if (st.blankAsOne) { sum += 1; n++; }
    });
    return { valor: n ? round1(sum / n) : null, con: con, total: ts.length };
  }

  /* ---------- estilos ---------- */
  function injectStyles() {
    var css = ''
      + '#sec-notasproceso .np-intro{font-size:13px;color:#475569;margin:-8px 0 14px;line-height:1.5}'
      + '.np-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}'
      + '.np-tab{padding:9px 16px;border-radius:999px;border:2px solid #cbd5e1;background:#fff;font:700 13px Inter,system-ui,sans-serif;color:#334155;cursor:pointer}'
      + '.np-tab[aria-pressed="true"]{background:#0f766e;border-color:#0f766e;color:#fff}'
      + '.np-tab:focus-visible,.np-th:focus-visible,.np-cell:focus-visible{outline:3px solid #f59e0b;outline-offset:1px}'
      + '.np-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}'
      + '.np-bar select{padding:7px 10px;border:2px solid #e2e8f0;border-radius:10px;font:600 12px Inter,system-ui,sans-serif;background:#f9fafb;max-width:100%}'
      + '.np-opts{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:#334155;margin-bottom:10px}'
      + '.np-opts label{display:inline-flex;gap:6px;align-items:center;cursor:pointer}'
      + '.np-status{font-size:12px;font-weight:700;color:#0f766e;margin-left:auto}'
      + '.np-status.err{color:#b91c1c}.np-status.busy{color:#b45309}'
      + '.np-help{font-size:12px;color:#64748b;margin:0 0 10px;line-height:1.5}'
      + '.np-scroll{overflow:auto;max-height:calc(100vh - 300px);min-height:220px;background:#fff;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,.04);border:1px solid #e2e8f0}'
      + '.np-table{border-collapse:separate;border-spacing:0;min-width:100%;font-size:13px}'
      + '.np-table th,.np-table td{border-bottom:1px solid #e2e8f0;border-right:1px solid #f1f5f9;padding:4px 6px;text-align:center;background:#fff}'
      + '.np-table thead th{position:sticky;top:0;z-index:3;background:#f8fafc;font-size:11px;font-weight:800;color:#475569;vertical-align:bottom;padding:8px 6px}'
      + '.np-table tfoot td{position:sticky;bottom:0;z-index:2;background:#f8fafc;font-weight:800;color:#334155}'
      + '.np-table .np-name{position:sticky;left:0;z-index:2;text-align:left;min-width:220px;max-width:280px;font-weight:600;color:#0f172a;padding:6px 10px;border-right:2px solid #e2e8f0}'
      + '.np-table thead .np-name,.np-table tfoot .np-name{z-index:4;background:#f8fafc}'
      + '.np-num{display:inline-block;min-width:22px;color:#94a3b8;font-weight:700;font-size:11px}'
      + '.np-th{display:block;width:100%;min-width:92px;max-width:150px;border:0;background:transparent;font:800 11px Inter,system-ui,sans-serif;color:#1e293b;cursor:pointer;padding:4px;border-radius:8px;line-height:1.3;white-space:normal}'
      + '.np-th:hover{background:#e2e8f0}.np-th small{display:block;font-weight:600;color:#64748b;margin-top:2px}'
      + '.np-arch{opacity:.55}.np-arch .np-th{text-decoration:line-through}'
      + '.np-cell{width:58px;height:34px;border:1px solid #cbd5e1;border-radius:8px;text-align:center;font:700 14px Inter,system-ui,sans-serif;color:#1d4ed8;background:#fff;transition:background .4s,border-color .2s}'
      + '.np-cell.rojo{color:#b91c1c}.np-cell:disabled{background:#f1f5f9;color:#94a3b8}'
      + '.np-cell.saving{border-color:#f59e0b;background:#fffbeb}'
      + '.np-cell.saved{border-color:#16a34a;background:#dcfce7}'
      + '.np-cell.error{border-color:#dc2626;background:#fee2e2}'
      + '.np-prom{font-weight:800;font-size:14px;color:#1d4ed8;min-width:90px;background:#f0fdfa!important}'
      + '.np-prom.rojo{color:#b91c1c}.np-prom small{display:block;font-size:10px;font-weight:600;color:#64748b}'
      + '.np-empty{padding:28px 18px;text-align:center;color:#475569;font-size:14px;line-height:1.6}'
      + '.np-empty .btn{margin:6px 4px 0}'
      + '.np-hist{margin-top:14px;background:#fff;border-radius:14px;border:1px solid #e2e8f0;padding:10px 14px}'
      + '.np-hist summary{cursor:pointer;font-weight:800;font-size:13px;color:#334155}'
      + '.np-hist ul{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:6px}'
      + '.np-hist li{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap;font-size:12px;color:#334155;border-bottom:1px solid #f1f5f9;padding-bottom:6px}'
      + '.np-courses{display:flex;gap:14px;flex-wrap:wrap;font-size:13px}'
      + '.np-courses label{display:inline-flex;gap:6px;align-items:center;text-transform:none;letter-spacing:0;font-size:13px;margin:0}'
      + '.form-group .np-courses input{width:auto;padding:0}'
      + '.np-print-title{display:none}'
      + '#npStats{grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:14px}'
      + '#npStats .stat-card{padding:10px 14px}#npStats .stat-card .value{font-size:20px;margin-top:2px}'
      + '@media(max-width:768px){.np-table .np-name{min-width:150px;max-width:170px;font-size:12px}.np-scroll{max-height:68vh}.np-status{margin-left:0;width:100%}'
      + '#npStats{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#npStats .stat-card{padding:8px 10px}#npStats .stat-card .label{font-size:9px}#npStats .stat-card .value{font-size:17px}'
      + '.np-tab{padding:7px 12px;font-size:12px}}'
      + '@media print{.header,.sidebar,.mobile-nav,.np-tabs,.np-bar,.np-opts,.np-help,.np-hist,#sec-notasproceso h2,#sec-notasproceso .np-intro,.stat-row{display:none!important}'
      + '.content{padding:0!important;overflow:visible!important}.np-scroll{max-height:none;overflow:visible;box-shadow:none;border:0}'
      + '.np-print-title{display:block;font:800 15px Inter,system-ui,sans-serif;margin-bottom:8px}'
      + '.np-table th,.np-table td{position:static!important}.np-cell{border:0;width:auto;height:auto;background:transparent!important}}';
    var el = document.createElement('style');
    el.id = 'npStyles';
    el.textContent = css;
    document.head.appendChild(el);
  }

  /* ---------- modal de tarea ---------- */
  function mountModal() {
    var wrap = document.createElement('div');
    wrap.className = 'modal-overlay';
    wrap.id = 'modal-npTask';
    wrap.innerHTML = ''
      + '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="npTaskTitle">'
      + '<h3 id="npTaskTitle">Nueva tarea</h3>'
      + '<div class="form-group"><label for="npTaskName">Nombre de la tarea</label><input id="npTaskName" maxlength="80" placeholder="Ej: Libreto en Canva"></div>'
      + '<div class="form-group"><label for="npTaskDate">Fecha (opcional)</label><input id="npTaskDate" type="date"></div>'
      + '<div class="form-group" id="npTaskCoursesBox"><label>Agregar en</label><div class="np-courses" id="npTaskCourses"></div></div>'
      + '<div class="btn-row" id="npTaskEditActions" style="margin:4px 0 0">'
      + '<button class="btn btn-secondary btn-sm" type="button" data-np="move-left">← Mover a la izquierda</button>'
      + '<button class="btn btn-secondary btn-sm" type="button" data-np="move-right">Mover a la derecha →</button>'
      + '<button class="btn btn-warn btn-sm" type="button" data-np="archive">Archivar tarea</button>'
      + '</div>'
      + '<p class="hint" id="npTaskHint"></p>'
      + '<div class="modal-actions">'
      + '<button class="btn btn-secondary" type="button" data-np="cancel">Cancelar</button>'
      + '<button class="btn btn-primary" type="button" data-np="save-task">Guardar</button>'
      + '</div></div>';
    document.body.appendChild(wrap);
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap) { closeModal('npTask'); return; }
      var b = e.target.closest('[data-np]');
      if (!b) return;
      var a = b.getAttribute('data-np');
      if (a === 'cancel') closeModal('npTask');
      else if (a === 'save-task') saveTask();
      else if (a === 'move-left') moveTask(-1);
      else if (a === 'move-right') moveTask(1);
      else if (a === 'archive') toggleArchive();
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal('npTask');
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox') { e.preventDefault(); saveTask(); }
    });
  }

  function openTaskModal(tid) {
    var t = tid ? (cursoData().tareas || {})[tid] : null;
    st.editingTask = t ? tid : null;
    document.getElementById('npTaskTitle').textContent = t ? 'Editar tarea · ' + cursoLabel(st.curso) : 'Nueva tarea';
    document.getElementById('npTaskName').value = t ? (t.titulo || '') : '';
    document.getElementById('npTaskDate').value = t ? (t.fecha || '') : '';
    document.getElementById('npTaskCoursesBox').classList.toggle('hidden', !!t);
    document.getElementById('npTaskEditActions').classList.toggle('hidden', !t);
    document.getElementById('npTaskCourses').innerHTML = CURSOS.map(function (c) {
      return '<label><input type="checkbox" value="' + c.id + '" checked> ' + esc(c.label) + '</label>';
    }).join('');
    if (t) {
      document.querySelector('#npTaskEditActions [data-np="archive"]').textContent = t.archivada ? 'Restaurar tarea' : 'Archivar tarea';
      document.getElementById('npTaskHint').textContent = t.archivada
        ? 'Esta tarea está archivada: no se muestra ni cuenta en el promedio. Sus notas se conservan.'
        : 'Archivar oculta la columna y la saca del promedio. Las notas se conservan y la tarea se puede restaurar.';
    } else {
      document.getElementById('npTaskHint').textContent = 'La misma tarea queda en los cursos marcados. Cada curso registra sus propias notas.';
    }
    openModal('npTask');
    setTimeout(function () { document.getElementById('npTaskName').focus(); }, 30);
  }

  function maxOrden(c) {
    return tareasDe(c, true).reduce(function (m, t) { return Math.max(m, Number(t.orden) || 0); }, 0);
  }

  async function saveTask() {
    var titulo = document.getElementById('npTaskName').value.trim().replace(/\s+/g, ' ');
    var fecha = document.getElementById('npTaskDate').value || '';
    if (!titulo) { toast('Escriba el nombre de la tarea', 'err'); return; }
    if (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) { toast('Fecha no válida', 'err'); return; }
    var updates = {};
    if (st.editingTask) {
      var base = 'cursos/' + st.curso + '/tareas/' + st.editingTask + '/';
      updates[base + 'titulo'] = titulo;
      updates[base + 'fecha'] = fecha;
      updates[base + 'actualizada'] = TS;
    } else {
      var cursos = Array.prototype.slice.call(document.querySelectorAll('#npTaskCourses input:checked')).map(function (i) { return i.value; });
      if (!cursos.length) { toast('Marque al menos un curso', 'err'); return; }
      var tid = newTaskId();
      cursos.forEach(function (c) {
        updates['cursos/' + c + '/tareas/' + tid] = { titulo: titulo, fecha: fecha, orden: maxOrden(c) + 1, archivada: false, creada: TS, actualizada: TS };
      });
    }
    try {
      setStatus('Guardando…', 'busy');
      await db.ref(ROOT).update(updates);
      closeModal('npTask');
      setStatus('Cambios guardados', '');
      toast(st.editingTask ? 'Tarea actualizada' : 'Tarea agregada', 'ok');
    } catch (e) {
      console.error('[notas-proceso/tarea]', e);
      setStatus('No se pudo guardar la tarea', 'err');
      toast('No se pudo guardar: ' + (e.message || e), 'err');
    }
  }

  async function moveTask(dir) {
    var list = tareasDe(st.curso, true);
    var i = list.findIndex(function (t) { return t.id === st.editingTask; });
    var j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) { toast(dir < 0 ? 'Ya es la primera columna' : 'Ya es la última columna', 'err'); return; }
    var u = {};
    // Reasigna 1..n para que el orden quede limpio aunque haya empates.
    var ordered = list.slice();
    var tmp = ordered[i]; ordered[i] = ordered[j]; ordered[j] = tmp;
    ordered.forEach(function (t, k) { u['cursos/' + st.curso + '/tareas/' + t.id + '/orden'] = k + 1; });
    try { await db.ref(ROOT).update(u); toast('Columna movida', 'ok'); }
    catch (e) { toast('No se pudo mover: ' + (e.message || e), 'err'); }
  }

  async function toggleArchive() {
    var tid = st.editingTask, t = (cursoData().tareas || {})[tid];
    if (!t) return;
    var base = 'cursos/' + st.curso + '/tareas/' + tid + '/', u = {};
    u[base + 'archivada'] = !t.archivada;
    u[base + 'actualizada'] = TS;
    try {
      await db.ref(ROOT).update(u);
      closeModal('npTask');
      toast(t.archivada ? 'Tarea restaurada' : 'Tarea archivada. Se recupera con «Mostrar tareas archivadas».', 'ok');
    } catch (e) { toast('No se pudo cambiar: ' + (e.message || e), 'err'); }
  }

  async function addSuggested() {
    var updates = {}, agregadas = 0, idBase = Date.now().toString(36);
    SUGERIDAS.forEach(function (s, k) {
      var tid = 't' + idBase + 's' + k;
      CURSOS.forEach(function (c) {
        var existe = tareasDe(c.id, true).some(function (t) { return norm(t.titulo) === norm(s.titulo); });
        if (existe) return;
        updates['cursos/' + c.id + '/tareas/' + tid] = { titulo: s.titulo, fecha: s.fecha, orden: maxOrden(c.id) + k + 1, archivada: false, creada: TS, actualizada: TS };
        agregadas++;
      });
    });
    if (!agregadas) { toast('Esas tareas ya están en los tres cursos', 'ok'); return; }
    try { await db.ref(ROOT).update(updates); toast('Tareas del proyecto audiovisual agregadas', 'ok'); }
    catch (e) { toast('No se pudieron agregar: ' + (e.message || e), 'err'); }
  }

  /* ---------- guardado de notas ---------- */
  function cellKey(uid, tid) { return uid + '|' + tid; }
  function findCell(uid, tid) {
    return document.querySelector('.np-cell[data-u="' + CSS.escape(uid) + '"][data-t="' + CSS.escape(tid) + '"]');
  }
  function markCell(uid, tid, cls) {
    var el = findCell(uid, tid);
    if (!el) return;
    el.classList.remove('saving', 'saved', 'error');
    if (cls) el.classList.add(cls);
    if (cls === 'saved') setTimeout(function () { el.classList.remove('saved'); }, 1400);
  }

  async function saveCells(changes) {
    var curso = st.curso, updates = {}, real = [];
    changes.forEach(function (ch) {
      var prev = notaDe(ch.uid, ch.tid, curso);
      if (prev === ch.value) return;
      var k = cellKey(ch.uid, ch.tid);
      if (Object.prototype.hasOwnProperty.call(st.pending, k) && st.pending[k] === ch.value) return;
      real.push(ch);
      st.pending[k] = ch.value;
      updates['cursos/' + curso + '/notas/' + ch.uid + '/' + ch.tid] = ch.value == null ? null : { n: ch.value, ts: TS, por: currentUser.uid };
      var hk = db.ref(ROOT + '/historial/' + curso).push().key;
      updates['historial/' + curso + '/' + hk] = { uid: ch.uid, tarea: ch.tid, antes: prev, despues: ch.value, ts: TS, por: currentUser.uid };
    });
    if (!real.length) return true;
    real.forEach(function (ch) { markCell(ch.uid, ch.tid, 'saving'); });
    setStatus('Guardando…', 'busy');
    try {
      await db.ref(ROOT).update(updates);
      // Relectura desde el servidor antes de dar por guardado.
      var reads = await Promise.all(real.map(function (ch) {
        return db.ref(ROOT + '/cursos/' + curso + '/notas/' + ch.uid + '/' + ch.tid).get();
      }));
      var malas = 0;
      real.forEach(function (ch, i) {
        var v = reads[i].val(), got = v && isFinite(Number(v.n)) ? Number(v.n) : null;
        delete st.pending[cellKey(ch.uid, ch.tid)];
        if (got === ch.value) markCell(ch.uid, ch.tid, 'saved');
        else { malas++; markCell(ch.uid, ch.tid, 'error'); }
      });
      if (malas) { setStatus('Hay ' + malas + ' nota(s) sin confirmar. Revise y vuelva a escribirlas.', 'err'); return false; }
      setStatus('Cambios guardados · ' + new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }), '');
      syncValues();
      return true;
    } catch (e) {
      console.error('[notas-proceso/guardar]', e);
      real.forEach(function (ch) { delete st.pending[cellKey(ch.uid, ch.tid)]; });
      syncValues(); // la celda vuelve a mostrar lo que hay guardado
      real.forEach(function (ch) { markCell(ch.uid, ch.tid, 'error'); });
      setStatus('No se pudo guardar. La celda en rojo muestra lo que sigue guardado; vuelva a escribir la nota.', 'err');
      toast('No se pudo guardar: ' + (e.message || e), 'err');
      return false;
    }
  }

  function commitCell(input) {
    var uid = input.getAttribute('data-u'), tid = input.getAttribute('data-t');
    var v = parseNota(input.value);
    if (v === undefined) {
      toast('Escriba una nota entre 1,0 y 7,0 (o deje la celda vacía)', 'err');
      input.value = fmt(notaDe(uid, tid));
      paintCell(input);
      markCell(uid, tid, 'error');
      return;
    }
    input.value = fmt(v);
    paintCell(input);
    saveCells([{ uid: uid, tid: tid, value: v }]);
  }

  function paintCell(input) {
    var v = parseNota(input.value);
    input.classList.toggle('rojo', typeof v === 'number' && v < 4);
  }

  /* ---------- render ---------- */
  function setStatus(text, kind) {
    var el = document.getElementById('npStatus');
    if (!el) return;
    el.textContent = text;
    el.className = 'np-status' + (kind ? ' ' + kind : '');
  }

  function shell() {
    var root = document.getElementById('npRoot');
    if (!root || st.mounted) return;
    st.mounted = true;
    root.innerHTML = ''
      + '<div class="np-tabs" role="group" aria-label="Curso" id="npTabs"></div>'
      + '<div class="stat-row" id="npStats"></div>'
      + '<div class="np-bar">'
      + '<button class="btn btn-primary btn-sm" type="button" data-np="add-task">+ Tarea</button>'
      + '<label class="muted" for="npLirmiCol" style="font-weight:700">Columna para Lirmi</label>'
      + '<select id="npLirmiCol"></select>'
      + '<button class="btn btn-secondary btn-sm" type="button" data-np="csv-lirmi">📥 CSV para Lirmi</button>'
      + '<button class="btn btn-secondary btn-sm" type="button" data-np="csv-full">📥 CSV completo</button>'
      + '<button class="btn btn-secondary btn-sm" type="button" data-np="print">🖨 Imprimir</button>'
      + '<span class="np-status" id="npStatus" role="status" aria-live="polite">Cargando…</span>'
      + '</div>'
      + '<div class="np-opts">'
      + '<label><input type="checkbox" id="npShowArch"> Mostrar tareas archivadas</label>'
      + '<label><input type="checkbox" id="npBlankOne"> Contar tareas sin nota como 1,0 en el promedio</label>'
      + '</div>'
      + '<p class="np-help">Escriba la nota y presione Enter: baja a la siguiente fila. «55» se guarda como 5,5. Celda vacía = sin nota. Puede pegar una columna copiada desde Excel o Lirmi. Para cambiar el nombre o la fecha de una tarea, haga clic en su encabezado.</p>'
      + '<div class="np-print-title" id="npPrintTitle"></div>'
      + '<div class="np-scroll" id="npScroll"></div>'
      + '<details class="np-hist" id="npHist"><summary>Últimos cambios del curso</summary><ul id="npHistList"></ul></details>';

    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-np]');
      if (!b) return;
      var a = b.getAttribute('data-np');
      if (a === 'add-task') openTaskModal(null);
      else if (a === 'edit-task') openTaskModal(b.getAttribute('data-t'));
      else if (a === 'suggested') addSuggested();
      else if (a === 'csv-lirmi') exportLirmi();
      else if (a === 'csv-full') exportFull();
      else if (a === 'print') printSheet();
      else if (a === 'curso') selectCurso(b.getAttribute('data-c'));
      else if (a === 'undo') undoHist(b.getAttribute('data-h'));
    });
    document.getElementById('npShowArch').addEventListener('change', function (e) { st.showArchived = e.target.checked; st.sig = ''; render(); });
    document.getElementById('npBlankOne').addEventListener('change', function (e) { st.blankAsOne = e.target.checked; savePrefs(); syncValues(); });
    document.getElementById('npLirmiCol').addEventListener('change', function (e) { st.lirmiCol = e.target.value; });

    var scroll = document.getElementById('npScroll');
    // Seleccionar al entrar, sin esperar: así la primera tecla reemplaza la nota.
    // El mouseup del mismo clic no debe deshacer la selección.
    scroll.addEventListener('focusin', function (e) {
      if (!e.target.classList.contains('np-cell')) return;
      e.target.select();
      e.target.__npJustFocused = true;
    });
    scroll.addEventListener('mouseup', function (e) {
      if (e.target.__npJustFocused) { e.preventDefault(); e.target.__npJustFocused = false; }
    });
    scroll.addEventListener('keydown', function (e) { if (e.target.__npJustFocused) e.target.__npJustFocused = false; }, true);
    scroll.addEventListener('change', function (e) { if (e.target.classList.contains('np-cell')) commitCell(e.target); });
    scroll.addEventListener('input', function (e) { if (e.target.classList.contains('np-cell')) { e.target.classList.remove('error'); paintCell(e.target); } });
    scroll.addEventListener('keydown', onCellKey);
    scroll.addEventListener('paste', onPaste);
  }

  function moveFocus(input, dRow, dCol) {
    var cells = Array.prototype.slice.call(document.querySelectorAll('#npScroll .np-cell:not(:disabled)'));
    var r = Number(input.getAttribute('data-r')), c = Number(input.getAttribute('data-c'));
    var target = cells.find(function (x) { return Number(x.getAttribute('data-r')) === r + dRow && Number(x.getAttribute('data-c')) === c + dCol; });
    if (target) target.focus();
  }

  function onCellKey(e) {
    var input = e.target;
    if (!input.classList || !input.classList.contains('np-cell')) return;
    var all = input.selectionStart === 0 && input.selectionEnd === input.value.length;
    if (e.key === 'Enter') { e.preventDefault(); commitCell(input); moveFocus(input, e.shiftKey ? -1 : 1, 0); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); commitCell(input); moveFocus(input, 1, 0); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); commitCell(input); moveFocus(input, -1, 0); }
    else if (e.key === 'ArrowRight' && (all || input.selectionStart === input.value.length)) { e.preventDefault(); commitCell(input); moveFocus(input, 0, 1); }
    else if (e.key === 'ArrowLeft' && (all || input.selectionEnd === 0)) { e.preventDefault(); commitCell(input); moveFocus(input, 0, -1); }
    else if (e.key === 'Escape') {
      input.value = fmt(notaDe(input.getAttribute('data-u'), input.getAttribute('data-t')));
      paintCell(input); input.select();
    }
  }

  function onPaste(e) {
    var input = e.target;
    if (!input.classList || !input.classList.contains('np-cell')) return;
    var text = (e.clipboardData || window.clipboardData).getData('text') || '';
    text = text.replace(/\r/g, '').replace(/\n+$/, '');
    if (text.indexOf('\n') === -1 && text.indexOf('\t') === -1) return; // un solo valor: pegado normal
    e.preventDefault();
    var rows = text.split('\n').map(function (l) { return l.split('\t'); });
    var r0 = Number(input.getAttribute('data-r')), c0 = Number(input.getAttribute('data-c'));
    var changes = [], malas = 0, fuera = 0;
    rows.forEach(function (cols, i) {
      cols.forEach(function (raw, j) {
        var cell = document.querySelector('#npScroll .np-cell[data-r="' + (r0 + i) + '"][data-c="' + (c0 + j) + '"]');
        if (!cell || cell.disabled) { fuera++; return; }
        var v = parseNota(raw);
        if (v === undefined) { malas++; return; }
        changes.push({ uid: cell.getAttribute('data-u'), tid: cell.getAttribute('data-t'), value: v, el: cell });
      });
    });
    if (malas) { toast('No se pegó nada: hay ' + malas + ' valor(es) que no son notas entre 1,0 y 7,0', 'err'); return; }
    changes.forEach(function (ch) { ch.el.value = fmt(ch.value); paintCell(ch.el); });
    saveCells(changes).then(function (ok) {
      var notas = changes.filter(function (ch) { return ch.value != null; }).length, vacias = changes.length - notas;
      if (ok) toast('Se pegaron ' + notas + ' nota(s)' + (vacias ? ' y ' + vacias + ' celda(s) vacía(s)' : '') + (fuera ? ' · ' + fuera + ' quedaron fuera de la planilla' : ''), 'ok');
    });
  }

  function renderTabs() {
    document.getElementById('npTabs').innerHTML = CURSOS.map(function (c) {
      return '<button class="np-tab" type="button" data-np="curso" data-c="' + c.id + '" aria-pressed="' + (c.id === st.curso) + '">' + esc(c.label) + '</button>';
    }).join('');
  }

  function renderLirmiSelect() {
    var sel = document.getElementById('npLirmiCol');
    var ts = tareasActivas();
    if (st.lirmiCol !== 'promedio' && !ts.some(function (t) { return t.id === st.lirmiCol; })) st.lirmiCol = 'promedio';
    sel.innerHTML = '<option value="promedio">Promedio</option>' + ts.map(function (t) {
      return '<option value="' + esc(t.id) + '">' + esc(t.titulo) + '</option>';
    }).join('');
    sel.value = st.lirmiCol;
  }

  function signature() {
    return [st.curso, st.showArchived, roster().map(function (s) { return s.uid + ':' + (s.nombre || ''); }).join(','),
      tareasVisibles().map(function (t) { return t.id + ':' + t.titulo + ':' + (t.fecha || '') + ':' + (t.archivada ? 1 : 0); }).join(',')].join('#');
  }

  function render() {
    if (!st.mounted) return;
    renderTabs();
    document.getElementById('npShowArch').checked = st.showArchived;
    document.getElementById('npBlankOne').checked = st.blankAsOne;
    document.getElementById('npPrintTitle').textContent = 'Notas de proceso · ' + cursoLabel(st.curso) + ' · ' + new Date().toLocaleDateString('es-CL');
    if (st.loadError) { document.getElementById('npScroll').innerHTML = '<div class="np-empty">' + esc(st.loadError) + '</div>'; setStatus('Sin conexión con las notas', 'err'); return; }
    if (!st.all) { document.getElementById('npScroll').innerHTML = '<div class="np-empty">Cargando notas…</div>'; return; }
    var sig = signature();
    if (sig !== st.sig) { st.sig = sig; renderGrid(); }
    else syncValues();
  }

  function renderGrid() {
    var scroll = document.getElementById('npScroll');
    var active = document.activeElement, keep = null;
    if (active && active.classList && active.classList.contains('np-cell')) keep = { u: active.getAttribute('data-u'), t: active.getAttribute('data-t'), v: active.value };
    renderLirmiSelect();
    var pupils = roster(), ts = tareasVisibles();
    if (!pupils.length && !Object.keys(studentsMap || {}).length) {
      scroll.innerHTML = '<div class="np-empty">Cargando la nómina de estudiantes…</div>';
      st.sig = ''; renderStats(); return;
    }
    if (!pupils.length) {
      scroll.innerHTML = '<div class="np-empty">No hay estudiantes activos en ' + esc(cursoLabel(st.curso)) + '. Revise la nómina en «Estudiantes».</div>';
      renderStats(); return;
    }
    if (!tareasDe(st.curso, true).length) {
      scroll.innerHTML = '<div class="np-empty"><strong>' + esc(cursoLabel(st.curso)) + '</strong> todavía no tiene tareas.<br>'
        + '<button class="btn btn-primary" type="button" data-np="add-task">+ Agregar una tarea</button>'
        + '<button class="btn btn-secondary" type="button" data-np="suggested">Agregar las 4 tareas del proyecto audiovisual (6, 13, 20 y 27 de noviembre) a 3.º A, B y D</button></div>';
      renderStats(); return;
    }
    var head = '<tr><th class="np-name" scope="col">Estudiante</th>' + ts.map(function (t) {
      var f = fmtFecha(t.fecha);
      return '<th scope="col" class="' + (t.archivada ? 'np-arch' : '') + '"><button class="np-th" type="button" data-np="edit-task" data-t="' + esc(t.id) + '" title="Editar, mover o archivar">'
        + esc(t.titulo) + (f || t.archivada ? '<small>' + (f ? esc(f) : '') + (t.archivada ? (f ? ' · ' : '') + 'archivada' : '') + '</small>' : '') + '</button></th>';
    }).join('') + '<th scope="col" class="np-prom">Promedio</th></tr>';
    var body = pupils.map(function (s, r) {
      var cells = ts.map(function (t, c) {
        var v = notaDe(s.uid, t.id);
        return '<td class="' + (t.archivada ? 'np-arch' : '') + '"><input class="np-cell' + (v != null && v < 4 ? ' rojo' : '') + '" type="text" inputmode="decimal" autocomplete="off" maxlength="4"'
          + ' data-u="' + esc(s.uid) + '" data-t="' + esc(t.id) + '" data-r="' + r + '" data-c="' + c + '" value="' + fmt(v) + '"'
          + (t.archivada ? ' disabled' : '') + ' aria-label="Nota de ' + esc(s.nombre || 'estudiante') + ' en ' + esc(t.titulo) + '"></td>';
      }).join('');
      return '<tr><th class="np-name" scope="row"><span class="np-num">' + (r + 1) + '</span> ' + esc(s.nombre || '—') + '</th>' + cells
        + '<td class="np-prom" data-prom="' + esc(s.uid) + '"></td></tr>';
    }).join('');
    var foot = '<tr><td class="np-name">Promedio del curso</td>' + ts.map(function (t) {
      return '<td data-tavg="' + esc(t.id) + '"></td>';
    }).join('') + '<td class="np-prom" data-tavg="__prom"></td></tr>';
    scroll.innerHTML = '<table class="np-table"><thead>' + head + '</thead><tbody>' + body + '</tbody><tfoot>' + foot + '</tfoot></table>';
    syncValues();
    if (keep) {
      var el = findCell(keep.u, keep.t);
      if (el) { el.value = keep.v; paintCell(el); el.focus(); }
    }
  }

  // Actualiza valores, promedios y totales sin redibujar (no interrumpe la escritura).
  function syncValues() {
    if (!st.mounted || !st.all) return;
    var active = document.activeElement;
    document.querySelectorAll('#npScroll .np-cell').forEach(function (el) {
      var uid = el.getAttribute('data-u'), tid = el.getAttribute('data-t');
      if (el === active || Object.prototype.hasOwnProperty.call(st.pending, cellKey(uid, tid))) return;
      var val = fmt(notaDe(uid, tid));
      if (el.value !== val) { el.value = val; paintCell(el); }
    });
    var pupils = roster();
    pupils.forEach(function (s) {
      var td = document.querySelector('#npScroll [data-prom="' + CSS.escape(s.uid) + '"]');
      if (!td) return;
      var p = promedio(s.uid);
      td.classList.toggle('rojo', p.valor != null && p.valor < 4);
      td.innerHTML = (p.valor == null ? '—' : fmt(p.valor)) + '<small>' + p.con + ' de ' + p.total + '</small>';
    });
    tareasVisibles().forEach(function (t) {
      var td = document.querySelector('#npScroll [data-tavg="' + CSS.escape(t.id) + '"]');
      if (!td) return;
      var sum = 0, n = 0;
      pupils.forEach(function (s) { var v = notaDe(s.uid, t.id); if (v != null) { sum += v; n++; } });
      td.textContent = n ? fmt(round1(sum / n)) : '—';
    });
    var tdp = document.querySelector('#npScroll [data-tavg="__prom"]');
    if (tdp) {
      var ps = pupils.map(function (s) { return promedio(s.uid).valor; }).filter(function (v) { return v != null; });
      tdp.textContent = ps.length ? fmt(round1(ps.reduce(function (a, b) { return a + b; }, 0) / ps.length)) : '—';
    }
    renderStats();
  }

  function renderStats() {
    var pupils = roster(), ts = tareasActivas(), reg = 0, bajo = 0, sum = 0, n = 0;
    pupils.forEach(function (s) {
      ts.forEach(function (t) { if (notaDe(s.uid, t.id) != null) reg++; });
      var p = promedio(s.uid).valor;
      if (p != null) { sum += p; n++; if (p < 4) bajo++; }
    });
    var card = function (l, v) { return '<div class="stat-card"><div class="label">' + l + '</div><div class="value">' + v + '</div></div>'; };
    document.getElementById('npStats').innerHTML = card('Estudiantes', pupils.length) + card('Tareas', ts.length)
      + card('Notas registradas', reg + ' / ' + pupils.length * ts.length) + card('Promedio del curso', n ? fmt(round1(sum / n)) : '—')
      + card('Promedio bajo 4,0', bajo);
  }

  /* ---------- historial ---------- */
  function attachHistory() {
    if (st.histRef) st.histRef.off();
    st.hist = [];
    renderHistory();
    st.histRef = db.ref(ROOT + '/historial/' + st.curso).limitToLast(15);
    st.histRef.on('value', function (snap) {
      var v = snap.val() || {};
      st.hist = Object.keys(v).map(function (k) { return Object.assign({ id: k }, v[k]); }).reverse();
      renderHistory();
    }, function (err) { console.error('[notas-proceso/historial]', err); });
  }
  function renderHistory() {
    var ul = document.getElementById('npHistList');
    if (!ul) return;
    var tareas = cursoData().tareas || {};
    if (!st.hist.length) { ul.innerHTML = '<li class="muted">Sin cambios registrados en este curso.</li>'; return; }
    ul.innerHTML = st.hist.map(function (h) {
      var s = (studentsMap || {})[h.uid] || {}, t = tareas[h.tarea] || {};
      var hora = h.ts ? new Date(h.ts).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
      var antes = h.antes == null ? 'vacía' : fmt(h.antes), despues = h.despues == null ? 'vacía' : fmt(h.despues);
      return '<li><span>' + esc(hora) + ' · <strong>' + esc(s.nombre || 'Estudiante') + '</strong> · ' + esc(t.titulo || 'Tarea') + ': ' + esc(antes) + ' → ' + esc(despues) + '</span>'
        + '<button class="btn btn-secondary btn-sm" type="button" data-np="undo" data-h="' + esc(h.id) + '">Volver a ' + esc(antes) + '</button></li>';
    }).join('');
  }
  function undoHist(hid) {
    var h = st.hist.find(function (x) { return x.id === hid; });
    if (!h) return;
    var t = (cursoData().tareas || {})[h.tarea];
    if (!t || t.archivada) { toast('La tarea está archivada: restáurela primero', 'err'); return; }
    var antes = h.antes == null ? null : Number(h.antes);
    saveCells([{ uid: h.uid, tid: h.tarea, value: antes }]).then(function (ok) {
      if (ok) { var el = findCell(h.uid, h.tarea); if (el) { el.value = fmt(antes); paintCell(el); } toast('Nota restaurada', 'ok'); }
    });
  }

  /* ---------- exportar e imprimir ---------- */
  function csvCell(v) {
    var s = String(v == null ? '' : v);
    if (/^[=+\-@]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }
  function download(name, rows) {
    var csv = '﻿' + rows.map(function (r) { return r.map(csvCell).join(';'); }).join('\r\n');
    var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }
  function exportLirmi() {
    var pupils = roster();
    if (!pupils.length) { toast('No hay estudiantes en este curso', 'err'); return; }
    var col = st.lirmiCol, t = (cursoData().tareas || {})[col];
    var rows = [['Estudiante', 'Nota']].concat(pupils.map(function (s) {
      var v = col === 'promedio' ? promedio(s.uid).valor : notaDe(s.uid, col);
      return [s.nombre || '', fmt(v)];
    }));
    var nombre = col === 'promedio' ? 'promedio' : norm(t ? t.titulo : col).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    download('notas-proceso_' + st.curso + '_' + nombre + '_' + hoy() + '.csv', rows);
    toast('CSV para Lirmi descargado', 'ok');
  }
  function exportFull() {
    var pupils = roster(), ts = tareasActivas();
    if (!pupils.length) { toast('No hay estudiantes en este curso', 'err'); return; }
    var head = ['N°', 'Estudiante', 'RUT'].concat(ts.map(function (t) { return t.titulo + (t.fecha ? ' (' + fmtFecha(t.fecha) + ')' : ''); }), ['Promedio', 'Tareas con nota']);
    var rows = [head].concat(pupils.map(function (s, i) {
      var p = promedio(s.uid);
      return [i + 1, s.nombre || '', s.rut || ''].concat(ts.map(function (t) { return fmt(notaDe(s.uid, t.id)); }), [fmt(p.valor), p.con + ' de ' + p.total]);
    }));
    download('notas-proceso_' + st.curso + '_completo_' + hoy() + '.csv', rows);
    toast('CSV completo descargado', 'ok');
  }
  function printSheet() { window.print(); }

  /* ---------- ciclo de vida ---------- */
  function listen() {
    if (st.listening) return;
    st.listening = true;
    db.ref(ROOT + '/cursos').on('value', function (snap) {
      st.all = snap.val() || {};
      st.loadError = '';
      if (!Object.keys(st.pending).length) setStatus('Conectado · los cambios se guardan solos', '');
      render();
    }, function (err) {
      console.error('[notas-proceso/lectura]', err);
      st.listening = false;
      st.loadError = 'No se pudieron leer las notas de proceso (' + (err && err.code ? err.code : 'error') + '). Recargue la página e inicie sesión de nuevo.';
      render();
    });
  }

  function selectCurso(c) {
    if (!CURSOS.some(function (x) { return x.id === c; }) || c === st.curso) return;
    st.curso = c; st.sig = ''; st.lirmiCol = 'promedio';
    savePrefs();
    attachHistory();
    render();
  }

  function open() {
    shell();
    listen();
    if (!st.histRef) attachHistory();
    render();
    try { if (location.hash !== '#notas-proceso') history.replaceState(null, '', '#notas-proceso'); } catch (ignore) {}
  }
  function leave() {
    try { if (location.hash === '#notas-proceso') history.replaceState(null, '', location.pathname + location.search); } catch (ignore) {}
  }
  // La nómina (studentsMap) cambió: redibuja si la planilla ya está abierta.
  function refresh() {
    if (st.mounted) { st.sig = ''; render(); }
  }
  // Primera carga del admin: el enlace /lecturas/adminprofe/#notas-proceso abre esta sección.
  function onDataLoaded() {
    refresh();
    if (st.hashHandled) return;
    st.hashHandled = true;
    if (location.hash === '#notas-proceso' && typeof showSection === 'function') {
      var link = document.querySelector('.sidebar a[data-section="notasproceso"]');
      showSection('notasproceso', link);
    }
  }

  window.addEventListener('beforeunload', function (e) {
    if (Object.keys(st.pending).length) { e.preventDefault(); e.returnValue = ''; }
  });

  loadPrefs();
  injectStyles();
  mountModal();

  window.NotasProceso = {
    open: open, leave: leave, refresh: refresh, onDataLoaded: onDataLoaded,
    // Expuesto para la auditoría local; no escribe datos.
    _test: { parseNota: parseNota, round1: round1, fmt: fmt }
  };
})();
