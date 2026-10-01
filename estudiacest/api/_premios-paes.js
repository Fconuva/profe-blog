'use strict';
// Premios automáticos PAES: lista cerrada del kit básico, nunca arte personalizado.
const crypto = require('node:crypto');
const catalogo = require('../estudiantes/js/catalogo-casa.js');
const BASE = 'plataforma_estudiantes';
const CURSOS = ['3A-HC','3B-HC','4A-HC','4B-HC'];
const PREMIOS = Object.freeze({15:'chairDesk',16:'desk',17:'computerScreen',18:'loungeSofa',19:'lampSquareFloor',20:'pottedPlant',21:'televisionModern'});
const nombres = new Map(catalogo.map(item=>[item.id,item.nom]));
const normalizarRut = value=>String(value||'').replace(/[.\s-]/g,'').toUpperCase();
const visible = perfil=>perfil && perfil.ocultarDeCasas!==true && CURSOS.includes(perfil.curso);
function completada(guia, record) {
  if(!record || record.status==='draft')return false;
  return record.status==='sent' || record.submitted===true || record.completada===true ||
    (['10','11','12','13'].includes(String(guia)) && Number(record.submittedAt)>0 && Object.keys(record.answers||{}).length>0);
}
function fichas() {return Object.entries(PREMIOS).map(([guia,mueble])=>({guia,mueble,nombre:nombres.get(mueble)}));}
function requisitos(curso) {
  return CURSOS.includes(curso) ? Object.fromEntries(fichas().map(item=>[item.mueble,[{regla:'paes-'+item.guia,tipo:'paes',fuente:item.guia,titulo:'Guía '+item.guia+' PAES',nombreSet:item.nombre}]])) : {};
}
async function perfiles(db) {return (await db.ref(BASE+'/estudiantes').once('value')).val()||{};}
function unicos(todos) {
  const result={};
  for(const [uid,perfil] of Object.entries(todos))if(visible(perfil)) {
    const rut=normalizarRut(perfil.rut);if(!rut)continue;
    if(Object.values(todos).filter(other=>visible(other)&&normalizarRut(other.rut)===rut).length===1)result[uid]=perfil;
  }
  return result;
}
async function evaluar(db, uid, perfil, entregas) {
  const regalos=(await db.ref(BASE+'/avatar/'+uid+'/regalos').once('value')).val()||{};
  const rut=normalizarRut(perfil.rut);
  const premios=[];
  for(const item of fichas()) {
    const record=entregas ? entregas[item.guia]?.[rut] : (await db.ref('plataforma_paes/guia_respuestas/'+item.guia+'/'+rut).once('value')).val();
    if(completada(item.guia,record))premios.push({...item,yaTiene:!!regalos[item.mueble]});
  }
  return{uid,nombre:String(perfil.nombre||'Estudiante'),premios};
}
async function entregar(db, row) {
  const faltan=row.premios.filter(item=>!item.yaTiene);
  let nuevos=0;
  if(faltan.length) {
    const ref=db.ref(BASE+'/avatar/'+row.uid+'/regalos');
    await ref.transaction(actual=>{
      const regalos={...(actual||{})};
      nuevos=0;
      for(const item of faltan)if(!regalos[item.mueble]){regalos[item.mueble]={de:'Guía PAES '+item.guia,tipo:'paes-automatico',guia:item.guia,automatico:true,ts:Date.now()};nuevos++;}
      return nuevos ? regalos : undefined;
    });
  }
  const saved=(await db.ref(BASE+'/avatar/'+row.uid+'/regalos').once('value')).val()||{};
  if(!row.premios.every(item=>!!saved[item.mueble]))throw Error('No se pudo confirmar el premio.');
  return nuevos;
}
async function sincronizarUid(db, uid) {
  const perfil=unicos(await perfiles(db))[uid];
  if(!perfil)return 0;
  return entregar(db,await evaluar(db,uid,perfil));
}
async function alEntregar(db, rut, guia) {
  if(!PREMIOS[String(guia)])return 0;
  const entry=Object.entries(unicos(await perfiles(db))).find(([,perfil])=>normalizarRut(perfil.rut)===normalizarRut(rut));
  if(!entry)return 0;
  const [uid,perfil]=entry;
  return entregar(db,await evaluar(db,uid,perfil));
}
async function planCurso(db, curso) {
  const todos=await perfiles(db), validos=unicos(todos);
  const targets=Object.entries(todos).filter(([,perfil])=>visible(perfil)&&perfil.curso===curso);
  if(targets.some(([uid])=>!validos[uid])){const error=Error('Hay perfiles sin RUT o duplicados; revisa la nómina antes de entregar.');error.status=409;throw error;}
  const entregas=Object.fromEntries(await Promise.all(Object.keys(PREMIOS).map(async guia=>[guia,(await db.ref('plataforma_paes/guia_respuestas/'+guia).once('value')).val()||{}])));
  const destinatarios=[];
  for(const [uid,perfil] of targets) {
    const row=await evaluar(db,uid,perfil,entregas);if(row.premios.length)destinatarios.push(row);
  }
  const firma=crypto.createHash('sha256').update(JSON.stringify(destinatarios.map(row=>[row.uid,row.premios.map(item=>[item.guia,item.mueble,item.yaTiene])]).sort((a,b)=>a[0].localeCompare(b[0])))).digest('hex');
  return{curso,totalCurso:targets.length,destinatarios,firma,pendientes:destinatarios.reduce((total,row)=>total+row.premios.filter(item=>!item.yaTiene).length,0),asignaciones:fichas()};
}
module.exports={CURSOS,PREMIOS,completada,fichas,requisitos,sincronizarUid,alEntregar,planCurso,entregar};
