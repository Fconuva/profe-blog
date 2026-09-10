/* Cálculos compartidos por el dashboard y sus pruebas; sin acceso a Firebase. */
(function (root) {
    'use strict';
    function monto(v) { return typeof v === 'number' && Number.isFinite(v) && v >= 0; }
    function sinCobro(p) {
        return p.noCobrar === true || p.archivado === true || p.liberado === true
            || ['baja', 'duplicado', 'devuelto', 'gratis'].includes(p.paymentStatus)
            || ['no_cobrar', 'excluido'].includes((p.cartera || {}).tramoCobro);
    }
    function saldo(p, precio, pagado) {
        if (sinCobro(p)) return 0;
        if (monto((p.cartera || {}).saldo)) return p.cartera.saldo;
        if (monto(p.saldoPendiente)) return p.saldoPendiente;
        if (['approved', 'aprobado', 'pagado'].includes(p.paymentStatus)) return 0;
        return precio > 0 ? Math.max(0, precio - pagado) : null;
    }
    function dia(v) { return /^\d{4}-\d{2}-\d{2}/.test(String(v || '')) ? String(v).slice(0, 10) : ''; }
    function hoyChile(now) {
        return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now || new Date());
    }
    function ultimoPago(p) {
        var c = p.cartera || {};
        if (c.fuentePago === '_gestion/LIBRO_DE_CAJA.jsonl') return dia(c.ultimoPagoFecha);
        return [p.paidAt, p.paymentConfirmedAt].concat(Object.values(p.abonos || {}).filter(a => a && a.monto > 0).map(a => a.fecha)).map(dia).filter(Boolean).sort().pop() || '';
    }
    function sumarDias(fecha, dias) {
        var d = new Date(fecha + 'T12:00:00Z');
        if (!Number.isFinite(d.getTime())) return '';
        d.setUTCDate(d.getUTCDate() + dias);
        return d.toISOString().slice(0, 10);
    }
    function bucket(fecha, hoy) {
        if (!dia(fecha)) return 'sin-fecha';
        if (fecha <= hoy) return 'ahora';
        if (fecha <= '2026-08-31') return 'fin-agosto';
        if (fecha <= '2026-09-15') return 'mitad-septiembre';
        if (fecha <= '2026-09-30') return 'fin-septiembre';
        return 'despues-septiembre';
    }
    function agenda(p, base, hoy) {
        var c = p.cartera || {}, cp = p.compromisoPago || {}, restante = base.saldo, eventos = [];
        if (!(restante > 0) || sinCobro(p)) return eventos;
        function agregar(fecha, importe, estado, evidencia, ventana, grupo) {
            var n = Math.min(restante, Math.max(0, Number(importe) || 0));
            if (!n) return;
            eventos.push(Object.assign({}, base, { fecha: dia(fecha), monto: n, estado: estado,
                evidencia: evidencia || '', ventana: ventana || '', bucket: grupo || bucket(dia(fecha), hoy) }));
            restante -= n;
        }
        if (cp.estado === 'pausado' || c.tramoCobro === 'pausado') {
            agregar('', restante, 'pausado', cp.evidencia || c.proximoCobroMotivo, cp.ventana, 'pausado');
        } else if (c.tramoCobro === 'esperar_m1') {
            agregar('', restante, 'esperar-m1', c.proximoCobroMotivo, 'Hasta entregar M1', 'esperar-m1');
        } else if (p.seguimientoAntecedentes && p.seguimientoAntecedentes.estado === 'esperando_antecedentes') {
            agregar('', restante, 'sin-fecha', 'Antecedentes comprometidos para ' + p.seguimientoAntecedentes.fechaCompromiso + '. No es una promesa de pago ni una baja automática.');
        } else if (c.revisionIdentidad === 'pendiente') {
            agregar('', restante, 'fecha-incompleta', c.proximoCobroMotivo, 'Revisar identidad antes de cobrar');
        } else {
            var cuotas = Object.values(c.cuotasAcordadas || {}).filter(q => q && q.estado === 'pendiente');
            var campana = c.tramoCobro === 'cobrar_1_septiembre';
            var reciente = c.estadoCobranza === 'ESPERAR_PAGO_RECIENTE';
            var acordado = ['ACORDADO', 'ESPERAR_CUOTA_ACORDADA'].includes(c.estadoCobranza) || c.compromisoEstructurado === 'CONFIRMADO';
            var carteraPosterior = !campana && !reciente && dia(c.proximoCobroFecha)
                && (acordado || cp.estado !== 'confirmado') && dia(c.actualizadoEn) >= dia(cp.actualizadoEn);
            if (cuotas.length) {
                cuotas.sort((a, b) => String(a.fecha).localeCompare(String(b.fecha))).forEach(q => agregar(q.fecha, q.monto, 'confirmado', c.proximoCobroMotivo));
            } else if (cp.estado === 'fecha-incompleta' || c.tramoCobro === 'plazo_sin_fecha') {
                agregar('', restante, 'fecha-incompleta', cp.evidencia || c.proximoCobroMotivo, cp.ventana || 'Día pendiente');
            } else if (carteraPosterior) {
                agregar(c.proximoCobroFecha, c.proximoCobroMonto || restante, acordado ? 'confirmado' : 'calculado', c.proximoCobroMotivo);
            } else if (cp.estado === 'confirmado' && Array.isArray(cp.pagos) && cp.pagos.length) {
                // Los pagos posteriores al acuerdo cubren primero sus cuotas más antiguas.
                var cubierto = Math.max(0, cp.pagos.reduce((s, q) => s + (Number(q.monto) || 0), 0) - restante);
                cp.pagos.slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha))).forEach(q => {
                    var importe = Math.max(0, Number(q.monto) || 0), usado = Math.min(cubierto, importe);
                    cubierto -= usado;
                    agregar(q.fecha, importe - usado, 'confirmado', cp.evidencia);
                });
            } else if (c.tramoCobro === 'sin_fecha') {
                agregar('', restante, 'sin-fecha', c.proximoCobroMotivo || cp.evidencia);
            } else if (ultimoPago(p)) {
                agregar(sumarDias(ultimoPago(p), 30), c.proximoCobroMonto || restante, 'calculado', 'Fecha operativa: 30 días después del último abono (' + ultimoPago(p) + '). No es una promesa del docente.');
            } else {
                agregar('', restante, 'sin-fecha', 'Sin fecha de pago acordada. ' + (c.proximoCobroMotivo || ''));
            }
        }
        if (restante > 0) agregar('', restante, 'sin-fecha', 'Resto del saldo sin fecha; no se considera una cuota pactada.');
        return eventos;
    }
    var api = { saldo, sinCobro, ultimoPago, hoyChile, bucket, agenda };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.FinanzasAdmin = api;
})(typeof window !== 'undefined' ? window : globalThis);
