(function () {
  'use strict';
  const $ = id => document.getElementById(id), e = NM2.esc;
  const GROUPS = [
    { title: 'Unidad 3 · Clases', keys: [1, 2, 3, 4, 5, 6, 7, 10, 11, 12].map(n => ['sesion-u3-' + n, 'Clase ' + n]) },
    { title: 'Unidad 4 · Miniensayos', keys: [1, 2, 3].map(n => ['sesion-u4-' + n, 'Miniensayo ' + n]) },
    { title: 'NM2', keys: [['nm2-1', 'Clase 1 · 18 de noviembre']] }
  ];
  const f = x => x == null ? '' : (Math.round(x * 10) / 10).toFixed(1).replace('.', ',');
  function cell(c) {
    if (c.na) return ['na', 'N/A', 'Clase anterior a tu llegada'];
    if (c.pendiente) return ['pend', c.nota == null ? 'P' : f(c.nota), c.nota == null ? 'Pendiente: no hay nada guardado' : 'Pendiente: el borrador quedó casi vacío'];
    if (c.nota == null) return ['sin', '—', 'Sin nota, no cuenta en el promedio'];
    return [c.nota < 4 ? 'low' : '', f(c.nota), ''];
  }
  function render(p) {
    const where = { 'sesion-u3': ' de la Unidad 3', 'sesion-u4': ' de la Unidad 4' };
    const pend = GROUPS.flatMap(g => g.keys).filter(([k]) => p.celdas[k].pendiente)
      .map(([k, label]) => k === 'nm2-1' ? 'Clase 1 de NM2 (18 de noviembre)' : label + (where[k.replace(/-\d+$/, '')] || ''));
    const blocks = GROUPS.map(g => `<section class="box"><h2>${e(g.title)}</h2><ul class="notas-unidad">${g.keys.map(([k, label]) => {
      const [cls, value, note] = cell(p.celdas[k]);
      return `<li class="${cls === 'pend' ? 'es-pend' : ''}"><span>${e(label)}${note ? `<small>${e(note)}</small>` : ''}</span><span class="nota ${cls}">${e(value)}</span></li>`;
    }).join('')}</ul></section>`).join('');
    const aviso = pend.length
      ? `<section class="box notas-aviso"><h2>Tienes ${pend.length} ${pend.length === 1 ? 'tarea pendiente' : 'tareas pendientes'}</h2><p>${pend.map(e).join(' · ')}</p><div class="actions"><a class="button primary" href="/estudiantes/dashboard.html?guias=simce">Ir a mis guías SIMCE (Unidades 3 y 4)</a>${p.celdas['nm2-1'].pendiente ? '<a class="button" href="clase.html?clase=1">Ir a la clase 1 de NM2</a>' : ''}</div></section>`
      : '<section class="box"><h2>No tienes tareas pendientes</h2><p>¡Bien hecho! Todas tus tareas tienen nota.</p></section>';
    $('planilla').innerHTML = `<div class="notas-resumen"><div class="box"><b>${f(p.promedioTareas) || '—'}</b><span>Promedio de tus tareas</span></div><div class="box"><b>${p.pendientes}</b><span>Tareas pendientes</span></div><div class="box final"><b>${f(p.promedioFinal) || '—'}</b><span>Promedio final${p.piso ? ' · sube a 6,0 por tener 5 pendientes o menos' : ''}</span></div></div>${aviso}<div class="notas-bloques">${blocks}</div>`;
    $('planilla').hidden = false;
  }
  async function session() {
    const user = NM2.user;
    $('loginButton').hidden = true;
    $('status').className = '';
    $('status').textContent = 'Cargando tus notas…';
    const r = await fetch('/api/estudiantes?action=planilla-semestre', { headers: { Authorization: 'Bearer ' + await user.getIdToken() } });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || 'No se pudieron cargar tus notas.');
    if (!data.planilla) {
      $('status').textContent = 'Esta planilla es para 2.º A y 2.º B HC. Si eres de esos cursos y no ves tus notas, escríbele a tu profesor.';
      return;
    }
    $('identity').textContent = (data.planilla.curso === '2A-HC' ? '2.º A HC' : '2.º B HC') + ' · Solo tú ves esta página.';
    $('status').textContent = '';
    render(data.planilla);
  }
  (async () => {
    try {
      $('loginButton').onclick = () => NM2.login(() => session().catch(fail));
      if (await NM2.restore()) await session();
    } catch (error) { fail(error); }
  })();
  function fail(error) { $('status').textContent = error.message; $('status').className = 'error'; $('loginButton').hidden = false; }
})();
