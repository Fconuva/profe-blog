/**
 * Sistema de Protección Anticopia y Privacidad (Estudia CEST / Profe Francisco)
 * Previene: Copiado, arrastre de texto, clic derecho, combinaciones de herramientas de desarrollo (F12, Ctrl+U, etc.),
 * guardado de página, impresión, y capturas de pantalla integradas difuminando la pantalla cuando el foco se pierde.
 */

(function () {
    // 1. Inyección Dinámica de Reglas de CSS para anular selección de texto e impresión
    const cssRules = `
        /* Desactivar selección de texto global en elementos sensibles */
        body, p, span, li, button, h1, h2, h3, h4, h5, h6, .p-text, .option-item, .q-header, .text-title, .text-source {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            cursor: default !important;
        }

        /* Permitir selección únicamente en inputs y áreas de respuesta */
        input, textarea, select, option, .p-note-input {
            -webkit-user-select: auto !important;
            -moz-user-select: auto !important;
            -ms-user-select: auto !important;
            user-select: auto !important;
            cursor: text !important;
        }

        /* Difuminado suave para efectos de pérdida de foco */
        body {
            transition: filter 0.15s ease-in-out !important;
        }

        /* Ocultar el contenido al intentar imprimir o guardar como PDF (Ctrl+P) */
        @media print {
            body, html {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    if (styleEl.styleSheet) {
        styleEl.styleSheet.cssText = cssRules;
    } else {
        styleEl.appendChild(document.createTextNode(cssRules));
    }
    document.head.appendChild(styleEl);

    // 2. Deshabilitar Clic Derecho (Menú Contextual)
    document.addEventListener('contextmenu', function (e) {
        // Permitir clic derecho en campos de texto (ej. anotaciones de notas de párrafo)
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
            return;
        }
        e.preventDefault();
        showWarningToast('El menú contextual está deshabilitado para proteger este material.');
    }, false);

    // 3. Deshabilitar Selección y Arrastre de Texto
    document.addEventListener('selectstart', function (e) {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
            return;
        }
        e.preventDefault();
    });

    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
    });

    // 4. Bloquear Copia e Infiltrar Portapapeles (Clipboard Hijacking)
    document.addEventListener('copy', function (e) {
        e.clipboardData.setData('text/plain', 'Este contenido está protegido por derechos de autor. Copia deshabilitada.');
        e.preventDefault();
        showWarningToast('La copia de contenido está estrictamente deshabilitada.');
    });

    document.addEventListener('cut', function (e) {
        e.preventDefault();
    });

    // 5. Bloquear combinaciones de teclado de herramientas de desarrollo, impresión, guardado y copiado
    document.addEventListener('keydown', function (e) {
        const key = e.key.toLowerCase();
        const isCmdOrCtrl = e.ctrlKey || e.metaKey;

        // F12 (Herramientas de desarrollo)
        if (e.key === 'F12') {
            e.preventDefault();
            showWarningToast('Las herramientas de desarrollo están deshabilitadas.');
            return false;
        }

        // Ctrl+Shift+I / Ctrl+Shift+C / Ctrl+Shift+J (Consola / Inspección)
        if (isCmdOrCtrl && e.shiftKey && ['i', 'c', 'j'].includes(key)) {
            e.preventDefault();
            showWarningToast('El inspector de elementos está deshabilitado.');
            return false;
        }

        // Ctrl+U (Ver código fuente)
        if (isCmdOrCtrl && key === 'u') {
            e.preventDefault();
            showWarningToast('No está permitido ver el código fuente de esta página.');
            return false;
        }

        // Ctrl+C (Copiar) y Ctrl+X (Cortar)
        if (isCmdOrCtrl && ['c', 'x'].includes(key)) {
            if (e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                showWarningToast('La copia de contenido está deshabilitada.');
                return false;
            }
        }

        // Ctrl+S (Guardar página)
        if (isCmdOrCtrl && key === 's') {
            e.preventDefault();
            showWarningToast('No se permite guardar esta página de manera local.');
            return false;
        }

        // Ctrl+P (Imprimir)
        if (isCmdOrCtrl && key === 'p') {
            e.preventDefault();
            showWarningToast('La impresión de este contenido está prohibida.');
            return false;
        }
    });

    // 6. Anti-Captura de Pantalla: Difuminado cuando el estudiante cambia de pestaña o desenfoca la ventana
    // Esto previene que se use la herramienta de recortes (Snipping Tool) o capturadoras externas, ya que éstas provocan "blur"
    window.addEventListener('blur', function () {
        document.body.style.filter = 'blur(25px)';
    });

    window.addEventListener('focus', function () {
        document.body.style.filter = 'none';
    });

    // 7. Limpieza del portapapeles al presionar ReImpr (PrintScreen) u otras combinaciones
    window.addEventListener('keyup', function (e) {
        if (e.key === 'PrintScreen') {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText('Contenido Protegido - Estudia CEST');
            }
            showWarningToast('Las capturas de pantalla están restringidas para esta sesión.');
        }
    });

    // 8. Ocultar contenido proactivamente en los eventos de impresión nativos
    window.addEventListener('beforeprint', function () {
        document.body.style.display = 'none';
    });

    window.addEventListener('afterprint', function () {
        document.body.style.display = 'block';
    });

    // Función auxiliar para desplegar feedback
    function showWarningToast(message) {
        // Intentar usar el toast existente de la web
        const existingToast = document.getElementById('toast');
        if (existingToast) {
            existingToast.textContent = message;
            existingToast.classList.add('show');
            setTimeout(() => {
                existingToast.classList.remove('show');
            }, 3500);
            return;
        }

        // Si no hay toast, construir un banner elegante flotante temporal
        let banner = document.getElementById('security-toast-warning');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'security-toast-warning';
            banner.style.cssText = `
                position: fixed;
                top: 24px;
                left: 50%;
                transform: translateX(-50%);
                background: #b91c1c;
                color: #ffffff;
                padding: 12px 24px;
                border-radius: 8px;
                font-family: system-ui, -apple-system, sans-serif;
                font-size: 13.5px;
                font-weight: 700;
                box-shadow: 0 10px 25px rgba(185, 28, 28, 0.4);
                z-index: 999999;
                pointer-events: none;
                transition: opacity 0.3s, transform 0.3s;
                opacity: 0;
            `;
            document.body.appendChild(banner);
        }

        banner.style.transform = 'translateX(-50%) translateY(0)';
        banner.textContent = message;
        banner.style.opacity = '1';

        // Timer para desvanecer
        if (window.securityToastTimer) {
            clearTimeout(window.securityToastTimer);
        }
        window.securityToastTimer = setTimeout(() => {
            banner.style.opacity = '0';
            banner.style.transform = 'translateX(-50%) translateY(-10px)';
        }, 3500);
    }
})();
