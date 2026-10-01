// api/_salas.js
// Salas de Mi espacio: quién está en cada casa y el chat de la casa.
//
// No es una función de Vercel por sí misma (los archivos con guion bajo no se
// despliegan como funciones): el plan Hobby admite 12 y ya están ocupadas. Se
// enruta desde api/estudiantes.js con las acciones `salas-entrar`, `salas-lista`,
// `salas-latido`, `salas-salir`, `salas-decir`, `salas-atender` y `salas-regalar`.
//
// Todo lo que escribe el chat pasa por aquí, con credenciales de servidor. El
// cliente solo LEE el nodo `salas` (regla .read para estudiantes registrados);
// no puede escribir ni una letra sin que el filtro la revise primero.
//
// Reglas de la sala:
//  - Tope de 30 presentes por casa; quien no da señales de vida en 60 s se cae.
//  - Un mensaje cada 1,5 s por persona, máximo 200 caracteres.
//  - Lo que el filtro bloquea no se publica: queda en `bloqueados_chat` para el
//    profesor. Lo que el filtro marca como alerta SÍ se publica, y además va a
//    `alertas_chat`: esconder "me quiero morir" esconde el pedido de ayuda.
//  - El chat de cada casa conserva los últimos 100 mensajes.

'use strict';

const admin = require('firebase-admin');
const { randomUUID } = require('node:crypto');
const { revisar } = require('./_filtro-garabatos.js');
const { visiblesDeCurso } = require('./_nombre-visible.js');
const CATALOGO_CASA = require('../estudiantes/js/catalogo-casa.js');
const MAPAS_CASA = require('../estudiantes/js/mapas-casa.js');
const PREMIOS_PAES = require('./_premios-paes.js');
const EXPERIENCIA_DOCENTE = require('./_experiencia-docente.js');
const PERSONAJE = require('../estudiantes/js/personaje-iso.js');
const PREMIOS_AVATAR = PERSONAJE.catalogoPremios();
const PREMIOS_AVATAR_POR_ID = new Map(PREMIOS_AVATAR.map(p=>[p.id,p]));

const BASE = 'plataforma_estudiantes';
const TOPE_SALA = 30;
const VIDA_MS = 60 * 1000;
const ENTRE_MENSAJES_MS = 1500;
const LARGO_MAX = 200;
const HISTORIAL = 100;
const CONFIG_PATH = `${BASE}/configuracion/mi_espacio`;
const RECOMPENSAS_PATH = `${BASE}/configuracion/recompensas_muebles`;
const CATALOGO_POR_ID = new Map(CATALOGO_CASA.map(mueble => [mueble.id, mueble]));

async function estadoMiEspacio(db) {
    const value = (await db.ref(CONFIG_PATH).once('value')).val() || {};
    return { enabled: value.enabled === true, updatedAt: Number(value.updatedAt || 0) };
}

function idFuente(valor) {
    const id = String(valor || '').trim();
    return /^[A-Za-z0-9_-]{3,100}$/.test(id) ? id : null;
}

function normalizarRegla(id, valor) {
    if (!valor || valor.activa === false) return null;
    const tipo = valor.tipo === 'tarea' ? 'tarea' : 'sesion';
    const fuente = idFuente(valor.fuente);
    const fuentes = [];
    if (fuente) fuentes.push(fuente);
    Object.keys(valor.fuentes || {}).forEach(clave => {
        const normalizada = idFuente(clave);
        if (normalizada && valor.fuentes[clave] === true && !fuentes.includes(normalizada)) fuentes.push(normalizada);
    });
    const muebles = Object.keys(valor.muebles || {}).filter(mueble =>
        valor.muebles[mueble] === true && CATALOGO_POR_ID.has(mueble) && Number(CATALOGO_POR_ID.get(mueble).xp || 0) > 0
    );
    if (!fuentes.length || !muebles.length) return null;
    return {
        id,
        tipo,
        fuente: fuentes[0],
        fuentes,
        titulo: String(valor.titulo || fuentes[0]).trim().slice(0, 140),
        nombreSet: String(valor.nombreSet || (muebles.length === 1 ? 'Mueble' : 'Set de muebles')).trim().slice(0, 80),
        muebles,
        updatedAt: Number(valor.updatedAt || 0)
    };
}

async function leerReglasRecompensa(db) {
    const valor = (await db.ref(RECOMPENSAS_PATH).once('value')).val() || {};
    return Object.keys(valor).map(id => normalizarRegla(id, valor[id])).filter(Boolean);
}

function entregaCanonica(valor) {
    return !!valor && valor.submitted === true && valor.completada === true;
}

async function inventarioPorTareas(db, yo) {
    const reglas = await leerReglasRecompensa(db);
    if (yo.esAdmin) return { desbloqueados: {}, requisitos: {}, reglas };

    const lecturas = new Map();
    const leerEntrega = (tipo, fuente) => {
        const ruta = tipo === 'tarea'
            ? `${BASE}/tareas/${fuente}/${yo.uid}`
            : `${BASE}/respuestas/${fuente}/${yo.uid}`;
        if (!lecturas.has(ruta)) lecturas.set(ruta, db.ref(ruta).once('value').then(snap => snap.val()));
        return lecturas.get(ruta);
    };

    const evaluadas = await Promise.all(reglas.map(async regla => {
        const valores = await Promise.all(regla.fuentes.map(fuente => leerEntrega(regla.tipo, fuente)));
        const completa = valores.some(valor => regla.tipo === 'tarea' ? !!(valor && valor.completada === true) : entregaCanonica(valor));
        return { regla, completa };
    }));

    const desbloqueados = {};
    const requisitos = {};
    evaluadas.forEach(({ regla, completa }) => {
        regla.muebles.forEach(mueble => {
            if (!requisitos[mueble]) requisitos[mueble] = [];
            requisitos[mueble].push({
                regla: regla.id,
                tipo: regla.tipo,
                fuente: regla.fuente,
                titulo: regla.titulo,
                nombreSet: regla.nombreSet
            });
            if (completa) desbloqueados[mueble] = {
                regla: regla.id,
                titulo: regla.titulo,
                nombreSet: regla.nombreSet
            };
        });
    });
    return { desbloqueados, requisitos };
}

