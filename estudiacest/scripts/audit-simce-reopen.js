'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');
const vm = require('vm');
const attempts = require('../api/_simce-admin-attempts');
const interview = require('../api/_simce-u3s12');
const ROOT = path.resolve(__dirname, '..');
const BASE = 'plataforma_estudiantes';
const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
const get = (state, route) => route.split('/').filter(Boolean).reduce((n,k) => n?.[k], state);
function put(state, route, value) {
    const keys = route.split('/').filter(Boolean); let node = state;
    for (const key of keys.slice(0,-1)) node = node[key] ||= {};
    if (value === null) delete node[keys.at(-1)]; else node[keys.at(-1)] = clone(value);
}
const snap = value => ({ val:() => clone(value), exists:() => value != null });
function fixture() {
    const response = { answers:{q1:'A',q2:'B'}, desarrollo:'Una explicación original conservada.',
        noticia:'Noticia original conservada.', notes:{p1:'Nota conservada'}, ticket:'Ticket conservado',
        submitted:true, completada:true, submittedAt:1000, completadaAt:1000,
        strikes:3, bloqueado_por_strikes:true, startedAt:500, curso:'2A-HC' };
    return { [BASE]: {
        admins:{ docente:true, otroDocente:true },
        docentes:{ docente:{ cursos:['2A-HC'], superadmin:false }, otroDocente:{ cursos:['2B-HC'] } },
        estudiantes:{ estudianteA:{ nombre:'ESTUDIANTE PRUEBA A', curso:'2A-HC', perfil_completo:true },
            estudianteB:{ nombre:'ESTUDIANTE PRUEBA B', curso:'2A-HC', perfil_completo:true } },
        sesiones:{ 'sesion-u3-10':{ titulo:'Clase 10 · Crónica y carta', programa:'simce', asignados:['2A-HC'], activa:false, respuestas_bloqueadas:true },
            'sesion-u3-12':{ titulo:'Clase 12 · La entrevista', programa:'simce', asignados:['2A-HC'], activa:false, respuestas_bloqueadas:true, formativa:true } },
        respuestas:{ 'sesion-u3-10':{ estudianteA:response, estudianteB:clone(response) },
            'sesion-u3-12':{ estudianteA:{ ...clone(response), answers:Object.fromEntries(Array.from({length:24},(_,i)=>['q'+(i+1),'A'])),metaResponses:{m1:'Una reflexión original completa que se conserva.'} } } },
        resultados:{ 'sesion-u3-10':{ estudianteA:{score:1,total:2,porcentaje:50,nota:3.5},estudianteB:{score:1,total:2,porcentaje:50,nota:3.5} },
            'sesion-u3-12':{ estudianteA:{score:4,total:24,porcentaje:17} } },
        calificaciones_clase:{ estudianteA:{ 'sesion-u3-10':{grade:5,status:'submitted',submitted:true} } },
        ranking:{ 'sesion-u3-10':{ '2A-HC':{ estudianteA:{puntaje:1},estudianteB:{puntaje:1} } } }
    } };
}
function mockDb(state = fixture(), { cold = true, retry } = {}) {
    const db = { state, transactions:0, writes:0, ref(route) {
        return { child(key) { return db.ref(route+'/'+key); }, async once() { return snap(get(state,route)); },
            async set(value) { put(state,route,value); db.writes++; },
            async update(values) { for (const [key,value] of Object.entries(values)) put(state,route+'/'+key,value); db.writes++; },
            async transaction(fn) {
                db.transactions++;
                if (cold && fn(null) === undefined) return { committed:false,snapshot:snap(get(state,route)) };
                if (retry) { fn(clone(get(state,route))); retry(state); }
                const next = fn(clone(get(state,route)));
                if (next === undefined) return {committed:false,snapshot:snap(get(state,route))};
                put(state,route,next); db.writes++;
                return { committed:true,snapshot:snap(get(state,route)) };
            }
        };
    } }; return db;
}
const auth = { async verifyIdToken(token) { if (token==='invalid') throw Error('invalid'); return {uid:token}; } };
const request = {sessionId:'sesion-u3-10',studentUid:'estudianteA',requestId:'solicitud-prueba-0001'};
async function serve(db, browser = false) {
    const server = http.createServer(async (req,out) => {
        const url = new URL(req.url,'http://localhost');
        if (url.pathname === '/fixture-db') {
            out.setHeader('Content-Type','application/json'); return out.end(JSON.stringify(get(db.state,url.searchParams.get('path')) ?? null));
        }
        if (url.pathname === '/fixture-reset' && browser) { db.state[BASE] = fixture()[BASE]; out.end('OK'); return; }
        if (url.pathname === '/api/estudiantes') {
            let raw=''; for await (const chunk of req) raw+=chunk;
            req.body=raw?JSON.parse(raw):{};
            const res={code:200,setHeader:(k,v)=>out.setHeader(k,v),status(code){this.code=code;return this;},json(value){out.writeHead(this.code,{'Content-Type':'application/json'});out.end(JSON.stringify(value));}};
            const action=url.searchParams.get('action')||'';
            if(action.startsWith('simce-u3s12-')) await interview.manejar(req,res,action,db,auth);
            else await attempts.manejar(req,res,action.replace(/^simce-admin-/,''),db,auth);
            return;
        }
        if (!browser) { out.writeHead(404);out.end();return; }
        let target=path.resolve(ROOT,'.'+decodeURIComponent(url.pathname));
        if (!target.startsWith(ROOT+path.sep)) { out.writeHead(403);out.end();return; }
        if(url.pathname.endsWith('/'))target=path.join(target,'index.html');
        if(!fs.existsSync(target)){out.writeHead(404);out.end();return;}
        let content=fs.readFileSync(target);
        if(target.endsWith('.html')) {
            let html=content.toString();
            html=html.replace(/<script[^>]*src="https:\/\/www\.gstatic\.com\/firebasejs[^>]*><\/script>/g,'');
            html=html.replace(/<script[^>]*src="[^\"]*(?:forced-refresh|work-telemetry)[^\"]*"[^>]*><\/script>/g,'');
            const identity=url.searchParams.get('student')==='1'?'estudianteA':'docente';
            html=html.replace(/<\/head>/, '<script>'+browserFirebase(identity)+'</script></head>');
            content=Buffer.from(html);
        }
        const ext=path.extname(target);out.setHeader('Content-Type',ext==='.html'?'text/html; charset=utf-8':ext==='.js'?'text/javascript; charset=utf-8':ext==='.css'?'text/css':'application/octet-stream');out.end(content);
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    return {server,url:'http://127.0.0.1:'+server.address().port};
}
function browserFirebase(uid) {
    return `(function(){const uid=${JSON.stringify(uid)};const user={uid,email:'prueba@example.invalid',getIdToken:async()=>uid};const makeAuth=()=>({currentUser:user,setPersistence:async()=>{},onAuthStateChanged(fn){setTimeout(()=>fn(user),0);return ()=>{}},signOut:async()=>{}});const auth=()=>makeAuth();auth.Auth={Persistence:{LOCAL:'local'}};const ref=p=>({once:async()=>{const r=await fetch('/fixture-db?path='+encodeURIComponent(p));const v=await r.json();return {val:()=>v,exists:()=>v!==null};},child:k=>ref(p+'/'+k),on(){},off(){}});const app={auth,database:()=>({ref})};window.firebase={apps:[app],auth,database:()=>({ref}),initializeApp:()=>app,app:()=>app};window.__fixtureErrors=[];addEventListener('error',e=>__fixtureErrors.push(e.message));})();`;
}
async function call(url, body=request, token='docente', action='simce-admin-reopen', method='POST') {
    const response=await fetch(url+'/api/estudiantes?action='+action,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(method==='POST'?{body:JSON.stringify(body)}:{})});
    return {status:response.status,data:await response.json(),cache:response.headers.get('cache-control')};
}
async function main() {
    const db=mockDb();const {server,url}=await serve(db);
    try {
        const before=clone(db.state[BASE]);
        assert.equal((await call(url,request,'')).status,401);
        assert.equal((await call(url,request,'invalid')).status,401);
        assert.equal((await call(url,request,'estudianteA')).status,403);
        assert.equal((await call(url,request,'otroDocente')).status,403);
        assert.equal((await call(url,request,'docente','simce-admin-reopen','GET')).status,405);
        assert.equal((await call(url,{...request,studentUid:'../estudianteB'})).status,400);
        assert.equal((await call(url,{...request,sessionId:'no-existe'})).status,404);
        assert.deepEqual(db.state[BASE],before,'Los rechazos no escriben.');
        const result=await call(url);assert.equal(result.status,200);assert.equal(result.cache,'no-store');assert.equal(result.data.reopened,true);
        const root=db.state[BASE],draft=root.respuestas['sesion-u3-10'].estudianteA;
        for(const key of ['answers','desarrollo','noticia','notes','ticket','startedAt'])assert.deepEqual(draft[key],before.respuestas['sesion-u3-10'].estudianteA[key]);
        assert.equal(draft.submitted,false);assert.equal(draft.completada,false);assert.equal(draft.strikes,undefined);assert.equal(draft.submittedAt,undefined);
        assert.equal(root.sesiones['sesion-u3-10'].activa,false);assert.equal(root.sesiones['sesion-u3-10'].respuestas_bloqueadas,true);
        assert.deepEqual(root.sesiones['sesion-u3-10'].excepciones_desbloqueo,{estudianteA:true});
        assert.equal(root.resultados['sesion-u3-10'].estudianteA,undefined);
        assert.deepEqual(root.respuestas['sesion-u3-10'].estudianteB,before.respuestas['sesion-u3-10'].estudianteB);
        assert.deepEqual(root.resultados['sesion-u3-10'].estudianteB,before.resultados['sesion-u3-10'].estudianteB);
        assert.deepEqual(root.ranking['sesion-u3-10']['2A-HC'].estudianteB,before.ranking['sesion-u3-10']['2A-HC'].estudianteB);
        assert.equal(root.calificaciones_clase.estudianteA['sesion-u3-10'].grade,5);
        assert.equal(root.calificaciones_clase.estudianteA['sesion-u3-10'].needsReview,true);
        const {hasConfirmedSubmissionTelemetry}=require('./reconcile-class-submission-statuses');
        assert.equal(hasConfirmedSubmissionTelemetry(draft,{submissionConfirmationCount:1,submittedAt:1000,submissionConfirmedAt:1100}),false,'La telemetría de la entrega anterior no cancela la reapertura.');
        const archive=root.historial_reaperturas['sesion-u3-10'].estudianteA[request.requestId];
        assert.deepEqual(archive.response,before.respuestas['sesion-u3-10'].estudianteA);
        assert.deepEqual(archive.result,before.resultados['sesion-u3-10'].estudianteA);
        const writes=db.writes;assert.equal((await call(url)).data.alreadyProcessed,true);assert.equal(db.writes,writes);
        root.respuestas['sesion-u3-10'].estudianteA.submitted=true;root.respuestas['sesion-u3-10'].estudianteA.completada=true;
        assert.equal((await call(url)).data.reopened,false,'Una petición antigua no reabre la nueva entrega.');
        assert.equal(root.respuestas['sesion-u3-10'].estudianteA.completada,true);
        const second={...request,requestId:'solicitud-prueba-0002'};
        assert.equal((await call(url,second)).status,200);
        assert.equal(Object.keys(db.state[BASE].historial_reaperturas['sesion-u3-10'].estudianteA).length,2);
        const interviewRequest={...request,sessionId:'sesion-u3-12',requestId:'solicitud-entrevista-1'};
        assert.equal((await call(url,interviewRequest)).status,200);
        let state=await call(url,null,'estudianteA','simce-u3s12-state','GET');assert.equal(state.data.session.active,true);assert.equal(state.data.attempt.completada,false);
        const payload={answers:{...state.data.attempt.answers,q1:'D'},metaResponses:state.data.attempt.metaResponses};
        assert.equal((await call(url,payload,'estudianteA','simce-u3s12-save')).status,200);
        assert.equal((await call(url,payload,'estudianteA','simce-u3s12-submit')).status,200);
        state=await call(url,null,'estudianteA','simce-u3s12-state','GET');assert.equal(state.data.attempt.completada,true);assert.equal(state.data.attempt.submitted,true);assert.equal(state.data.attempt.answers.q1,'D');
        assert.equal((await call(url,payload,'estudianteA','simce-u3s12-submit')).status,409);
        assert.equal((await call(url,{},'estudianteB','simce-u3s12-save')).status,423);
        await checkUi();
        const race=mockDb(fixture(),{retry:state=>{state[BASE].docentes.docente.cursos=['2B-HC'];}});
        const concurrent=await serve(race);try{assert.equal((await call(concurrent.url)).status,403);assert.equal(race.writes,0);}finally{await new Promise(resolve=>concurrent.server.close(resolve));}
        const unsupported=fixture();unsupported[BASE].sesiones['sesion-u3-10'].programa='paes';assert.throws(()=>attempts.reopen(unsupported[BASE],request,'docente',100),/solo a SIMCE/);
        const mismatch=fixture();mismatch[BASE].respuestas['sesion-u3-10'].estudianteA.curso='2B-HC';assert.throws(()=>attempts.reopen(mismatch[BASE],request,'docente',100),/curso de la respuesta/);
        const duplicate=fixture();duplicate[BASE].estudiantes.estudianteA.run='12345678-9';duplicate[BASE].estudiantes.estudianteB.run='12.345.678-9';assert.throws(()=>attempts.reopen(duplicate[BASE],request,'docente',100),/cuentas duplicadas/);
        console.log('SIMCE Reabrir: API HTTP real con fixtures, permisos, alcance, respaldo atómico, caché fría, concurrencia, peticiones repetidas, conservación de evidencia, nota pendiente, interfaz y nueva entrega comprobados. Sin cambios en producción.');
    } finally { await new Promise(resolve=>server.close(resolve)); }
}
async function checkUi() {
    const admin=fs.readFileSync(path.join(ROOT,'estudiantes/adminprofe/index.html'),'utf8');
    const source=admin.slice(admin.indexOf('const simceReopenBusy='),admin.indexOf('async function softResetStudent'));
    const ctx={Set,Map,crypto:require('crypto'),students:{estudianteA:{nombre:'PRUEBA',curso:'2A-HC'}},sessions:{'sesion-u3-10':{titulo:'PRUEBA'}},isMiCurso:()=>true,studentCanSeeSession:()=>true,confirm:()=>false,loadResults:()=>{},fetch:()=>{throw Error('La cancelación no envía.')}};
    vm.createContext(ctx);vm.runInContext(source,ctx);await ctx.reopenSimceStudent('estudianteA','sesion-u3-10');
    assert(admin.includes('🔓 Reabrir'));assert(admin.includes('Reabierta para corregir'));
    const dashboard=fs.readFileSync(path.join(ROOT,'estudiantes/dashboard.html'),'utf8');
    const reconcile=dashboard.slice(dashboard.indexOf('        function reconcileLaborGradeStatus('),dashboard.indexOf('        function renderLaborGrades('));
    const view={classifySubmissionStatus:()=>({completed:true})};vm.createContext(view);vm.runInContext(reconcile,view);
    const pending={sessionId:'sesion-u3-10',needsReview:true,status:'revision_pending'};
    assert.deepEqual(view.reconcileLaborGradeStatus(pending,{}),pending,'Una nueva entrega no publica automáticamente la nota anterior.');
    assert(dashboard.includes('item.needsReview !== true'));
    assert(dashboard.includes('Nota pendiente de revisión'));
}
if(require.main===module) {
    if(process.argv.includes('--serve'))serve(mockDb(),true).then(({url})=>console.log('Fixture local SIMCE: '+url)).catch(error=>{console.error(error);process.exitCode=1;});
    else main().catch(error=>{console.error(error);process.exitCode=1;});
}
module.exports={fixture,mockDb,serve};
