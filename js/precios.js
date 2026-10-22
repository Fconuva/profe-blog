// Fuente única de precios del panel del docente, igual a la portada (index.njk).
// Si cambia un valor aquí, cambia también en index.njk: es lo que el docente leyó antes de inscribirse.
(function (root) {
    var PRECIOS = {
        completo: 200000,
        modulo1: 79990,
        modulo2: 99990,
        modulo3: 79990,
        revision: { modulo1: 25000, modulo2: 30000, modulo3: 20000 },
        cuotasMax: 2,
        cuotasTexto: 'hasta 2 cuotas'
    };

    // Los planes a la medida suman sus módulos sueltos, como dice la portada.
    var MODULOS_DEL_PLAN = {
        completo: null,
        modulo1: ['modulo1'],
        modulo2: ['modulo2'],
        modulo3: ['modulo3'],
        m1m2: ['modulo1', 'modulo2'],
        m1m3: ['modulo1', 'modulo3'],
        m2m3: ['modulo2', 'modulo3']
    };

    function formatear(monto) {
        return '$' + Number(monto).toLocaleString('es-CL');
    }

    function montoPlan(plan) {
        if (plan === 'completo') return PRECIOS.completo;
        var modulos = MODULOS_DEL_PLAN[plan];
        if (!modulos) return 0;
        return modulos.reduce(function (total, m) { return total + PRECIOS[m]; }, 0);
    }

    // Rellena los textos marcados con data-precio="completo|modulo1|…" y data-precio="cuotas".
    function pintar(doc) {
        var nodos = (doc || root.document).querySelectorAll('[data-precio]');
        Array.prototype.forEach.call(nodos, function (el) {
            var clave = el.getAttribute('data-precio');
            if (clave === 'cuotas') el.textContent = PRECIOS.cuotasTexto;
            else if (typeof PRECIOS[clave] === 'number') el.textContent = formatear(PRECIOS[clave]);
        });
    }

    var api = { PRECIOS: PRECIOS, formatear: formatear, montoPlan: montoPlan, pintar: pintar };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.Precios = api;
})(typeof window !== 'undefined' ? window : this);
