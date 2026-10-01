(function (global) {
  'use strict';
  function delivered(id, record) {
    if (!record || record.status === 'draft') return false;
    return record.status === 'sent' || record.submitted === true || record.completada === true ||
      (['10', '11', '12', '13'].includes(String(id)) && Number(record.submittedAt) > 0 && Object.keys(record.answers || {}).length > 0);
  }
  const fold = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const sets = {gamer:['gamerDesk','whiteGamerTower','gamerChair','playStation5'], music:['electricGuitarSet','drumKit','rgbPartySpeaker'], living:['loungeSofaThree','rgbPartySpeaker']};
  function mount({ auth, getGuideData, refreshGuides, reviewGuide }) {
    const el = id => document.getElementById('house' + id);
    let students = [], catalog = [], selected = [], preview = null, recipients = [], checked = null, run = 0, busy = false;
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
    function target() {
      return {curso:el('Course').value, estudiante:el('Mode').value === 'student' ? el('Student').value : '', guia:el('Guide').value};
    }
    function hasTarget() { const value = target(); return el('Mode').value === 'student' ? !!value.estudiante : !!value.curso; }
    function signature() { return JSON.stringify({...target(), muebles:selected}); }
    function invalidate() { checked = null; el('Confirm').hidden = true; el('Recipients').replaceChildren(); }
    function renderStudents() {
      const previous = el('Student').value, course = el('Course').value;
      el('Student').replaceChildren(new Option('Selecciona un estudiante…', ''));
      students.filter(item => !course || item.curso === course).sort((a,b) => a.nombre.localeCompare(b.nombre, 'es'))
        .forEach(item => el('Student').add(new Option(item.nombre + ' · ' + item.curso.replace(/([34])([AB])-HC/, '$1°$2 HC'), item.uid)));
      if ([...el('Student').options].some(option => option.value === previous)) el('Student').value = previous;
    }
    function renderDeliveries() {
      el('Deliveries').replaceChildren();
      if (el('Mode').value !== 'student') return;
      const student = students.find(item => item.uid === el('Student').value);
      if (!student) return;
      const guides = getGuideData() || {};
      for (let id = 1; id <= 21; id++) {
        if (!delivered(id, guides[id]?.[student.rut])) continue;
        const button = document.createElement('button');
        button.type = 'button'; button.textContent = '✓ Guía ' + id + ' · Revisar';
        button.addEventListener('click', () => reviewGuide(student.rut, String(id)));
        el('Deliveries').append(button);
      }
    }
    function showPreview(item, direction = 'SE', focus = false) {
      preview = item.id; el('Preview').hidden = false;
      el('PreviewName').textContent = item.nombre;
      el('PreviewImage').src = '/estudiantes/assets/pieza/' + encodeURIComponent(item.id) + '_' + direction + '.png';
      el('PreviewImage').alt = item.nombre + ' · vista ' + direction;
      el('PreviewState').textContent = item.tiene ? (el('Mode').value === 'student' ? '✓ Ya lo tiene.' : '✓ Ya lo tienen todos los destinatarios.') : 'Vista ampliada. Puedes girarla y añadir este mueble al set.';
      el('Orientation').replaceChildren();
      ['SE','SW','NE','NW'].forEach((dir,index) => {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Vista ' + (index + 1);
        button.setAttribute('aria-pressed', String(dir === direction));
        button.addEventListener('click', () => showPreview(catalog.find(value => value.id === item.id) || item, dir));
        el('Orientation').append(button);
      });
      if (focus) el('Preview').scrollIntoView?.({behavior:'smooth', block:'center'});
    }
    function renderSelection() {
      el('Selected').textContent = selected.length ? 'Set elegido (' + selected.length + '/12): ' + selected.map(id => catalog.find(item => item.id === id)?.nombre || id).join(' · ') : 'No hay muebles elegidos.';
      el('Review').disabled = busy || !selected.length || !hasTarget();
    }
    function renderCatalog() {
      const query = fold(el('Search').value.trim()), filter = el('Ownership').value;
      el('Catalog').replaceChildren();
      catalog.filter(item => (!query || fold(item.nombre + ' ' + item.familia).includes(query)) &&
        (filter === 'all' || (filter === 'owned' ? item.tiene : !item.tiene))).forEach(item => {
        const card = document.createElement('div'); card.className = 'house-item' + (item.tiene ? ' owned' : '') + (selected.includes(item.id) ? ' selected' : '');
        const imageButton = document.createElement('button'); imageButton.type = 'button'; imageButton.className = 'house-image-button';
        imageButton.setAttribute('aria-label', 'Ver ' + item.nombre);
        const image = document.createElement('img'); image.src = '/estudiantes/assets/pieza/' + encodeURIComponent(item.id) + '_SE.png'; image.alt = ''; image.loading = 'lazy';
        imageButton.append(image); imageButton.addEventListener('click', () => showPreview(item, 'SE', true));
        const label = document.createElement('span'); label.textContent = item.nombre;
        const badge = document.createElement('strong'); badge.textContent = item.tiene ? (el('Mode').value === 'student' ? '✓ Ya lo tiene' : '✓ Ya lo tienen') : item.tienen ? item.tienen + ' ya lo tienen' : '';
        const pick = document.createElement('button'); pick.type = 'button'; pick.className = 'house-pick';
        pick.textContent = selected.includes(item.id) ? '✓ Quitar del set' : 'Añadir al set';
        pick.disabled = busy || item.tiene; pick.setAttribute('aria-pressed', String(selected.includes(item.id)));
        pick.addEventListener('click', () => {
          if (busy || item.tiene) return;
          if (!selected.includes(item.id) && selected.length >= 12) { status('El set admite hasta doce muebles.', true); return; }
          selected = selected.includes(item.id) ? selected.filter(id => id !== item.id) : [...selected, item.id];
          el('Set').value = 'custom'; invalidate(); showPreview(item); renderSelection(); renderCatalog(); status('');
        });
        card.append(imageButton, label, badge, pick); el('Catalog').append(card);
      });
      if (!el('Catalog').children.length) { const empty = document.createElement('p'); empty.className = 'house-note'; empty.textContent = 'No hay muebles que coincidan con este filtro.'; el('Catalog').append(empty); }
    }
    function applyData(data) {
      catalog = (Array.isArray(data.catalogo) ? data.catalogo : []).filter(item => /^[A-Za-z0-9_-]+$/.test(item.id));
      recipients = data.destinatarios || [];
      el('Summary').textContent = recipients.length + ' destinatario(s)' + (el('Guide').value ? ' con Guía ' + el('Guide').value + ' entregada' : '') + ' · ' + (data.excluidos || 0) + ' sin la entrega requerida.';
      renderDeliveries(); renderSelection(); renderCatalog();
      if (preview && catalog.some(item => item.id === preview)) showPreview(catalog.find(item => item.id === preview));
    }
    async function consult(review = false) {
      invalidate(); const request = ++run;
      if (!hasTarget()) {
        recipients = []; catalog = catalog.map(item => ({...item, tiene:false, tienen:0}));
        el('Summary').textContent = 'Selecciona un estudiante o un curso. Puedes mirar los muebles antes de elegir.';
        renderDeliveries(); renderSelection(); renderCatalog(); status(''); return false;
      }
      const current = signature(); status('Consultando destinatarios e inventarios…');
      try {
        const data = await api('regalos-admin-paes-lote', {...target(), muebles:review ? selected : []});
        if (request !== run || current !== signature()) return false;
        applyData(data);
        if (review) {
          if (!recipients.length) { status('Nadie cumple la condición de tarea seleccionada. No se entregará ningún regalo.', true); return false; }
          checked = {signature:current, uids:recipients.map(item => item.uid)};
          const count = recipients.reduce((sum,item) => sum + item.faltan.length, 0);
          el('Chosen').textContent = recipients.length + ' estudiantes · ' + selected.length + ' muebles en el set · ' + count + ' regalos nuevos.';
          recipients.forEach(item => {
            const row = document.createElement('li');
            row.textContent = item.nombre + ' · ' + item.faltan.length + ' nuevos · ' + item.yaTiene.length + ' ya obtenidos'; el('Recipients').append(row);
          });
          el('Confirm').hidden = false; el('Give').disabled = busy || count === 0;
          status(count ? 'Revisa la nómina y confirma la entrega. Aún no se ha regalado nada.' : 'Todos ya tienen el set. No hay regalos nuevos.');
        } else status('');
        return true;
      } catch (error) { if (request === run) status(error.message, true); return false; }
    }
    async function load(refresh = false) {
      if (busy) return;
      invalidate(); const request = ++run;
      status('Cargando estudiantes y muebles…');
      try {
        const [data, furniture] = await Promise.all([api('admin-house-students', {}, true), api('recompensas-listar'), refresh ? refreshGuides() : Promise.resolve()]);
        if (request !== run) return;
        students = (data.estudiantes || []).filter(item => ['3A-HC','3B-HC','4A-HC','4B-HC'].includes(item.curso));
        catalog = (furniture.catalogo || []).filter(item => /^[A-Za-z0-9_-]+$/.test(item.id));
        renderStudents(); renderSelection(); renderCatalog(); await consult();
      } catch (error) { if (request === run) status(error.message, true); }
    }
    function lock(value) {
      busy = value;
      ['Mode','Course','Student','Guide','Refresh','Give','Review','Clear','Set'].forEach(id => { el(id).disabled = value; });
      renderSelection(); renderCatalog();
    }
    async function give() {
      if (busy || !checked || checked.signature !== signature()) return;
      const payload = {...target(), muebles:[...selected], destinatarios:[...checked.uids], confirmar:true};
      lock(true); status('Entregando y comprobando el set…');
      try {
        const data = await api('regalos-admin-paes-lote', payload);
        if (data.errores || !data.destinatarios?.every(item => item.confirmado)) throw new Error('La entrega tiene confirmaciones pendientes. Actualiza y revisa antes de reintentar; no se duplicarán los regalos confirmados.');
        const count = data.destinatarios.reduce((sum,item) => sum + item.faltan.length, 0);
        selected = []; el('Set').value = 'custom';
        const confirmed = await consult();
        if (!confirmed || !payload.muebles.every(id => catalog.some(item => item.id === id && item.tiene))) throw new Error('No se pudo confirmar el inventario después de la entrega. Actualiza antes de reintentar.');
        status('Entrega confirmada: ' + count + ' regalos nuevos para ' + data.destinatarios.length + ' estudiantes. Los muebles ya obtenidos no se duplicaron.');
      } catch (error) { invalidate(); status(error.message, true); }
      finally { lock(false); }
    }
    for (let id = 1; id <= 21; id++) el('Guide').add(new Option('Guía ' + id, String(id)));
    el('Mode').addEventListener('change', () => { if (!busy) { el('StudentField').hidden = el('Mode').value === 'course'; el('Course').options[0].textContent = el('Mode').value === 'course' ? 'Selecciona un curso…' : 'Todos los cursos HC'; return consult(); } });
    el('Course').addEventListener('change', () => { if (!busy) { el('Student').value = ''; renderStudents(); return consult(); } });
    el('Student').addEventListener('change', () => { if (!busy) return consult(); });
    el('Guide').addEventListener('change', () => { if (!busy) return consult(); });
    el('Set').addEventListener('change', () => {
      if (busy) return;
      selected = (sets[el('Set').value] || []).filter(id => catalog.some(item => item.id === id && !item.tiene));
      invalidate(); renderSelection(); renderCatalog(); if (selected.length) showPreview(catalog.find(item => item.id === selected[0]));
    });
    el('Clear').addEventListener('click', () => { if (!busy) { selected = []; el('Set').value = 'custom'; invalidate(); renderSelection(); renderCatalog(); } });
    el('Search').addEventListener('input', renderCatalog); el('Ownership').addEventListener('change', renderCatalog);
    el('Refresh').addEventListener('click', () => load(true)); el('Review').addEventListener('click', () => consult(true)); el('Give').addEventListener('click', give);
    return { load };
  }
  global.PaesCasasAdmin = { mount, delivered };
})(window);
