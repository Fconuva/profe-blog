/* Una sola cuenta para el portal PAES y Mi espacio. */
(function (global) {
  'use strict';
  const BASE = 'plataforma_estudiantes';
  const COURSES = new Set(['3°A HC', '3°B HC', '4°A HC', '4°B HC']);
  const CONFIG = {
    apiKey: 'AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w',
    authDomain: 'estudiacest.firebaseapp.com',
    databaseURL: 'https://estudiacest-default-rtdb.firebaseio.com',
    projectId: 'estudiacest',
    storageBucket: 'estudiacest.firebasestorage.app',
    messagingSenderId: '999002169815',
    appId: '1:999002169815:web:51203237bc77c2e74deb92'
  };
  const cleanRut = value => String(value || '').replace(/[^0-9kK]/g, '').toUpperCase();
  const cleanCourse = value => String(value || '').replace(/[^0-9A-Z]/gi, '').toUpperCase();
  let clientPromise;

  function rosterEntry(rut) {
    const roster = typeof NOMINAS_PAES === 'undefined' ? [] : NOMINAS_PAES;
    return roster.find(student => cleanRut(student.rut) === cleanRut(rut)) || null;
  }
  function hasSpace(student) {
    return !!student && !student.es_prueba && COURSES.has(student.curso);
  }
  function client() {
    if (!clientPromise) clientPromise = (async () => {
      const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(CONFIG);
      const auth = app.auth();
      const db = app.database();
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      await new Promise((resolve, reject) => {
        let unsubscribe;
        unsubscribe = auth.onAuthStateChanged(() => {
          if (unsubscribe) unsubscribe();
          resolve();
        }, reject);
      });
      return { auth, db };
    })();
    return clientPromise;
  }
  async function sessionFor(user) {
    if (!user) return null;
    const { db } = await client();
    const snapshot = await db.ref(BASE + '/estudiantes/' + user.uid).once('value');
    const profile = snapshot.val();
    const student = profile && rosterEntry(profile.rut);
    if (!hasSpace(student) || profile.ocultarDeCasas === true ||
        cleanCourse(profile.curso) !== cleanCourse(student.curso)) return null;
    return { user, profile, student };
  }
  async function restore() {
    const { auth } = await client();
    return sessionFor(auth.currentUser);
  }
  function remember(session) {
    // La selección antigua nunca prevalece sobre la cuenta autenticada.
    sessionStorage.setItem('paes_student', JSON.stringify(session.student));
  }
  async function signIn(rut, password) {
    const { auth } = await client();
    const normalizedRut = cleanRut(rut);
    if (!hasSpace(rosterEntry(normalizedRut))) throw new Error('Esta cuenta no tiene Mi espacio habilitado.');
    let credential;
    let response;
    try {
      response = await fetch('/api/lecturas-login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut: normalizedRut, password })
      });
    } catch (_) { /* Firebase Auth también permite ingresar con la clave propia. */ }
    if (response && [401, 403].includes(response.status)) {
      throw new Error('RUT o contraseña incorrectos, o cuenta no habilitada.');
    }
    if (response && response.ok) {
      const data = await response.json();
      if (data.token) credential = await auth.signInWithCustomToken(data.token);
      else if (!data.fallback) throw new Error('No se pudo iniciar sesión. Inténtalo nuevamente.');
    }
    if (!credential) credential = await auth.signInWithEmailAndPassword(
      normalizedRut.toLowerCase() + '@est.estudiacest.com', password
    );
    const session = await sessionFor(credential.user);
    if (!session || cleanRut(session.student.rut) !== normalizedRut) {
      await auth.signOut();
      throw new Error('Tu cuenta no tiene un perfil PAES habilitado.');
    }
    remember(session);
    return session;
  }
  async function signOut() {
    const { auth } = await client();
    await auth.signOut();
    sessionStorage.removeItem('paes_student');
  }
  function errorMessage(error) {
    if (error && error.code === 'auth/network-request-failed') return 'No hay conexión. Revisa tu internet e inténtalo nuevamente.';
    if (error && error.code === 'auth/too-many-requests') return 'Espera un momento e intenta ingresar nuevamente.';
    if (error && String(error.code || '').startsWith('auth/')) return 'RUT o contraseña incorrectos.';
    return error && error.message || 'No se pudo recuperar tu sesión. Inténtalo nuevamente.';
  }
  global.PaesStudentSession = { client, restore, sessionFor, remember, signIn, signOut, hasSpace, rosterEntry, errorMessage };
})(window);
