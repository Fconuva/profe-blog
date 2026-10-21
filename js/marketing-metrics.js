/* Medición comercial: solo portada y registro; nunca lee campos del formulario. */
(function () {
  'use strict';
  if (window.profeMetrics) return;
  var path = window.location.pathname;
  if (!/^\/$|^\/cuenta\/crear-cuenta(?:\.html)?\/?$/.test(path)) return;
  var config = window.PROFE_MARKETING || {};
  if (!/^G-[A-Z0-9]+$/.test(config.measurementId || '')) return;
  var key = 'profe_measurement_consent_v1';
  var consent = null;
  var loaded = false;
  var completed = false;
  var allowed = ['registration_clicked', 'whatsapp_clicked', 'pricing_viewed', 'sign_up'];
  try { consent = localStorage.getItem(key); } catch (_) {}
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });
  function safePage() { return window.location.origin + path; }
  function load() {
    if (loaded || consent !== 'granted') return;
    loaded = true;
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', config.measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: safePage(),
      page_referrer: '',
      page_title: path === '/' ? 'Portafolios Docentes | Profe Francisco' : 'Crear cuenta | Profe Francisco'
    });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + config.measurementId;
    document.head.appendChild(script);
    window.gtag('event', 'page_view', { page_location: safePage(), page_referrer: '' });
  }
  function track(name, values, callback) {
    if (allowed.indexOf(name) === -1 || consent !== 'granted') {
      if (callback) callback();
      return false;
    }
    load();
    var data = { page_location: safePage(), page_referrer: '', send_to: config.measurementId, transport_type: 'beacon' };
    // Lista cerrada: no URL de destino, nombres, RUT, teléfono, correo ni UID.
    ['location', 'method'].forEach(function (prop) {
      if (values && typeof values[prop] === 'string' && /^[a-z_]{1,40}$/.test(values[prop])) data[prop] = values[prop];
    });
    if (callback) { data.event_callback = callback; data.event_timeout = 700; }
    window.gtag('event', name, data);
    return true;
  }
  function forgetCookies() {
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      ['', window.location.hostname, '.' + window.location.hostname, '.profefranciscopancho.com'].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      });
    });
  }
  function setConsent(value) {
    consent = value;
    try { localStorage.setItem(key, value); } catch (_) {}
    document.getElementById('profe-metrics-consent').hidden = true;
    if (value === 'granted') load();
    else {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
      window['ga-disable-' + config.measurementId] = true;
      forgetCookies();
    }
    window['ga-disable-' + config.measurementId] = value !== 'granted';
  }
  window.profeMetrics = {
    track: track,
    registrationComplete: function (method, next) {
      var done = false;
      function finish() { if (!done) { done = true; next(); } }
      if (completed) return finish();
      completed = true;
      setTimeout(finish, 800); // La medición nunca bloquea la inscripción.
      track('sign_up', { method: method }, finish);
    },
    openPreferences: function () { document.getElementById('profe-metrics-consent').hidden = false; }
  };
  function init() {
    var panel = document.createElement('section');
    panel.id = 'profe-metrics-consent';
    panel.setAttribute('aria-label', 'Preferencias de medición');
    panel.hidden = consent !== null;
    panel.innerHTML = '<p>¿Nos ayudas a mejorar la página?</p><span>Con tu permiso, Google Analytics mide visitas y clics. No enviamos los datos de tu formulario.</span><div><button type="button" data-consent="denied">Solo lo necesario</button><button type="button" data-consent="granted">Aceptar medición</button></div>';
    var style = document.createElement('style');
    style.textContent = '#profe-metrics-consent[hidden]{display:none!important}#profe-metrics-consent{position:fixed;left:20px;bottom:24px;z-index:200;width:min(390px,calc(100% - 40px));box-sizing:border-box;padding:22px;border:1px solid #60768b;border-radius:12px;background:#142131;color:#f2f5f7;box-shadow:0 10px 60px #0006;font:14px/1.6 Arial,sans-serif}#profe-metrics-consent p{margin:0 0 10px;color:#f2f5f7;font-size:16px;font-weight:600}#profe-metrics-consent span{color:#c4d1df;font-size:13px}#profe-metrics-consent div{display:flex;flex-wrap:wrap;gap:20px;margin-top:16px}#profe-metrics-consent button{border:0;background:none;color:#c4e5f7;padding:8px 0;font:inherit;text-decoration:underline;cursor:pointer}#profe-metrics-consent button:focus-visible{outline:3px solid #afd8ef;outline-offset:4px}#profe-metrics-preferences{font:inherit;color:inherit;background:none;border:0;text-decoration:underline;cursor:pointer}@media(max-width:767px){#profe-metrics-consent{bottom:88px}}';
    document.head.appendChild(style);
    document.body.appendChild(panel);
    panel.querySelectorAll('[data-consent]').forEach(function (button) {
      button.addEventListener('click', function () { setConsent(button.dataset.consent); });
    });
    var preferences = document.getElementById('privacy-settings');
    if (!preferences) {
      preferences = document.createElement('button');
      preferences.id = 'profe-metrics-preferences';
      preferences.textContent = 'Preferencias de medición';
      preferences.type = 'button';
      var footer = document.querySelector('footer');
      if (footer) footer.appendChild(preferences);
      else { preferences.style.cssText = 'display:block;margin:20px auto;font-size:12px'; document.body.appendChild(preferences); }
    }
    preferences.addEventListener('click', window.profeMetrics.openPreferences);
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (!link) return;
      var target;
      try { target = new URL(link.href, window.location.origin); } catch (_) { return; }
      var name;
      if (target.origin === window.location.origin && /^\/cuenta\/crear-cuenta(?:\.html)?\/?$/.test(target.pathname)) name = 'registration_clicked';
      if (target.hostname === 'wa.me' || target.hostname === 'api.whatsapp.com') name = 'whatsapp_clicked';
      if (!name) return;
      var section = link.closest('section,header,footer');
      var location = link.dataset.location || (section && (section.id || section.tagName.toLowerCase())) || 'page';
      location = location.replace(/-/g, '_').replace(/[^a-z_]/g, '').slice(0, 40) || 'page';
      track(name, { location: location });
    });
    var prices = document.getElementById('precios');
    if (prices && window.IntersectionObserver) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && consent === 'granted') { track('pricing_viewed', { location: 'prices' }); observer.disconnect(); }
      }, { threshold: 0.2 });
      observer.observe(prices);
    }
    load();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
