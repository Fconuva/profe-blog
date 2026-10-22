// Mensajes en español para los errores de Firebase (Auth y Storage) y de red.
// Firebase entrega error.message en inglés; al docente nunca se le muestra ese texto.
(function (root) {
    var MENSAJES = {
        'auth/email-already-in-use': 'Este correo ya está registrado. ¿Quieres ingresar en su lugar?',
        'auth/invalid-email': 'El correo no es válido. Revisa que esté bien escrito.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/missing-password': 'Escribe una contraseña.',
        'auth/user-disabled': 'Esta cuenta está desactivada. Escríbenos por WhatsApp y lo vemos.',
        'auth/user-not-found': 'No encontramos una cuenta con ese correo.',
        'auth/wrong-password': 'La contraseña no coincide.',
        'auth/invalid-credential': 'El correo o la contraseña no coinciden.',
        'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e intenta de nuevo.',
        'auth/network-request-failed': 'No hay conexión a internet. Revisa tu red e intenta de nuevo.',
        'auth/popup-closed-by-user': 'La ventana de Google fue cerrada. Intenta de nuevo.',
        'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Activa las ventanas emergentes e intenta de nuevo.',
        'auth/account-exists-with-different-credential': 'Esta cuenta ya está registrada con otro método. Intenta con tu correo y contraseña.',
        'auth/operation-not-allowed': 'Este método de ingreso no está disponible. Escríbenos por WhatsApp.',
        'storage/unauthorized': 'No tienes permiso para subir este archivo. Escríbenos por WhatsApp.',
        'storage/unauthenticated': 'Tu sesión se cerró. Vuelve a ingresar e intenta de nuevo.',
        'storage/canceled': 'La subida se canceló.',
        'storage/quota-exceeded': 'No queda espacio para subir archivos. Escríbenos por WhatsApp.',
        'storage/retry-limit-exceeded': 'La conexión está lenta y la subida no terminó. Intenta de nuevo.'
    };

    // Recibe un error (o su código) y devuelve un texto en español.
    // Si no lo reconoce, devuelve `porDefecto`; nunca el mensaje original en inglés.
    function mensajeError(error, porDefecto) {
        var codigo = typeof error === 'string' ? error : (error && error.code) || '';
        if (MENSAJES[codigo]) return MENSAJES[codigo];
        var texto = error && error.message ? String(error.message) : '';
        if (/failed to fetch|networkerror|load failed|network request failed/i.test(texto)) {
            return MENSAJES['auth/network-request-failed'];
        }
        return porDefecto || 'Algo falló. Intenta de nuevo y, si se repite, escríbenos por WhatsApp.';
    }

    var api = { MENSAJES: MENSAJES, mensajeError: mensajeError };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.mensajeError = mensajeError;
})(typeof window !== 'undefined' ? window : this);