async function inventarioConRegalos(db, yo) {
    const [porTareas, regalosSnap] = await Promise.all([
        inventarioPorTareas(db, yo),
        db.ref(`${BASE}/avatar/${yo.uid}`).once('value')
    ]);
    const avatar = regalosSnap.val() || {};
    const regalosCrudos = avatar.regalos || {};
    const regalos = {};
    Object.keys(regalosCrudos).forEach(id => {
        if (CATALOGO_POR_ID.has(id) && regalosCrudos[id] && typeof regalosCrudos[id] === 'object') regalos[id] = regalosCrudos[id];
    });
    const requisitos = {...PREMIOS_PAES.requisitos(yo.curso), ...porTareas.requisitos};
    Object.keys(regalosCrudos).forEach(id=>{ if(PREMIOS_AVATAR_POR_ID.has(id) && regalosCrudos[id] && typeof regalosCrudos[id]==='object') regalos[id]=regalosCrudos[id]; });
    return { ...porTareas, requisitos, regalos, xpTotal:EXPERIENCIA_DOCENTE.estado(avatar).xpTotal };
}

async function premiosAvatarDocente(req,res,db,yo){
    const estudiante=await estudianteAdministrable(db,yo,req.body.estudiante);
    const ref=db.ref(`${BASE}/avatar/${estudiante.uid}/regalos`);
    if(req.body.confirmar===true){
        const premio=PREMIOS_AVATAR_POR_ID.get(String(req.body.premio||''));
        if(!premio)return res.status(400).json({error:'Premio no válido.'});
        const regaloRef=db.ref(`${BASE}/avatar/${estudiante.uid}/regalos/${premio.id}`);
        await regaloRef.transaction(actual=>actual || {de:'Profe',tipo:'docente',premio:premio.tipo,otorgadoPor:yo.uid,ts:Date.now()});
        if(!(await regaloRef.once('value')).exists())return res.status(500).json({error:'No se pudo confirmar el premio.'});
    }
    const regalos=(await ref.once('value')).val()||{};
    res.setHeader('Cache-Control','private, no-store');
    return res.status(200).json({ok:true,estudiante,catalogo:PREMIOS_AVATAR.map(p=>({...p,tiene:!!regalos[p.id]}))});
}

function muebleEnSuelo(casa, col, fila) {
    const tamano = String((casa || {}).tamano || '5x5');
    const mapa = MAPAS_CASA.obtener(tamano);
    const max = mapa || (tamano === '7x7' ? { cols:7, filas:7 } : { cols:5, filas:5 });
    return Number.isInteger(col) && Number.isInteger(fila) && col >= 0 && fila >= 0 &&
        col < max.cols && fila < max.filas && (!mapa || MAPAS_CASA.haySuelo(tamano, col, fila));
}

function validarPieza(raw, casa, regalos, desbloqueados) {
    if (!Array.isArray(raw) || raw.length > 80) return null;
    const veces = new Map();
    const limpia = [];
    for (const p of raw) {
        const ficha = p && CATALOGO_POR_ID.get(String(p.id || ''));
        if (!ficha || ficha.acabado) return null;
        const n = (veces.get(ficha.id) || 0) + 1;
        veces.set(ficha.id, n);
        if (Number(ficha.xp || 0) > 0 &&
            (!(regalos && regalos[ficha.id]) && !(desbloqueados && desbloqueados[ficha.id]) || n > 1)) return null;
        if (p.pared) {
            if(ficha.fam==='terraza')return null;
            if (!['izq', 'der'].includes(p.pared) || !Number.isInteger(p.pos) || p.pos < 0 || p.pos > 6 ||
                !Number.isInteger(p.nivel) || p.nivel < 0 || p.nivel > 2) return null;
            limpia.push({ id:ficha.id, pared:p.pared, pos:p.pos, nivel:p.nivel });
        } else {
            if(ficha.huella && p.sobre)return null;
            if (!muebleEnSuelo(casa, p.col, p.fila) || !MAPAS_CASA.celdas(ficha,p).every(c=>muebleEnSuelo(casa,c.col,c.fila))) return null;
            limpia.push({ id:ficha.id, col:p.col, fila:p.fila,
                dir:['SE','SW','NE','NW'].includes(p.dir) ? p.dir : 'SE',
                sobre:p.sobre === true, encendido:p.encendido === true });
        }
    }
    // Las piezas nuevas de varias casillas no pueden invadir otra pieza de
    // su misma capa. No se invalida por esto un solapamiento histórico 1×1.
    for(let i=0;i<limpia.length;i++)for(let j=i+1;j<limpia.length;j++){
        const a=limpia[i],b=limpia[j],fa=CATALOGO_POR_ID.get(a.id),fb=CATALOGO_POR_ID.get(b.id);
        if(a.pared||b.pared||a.sobre||b.sobre||!!fa.plano!==!!fb.plano||(!fa.huella&&!fb.huella))continue;
        if(MAPAS_CASA.celdas(fa,a).some(c=>MAPAS_CASA.ocupa(fb,b,c.col,c.fila)))return null;
    }
    return limpia;
}

async function guardarCasa(req,res,db,yo){
    if(yo.esAdmin)return res.status(403).json({error:'Solo estudiantes.'});
    const raw=req.body.casa;
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return res.status(400).json({error:'Habitación no válida.'});
    if(['piso','muro','tamano'].some(k=>raw[k]!==undefined&&(typeof raw[k]!=='string'||raw[k].length>40)))return res.status(400).json({error:'Habitación no válida.'});
    const casa={piso:raw.piso||'claro',muro:raw.muro||'blanco',tamano:raw.tamano||'5x5'};
    const pisos={claro:0,roble:200,gris:200,azul:600,verde:600,rosa:1000,morado:1000,negro:1800};
    const muros={blanco:0,crema:150,celeste:400,verde:400,lila:800,gris:800,rojo:1500,oscuro:1800};
    const acabado=CATALOGO_CASA.find(m=>m.acabado?.id===casa.muro);
    const inventario=await inventarioPorTareas(db,yo),ref=db.ref(`${BASE}/avatar/${yo.uid}`);
    let error='No puedes usar un acabado no recibido o dejar muebles fuera.';
    const result=await ref.transaction(value=>{
        const av=value||{},xp=EXPERIENCIA_DOCENTE.estado(av).xpTotal;
        const posee=id=>!!av.regalos?.[id]||!!inventario.desbloqueados[id];
        if(!['5x5','7x7'].includes(casa.tamano)&&!MAPAS_CASA.obtener(casa.tamano))return;
        if(casa.piso==='pasto'?!posee('terraceGrass'):!(Object.hasOwn(pisos,casa.piso)&&xp>=pisos[casa.piso]))return;
        if(acabado?!posee(acabado.id):!(Object.hasOwn(muros,casa.muro)&&xp>=muros[casa.muro]))return;
        if((av.pieza||[]).some(p=>!p.pared&&!MAPAS_CASA.celdas(CATALOGO_POR_ID.get(p.id),p).every(c=>muebleEnSuelo(casa,c.col,c.fila))))return;
        error='';return {...av,casa:{...(av.casa||{}),piso:casa.piso,muro:casa.muro,tamano:casa.tamano}};
    },undefined,false);
    if(!result.committed)return res.status(409).json({error});
    const saved=(await ref.once('value')).val()?.casa;
    if(!saved||saved.piso!==casa.piso||saved.muro!==casa.muro||saved.tamano!==casa.tamano)return res.status(500).json({error:'No se pudo confirmar la habitación.'});
    return res.status(200).json({ok:true,casa:saved});
}

