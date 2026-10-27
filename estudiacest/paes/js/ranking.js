(function () {
  'use strict';
  const host = document.getElementById('paesAcademicRanking');
  if (!host) return;
  const program = host.dataset.program;
  if (!['hc', 'tp'].includes(program)) return;
  host.innerHTML = `<div class="paes-ranking-heading"><div><p class="paes-ranking-kicker">Resultados de las guías</p><h2>Ranking PAES ${program.toUpperCase()}</h2></div><label>Ver ranking<select id="rankingGuide"><option value="all">General · Promedio de logro</option></select></label></div><p class="paes-ranking-copy">Los mejores resultados de ${program.toUpperCase()}, separados del otro programa. Actualización automática cada minuto.</p><p id="rankingStatus" role="status" aria-live="polite">Comprobando tu sesión…</p><div id="rankingContent" hidden><div class="paes-ranking-scroll"><table><thead><tr><th scope="col">Puesto</th><th scope="col">Estudiante</th><th scope="col">Curso</th><th scope="col">Logro</th><th scope="col" id="rankingCountTitle">Guías</th></tr></thead><tbody id="rankingRows"></tbody></table></div><p id="rankingMine"></p><p id="rankingUpdated" class="paes-ranking-updated"></p></div><details><summary>¿Cómo se calcula?</summary><p>El ranking general promedia el porcentaje de aciertos de las guías entregadas. Cada guía cuenta una vez y conserva el mejor reenvío confirmado disponible. Las guías sin entregar no se cuentan. Se muestra cuántas completó cada estudiante; si el promedio empata, queda antes quien completó más. Los empates que continúan comparten puesto.</p><p>Al elegir una guía, ves sus mejores porcentajes. Se muestran los primeros diez puestos, incluidos sus empates. Se comparan actividades del mismo programa. Este porcentaje corresponde a la práctica CEST.</p></details>`;
  const $ = id => document.getElementById(id), select = $('rankingGuide');
  let user = null, generation = 0, controller, lastRefresh = 0;
  const clear = () => { $('rankingContent').hidden = true; $('rankingRows').replaceChildren(); $('rankingMine').textContent = ''; $('rankingUpdated').textContent = ''; };
  const percentage = n => Number(n).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';
  async function refresh() {
    if (!user || document.hidden) return;
    const id = ++generation, uid = user.uid, guide = select.value;
    controller?.abort(); controller = new AbortController();
    $('rankingStatus').textContent = 'Actualizando el ranking…';
    try {
      const token = await user.getIdToken();
      if (id !== generation) return;
      const response = await fetch('/api/paes?action=ranking&programa=' + program + '&guia=' + encodeURIComponent(guide), { cache: 'no-store', signal: controller.signal, headers: { Authorization: 'Bearer ' + token } });
      const data = await response.json();
      if (id !== generation || user?.uid !== uid) return;
      if (!response.ok) { if ([401, 403].includes(response.status)) clear(); throw Error(data.error || 'No se pudo actualizar el ranking.'); }
      if (data.program !== program || data.guide !== guide) throw Error('Vuelve a actualizar el ranking de tu programa.');
      if (select.options.length === 1) data.guides.forEach(guide => { const option = new Option(guide.label, guide.id); select.add(option); });
      $('rankingRows').replaceChildren();
      data.rows.forEach(row => {
        const tr = document.createElement('tr');
        if (row.isYou) tr.className = 'paes-ranking-you';
        for (const value of [row.position, row.nombre + (row.isYou ? ' · Tú' : ''), row.curso, percentage(row.percentage), row.completed]) { const td = document.createElement('td'); td.textContent = String(value); tr.appendChild(td); }
        $('rankingRows').appendChild(tr);
      });
      $('rankingMine').textContent = data.mine ? `Tu puesto: ${data.mine.position} · ${percentage(data.mine.percentage)} · ${data.mine.completed} ${guide === 'all' ? 'guía(s) entregada(s)' : 'guía entregada'}.` : 'Tu puesto aparecerá al tener una entrega confirmada para este ranking.';
      $('rankingCountTitle').textContent = guide === 'all' ? 'Guías' : 'Entregas';
      $('rankingStatus').textContent = data.rows.length ? `Mejores resultados · ${guide === 'all' ? 'General' : select.selectedOptions[0].textContent}` : 'Todavía no hay entregas confirmadas para este ranking.';
      $('rankingUpdated').textContent = 'Última actualización: ' + new Date(data.updatedAt).toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit' });
      $('rankingContent').hidden = false; lastRefresh = Date.now();
    } catch (error) {
      if (id !== generation || error.name === 'AbortError') return;
      $('rankingStatus').textContent = error.message === 'Failed to fetch' ? 'No se pudo actualizar. Se reintentará al recuperar la conexión.' : error.message;
    }
  }
  select.onchange = () => { clear(); refresh(); };
  setInterval(refresh, 60000);
  window.addEventListener('online', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - lastRefresh > 60000) refresh(); });
  (async () => {
    try {
      const { auth } = await PaesStudentSession.client();
      auth.onAuthStateChanged(value => {
        generation++; controller?.abort(); user = value; clear();
        if (user) refresh();
        else $('rankingStatus').textContent = program === 'tp' ? 'Ingresa con tu RUT en una de las actividades para ver el ranking de TP.' : 'Ingresa con tu RUT para ver el ranking de HC.';
      });
    } catch (_) { $('rankingStatus').textContent = 'No se pudo comprobar la sesión. Recarga para reintentar.'; }
  })();
})();
