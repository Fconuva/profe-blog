'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..'),api=require('../api/_simce-n3'),catalog=require('../api/_simce-n3-keys.json');
const {fixture,mockDb}=require('./audit-simce-u4'),BASE='plataforma_estudiantes';
const db=mockDb(fixture());db.state[BASE].sesiones[api.SESSION]={asignados:['2A-HC','2B-HC'],activa:false,cierre_final:true};
const good={answers:Object.fromEntries(catalog.questions.map(q=>[q.n,q.correct])),respuestas_abiertas:Object.fromEntries(catalog.openQuestions.map(q=>[q.n,'Respuesta ficticia de comprobación.']))};
let n=0;const check=(value,label)=>{assert.ok(value,label);n++;};
const auth={verifyIdToken:async token=>{if(token==='bad')throw Error();return {uid:token};}};
async function call(token,body=good,method='POST'){let code=200,result;await api.manejar({method,headers:{authorization:token?'Bearer '+token:''},body}, {setHeader(){},status(c){code=c;return this;},json(r){result=r;}},db,auth);return {code,result};}
(async()=>{
 check((await call('')).code===401,'Sin autenticación');check((await call('bad')).code===401,'Token inválido');
 check((await call('other')).code===403,'Otro curso');check((await call('student')).code===423,'Cerrada sin excepción');
 db.state[BASE].sesiones[api.SESSION].excepciones_desbloqueo={student:true};
 check((await call('student',{})).code===400,'No entrega vacía');check((await call('studentB')).code===423,'Excepción no pasa a otro estudiante');
 check(catalog.questions.every(q=>'ABCD'.includes(q.correct)&&q.correct.length===1),'Claves válidas');
 check((await call('student')).code===200,'Entrega con excepción');
 const saved=db.state[BASE].respuestas[api.SESSION].student,before=JSON.stringify(saved);
 check(saved.submitted&&saved.completada&&saved.submittedAt&&saved.completadaAt,'Par de marcas y fechas');
 check(saved.uid==='student'&&saved.sessionId===api.SESSION&&saved.curso==='2A-HC','Identidad');
 check(saved.result.puntaje===catalog.questions.length,'Calificación en servidor');
 check((await call('student',good,'GET')).result.attempt.completada===true,'Confirmación por estado');
 const altered=structuredClone(good);altered.answers[catalog.questions[0].n]='X';
 check((await call('student',good)).code===200&&JSON.stringify(db.state[BASE].respuestas[api.SESSION].student)===before,'Reintento idempotente');
 check(!JSON.stringify((await call('student',good,'GET')).result).includes('correct'),'No expone claves');
 const grades=db.state[BASE].calificaciones_clase;check(grades===undefined,'No modifica calificaciones');
 console.log('SIMCE N3: '+n+' comprobaciones de permisos, entrega, identidad y conservación aprobadas.');
})().catch(e=>{console.error(e);process.exitCode=1;});