async function guardarPieza(req, res, db, yo) {
    if (yo.esAdmin) return res.status(403).json({ error:'Solo estudiantes.' });
    const inventario = await inventarioPorTareas(db, yo);
    const ref = db.ref(`${BASE}/avatar/${yo.uid}`);
    let motivo = 'No puedes colocar un mueble que no tienes ni duplicar un premio.';
    const resultado = await ref.transaction(actual => {
        const avatar = actual && typeof actual === 'object' ? actual : {};
        const pieza = validarPieza(req.body.pieza, avatar.casa, avatar.regalos, inventario.desbloqueados);
        if (!pieza) return;
        motivo = '';
        return { ...avatar, pieza };
    }, undefined, false);
    if (!resultado.committed) return res.status(409).json({ ok:false, error:motivo });
    const releido = (await db.ref(`${BASE}/avatar/${yo.uid}/pieza`).once('value')).val();
    if (!Array.isArray(releido) && !(releido === null && req.body.pieza.length === 0)) {
        return res.status(500).json({ error:'No se pudo confirmar la habitación.' });
    }
    return res.status(200).json({ ok:true, pieza:releido || [] });
}

async function estudianteAdministrable(db, yo, uidSolicitado) {
    if (!yo.esAdmin) { const e = new Error('Solo el profesor.'); e.status = 403; throw e; }
    const uid = idSala(uidSolicitado);
    if (!uid) { const e = new Error('Estudiante no válido.'); e.status = 400; throw e; }
    const [perfilSnap, docenteSnap] = await Promise.all([
        db.ref(`${BASE}/estudiantes/${uid}`).once('value'),
        db.ref(`${BASE}/docentes/${yo.uid}`).once('value')
    ]);
    const perfil = perfilSnap.val();
    if (!perfil) { const e = new Error('Estudiante no encontrado.'); e.status = 404; throw e; }
    const docente = docenteSnap.val();
    if (docente && docente.superadmin !== true) {
        const cursos = Array.isArray(docente.cursos)
            ? docente.cursos.map(String)
            : Object.keys(docente.cursos || {}).filter(clave => docente.cursos[clave] === true);
        if (!cursos.includes(String(perfil.curso || ''))) {
            const e = new Error('Ese estudiante no pertenece a tus cursos.'); e.status = 403; throw e;
        }
    }
    return { uid, nombre: String(perfil.nombre || 'Estudiante'), curso: String(perfil.curso || '') };
}

async function listarInventarioParaRegalo(req, res, db, yo) {
    const estudiante = await estudianteAdministrable(db, yo, req.body.estudiante);
    const inventario = await inventarioConRegalos(db, { ...estudiante, esAdmin: false });
    const catalogo = CATALOGO_CASA.filter(mueble => Number(mueble.xp || 0) > 0).map(mueble => {
        const regalo = inventario.regalos[mueble.id];
        const tarea = inventario.desbloqueados[mueble.id];
        let origen = '';
        if (regalo) origen = regalo.tipo === 'paes-automatico' ? `Guía ${regalo.guia} PAES completada` : regalo.tipo === 'docente' ? 'Regalo del profesor' : `Regalo de ${String(regalo.de || 'un compañero').slice(0, 80)}`;
        else if (tarea) origen = `Tarea completada: ${String(tarea.titulo || tarea.nombreSet || '').slice(0, 120)}`;
        return { id: mueble.id, nombre: mueble.nom, familia: mueble.fam, tiene: !!(regalo || tarea), origen };
    });
    return res.status(200).json({ ok: true, estudiante, catalogo });
}

async function entregarRegaloDocente(req, res, db, yo) {
    const estudiante = await estudianteAdministrable(db, yo, req.body.estudiante);
    const mueble = idMueble(req.body.mueble);
    const fichaMueble = mueble && CATALOGO_POR_ID.get(mueble);
    if (!fichaMueble || Number(fichaMueble.xp || 0) === 0) return res.status(400).json({ error: 'Mueble no válido.' });

    const inventario = await inventarioConRegalos(db, { ...estudiante, esAdmin: false });
    if (inventario.regalos[mueble] || inventario.desbloqueados[mueble]) {
        return res.status(200).json({ ok: true, yaLoTiene: true, mueble });
    }

    const ahora = Date.now();
    const destino = db.ref(`${BASE}/avatar/${estudiante.uid}/regalos/${mueble}`);
    const resultado = await destino.transaction(actual => actual || {
        de: 'Profe', ts: ahora, tipo: 'docente', otorgadoPor: yo.uid
    });
    if (!resultado.committed && !(await destino.once('value')).exists()) {
        return res.status(500).json({ error: 'No se pudo confirmar el regalo.' });
    }
    const releido = (await destino.once('value')).val();
    if (!releido || releido.tipo !== 'docente') {
        return res.status(200).json({ ok: true, yaLoTiene: true, mueble });
    }
    return res.status(200).json({ ok: true, mueble, nombre: fichaMueble.nom });
}

function entregaPaesParaPremio(guia, valor) {
    return PREMIOS_PAES.completada(guia, valor);
}

