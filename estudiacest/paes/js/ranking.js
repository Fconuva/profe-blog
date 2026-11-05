(function () {
  'use strict';
  const host = document.getElementById('paesAcademicRanking');
  if (!host) return;
  const program = host.dataset.program;
  if (!['hc', 'tp'].includes(program)) return;
  host.innerHTML = `<div class="paes-ranking-heading"><div><p class="paes-ranking-kicker">Resultados de las guías</p><h2>Ranking PAES ${program.toUpperCase()}</h2></div></div><p class="paes-ranking-copy">Un solo ranking por el total acumulado de todas las guías de ${program.toUpperCase()}, separado del otro programa. Actualización automática cada minuto.</p><p id="rankingStatus" role="status" aria-live="polite">Comprobando tu sesión…</p><div id="rankingContent" hidden><div class="paes-ranking-scroll"><table><thead><tr><th scope="col">Puesto</th><th scope="col">Estudiante</th><th scope="col">Curso</th><th scope="col">Puntaje total</th><th scope="col">Logro</th><th scope="col">Guías</th></tr></thead><tbody id="rankingRows"></tbody></table></div><p id="rankingMine"></p><p id="rankingUpdated" class="paes-ranking-updated"></p></div><details><summary>¿Cómo se calcula?</summary><p>El ranking suma las respuestas correctas de todas las guías del programa. Una guía sin entregar aporta 0 puntos, así que entregar una sola guía no basta para ir primero: gana quien acumula más puntaje. Cada guía cuenta una vez y conserva el mejor reenvío confirmado. El logro es el puntaje sobre el total posible de las guías. Si el puntaje empata, queda antes quien completó más guías; los empates que continúan comparten puesto.</p><p>Se muestran los primeros diez puestos, incluidos sus empates. Se comparan actividades del mismo programa. Este puntaje corresponde a la práctica CEST.</p></details>`;
  const $ = id => document.getElementById(id);
  let user = null, generation = 0, controller, lastRefresh = 0;
  const clear = () => { $('rankingContent').hidden = true; $('rankingRows').replaceChildren(); $('rankingMine').textContent = ''; $('rankingUpdated').textContent = ''; };
  const percentage = n => Number(n).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';
  async function refresh() {
    if (!user || document.hidden) return;
    const id = ++generation, uid = user.uid, guide = 'all';
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
      $('rankingRows').replaceChildren();
      data.rows.forEach(row => {
        const tr = document.createElement('tr');
        if (row.isYou) tr.className = 'paes-ranking-you';
        for (const value of [row.position, row.nombre + (row.isYou ? ' · Tú' : ''), row.curso, row.score + ' de ' + row.possible, percentage(row.percentage), row.completed + ' de ' + data.totalGuides]) { const td = document.createElement('td'); td.textContent = String(value); tr.appendChild(td); }
        $('rankingRows').appendChild(tr);
      });
      $('rankingMine').textContent = data.mine ? `Tu puesto: ${data.mine.position} · ${data.mine.score} de ${data.mine.possible} puntos (${percentage(data.mine.percentage)}) · ${data.mine.completed} de ${data.totalGuides} guías entregadas.` : 'Tu puesto aparecerá al tener una entrega confirmada para este ranking.';
      $('rankingStatus').textContent = data.rows.length ? 'Mejores resultados · Total acumulado' : 'Todavía no hay entregas confirmadas para este ranking.';
      $('rankingUpdated').textContent = 'Última actualización: ' + new Date(data.updatedAt).toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit' });
      $('rankingContent').hidden = false; lastRefresh = Date.now();
    } catch (error) {
      if (id !== generation || error.name === 'AbortError') return;
      $('rankingStatus').textContent = error.message === 'Failed to fetch' ? 'No se pudo actualizar. Se reintentará al recuperar la conexión.' : error.message;
    }
  }
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
