/* ECEP · Plataforma de estudio — autenticación y control de acceso
   Login SOLO con Google (Firebase Auth, proyecto profe-blog).
   - Páginas con window.ECEP_PAGE = "gated"  -> exigen sesión; si no hay, van a /evaluaciones/acceso/
   - Página con  window.ECEP_PAGE = "login"  -> si ya hay sesión, va al panel
   Anti-parpadeo: el <head> agrega html.ecg (oculta el body); aquí lo revelamos al resolver la sesión.
   (El control de PAGO se implementará después; por ahora solo login.)
*/
(function () {
  'use strict';

  var LOGIN = '/evaluaciones/acceso/';
  var HOME = '/evaluaciones/';

  function reveal() { document.documentElement.classList.remove('ecg'); }

  function googleProvider() {
    var p = new firebase.auth.GoogleAuthProvider();
    p.setCustomParameters({ prompt: 'select_account' });
    return p;
  }

  // --- acciones expuestas a los botones ---
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
            err.textContent = 'Este dominio no está autorizado en Firebase todavía. (Configuración pendiente.)';
          } else if (code === 'auth/operation-not-allowed') {
            err.textContent = 'El acceso con Google no está habilitado en Firebase todavía. (Configuración pendiente.)';
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

  // --- guardia de acceso ---
  if (typeof firebase === 'undefined' || !firebase.auth) { reveal(); return; }

  firebase.auth().onAuthStateChanged(function (user) {
    var mode = window.ECEP_PAGE;

    if (mode === 'login') {
      if (user) { window.location.replace(HOME); } else { reveal(); }
      return;
    }

    if (mode === 'gated') {
      if (user) {
        reveal();
        var name = document.querySelectorAll('[data-user-name]');
        name.forEach(function (el) { el.textContent = user.displayName || user.email || 'Docente'; });
        var mail = document.querySelectorAll('[data-user-email]');
        mail.forEach(function (el) { el.textContent = user.email || ''; });
        var photo = document.querySelectorAll('[data-user-photo]');
        photo.forEach(function (img) { if (user.photoURL) img.src = user.photoURL; });
        var ini = document.querySelectorAll('[data-user-initial]');
        ini.forEach(function (el) { el.textContent = ((user.displayName || user.email || '?').trim()[0] || '?').toUpperCase(); });
      } else {
        window.location.replace(LOGIN);
      }
      return;
    }

    reveal();
  });
})();