async function regalosPaesAutomaticos(req, res, db, yo) {
    if (!yo.esAdmin) return res.status(403).json({error:'Solo el profesor.'});
    const curso=String(req.body.curso||'');
    if (!PREMIOS_PAES.CURSOS.includes(curso)) return res.status(400).json({error:'Selecciona un curso PAES HC.'});
    const docente=(await db.ref(`${BASE}/docentes/${yo.uid}`).once('value')).val();
    const cursos=docente && (Array.isArray(docente.cursos)?docente.cursos:Object.keys(docente.cursos||{}).filter(id=>docente.cursos[id]===true));
    if (docente && docente.superadmin!==true && !cursos.includes(curso)) return res.status(403).json({error:'Ese curso no pertenece a tus cursos.'});
    const plan=await PREMIOS_PAES.planCurso(db,curso);
    res.setHeader('Cache-Control','private, no-store');
    if (req.body.confirmar!==true) return res.status(200).json({ok:true,...plan});
    if (req.body.firma!==plan.firma) return res.status(409).json({error:'La nómina o sus premios cambiaron. Revisa nuevamente.'});
    let entregados=0;const errores=[];
    for(const row of plan.destinatarios) {
        try {entregados+=await PREMIOS_PAES.entregar(db,row);} catch(_) {errores.push(row.uid);}
    }
    const releido=await PREMIOS_PAES.planCurso(db,curso);
    return res.status(200).json({ok:true,...releido,entregados,errores:errores.length});
}

// Primero simula; la confirmación vuelve a validar curso, tarea y la nómina exacta.
// Cada inventario se actualiza con una transacción y se relee: reintentar no duplica premios.
async function regalosPaesPorLote(req, res, db, yo) {
    if (!yo.esAdmin) return res.status(403).json({ error:'Solo el profesor.' });
    const { curso, estudiante, guia, confirmar } = req.body;
    const courses = ['3A-HC', '3B-HC', '4A-HC', '4B-HC'];
    if ((!estudiante && !courses.includes(curso)) || (guia && !/^(?:[1-9]|1[0-9]|2[01])$/.test(String(guia)))) {
        return res.status(400).json({ error:'Selecciona un curso HC y una guía válida.' });
    }
    const raw = req.body.muebles;
    if (!Array.isArray(raw) || raw.length > 12 || raw.some(id => !CATALOGO_POR_ID.has(id) || Number(CATALOGO_POR_ID.get(id).xp || 0) <= 0)) {
        return res.status(400).json({ error:'Elige entre uno y doce muebles del catálogo.' });
    }
    const muebles = [...new Set(raw)];
    const [profilesSnap, docenteSnap, entregaSnap] = await Promise.all([
        db.ref(`${BASE}/estudiantes`).once('value'),
        db.ref(`${BASE}/docentes/${yo.uid}`).once('value'),
        guia ? db.ref(`plataforma_paes/guia_respuestas/${guia}`).once('value') : Promise.resolve(null)
    ]);
    const docente = docenteSnap.val();
    const assigned = docente && (Array.isArray(docente.cursos) ? docente.cursos : Object.keys(docente.cursos || {}).filter(id => docente.cursos[id] === true));
    const profiles = profilesSnap.val() || {};
    if (estudiante && (!profiles[estudiante] || profiles[estudiante].ocultarDeCasas === true)) return res.status(404).json({ error:'Estudiante no disponible.' });
    const targetCourse = estudiante ? profiles[estudiante].curso : curso;
    if (!courses.includes(targetCourse) || (docente && docente.superadmin !== true && !assigned.includes(targetCourse))) {
        return res.status(403).json({ error:'Ese curso no pertenece a tus cursos PAES.' });
    }
    const todos = Object.entries(profiles).filter(([uid, perfil]) => perfil && perfil.ocultarDeCasas !== true &&
        perfil.curso === targetCourse && (!estudiante || uid === estudiante)).map(([uid, perfil]) => ({
        uid, nombre:String(perfil.nombre || 'Estudiante'), curso:perfil.curso,
        rut:String(perfil.rut || '').replace(/[.\s-]/g, '').toUpperCase()
    }));
    const entregas = entregaSnap ? entregaSnap.val() || {} : {};
    if (guia && todos.some((perfil, index) => perfil.rut && todos.some((otro, otroIndex) => otroIndex !== index && otro.rut === perfil.rut))) {
        return res.status(409).json({ error:'Hay cuentas duplicadas en la nómina. Revisa los perfiles antes de premiar por tarea.' });
    }
    const elegibles = todos.filter(perfil => !guia || (perfil.rut && entregaPaesParaPremio(guia, entregas[perfil.rut])));
    if (confirmar === true) {
        const esperados = req.body.destinatarios;
        const actuales = elegibles.map(item => item.uid).sort();
        if (!muebles.length || !actuales.length || !Array.isArray(esperados) ||
            JSON.stringify([...new Set(esperados)].sort()) !== JSON.stringify(actuales)) {
            return res.status(409).json({ error:'La nómina cambió o no hay destinatarios. Revisa la entrega de nuevo antes de confirmar.' });
        }
    }
    const resultados = [], cuentas = Object.fromEntries(CATALOGO_CASA.map(item => [item.id, 0]));
    // Acotar concurrencia para cursos completos, sin una escritura global de datos académicos.
    for (let start = 0; start < elegibles.length; start += 6) {
        const bloque = await Promise.all(elegibles.slice(start, start + 6).map(async perfil => {
            const target = {uid:perfil.uid, nombre:perfil.nombre, curso:perfil.curso, esAdmin:false};
            const inventario = await inventarioConRegalos(db, target);
            const tiene = id => !!(inventario.regalos[id] || inventario.desbloqueados[id]);
            Object.keys(cuentas).forEach(id => { if (tiene(id)) cuentas[id]++; });
            const faltan = muebles.filter(id => !tiene(id));
            const result = {uid:perfil.uid, nombre:perfil.nombre, faltan, yaTiene:muebles.filter(tiene), confirmado:false};
            if (confirmar !== true || !faltan.length) { result.confirmado = confirmar === true; return result; }
            try {
                const ref = db.ref(`${BASE}/avatar/${perfil.uid}/regalos`);
                await ref.transaction(actual => {
                    const regalos = {...(actual || {})};
                    faltan.forEach(id => { if (!regalos[id]) regalos[id] = {de:'Profe', ts:Date.now(), tipo:'docente', otorgadoPor:yo.uid, fuente:'paes', curso:targetCourse, guia:String(guia || '')}; });
                    return regalos;
                });
                const releido = (await ref.once('value')).val() || {};
                result.confirmado = faltan.every(id => !!releido[id]);
                if (!result.confirmado) result.error = 'No se pudo confirmar el inventario. Actualiza antes de reintentar.';
            } catch (_) { result.error = 'No se pudo confirmar esta entrega. Actualiza antes de reintentar.'; }
            return result;
        }));
        resultados.push(...bloque);
    }
    const catalogo = CATALOGO_CASA.filter(item => Number(item.xp || 0) > 0).map(item => ({
        id:item.id, nombre:item.nom, familia:item.fam, tienen:cuentas[item.id], tiene:elegibles.length > 0 && cuentas[item.id] === elegibles.length
    }));
    res.setHeader('Cache-Control', 'private, no-store');
    return res.status(200).json({ ok:true, confirmar:confirmar === true, totalCurso:todos.length,
        excluidos:todos.length - elegibles.length, destinatarios:resultados, catalogo,
        errores:resultados.filter(item => item.error).length });
}

