/* Reproductor compartido: obtiene enlaces privados al pedirlos, sin ventanas emergentes. */
(function () {
  'use strict';
  const escape = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isAudio = file => file && (file.category === 'interview_audio' || /^audio\//.test(file.contentType || '') || /\.(mp3|m4a|wav|ogg|webm|aac|opus)$/i.test(file.name || ''));
  function markup(file, owner) {
    if (!file) return '<p class="media-empty">Sin audio guardado para esta entrevista.</p>';
    return `<div class="audio-player" data-media-file="${escape(file.id)}" data-media-owner="${escape(owner)}"><button type="button" class="secondary" data-load-audio>Escuchar audio</button><audio controls preload="none" aria-label="Audio: ${escape(file.name)}"></audio><a hidden target="_blank" rel="noopener" data-audio-link>Abrir o descargar audio</a><p data-media-status role="status">${escape(file.name)}</p></div>`;
  }
  function bind(container, resolveUrl) {
    container.querySelectorAll('[data-load-audio]').forEach(button => {
      if (button.dataset.bound) return;
      button.dataset.bound = 'true';
      button.addEventListener('click', async () => {
        const box = button.closest('[data-media-file]');
        const audio = box.querySelector('audio');
        const status = box.querySelector('[data-media-status]');
        button.disabled = true; status.textContent = 'Cargando audio…';
        try {
          const url = await resolveUrl(box.dataset.mediaFile, box.dataset.mediaOwner);
          if (!box.isConnected) return;
          const link = box.querySelector('[data-audio-link]');
          link.href = url; link.hidden = false;
          audio.src = url; audio.load();
          audio.onloadedmetadata = () => { status.textContent = 'Audio listo. Usa ▶ para reproducir y la barra para avanzar.'; };
          audio.onerror = () => { status.textContent = 'El navegador no pudo reproducirlo. Prueba Abrir o descargar audio, o vuelve a cargar el enlace.'; };
          status.textContent = 'Preparando reproducción…';
          audio.play().catch(() => { if (!audio.error) status.textContent = 'Pulsa ▶ en el reproductor para escuchar.'; });
        } catch (error) { status.textContent = error.message || 'No se pudo cargar. Vuelve a intentarlo.'; }
        finally { button.disabled = false; button.textContent = 'Volver a cargar audio'; }
      });
    });
  }
  function stop(container) { container.querySelectorAll('audio').forEach(audio => { audio.pause(); audio.removeAttribute('src'); audio.load(); }); }
  document.addEventListener('play', event => { if (event.target.tagName === 'AUDIO') document.querySelectorAll('audio').forEach(audio => { if (audio !== event.target) audio.pause(); }); }, true);
  window.AnuarioMedia = { isAudio, markup, bind, stop };
}());
