(function () {
  'use strict';

  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var title = document.getElementById('slide-title');
  var count = document.getElementById('slide-count');
  var progress = document.getElementById('progress');
  var fullscreen = document.getElementById('fullscreen');
  var modal = document.getElementById('image-modal');
  var modalImage = modal ? modal.querySelector('img') : null;
  var modalClose = modal ? modal.querySelector('button') : null;
  var current = 0;

  if (!slides.length || !prev || !next || !title || !count || !progress) return;

  function show(index, direction) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    slides[current].classList.remove('active', 'reverse');
    current = index;
    slides[current].classList.toggle('reverse', direction < 0);
    void slides[current].offsetWidth;
    slides[current].classList.add('active');
    slides[current].classList.remove('reverse');
    slides[current].scrollTop = 0;
    title.textContent = slides[current].getAttribute('data-title') || '';
    count.textContent = (current + 1) + ' / ' + slides.length;
    progress.style.width = ((current + 1) / slides.length * 100) + '%';
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    if (history.replaceState) history.replaceState(null, '', '#' + (current + 1));
  }

  prev.addEventListener('click', function () { show(current - 1, -1); });
  next.addEventListener('click', function () { show(current + 1, 1); });

  document.addEventListener('keydown', function (event) {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
    if (modal && modal.classList.contains('open')) {
      if (event.key === 'Escape') closeModal();
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault(); show(current + 1, 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault(); show(current - 1, -1);
    } else if (event.key === 'Home') {
      event.preventDefault(); show(0, -1);
    } else if (event.key === 'End') {
      event.preventDefault(); show(slides.length - 1, 1);
    } else if ((event.key === 'f' || event.key === 'F') && fullscreen) {
      toggleFullscreen();
    }
  });

  var startX = null;
  var startY = null;
  document.addEventListener('touchstart', function (event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (event) {
    if (startX === null || (modal && modal.classList.contains('open'))) return;
    var deltaX = event.changedTouches[0].clientX - startX;
    var deltaY = event.changedTouches[0].clientY - startY;
    if (Math.abs(deltaX) > 64 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      show(current + (deltaX < 0 ? 1 : -1), deltaX < 0 ? 1 : -1);
    }
    startX = null;
    startY = null;
  }, { passive: true });

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  }
  if (fullscreen) fullscreen.addEventListener('click', toggleFullscreen);

  function openModal(image) {
    if (!modal || !modalImage) return;
    modalImage.src = image.currentSrc || image.src;
    modalImage.alt = image.alt || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if (modalClose) modalClose.focus();
  }
  function closeModal() {
    if (!modal || !modalImage) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalImage.removeAttribute('src');
  }
  Array.prototype.forEach.call(document.querySelectorAll('img[data-expand]'), function (image) {
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
    image.addEventListener('click', function () { openModal(image); });
    image.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openModal(image); }
    });
  });
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', function (event) { if (event.target === modal) closeModal(); });

  window.addEventListener('hashchange', function () {
    var target = parseInt((location.hash || '').replace('#', ''), 10);
    if (target > 0 && target <= slides.length && target - 1 !== current) {
      show(target - 1, target - 1 > current ? 1 : -1);
    }
  });

  var initial = parseInt((location.hash || '').replace('#', ''), 10);
  current = initial > 0 && initial <= slides.length ? initial - 1 : 0;
  slides.forEach(function (slide, index) { slide.classList.toggle('active', index === current); });
  show(current, 1);
})();