async function listarRecompensas(req, res, db, yo) {
    if (!yo.esAdmin) return res.status(403).json({ error: 'Solo el profesor.' });
    return res.status(200).json({
        ok: true,
        reglas: await leerReglasRecompensa(db),
        catalogo: CATALOGO_CASA.filter(mueble => Number(mueble.xp || 0) > 0).map(mueble => ({
            id: mueble.id,
            nombre: mueble.nom,
            familia: mueble.fam
        }))
    });
}

async function guardarRecompensa(req, res, db, yo) {
    if (!yo.esAdmin) return res.status(403).json({ error: 'Solo el profesor.' });
    const tipo = req.body.tipo === 'tarea' ? 'tarea' : 'sesion';
    const fuente = idFuente(req.body.fuente);
    if (!fuente) return res.status(400).json({ error: 'La tarea no es válida.' });
    const fuentesSolicitadas = Array.isArray(req.body.fuentes) ? req.body.fuentes : [fuente];
    const fuentes = [...new Set([fuente, ...fuentesSolicitadas].map(idFuente).filter(Boolean))].slice(0, 5);
    const muebles = [...new Set((Array.isArray(req.body.muebles) ? req.body.muebles : []).map(String))]
        .filter(id => CATALOGO_POR_ID.has(id) && Number(CATALOGO_POR_ID.get(id).xp || 0) > 0)
        .slice(0, 24);
    if (!muebles.length) return res.status(400).json({ error: 'Selecciona al menos un mueble no inicial.' });
    const reglaSolicitada = String(req.body.regla || '');
    const regla = /^[A-Za-z0-9_-]{6,100}$/.test(reglaSolicitada)
        ? reglaSolicitada
        : `premio-${tipo}-${fuente}`.slice(0, 100);
    const tituloSesion = tipo === 'sesion' ? (await db.ref(`${BASE}/sesiones/${fuente}`).once('value')).val() : null;
    const registro = {
        activa: true,
        tipo,
        fuente,
        fuentes: Object.fromEntries(fuentes.map(id => [id, true])),
        titulo: String((tituloSesion && tituloSesion.titulo) || req.body.titulo || fuente).trim().slice(0, 140),
        nombreSet: String(req.body.nombreSet || (muebles.length === 1 ? CATALOGO_POR_ID.get(muebles[0]).nom : 'Set de muebles')).trim().slice(0, 80),
        muebles: Object.fromEntries(muebles.map(id => [id, true])),
        updatedAt: Date.now(),
        updatedBy: yo.uid
    };
    const ref = db.ref(`${RECOMPENSAS_PATH}/${regla}`);
    await ref.set(registro);
    const releida = normalizarRegla(regla, (await ref.once('value')).val());
    if (!releida || releida.muebles.length !== muebles.length) return res.status(500).json({ error: 'No se pudo confirmar la recompensa guardada.' });
    return res.status(200).json({ ok: true, regla: releida });
}

async function eliminarRecompensa(req, res, db, yo) {
    if (!yo.esAdmin) return res.status(403).json({ error: 'Solo el profesor.' });
    const regla = String(req.body.regla || '');
    if (!/^[A-Za-z0-9_-]{6,100}$/.test(regla)) return res.status(400).json({ error: 'Recompensa no válida.' });
    await db.ref(`${RECOMPENSAS_PATH}/${regla}`).remove();
    if ((await db.ref(`${RECOMPENSAS_PATH}/${regla}`).once('value')).exists()) {
        return res.status(500).json({ error: 'No se pudo confirmar la eliminación.' });
    }
    return res.status(200).json({ ok: true });
}

// ---- identidad: el token dice quién es, la nómina dice si existe ----
async function quien(req, db, auth) {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) { const e = new Error('Inicia sesión para continuar.'); e.status = 401; throw e; }
    const decoded = await auth.verifyIdToken(token);
    const [estSnap, adminSnap] = await Promise.all([
        db.ref(`${BASE}/estudiantes/${decoded.uid}`).once('value'),
        db.ref(`${BASE}/admins/${decoded.uid}`).once('value')
    ]);
    const est = estSnap.val();
    const esAdmin = adminSnap.val() === true;
    if (!est && !esAdmin) { const e = new Error('Tu cuenta no está registrada como estudiante.'); e.status = 403; throw e; }
    return {
        uid: decoded.uid,
        nombre: est ? String(est.nombre || 'Estudiante') : 'Profe',
        curso: est ? String(est.curso || '') : 'admin',
        esAdmin
    };
}

// ---- nombre que ven los demás ----
// Primer nombre y primer apellido, desempatado dentro del curso. El nombre
// completo solo va a los registros del profesor (bloqueados_chat, alertas_chat):
// el nodo `salas` lo leen todos los estudiantes registrados.
// Se cachea por curso unos minutos: una instancia caliente atiende muchos
// mensajes y no hace falta leer la nómina del curso en cada uno.
const CACHE_CURSO_MS = 5 * 60 * 1000;
const cacheCurso = new Map();

async function perfilesDeCurso(db, curso) {
    const guardado = cacheCurso.get(curso);
    if (guardado && Date.now() - guardado.t < CACHE_CURSO_MS) return guardado;
    const snap = await db.ref(`${BASE}/estudiantes`).orderByChild('curso').equalTo(curso).once('value');
    const perfiles = Object.fromEntries(Object.entries(snap.val() || {})
        .filter(([, perfil]) => perfil && perfil.ocultarDeCasas !== true));
    const entrada = { t: Date.now(), perfiles, visibles: visiblesDeCurso(perfiles) };
    cacheCurso.set(curso, entrada);
    return entrada;
}

