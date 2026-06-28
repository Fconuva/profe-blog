/* ECEP · Plataforma de estudio — autenticación, control de PAGO por dossier y protección de contenido.
   Login SOLO con Google (Firebase Auth, proyecto profe-blog).
   - window.ECEP_PAGE = "gated" -> exige sesión; sin sesión -> /evaluaciones/acceso/
   - window.ECEP_PAGE = "login" -> con sesión -> al panel
   - window.ECEP_PAGE = "qa"    -> revela sin redirigir (solo para screenshots)
   - window.ECEP_PAGE = "admin" -> solo admin; otros -> panel
   Control de PAGO: cada dossier se identifica por la URL. Si el usuario no tiene
   ecep_accesos/{uid}/{dossierId} = true, se muestra un PAYWALL (no el contenido).
   Protección: marca de agua con el correo + bloqueo de copiar/seleccionar/imprimir.
*/
(function () {
  'use strict';

  var LOGIN = '/evaluaciones/acceso/';
  var HOME = '/evaluaciones/';
  var ADMIN_EMAILS = ['fconuva@gmail.com', 'portafolio.admin@profefranciscopancho.com'];
  var PAY_LINK = 'https://mpago.la/1wxtybe';
  var PRECIO = '$20.000';
  var WSP = '56988138929';
  var TRIAL_MS = 30 * 60 * 1000; // prueba gratis: 30 minutos desde la creación de la cuenta

  var DOSSIERS = {
    generalista: 'Educación Básica Generalista',
    lenguaje: 'Educación Básica · Lenguaje',
    matematica: 'Educación Básica · Matemática',
    historia: 'Educación Básica · Historia y Geografía',
    ciencias: 'Educación Básica · Ciencias Naturales',
    parvularia: 'Educación Parvularia',
    'especial-dea': 'Educación Especial · Dificultades del Aprendizaje (DEA)',
    'especial-di': 'Educación Especial · Discapacidad Intelectual',
    'especial-tea': 'Educación Especial · Trastorno del Espectro Autista',
    'especial-tel': 'Educación Especial · Trastorno del Lenguaje (TEL)',
    'media-lengua': 'Educación Media · Lengua y Literatura',
    'media-matematica': 'Educación Media · Matemática',
    'media-biologia': 'Educación Media · Biología',
    'media-historia': 'Educación Media · Historia y Geografía',
    'media-fisica': 'Educación Media · Física',
    'media-quimica': 'Educación Media · Química',
    'ingles': 'Educación Básica · Inglés',
    'media-ingles': 'Educación Media · Inglés',
    'ef-basica': 'Educación Básica · Educación Física y Salud',
    'tecnologia': 'Educación Básica · Tecnología',
    'religion': 'Educación Básica · Religión Católica',
    'media-musica': 'Educación Media · Música',
    'media-artes-visuales': 'Educación Media · Artes Visuales',
    'media-educacion-fisica': 'Educación Media · Educación Física y Salud',
    'media-filosofia': 'Educación Media · Filosofía',
    'musica-basica': 'Educación Básica · Música',
    'artes-basica': 'Educación Básica · Artes Visuales'
  };

  function reveal() { document.documentElement.classList.remove('ecg'); }

  function showVerifying() {
    reveal();
    if (document.getElementById('ecep-verify')) return;
    var v = document.createElement('div');
    v.id = 'ecep-verify';
    v.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.97);text-align:center;padding:24px';
    v.innerHTML = '<div><div style="font-size:34px;color:#0e7d8a"><i class="bi bi-hourglass-split"></i></div>' +
      '<h2 style="font:700 20px Poppins,system-ui,sans-serif;color:#0f172a;margin:14px 0 6px">Verificando tu pago…</h2>' +
      '<p style="color:#64748b;font-size:14px;max-width:360px;margin:0 auto;line-height:1.5">Estamos confirmando tu pago con Mercado Pago para activar tu acceso. Esto toma unos segundos.</p></div>';
    document.body.appendChild(v);
  }
  function hideVerifying() { var v = document.getElementById('ecep-verify'); if (v && v.parentNode) v.parentNode.removeChild(v); }
  function isAdmin(u) { return !!(u && u.email && ADMIN_EMAILS.indexOf(u.email.toLowerCase()) >= 0); }

  function dossierFromPath() {
    var p = location.pathname;
    if (p.indexOf('/educacion-parvularia/') >= 0) return 'parvularia';
    if (p.indexOf('/educacion-especial/') >= 0) { var me = p.match(/\/(?:estudio|prueba)\/([^\/]+)\//); return me ? 'especial-' + me[1] : null; }
    if (p.indexOf('/educacion-media/') >= 0) { var mm = p.match(/\/(?:estudio|prueba)\/([^\/]+)\//); if (!mm) return null; return mm[1] === 'lengua-y-literatura' ? 'media-lengua' : 'media-' + mm[1]; }
    var m = p.match(/\/(?:estudio|prueba)\/([^\/]+)\//);
    if (!m) return null;
    var seg = m[1];
    if (seg === 'educacion-generalista') return 'generalista';
    if (seg === 'lenguaje-comunicacion') return 'lenguaje';
    if (seg === 'matematica') return 'matematica';
    if (seg === 'historia-geografia') return 'historia';
    if (seg === 'ciencias-naturales') return 'ciencias';
    if (seg === 'ingles') return 'ingles';
    if (seg === 'educacion-fisica') return 'ef-basica';
    if (seg === 'tecnologia') return 'tecnologia';
    if (seg === 'religion') return 'religion';
    if (seg === 'musica') return 'musica-basica';
    if (seg === 'artes-visuales') return 'artes-basica';
    return null;
  }

  function googleProvider() {
    var p = new firebase.auth.GoogleAuthProvider();
    p.setCustomParameters({ prompt: 'select_account' });
    return p;
  }

  // Detección de entorno (para elegir popup vs redirect y avisar de navegadores internos)
  function isMobileDevice() {
    var ua = navigator.userAgent || '';
    if (/Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile|Tablet|Silk|Kindle|PlayBook|BlackBerry/i.test(ua)) return true;
    if (/Macintosh/.test(ua) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1) return true; // iPad iOS 13+
    return false;
  }
  function isInAppBrowser() {
    var ua = navigator.userAgent || '';
    return /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|WhatsApp|GSA\/|; wv\)|; wv;|TikTok|Snapchat/i.test(ua);
  }
  function showAuthError(err, e) {
    if (!err) return;
    var code = e && e.code;
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      err.textContent = 'Se cerró la ventana de Google antes de terminar. Inténtalo otra vez.';
    } else if (code === 'auth/unauthorized-domain') {
      err.textContent = 'Este dominio no está autorizado en Firebase todavía.';
    } else if (code === 'auth/operation-not-allowed') {
      err.textContent = 'El acceso con Google no está habilitado en Firebase todavía.';
    } else if (code === 'auth/network-request-failed') {
      err.textContent = 'Problema de conexión. Revisa tu internet e inténtalo de nuevo.';
    } else {
      err.textContent = 'No se pudo iniciar sesión. ' + ((e && e.message) || '');
    }
    err.style.display = 'block';
  }
  function showOpenInBrowser(err) {
    if (!err) return;
    err.innerHTML = 'Estás abriendo la página <b>dentro de otra app</b> (WhatsApp, Instagram, etc.) y Google no permite iniciar sesión ahí. <b>Ábrela en Chrome o Safari</b>: toca el menú (⋮ o ⋯) arriba a la derecha y elige <b>“Abrir en el navegador”</b>, o copia la dirección y pégala en Chrome/Safari.';
    err.style.display = 'block';
  }

  // --- acciones de botones ---
  window.ecepLoginGoogle = function () {
    var btn = document.getElementById('btn-google');
    var err = document.getElementById('login-error');
    if (err) err.style.display = 'none';
    if (isInAppBrowser()) { showOpenInBrowser(err); return; } // WhatsApp/IG: Google bloquea OAuth aquí
    if (btn) { btn.disabled = true; btn.classList.add('loading'); }
    var prov = googleProvider();
    // POPUP en TODOS los dispositivos (incluido móvil/tablet). El resultado vuelve por
    // postMessage, que NO depende del almacenamiento de terceros. En cambio signInWithRedirect
    // se ROMPE en Safari iOS / Chrome con partición de almacenamiento cuando el authDomain
    // (profe-blog.firebaseapp.com) es distinto del dominio del sitio (profefranciscopancho.com):
    // al volver de Google se pierde la credencial y el usuario queda atascado en el login.
    // Es la recomendación oficial de Firebase para apps en dominio propio.
    firebase.auth().signInWithPopup(prov)
      .then(function () { window.location.href = HOME; })
      .catch(function (e) {
        var code = e && e.code;
        if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
          if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
          showAuthError(err, e);
          return;
        }
        // Popup realmente bloqueado / no soportado -> último recurso: redirect
        if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
          firebase.auth().signInWithRedirect(prov).catch(function (e2) {
            if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
            showAuthError(err, e2);
          });
          return;
        }
        if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
        showAuthError(err, e);
      });
  };

  window.ecepLogout = function () {
    firebase.auth().signOut().then(function () { window.location.replace(LOGIN); });
  };

  function populateUser(user) {
    var name = user.displayName || user.email || 'Docente';
    document.querySelectorAll('[data-user-name]').forEach(function (el) { el.textContent = name; });
    document.querySelectorAll('[data-user-email]').forEach(function (el) { el.textContent = user.email || ''; });
    document.querySelectorAll('[data-user-photo]').forEach(function (img) { if (user.photoURL) img.src = user.photoURL; });
    document.querySelectorAll('[data-user-initial]').forEach(function (el) {
      el.textContent = ((name || '?').trim()[0] || '?').toUpperCase();
    });
    var admin = isAdmin(user);
    document.querySelectorAll('[data-admin-only]').forEach(function (el) { el.style.display = admin ? '' : 'none'; });
  }

  function registrar(user) {
    try {
      var uref = firebase.database().ref('ecep_usuarios/' + user.uid);
      uref.update({
        email: user.email || '',
        nombre: user.displayName || '',
        ultimo_ingreso: firebase.database.ServerValue.TIMESTAMP
      });
      // Inicia la prueba gratis UNA sola vez (al crear la cuenta / primer ingreso)
      uref.child('trial_inicio').once('value').then(function (s) {
        if (s.val() == null) uref.child('trial_inicio').set(firebase.database.ServerValue.TIMESTAMP);
      }).catch(function () {});
    } catch (e) { /* no bloquea el acceso */ }
  }

  // ============ PROTECCIÓN DE CONTENIDO ============
  function watermarkBackground(text) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200">' +
      '<text x="14" y="120" transform="rotate(-24 14 120)" fill="rgba(15,23,42,0.07)" ' +
      'font-size="15" font-weight="600" font-family="Inter,system-ui,sans-serif">' + text + '</text></svg>';
    return 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';
  }

  function flashShield() {
    var f = document.createElement('div');
    f.className = 'ecep-shield-flash';
    f.textContent = 'Contenido protegido · uso personal';
    document.body.appendChild(f);
    setTimeout(function () { f.parentNode && f.parentNode.removeChild(f); }, 1400);
  }

  function enableProtection(user) {
    var tag = (user.email || 'uso personal') + ' · ' + new Date().toISOString().slice(0, 10);
    document.documentElement.classList.add('ecep-protected');
    document.body.classList.add('ecep-noselect');
    // marca de agua
    var wm = document.createElement('div');
    wm.className = 'ecep-watermark';
    wm.style.backgroundImage = watermarkBackground(tag);
    document.body.appendChild(wm);
    // bloqueos
    ['contextmenu', 'copy', 'cut', 'dragstart', 'selectstart'].forEach(function (ev) {
      document.addEventListener(ev, function (e) { e.preventDefault(); return false; }, true);
    });
    document.addEventListener('keydown', function (e) {
      var k = (e.key || '').toLowerCase();
      if (k === 'printscreen') { try { navigator.clipboard.writeText('Contenido protegido'); } catch (_) {} flashShield(); return; }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && ['c', 'x', 's', 'p', 'u'].indexOf(k) >= 0) { e.preventDefault(); return false; }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].indexOf(k) >= 0) { e.preventDefault(); return false; }
      if (k === 'f12') { e.preventDefault(); return false; }
    }, true);
  }

  // ============ PAGO (Mercado Pago) ============
  function iniciarPago(did, user, btn) {
    var nombre = DOSSIERS[did] || 'este dossier';
    var orig = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Generando pago seguro…'; }
    fetch('/api/mercadopago/create_preference', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'ecep', uid: user.uid, email: user.email || '', dossier: did, dossierName: nombre, returnPath: location.pathname })
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (d && d.init_point) { window.location.href = d.init_point; }
      else { throw new Error((d && d.details) || 'sin init_point'); }
    }).catch(function (e) {
      if (btn) { btn.disabled = false; btn.innerHTML = orig; }
      alert('No se pudo iniciar el pago en línea. Inténtalo de nuevo, o paga por transferencia y envíanos el comprobante por WhatsApp.\n\n(' + ((e && e.message) || '') + ')');
    });
  }

  // ============ PRUEBA GRATIS (30 min) ============
  // Antes del paywall: si la cuenta está dentro de su ventana de prueba, se da acceso
  // con un cronómetro. Al expirar, aparece el paywall. El tiempo se mide con la hora
  // del SERVIDOR (serverTimeOffset) para que no se pueda burlar cambiando el reloj.
  function checkTrial(did, user) {
    firebase.database().ref('.info/serverTimeOffset').once('value').then(function (o) {
      var off = o.val() || 0;
      var tref = firebase.database().ref('ecep_usuarios/' + user.uid + '/trial_inicio');
      tref.once('value').then(function (s) {
        var inicio = s.val();
        if (inicio == null) { tref.set(firebase.database.ServerValue.TIMESTAMP); inicio = Date.now() + off; }
        var left = TRIAL_MS - ((Date.now() + off) - inicio);
        hideVerifying();
        if (left > 0) { reveal(); enableProtection(user); showTrialBanner(left, did, user); }
        else { showPaywall(did, user); }
      }).catch(function () { hideVerifying(); showPaywall(did, user); });
    }).catch(function () { hideVerifying(); showPaywall(did, user); });
  }

  function showTrialBanner(msLeft, did, user) {
    if (document.getElementById('ecep-trial')) return;
    var bar = document.createElement('div');
    bar.id = 'ecep-trial';
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99998;background:#0f766e;color:#fff;padding:10px 16px;display:flex;align-items:center;justify-content:center;gap:12px 18px;flex-wrap:wrap;font:600 14px Inter,system-ui,sans-serif;box-shadow:0 -6px 22px rgba(0,0,0,.28)';
    bar.innerHTML =
      '<span><i class="bi bi-stopwatch"></i> Prueba gratis · te queda <b id="ecep-trial-clock" style="font-variant-numeric:tabular-nums">--:--</b></span>' +
      '<button id="ecep-trial-pay" style="background:#fff;color:#0f766e;border:0;border-radius:9px;padding:8px 15px;font-weight:800;cursor:pointer"><i class="bi bi-unlock-fill"></i> Desbloquear este dossier · ' + PRECIO + '</button>';
    document.body.appendChild(bar);
    var pb = document.getElementById('ecep-trial-pay');
    pb.onclick = function () { iniciarPago(did, user, pb); };
    var end = Date.now() + msLeft, clk = document.getElementById('ecep-trial-clock'), iv;
    function tick() {
      var rem = end - Date.now();
      if (rem <= 0) { clearInterval(iv); if (bar.parentNode) bar.parentNode.removeChild(bar); showPaywall(did, user); return; }
      var m = Math.floor(rem / 60000), sec = Math.floor((rem % 60000) / 1000);
      clk.textContent = (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
      if (rem < 300000) bar.style.background = '#b45309'; // últimos 5 min: ámbar
    }
    tick(); iv = setInterval(tick, 1000);
  }

  // ============ PAYWALL ============
  function showPaywall(did, user) {
    var nombre = DOSSIERS[did] || 'este dossier';
    var mailTxt = user.email || '';
    var wspMsg = encodeURIComponent('Hola, pagué el dossier "' + nombre + '" de la plataforma ECEP. Mi correo de acceso es ' + mailTxt + '. Adjunto el comprobante para que activen mi acceso.');
    document.body.classList.add('ecep-paywalled');
    var ov = document.createElement('div');
    ov.className = 'ecep-paywall';
    ov.innerHTML =
      '<div class="ecep-pw-card">' +
        '<div class="ecep-pw-ico"><i class="bi bi-lock-fill"></i></div>' +
        '<span class="ecep-pw-kicker">Dossier de estudio</span>' +
        '<h1>' + nombre + '</h1>' +
        '<p class="ecep-pw-sub">Este dossier es de acceso pagado. Adquiérelo una vez y estudia el temario completo, con casos tipo ECEP, imágenes y autoevaluación.</p>' +
        '<div class="ecep-pw-price"><b>' + PRECIO + '</b><span>pago único · este dossier</span></div>' +
        '<button class="ecep-pw-buy" id="ecep-pw-pay"><i class="bi bi-credit-card-2-front-fill"></i> Pagar ' + PRECIO + ' con Mercado Pago</button>' +
        '<a class="ecep-pw-wsp" href="https://wa.me/' + WSP + '?text=' + wspMsg + '" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> ¿Pagaste por transferencia? Envía el comprobante</a>' +
        '<button class="ecep-pw-refresh" onclick="location.reload()"><i class="bi bi-arrow-clockwise"></i> Ya tengo acceso · actualizar</button>' +
        '<p class="ecep-pw-note">Al pagar con Mercado Pago tu acceso se <b>activa solo</b> en unos segundos. Ingresaste como <b>' + mailTxt + '</b>.</p>' +
        '<button class="ecep-pw-logout" onclick="ecepLogout()">Cambiar de cuenta</button>' +
      '</div>';
    document.body.appendChild(ov);
    var payBtn = document.getElementById('ecep-pw-pay');
    if (payBtn) payBtn.onclick = function () { iniciarPago(did, user, payBtn); };
    reveal();
  }

  // --- guardia de acceso ---
  if (typeof firebase === 'undefined' || !firebase.auth) { reveal(); return; }

  // Si volvió de un login por redirect (móvil/tablet), el éxito lo maneja onAuthStateChanged;
  // aquí solo capturamos errores para mostrarlos en la página de acceso.
  try {
    firebase.auth().getRedirectResult().catch(function (e) {
      if (e && e.code) showAuthError(document.getElementById('login-error'), e);
    });
  } catch (e) {}

  firebase.auth().onAuthStateChanged(function (user) {
    var mode = window.ECEP_PAGE;

    if (mode === 'login') {
      if (user) { window.location.replace(HOME); } else { reveal(); }
      return;
    }

    if (mode === 'admin') {
      if (!user) { window.location.replace(LOGIN); return; }
      if (!isAdmin(user)) { window.location.replace(HOME); return; }
      populateUser(user);
      reveal();
      if (window.ecepAdminInit) window.ecepAdminInit(firebase);
      return;
    }

    if (mode === 'gated') {
      if (!user) { window.location.replace(LOGIN); return; }
      registrar(user);
      populateUser(user);
      var did = dossierFromPath();
      if (!did) { reveal(); return; }            // panel/dashboard u otra página sin dossier
      if (isAdmin(user)) { reveal(); enableProtection(user); return; }  // admin ve todo
      // Si vuelve de pagar (?pago=ok), espera a que el webhook escriba el acceso (unos segundos).
      var pagoReturn = /[?&]pago=ok/.test(location.search);
      if (pagoReturn) showVerifying();
      (function check(tries) {
        firebase.database().ref('ecep_accesos/' + user.uid + '/' + did).once('value')
          .then(function (snap) {
            if (snap.val() === true) { hideVerifying(); reveal(); enableProtection(user); }
            else if (tries > 1) { setTimeout(function () { check(tries - 1); }, 1600); }
            else { checkTrial(did, user); }   // sin pago: ver si está en su prueba gratis de 30 min
          })
          .catch(function () { checkTrial(did, user); });
      })(pagoReturn ? 7 : 1);
      return;
    }

    reveal();
  });
})();
