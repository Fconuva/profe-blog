(function (global) {
  'use strict';
  function delivered(id, record) {
    if (!record || record.status === 'draft') return false;
    return record.status === 'sent' || record.submitted === true || record.completada === true ||
      (['10', '11', '12', '13'].includes(String(id)) && Number(record.submittedAt) > 0 && Object.keys(record.answers || {}).length > 0);
  }
  const fold = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function mount({ auth, getGuideData, refreshGuides, reviewGuide }) {
    const el = id => document.getElementById('house' + id);
    let students = [], catalog = [], student = null, selected = null, run = 0, busy = false;
    async function api(action, payload = {}, paes = false) {
      if (!auth.currentUser) throw new Error('La sesión docente venció. Recarga la página.');
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(paes ? '/api/paes?action=' + action : '/api/estudiantes', {
        method:'POST', headers:{'Content-Type':'application/json', Authorization:'Bearer ' + token},
        body:JSON.stringify(paes ? payload : { ...payload, action:'salas-' + action })
      });
      const data = await response.json();
      if (!response.ok || data.ok === false || data.success === false) throw new Error(data.error || 'No se pudo consultar Mi espacio.');
      return data;
    }
    function status(message, error = false) {
      el('Status').textContent = message;
      el('Status').style.color = error ? '#fca5a5' : '#6ee7b7';
    }
    function clear() {
      ++run; catalog = []; student = null; selected = null;
      el('Confirm').hidden = true;
      el('Catalog').replaceChildren(); el('Deliveries').replaceChildren();
      el('Summary').textContent = 'Selecciona un estudiante para ver sus entregas y muebles.';
      status('');
    }
    function renderStudents() {
      const previous = el('Student').value;
      const course = el('Course').value;
      el('Student').replaceChildren(new Option('Selecciona un estudiante…', ''));
      students.filter(item => !course || item.curso === course)
        .sort((a,b) => a.nombre.localeCompare(b.nombre, 'es'))
        .forEach(item => el('Student').add(new Option(item.nombre + ' · ' + item.curso.replace(/([34])([AB])-HC/, '$1°$2 HC'), item.uid)));
      if ([...el('Student').options].some(option => option.value === previous)) el('Student').value = previous;
    }
    function renderDeliveries() {
      const guides = getGuideData() || {};
      el('Deliveries').replaceChildren();
      let count = 0;
      for (let id = 1; id <= 21; id++) {
        if (!delivered(id, guides[id]?.[student.rut])) continue;
        count++;
        const button = document.createElement('button');
        button.type = 'button'; button.textContent = '✓ Guía ' + id + ' · Revisar';
        button.addEventListener('click', () => reviewGuide(student.rut, String(id)));
        el('Deliveries').append(button);
      }
      const furnitureCount = catalog.filter(item => item.tiene).length;
      el('Summary').textContent = student.nombre + ' · ' + count + (count === 1 ? ' guía entregada · ' : ' guías entregadas · ') +
        furnitureCount + (furnitureCount === 1 ? ' mueble obtenido' : ' muebles obtenidos');
      if (!count) {
        const note = document.createElement('p'); note.className = 'house-note';
        note.textContent = 'No hay entregas finales registradas. Los borradores no cuentan como entrega.';
        el('Deliveries').append(note);
      }
    }
    function renderCatalog() {
      const query = fold(el('Search').value.trim()), filter = el('Ownership').value;
      el('Catalog').replaceChildren();
      catalog.filter(item => (!query || fold(item.nombre + ' ' + item.familia).includes(query)) &&
        (filter === 'all' || (filter === 'owned' ? item.tiene : !item.tiene)))
        .forEach(item => {
          const button = document.createElement('button');
          button.type = 'button'; button.className = 'house-item' + (item.tiene ? ' owned' : '');
          button.disabled = busy || item.tiene;
          button.setAttribute('aria-pressed', String(selected === item.id));
          const image = document.createElement('img');
          image.src = '/estudiantes/assets/pieza/' + encodeURIComponent(item.id) + '_SE.png';
          image.alt = ''; image.loading = 'lazy';
          const label = document.createElement('span'); label.textContent = item.nombre;
          const badge = document.createElement('strong'); badge.textContent = item.tiene ? '✓ Ya lo tiene' : 'Elegir';
          if (item.tiene && item.origen) button.title = item.origen;
          button.append(image, label, badge);
          button.addEventListener('click', () => {
            if (busy || item.tiene) return;
            selected = item.id;
            el('Chosen').textContent = 'Regalar “' + item.nombre + '” a ' + student.nombre;
            el('Confirm').hidden = false;
            status('Comprueba el estudiante y el mueble antes de confirmar.');
            renderCatalog();
          });
          el('Catalog').append(button);
        });
      if (student && !el('Catalog').children.length) {
        const empty = document.createElement('p'); empty.className = 'house-note';
        empty.textContent = 'No hay muebles que coincidan con este filtro.'; el('Catalog').append(empty);
      }
    }
    async function inventory() {
      const uid = el('Student').value;
      clear();
      if (!uid) return false;
      const request = run;
      el('Summary').textContent = 'Consultando entregas e inventario…';
      try {
        const data = await api('regalos-admin-inventario', { estudiante:uid });
        if (request !== run || el('Student').value !== uid) return false;
        const profile = students.find(item => item.uid === uid);
        if (!profile || data.estudiante?.uid !== uid || data.estudiante?.curso !== profile.curso) throw new Error('La cuenta no coincide con el estudiante seleccionado. Actualiza el listado.');
        student = profile;
        catalog = (Array.isArray(data.catalogo) ? data.catalogo : []).filter(item => /^[A-Za-z0-9_-]+$/.test(item.id));
        renderDeliveries(); renderCatalog();
        return true;
      } catch (error) {
        if (request !== run) return false;
        status(error.message, true); el('Summary').textContent = 'No se pudo cargar este estudiante. Pulsa Actualizar para reintentar.';
        return false;
      }
    }
    async function load(refresh = false) {
      if (busy) return;
      clear();
      const request = run;
      status('Cargando estudiantes…');
      try {
        const [data] = await Promise.all([api('admin-house-students', {}, true), refresh ? refreshGuides() : Promise.resolve()]);
        if (request !== run) return;
        students = (Array.isArray(data.estudiantes) ? data.estudiantes : []).filter(item => ['3A-HC','3B-HC','4A-HC','4B-HC'].includes(item.curso));
        renderStudents(); status('');
        if (el('Student').value) await inventory();
      } catch (error) { if (request === run) status(error.message, true); }
    }
    async function give() {
      const item = catalog.find(item => item.id === selected);
      const uid = student?.uid;
      if (busy || !uid || !item || item.tiene || el('Student').value !== uid) return;
      busy = true;
      ['Course','Student','Refresh','Give'].forEach(id => { el(id).disabled = true; });
      renderCatalog(); status('Entregando y comprobando el regalo…');
      try {
        const data = await api('regalos-admin-entregar', { estudiante:uid, mueble:item.id });
        const confirmed = await inventory();
        if (!confirmed || !catalog.some(furniture => furniture.id === item.id && furniture.tiene)) {
          throw new Error('No se pudo confirmar el inventario después de la entrega. Pulsa Actualizar antes de volver a regalar.');
        }
        status(data.yaLoTiene ? 'El estudiante ya tenía este mueble. No se duplicó.' : 'Regalo confirmado: ' + item.nombre + '. Ya aparece marcado en su inventario.');
      } catch (error) { status(error.message, true); }
      finally {
        busy = false;
        ['Course','Student','Refresh','Give'].forEach(id => { el(id).disabled = false; });
        renderCatalog();
      }
    }
    el('Course').addEventListener('change', () => { if (!busy) { el('Student').value = ''; clear(); renderStudents(); } });
    el('Student').addEventListener('change', () => { if (!busy) return inventory(); });
    el('Search').addEventListener('input', renderCatalog);
    el('Ownership').addEventListener('change', renderCatalog);
    el('Refresh').addEventListener('click', () => load(true));
    el('Give').addEventListener('click', give);
    return { load };
  }
  global.PaesCasasAdmin = { mount, delivered };
})(window);