async function nombreDe(db, yo) {
    if (!yo.curso || yo.curso === 'admin') return 'Profe';
    const { visibles } = await perfilesDeCurso(db, yo.curso);
    return visibles[yo.uid] || 'Estudiante';
}

const idSala = (v) => (/^[A-Za-z0-9_-]{6,64}$/.test(String(v || '')) ? String(v) : null);
async function posicionEnCasa(db, sala, col, fila) {
    const casa = (await db.ref(`${BASE}/avatar/${sala}/casa`).once('value')).val() || {};
    const tamano = String(casa.tamano || '5x5');
    const mapa = MAPAS_CASA.obtener(tamano);
    const max = mapa || (tamano === '7x7' ? { cols: 7, filas: 7 } : { cols: 5, filas: 5 });
    const c = Math.round(Number(col));
    const f = Math.round(Number(fila));
    const valida = Number.isFinite(c) && Number.isFinite(f) && c >= 0 && c < max.cols &&
        f >= 0 && f < max.filas && (!mapa || MAPAS_CASA.haySuelo(tamano, c, f));
    return valida ? { col: c, fila: f } : (mapa ? { ...mapa.entrada } : { col: 2, fila: 3 });
}

// look: solo strings cortos, y solo claves conocidas; lo demás se descarta
function limpiaLook(look) {
    const out = {};
    Object.keys(look || {}).forEach((k) => {
        if (!/^[a-zA-Z]{2,20}$/.test(k)) return;
        const v = String(look[k] || '').slice(0, 24);
        if (/^[a-z0-9_-]+$/i.test(v)) out[k] = v;
    });
    return out;
}

async function existeSala(db, sala) {
    const snap = await db.ref(`${BASE}/estudiantes/${sala}`).once('value');
    return snap.exists() && snap.val().ocultarDeCasas !== true;
}

// Limpia a los que ya no dan señales y devuelve a los que quedan.
async function presentesVivos(db, sala) {
    const ref = db.ref(`${BASE}/salas/${sala}/presentes`);
    const snap = await ref.once('value');
    const todos = snap.val() || {};
    const ahora = Date.now();
    const vivos = {};
    const borrar = {};
    Object.keys(todos).forEach((uid) => {
        if (ahora - Number(todos[uid].ts || 0) > VIDA_MS) borrar[uid] = null;
        else vivos[uid] = todos[uid];
    });
    if (Object.keys(borrar).length) await ref.update(borrar);
    return vivos;
}

async function entrar(req, res, db, yo) {
    const sala = idSala(req.body.sala);
    if (!sala) return res.status(400).json({ error: 'Sala no válida' });
    if (!(await existeSala(db, sala))) return res.status(404).json({ error: 'Esa casa no existe' });

    const vivos = await presentesVivos(db, sala);
    const yaEstaba = !!vivos[yo.uid];
    if (!yaEstaba && Object.keys(vivos).length >= TOPE_SALA) {
        return res.status(200).json({ ok: false, lleno: true, presentes: Object.keys(vivos).length,
            error: `La casa está llena (${TOPE_SALA} personas). Intenta más tarde.` });
    }
    const visible = await nombreDe(db, yo);
    const posicion = await posicionEnCasa(db, sala, req.body.col, req.body.fila);
    await db.ref(`${BASE}/salas/${sala}/presentes/${yo.uid}`).set({
        nombre: visible,
        curso: yo.curso,
        look: limpiaLook(req.body.look),
        ...posicion,
        ts: Date.now()
    });
    return res.status(200).json({ ok: true, yo: visible, presentes: Object.keys(vivos).length + (yaEstaba ? 0 : 1) });
}

// Casas que se pueden visitar: las del propio curso, con cuántos hay dentro.
// La arma el servidor para que el navegador no descargue perfiles ajenos: el
// perfil guarda el RUT, y la clave inicial sale del RUT.
async function lista(req, res, db, yo) {
    if (!yo.curso || yo.curso === 'admin') return res.status(200).json({ ok: true, casas: [] });
    const { perfiles, visibles } = await perfilesDeCurso(db, yo.curso);

    // Un mismo estudiante registrado dos veces (mismo RUT) aparece una sola vez:
    // se conserva el perfil más reciente.
    const porRut = {};
    Object.keys(perfiles).forEach((uid) => {
        if (uid === yo.uid) return;
        const rut = String(perfiles[uid].rut || uid).replace(/[^0-9kK]/g, '').toUpperCase() || uid;
        const previo = porRut[rut];
        if (!previo || Number(perfiles[uid].createdAt || 0) > Number(perfiles[previo].createdAt || 0)) porRut[rut] = uid;
    });
    const uids = Object.values(porRut);

    const ahora = Date.now();
    const cuentas = await Promise.all(uids.map((uid) =>
        db.ref(`${BASE}/salas/${uid}/presentes`).once('value').then((s) => {
            const p = s.val() || {};
            return Object.keys(p).filter((k) => ahora - Number(p[k].ts || 0) <= VIDA_MS).length;
        })));

    const casas = uids.map((uid, i) => ({ uid, nombre: visibles[uid] || 'Estudiante', n: cuentas[i] }))
        .sort((a, b) => (b.n - a.n) || a.nombre.localeCompare(b.nombre, 'es'));
    return res.status(200).json({ ok: true, casas, tope: TOPE_SALA });
}

async function latido(req, res, db, yo) {
    const sala = idSala(req.body.sala);
    if (!sala) return res.status(400).json({ error: 'Sala no válida' });
    const ref = db.ref(`${BASE}/salas/${sala}/presentes/${yo.uid}`);
    const actual = (await ref.once('value')).val();
    if (!actual) return res.status(200).json({ ok: false, fuera: true });
    const posicion = await posicionEnCasa(db, sala, req.body.col, req.body.fila);
    const cambios = { ts: Date.now(), ...posicion };
    if (['SE','SW','NE','NW'].includes(req.body.dir)) cambios.dir=req.body.dir;
    const gesto = String(req.body.gesto || '');
    if (PERSONAJE.GESTOS.some(opcion=>opcion.id===gesto)) {
        cambios.gesto = gesto;
        cambios.gestoHasta = Date.now() + 3400;
    }
    if (req.body.look) cambios.look = limpiaLook(req.body.look);
    await ref.update(cambios);
    return res.status(200).json({ ok: true });
}

async function salir(req, res, db, yo) {
    const sala = idSala(req.body.sala);
    if (!sala) return res.status(400).json({ error: 'Sala no válida' });
    await db.ref(`${BASE}/salas/${sala}/presentes/${yo.uid}`).remove();
    return res.status(200).json({ ok: true });
}

