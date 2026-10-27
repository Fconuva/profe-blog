(function () {
  'use strict';
  const $ = id => document.getElementById(id), config = {
    apiKey: 'AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w', authDomain: 'estudiacest.firebaseapp.com',
    databaseURL: 'https://estudiacest-default-rtdb.firebaseio.com', projectId: 'estudiacest',
    storageBucket: 'estudiacest.firebasestorage.app', messagingSenderId: '999002169815', appId: '1:999002169815:web:51203237bc77c2e74deb92'
  };
  const app = firebase.apps.find(a => a.name === 'estudiacest-admin') || firebase.initializeApp(config, 'estudiacest-admin'), auth = app.auth();
  const ready = auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  const QUESTIONS = [ ['recibir', '¿Cómo recibimos ayuda?'], ['ayudar', '¿Cómo entregamos ayuda?'], ['comprender', '¿Cómo se relacionan dignidad, respeto y amor?'], ['indiferencia', '¿Dónde aparece la indiferencia?'], ['actitud', '¿Qué actitud sería coherente con el amor al prójimo?'], ['accion', '¿Qué acción concreta se podría realizar?'], ['compromiso', 'Esta semana, yo me comprometo a…'] ];
  let rows = [];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const done = r => r.submitted === true && r.completada === true;
  const date = value => value ? new Date(value).toLocaleString('es-CL', { timeZone: 'America/Santiago' }) : 'Sin registro';
  function status(message, error = false) { $('adminStatus').textContent = message; $('adminStatus').classList.toggle('error', error); }
  function render() {
    const query = $('search').value.trim().toLocaleLowerCase('es-CL'), filter = $('stateFilter').value;
    const filtered = rows.filter(r => r.fullName.toLocaleLowerCase('es-CL').includes(query) && (!filter || (filter === 'done' ? done(r) : !done(r))));
    $('summary').textContent = rows.filter(done).length + ' entregas confirmadas · ' + rows.filter(r => !done(r)).length + ' borradores';
    $('rows').innerHTML = filtered.length ? filtered.map((r, i) => `<tr><td>${esc(r.fullName)}</td><td>${done(r) ? 'Entregada' : r.submitted || r.completada ? 'Revisar estado' : 'Borrador'}</td><td>${r.answered || 0}/${r.total}</td><td>${date(r.submittedAt || r.updatedAt)}</td><td><button type="button" data-detail="${i}">Ver respuestas</button></td></tr>`).join('') : '<tr><td colspan="5">No hay registros que coincidan.</td></tr>';
    document.querySelectorAll('[data-detail]').forEach(button => { button.onclick = () => {
      const r = filtered[Number(button.dataset.detail)];
      $('detail').innerHTML = `<h2>${esc(r.fullName)}</h2><p>1D · ${done(r) ? 'Entrega confirmada: ' + date(r.submittedAt) : 'Borrador: ' + date(r.updatedAt)}</p><p>Situación: <strong>${esc({ curso: 'En el curso', familia: 'En la familia', comunidad: 'En la comunidad' }[r.caseId] || 'Sin elegir')}</strong></p>` + QUESTIONS.map(([id, text], i) => `<h3>${i + 1}. ${text}</h3><p class="response">${esc(r.answers[id] || 'Sin respuesta')}</p>`).join('');
      $('detail').hidden = false; $('detail').focus(); $('detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }; });
  }
  async function refresh() {
    $('refresh').disabled = true;
    try {
      status('Consultando registros…');
      const response = await fetch('/api/estudiantes?action=1d-admin-list', { cache: 'no-store', headers: { Authorization: 'Bearer ' + await auth.currentUser.getIdToken() } });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'No se pudieron consultar los registros.');
      rows = data.rows.sort((a, b) => (b.submittedAt || b.updatedAt) - (a.submittedAt || a.updatedAt)); render();
      $('privatePanel').hidden = false; $('login').hidden = true; status('Registros actualizados.');
    } catch (error) { $('privatePanel').hidden = true; $('login').hidden = false; $('detail').hidden = true; rows = []; $('rows').textContent = ''; $('detail').textContent = ''; status(error.message, true); }
    finally { $('refresh').disabled = false; }
  }
  $('loginForm').onsubmit = async event => {
    event.preventDefault(); $('loginButton').disabled = true;
    try { await ready; await auth.signInWithEmailAndPassword($('email').value.trim(), $('password').value); $('password').value = ''; }
    catch (_) { status('No se pudo ingresar. Revisa tu correo y contraseña de administración.', true); }
    finally { $('loginButton').disabled = false; }
  };
  $('search').oninput = render; $('stateFilter').onchange = render; $('refresh').onclick = refresh;
  $('signOut').onclick = () => auth.signOut();
  auth.onAuthStateChanged(async user => {
    if (!user) { rows = []; $('privatePanel').hidden = true; $('rows').textContent = ''; $('detail').textContent = ''; $('detail').hidden = true; $('login').hidden = false; status('Ingresa con tu cuenta docente para ver las entregas.'); return; }
    await refresh();
  });
})();
