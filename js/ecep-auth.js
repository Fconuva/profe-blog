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
    'media-matematica': 'Educación Media · Matemática'
  };

  function reveal() { document.documentElement.classList.remove('ecg'); }
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
    return null;
  }

  function googleProvider() {
    var p = new firebase.auth.GoogleAuthProvider();
    p.setCustomParameters({ prompt: 'select_account' });
    return p;
  }

  // --- acciones de botones ---
  window.ecepLoginGoogle = function () {
    var btn = document.getElementById('btn-google');
    var err = document.getElementById('login-error');
    if (err) err.style.display = 'none';
    if (btn) { btn.disabled = true; btn.classList.add('loading'); }
    firebase.auth().signInWithPopup(googleProvider())
      .then(function () { window.location.href = HOME; })
      .catch(function (e) {
        if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
        if (err) {
          var code = e && e.code;
          if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
            err.textContent = 'Cerraste la ventana de Google antes de terminar. Inténtalo otra vez.';
          } else if (code === 'auth/unauthorized-domain') {
            err.textContent = 'Este dominio no está autorizado en Firebase todavía.';
          } else if (code === 'auth/operation-not-allowed') {
            err.textContent = 'El acceso con Google no está habilitado en Firebase todavía.';
          } else {
            err.textContent = 'No se pudo iniciar sesión. ' + ((e && e.message) || '');
          }
          err.style.display = 'block';
        }
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
      firebase.database().ref('ecep_usuarios/' + user.uid).update({
        email: user.email || '',
        nombre: user.displayName || '',
        ultimo_ingreso: firebase.database.ServerValue.TIMESTAMP
      });
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
        '<a class="ecep-pw-buy" href="' + PAY_LINK + '" target="_blank" rel="noopener"><i class="bi bi-credit-card-2-front-fill"></i> Pagar con Mercado Pago</a>' +
        '<a class="ecep-pw-wsp" href="https://wa.me/' + WSP + '?text=' + wspMsg + '" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> Ya pagué · enviar comprobante</a>' +
        '<button class="ecep-pw-refresh" onclick="location.reload()"><i class="bi bi-arrow-clockwise"></i> Ya tengo acceso · actualizar</button>' +
        '<p class="ecep-pw-note">Tu acceso se activa apenas confirmemos el pago. Ingresaste como <b>' + mailTxt + '</b>.</p>' +
        '<button class="ecep-pw-logout" onclick="ecepLogout()">Cambiar de cuenta</button>' +
      '</div>';
    document.body.appendChild(ov);
    reveal();
  }

  // --- guardia de acceso ---
  if (typeof firebase === 'undefined' || !firebase.auth) { reveal(); return; }

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
      firebase.database().ref('ecep_accesos/' + user.uid + '/' + did).once('value')
        .then(function (snap) {
          if (snap.val() === true) { reveal(); enableProtection(user); }
          else { showPaywall(did, user); }
        })
        .catch(function () { showPaywall(did, user); });
      return;
    }

    reveal();
  });
})();