async function decir(req, res, db, yo) {
    const sala = idSala(req.body.sala);
    if (!sala) return res.status(400).json({ error: 'Sala no válida' });
    const texto = String(req.body.texto || '').replace(/\s+/g, ' ').trim().slice(0, LARGO_MAX);
    if (!texto) return res.status(400).json({ error: 'Mensaje vacío' });

    const refYo = db.ref(`${BASE}/salas/${sala}/presentes/${yo.uid}`);
    const presente = (await refYo.once('value')).val();
    if (!presente) return res.status(403).json({ error: 'Tienes que estar en la casa para hablar.' });

    const ahora = Date.now();
    if (ahora - Number(presente.ultimoMsg || 0) < ENTRE_MENSAJES_MS) {
        return res.status(200).json({ ok: false, lento: true, error: 'Muy rápido. Espera un segundo.' });
    }

    const veredicto = revisar(texto);
    if (!veredicto.ok) {
        // No se publica, pero el profesor puede verlo: el intento también informa.
        await db.ref(`${BASE}/bloqueados_chat`).push({
            sala, uid: yo.uid, nombre: yo.nombre, curso: yo.curso, texto, motivo: veredicto.motivo, ts: ahora
        });
        await refYo.update({ ultimoMsg: ahora, ts: ahora });
        return res.status(200).json({ ok: false, bloqueado: true,
            error: 'Ese mensaje no se puede enviar. Aquí se habla sin garabatos.' });
    }

    const chatRef = db.ref(`${BASE}/salas/${sala}/chat`);
    const nuevo = chatRef.push();
    await nuevo.set({ uid: yo.uid, nombre: await nombreDe(db, yo), texto, ts: ahora, alerta: !!veredicto.alerta });
    await refYo.update({ ultimoMsg: ahora, ts: ahora });

    if (veredicto.alerta) {
        await db.ref(`${BASE}/alertas_chat`).push({
            sala, uid: yo.uid, nombre: yo.nombre, curso: yo.curso, texto, ts: ahora, atendida: false, mensajeId: nuevo.key
        });
    }

    // Recorta el historial: se guardan los últimos 100.
    const viejos = await chatRef.orderByChild('ts').limitToLast(HISTORIAL + 20).once('value');
    const claves = [];
    viejos.forEach((c) => { claves.push(c.key); });
    if (claves.length > HISTORIAL) {
        const borrar = {};
        claves.slice(0, claves.length - HISTORIAL).forEach((k) => { borrar[k] = null; });
        await chatRef.update(borrar);
    }
    return res.status(200).json({ ok: true, id: nuevo.key, alerta: !!veredicto.alerta });
}

// ---- regalar un mueble ----
// El regalo transfiere la propiedad: desaparece del inventario y de la casa
// del donante en la misma actualización que aparece en el receptor. Un regalo
// al día por persona (hora de Chile), y el
// contador vive en `regalos_log`, un nodo sin regla cliente: el estudiante no
// puede leerlo ni reiniciarlo. Qué muebles tiene cada uno lo decide su XP, que
// es del cliente; el servidor no la vuelve a juzgar.
const REGALOS_POR_DIA = 1;
const idMueble = (v) => (/^[A-Za-z][A-Za-z0-9_]{1,40}$/.test(String(v || '')) ? String(v) : null);
const hoyEnChile = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });

async function regalar(req, res, db, yo) {
    if (!yo.curso || yo.curso === 'admin') return res.status(403).json({ error: 'Los regalos son entre estudiantes.' });
    const para = idSala(req.body.para);
    const mueble = idMueble(req.body.mueble);
    if (!para || para === yo.uid) return res.status(400).json({ error: 'Elige a un compañero.' });
    if (!mueble) return res.status(400).json({ error: 'Mueble no válido.' });
    const fichaMueble = CATALOGO_POR_ID.get(mueble);
    if (!fichaMueble || Number(fichaMueble.xp || 0) === 0) return res.status(400).json({ error: 'Ese mueble no se puede regalar.' });
    if (PREMIOS_PAES.CURSOS.includes(yo.curso) && Object.values(PREMIOS_PAES.PREMIOS).includes(mueble)) return res.status(200).json({ok:false,error:'Ese mueble es un premio de guía PAES y no se puede transferir.'});

    const perfil = (await db.ref(`${BASE}/estudiantes/${para}`).once('value')).val();
    if (!perfil || String(perfil.curso || '') !== yo.curso) {
        return res.status(404).json({ error: 'Solo puedes regalar a compañeros de tu curso.' });
    }
    const destino = db.ref(`${BASE}/avatar/${para}/regalos/${mueble}`);
    if ((await destino.once('value')).exists()) {
        return res.status(200).json({ ok: false, error: 'Ya le regalaron ese mueble. Elige otro.' });
    }
    const reglas = await leerReglasRecompensa(db);
    if (reglas.some(regla => regla.muebles.includes(mueble))) {
        return res.status(200).json({ ok: false, error: 'Ese mueble se obtiene completando su tarea y no se puede transferir.' });
    }
    const regaloPropio = await db.ref(`${BASE}/avatar/${yo.uid}/regalos/${mueble}`).once('value');
    if (!regaloPropio.exists()) return res.status(200).json({ ok: false, error: 'No tienes ese mueble disponible para regalar.' });
    if (regaloPropio.val() && regaloPropio.val().tipo === 'docente') {
        return res.status(200).json({ ok: false, error: 'Un premio entregado por el profesor no se puede transferir.' });
    }

    // Dos donantes no pueden competir por el mismo mueble de una persona.
    const reservaRef = db.ref(`${BASE}/regalos_reservas/${para}/${mueble}`);
    const reservaId = randomUUID();
    const reserva = await reservaRef.transaction(actual => {
        if (actual && Number(actual.hasta) > Date.now()) return;
        return { id:reservaId, hasta:Date.now() + 120000 };
    });
    if (!reserva.committed) return res.status(409).json({ ok:false, error:'Ese regalo se está entregando. Intenta de nuevo.' });
    try {
        // Revalidar dentro de la reserva: las primeras lecturas pueden haber
        // quedado obsoletas mientras otra solicitud terminaba.
        if ((await destino.once('value')).exists()) return res.status(409).json({ ok:false, error:'Ya tiene ese mueble.' });
        if (!(await db.ref(`${BASE}/avatar/${yo.uid}/regalos/${mueble}`).once('value')).exists()) {
            return res.status(409).json({ ok:false, error:'Ese mueble ya no está en tu inventario.' });
        }
        const ahora = Date.now();
        const cupo = await db.ref(`${BASE}/regalos_log/${yo.uid}/${hoyEnChile()}`).transaction((actual) => {
            const n = Number(actual && actual.n) || 0;
            if (n >= REGALOS_POR_DIA) return;
            return { n: n + 1, ultimo: { para, mueble, ts: ahora } };
        });
        if (!cupo.committed) {
            return res.status(200).json({ ok:false, sinCupo:true, error:'Ya regalaste hoy. Mañana puedes regalar otro.' });
        }
        const piezaDonante = (await db.ref(`${BASE}/avatar/${yo.uid}/pieza`).once('value')).val();
        const sinRegalo = Array.isArray(piezaDonante)
            ? piezaDonante.filter(pieza => pieza && pieza.id !== mueble) : piezaDonante;
        if ((await reservaRef.once('value')).val()?.id !== reservaId) {
            return res.status(409).json({ ok:false, error:'La reserva expiró. Intenta de nuevo.' });
        }
        // update() aplica juntas las tres rutas: nunca deja propiedad duplicada.
        await db.ref(BASE).update({
            [`avatar/${para}/regalos/${mueble}`]: { de:await nombreDe(db, yo), ts:ahora, tipo:'estudiante' },
            [`avatar/${yo.uid}/regalos/${mueble}`]: null,
            [`avatar/${yo.uid}/pieza`]: sinRegalo || null
        });
        const [recibido, conservado] = await Promise.all([
            destino.once('value'), db.ref(`${BASE}/avatar/${yo.uid}/regalos/${mueble}`).once('value')
        ]);
        if (!recibido.exists() || conservado.exists()) return res.status(500).json({ error:'No se pudo confirmar la transferencia.' });
        return res.status(200).json({ ok:true, transferido:true });
    } finally {
        if ((await reservaRef.once('value')).val()?.id === reservaId) await reservaRef.remove();
    }
}

async function atender(req, res, db, yo) {
    if (!yo.esAdmin) return res.status(403).json({ error: 'Solo el profesor.' });
    const id = String(req.body.id || '');
    if (!/^[A-Za-z0-9_-]{8,40}$/.test(id)) return res.status(400).json({ error: 'Alerta no válida' });
    await db.ref(`${BASE}/alertas_chat/${id}`).update({ atendida: true, atendidaPor: yo.uid, atendidaTs: Date.now() });
    return res.status(200).json({ ok: true });
}

async function configurar(req, res, db, yo) {
    if (!yo.esAdmin) return res.status(403).json({ error: 'Solo el profesor.' });
    const enabled = req.body.enabled === true;
    const config = { enabled, updatedAt: Date.now(), updatedBy: yo.uid };
    await db.ref(CONFIG_PATH).set(config);
    if (!enabled) {
        const salas = (await db.ref(`${BASE}/salas`).once('value')).val() || {};
        const update = {};
        Object.keys(salas).forEach((uid) => { update[`${uid}/presentes`] = null; });
        if (Object.keys(update).length) await db.ref(`${BASE}/salas`).update(update);
    }
    return res.status(200).json({ ok: true, enabled, updatedAt: config.updatedAt });
}

// Punto de entrada desde api/estudiantes.js. `accion` llega sin el prefijo `salas-`.
async function manejar(req, res, accion, db, auth) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
    try {
        const yo = await quien(req, db, auth);
        if (accion === 'estado') {
            const state = await estadoMiEspacio(db);
            return res.status(200).json({ ok: true, ...state });
        }
        if (accion === 'configurar') return await configurar(req, res, db, yo);
        if (accion === 'recompensas-listar') return await listarRecompensas(req, res, db, yo);
        if (accion === 'recompensas-guardar') return await guardarRecompensa(req, res, db, yo);
        if (accion === 'recompensas-eliminar') return await eliminarRecompensa(req, res, db, yo);
        if (accion === 'regalos-admin-inventario') return await listarInventarioParaRegalo(req, res, db, yo);
        if (accion === 'regalos-admin-entregar') return await entregarRegaloDocente(req, res, db, yo);
        if (accion === 'regalos-admin-paes-lote') return await regalosPaesPorLote(req, res, db, yo);
        if (accion === 'regalos-admin-paes-automaticos') return await regalosPaesAutomaticos(req,res,db,yo);
        if (accion === 'regalos-admin-avatar') return await premiosAvatarDocente(req,res,db,yo);
        if (accion === 'experiencia-admin') {
            const estudiante=await estudianteAdministrable(db,yo,req.body.estudiante);
            return await EXPERIENCIA_DOCENTE.manejar(req,res,db,yo,estudiante);
        }
        if (accion === 'inventario') {
            let premiosPendientes=false;
            if (!yo.esAdmin) try {await PREMIOS_PAES.sincronizarUid(db,yo.uid);} catch(_) {premiosPendientes=true;}
            return res.status(200).json({ok:true,premiosPendientes,...(await inventarioConRegalos(db,yo))});
        }
        if (!['salir', 'atender'].includes(accion)) {
            const state = await estadoMiEspacio(db);
            if (!state.enabled) return res.status(200).json({ ok: false, disabled: true, error: 'Las casas y la decoración están deshabilitadas por el profesor.' });
        }
        if (accion === 'entrar') return await entrar(req, res, db, yo);
        if (accion === 'lista') return await lista(req, res, db, yo);
        if (accion === 'latido') return await latido(req, res, db, yo);
        if (accion === 'salir') return await salir(req, res, db, yo);
        if (accion === 'decir') return await decir(req, res, db, yo);
        if (accion === 'guardar-pieza') return await guardarPieza(req, res, db, yo);
        if (accion === 'guardar-casa') return await guardarCasa(req,res,db,yo);
        if (accion === 'atender') return await atender(req, res, db, yo);
        if (accion === 'regalar') return await regalar(req, res, db, yo);
        return res.status(400).json({ error: 'Acción no reconocida' });
    } catch (error) {
        const status = error.status || 500;
        if (status === 500) console.error('[_salas.js]', accion, error.message);
        return res.status(status).json({ error: status === 500 ? 'Error del servidor' : error.message });
    }
}

module.exports = { manejar, TOPE_SALA };
