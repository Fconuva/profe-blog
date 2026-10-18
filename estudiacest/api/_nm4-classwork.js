'use strict';
const ROSTER = require('./_roster_nm4');
const {CONFIG,evidence} = require('./_nm4-classwork-evidence');
const BASE = 'plataforma_nm4/planilla_trabajo_2026';
const ACTIVITIES = [
  {id:'oferta-contrato',title:'Oferta y contrato',mode:'Cuaderno'},
  {id:'derechos-seguridad',title:'Derechos y seguridad',mode:'Cuaderno'},
  {id:'curriculum',title:'Currículum joven',mode:'Cuaderno'},
  {id:'industria40',title:'Industria 4.0',mode:'Cuaderno',except:['4DTP']},
  {id:'entrevista',title:'Entrevista laboral',mode:'Cuaderno'},
  {id:'informe',title:'Informe técnico',mode:'Digital',except:['4DTP']},
  {id:'manual',title:'Manual ilustrado',mode:'Papel'},
  {id:'correo',title:'Correo formal',mode:'Papel',except:['4ATP','4BTP','4CTP','4ETP']},
  {id:'ia-futuro',title:'IA, dinero y futuro',mode:'Cuaderno'}
];
const fail=(status,message)=>Object.assign(new Error(message),{status});
const validGrade=n=>n===null || typeof n==='number'&&Number.isFinite(n)&&n>=1&&n<=7&&Math.abs(n*10-Math.round(n*10))<1e-8;
const normalizeCourse=c=>String(c||'').replace(/[^A-Z0-9]/gi,'').toUpperCase();
const isEnabled=(activity,course,settings)=>typeof settings?.[activity.id]?.enabled==='boolean'?settings[activity.id].enabled:!activity.except?.includes(course);
function project(course, roster, cells, snapshots, canEdit, settings={}) {
  const activities=ACTIVITIES.map(a=>({...a,applicable:isEnabled(a,course,settings),version:settings?.[a.id]?.version||0}));
  return {course,canEdit,activities,rows:roster.map(s=>{
    const auto=evidence({course,n:s.n},snapshots),grades={};
    for(const a of activities){
      const cell=cells?.[s.n]?.[a.id];
      const manual=Boolean(cell&&Object.hasOwn(cell,'version'));
      grades[a.id]={grade:a.applicable?(manual?(cell.grade??null):(a.id==='informe'?auto.grade:null)):null,version:cell?.version||0,
        source:manual?'docente':a.id==='informe'&&auto.grade!==null?'avance':'pendiente',
        ...(a.id==='informe'&&a.applicable?{done:auto.done,total:auto.total}:{}),applicable:a.applicable};
    }
    const values=Object.values(grades).filter(g=>g.applicable&&g.grade!==null).map(g=>g.grade);
    const total=activities.filter(a=>a.applicable).length;
    return {n:s.n,name:s.nombre,grades,average:values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length*10)/10:null,count:values.length,total,partial:values.length<total};
  })};
}
function createHandler({db,auth,roster=ROSTER,base=BASE}){
  return async function handle(req,res){
    res.setHeader('Cache-Control','private, no-store');
    try{
      if(!['GET','POST'].includes(req.method))throw fail(405,'Método no permitido.');
      let body=req.body||{};if(typeof body==='string'){try{body=JSON.parse(body);}catch(_){throw fail(400,'Solicitud inválida.');}}
      const action=req.query?.action||body.action||'list',course=normalizeCourse(req.query?.course||body.course);
      if(!Object.hasOwn(roster,course))throw fail(400,'Selecciona un curso NM4.');
      const token=String(req.headers?.authorization||'').replace(/^Bearer\s+/i,'');
      if(!token)throw fail(401,'Ingresa con tu cuenta de Estudia CEST.');
      let actor;try{actor=await auth.verifyIdToken(token);}catch(_){throw fail(401,'Tu sesión venció. Vuelve a ingresar.');}
      const [admin,teacher,student]=await Promise.all(['admins','docentes','estudiantes'].map(p=>db.ref(`plataforma_estudiantes/${p}/${actor.uid}`).once('value')));
      const canEdit=admin.val()===true&&teacher.val()?.superadmin===true;
      if(!canEdit&&!Object.hasOwn(roster,normalizeCourse(student.val()?.curso)))throw fail(403,'Esta planilla corresponde a estudiantes de NM4 y a su docente.');
      const coursePath=`${base}/cursos/${course}`,cellPath=`${coursePath}/celdas`,settingsPath=`${coursePath}/actividades`;
      const versions=Object.entries(CONFIG).filter(([,c])=>c[2].includes(course));
      const read=async()=>{
        const [courseData,...sources]=await Promise.all([coursePath,...versions.map(([,c])=>`plataforma_nm4/${c[0]}`)].map(p=>db.ref(p).once('value')));
        const current=courseData.val()||{};
        return project(course,roster[course],current.celdas,Object.fromEntries(versions.map(([v],i)=>[v,sources[i].val()||{}])),canEdit,current.actividades);
      };
      if(action==='set-activity'){
        if(req.method!=='POST')throw fail(405,'Usa el control de tareas para guardar.');
        if(!canEdit)throw fail(403,'Solo el docente puede activar o desactivar tareas.');
        const {activity,enabled,expectedVersion,requestId}=body,target=ACTIVITIES.find(a=>a.id===activity);
        if(!target||typeof enabled!=='boolean'||!Number.isInteger(expectedVersion)||expectedVersion<0||!/^[A-Za-z0-9_-]{12,100}$/.test(requestId||''))throw fail(400,'Revisa la tarea y el curso.');
        const ref=db.ref(`${settingsPath}/${activity}`),now=Date.now();
        const tx=await ref.transaction(current=>{
          if(current===null&&expectedVersion>0)return current;
          if(current?.history?.[requestId])return current;
          if((current?.version||0)!==expectedVersion)return;
          return {enabled,version:expectedVersion+1,updatedAt:now,updatedBy:actor.uid,history:{...(current?.history||{}),[requestId]:{enabled,previous:current?.enabled??!target.except?.includes(course),by:actor.uid,at:now}}};
        },undefined,false);
        const confirmed=(await ref.once('value')).val();
        if(!tx.committed||confirmed?.history?.[requestId]?.by!==actor.uid||confirmed.version!==expectedVersion+1||confirmed.enabled!==enabled)throw fail(409,'La selección de tareas cambió en otra ventana. Actualiza y vuelve a intentarlo.');
        return res.status(200).json({ok:true,...await read()});
      }
      if(action==='save'){
        if(req.method!=='POST')throw fail(405,'Usa Guardar para registrar una nota.');
        if(!canEdit)throw fail(403,'Solo el docente puede modificar notas.');
        const {n,activity,grade,expectedVersion,requestId}=body;
        const settings=(await db.ref(settingsPath).once('value')).val();
        const target=ACTIVITIES.find(a=>a.id===activity&&isEnabled(a,course,settings));
        if(!Number.isInteger(n)||!roster[course].some(s=>s.n===n)||!target||!validGrade(grade)||!Number.isInteger(expectedVersion)||expectedVersion<0||!/^[A-Za-z0-9_-]{12,100}$/.test(requestId||''))throw fail(400,'Revisa el estudiante, la actividad y la nota (1,0 a 7,0).');
        const ref=db.ref(`${cellPath}/${n}/${activity}`),now=Date.now();
        const tx=await ref.transaction(current=>{
          if(current===null&&expectedVersion>0)return current; // Permitir que Firebase cargue la versión real.
          if(current?.history?.[requestId])return current;
          if((current?.version||0)!==expectedVersion)return;
          return {grade,version:expectedVersion+1,updatedAt:now,updatedBy:actor.uid,history:{...(current?.history||{}),[requestId]:{grade,previous:current?.grade??null,by:actor.uid,at:now}}};
        },undefined,false);
        const confirmed=(await ref.once('value')).val();
        if(!tx.committed||confirmed?.history?.[requestId]?.by!==actor.uid||confirmed.version!==expectedVersion+1||(confirmed.grade??null)!==grade)throw fail(409,'La nota cambió en otra ventana. Se actualizará la planilla; revisa antes de guardar de nuevo.');
        return res.status(200).json({ok:true,...await read()});
      }
      if(req.method!=='GET'||!['list','watch'].includes(action))throw fail(400,'Acción no reconocida.');
      if(action==='list')return res.status(200).json({ok:true,...await read()});
      // La suscripción se sirve autenticada, sin abrir reglas de Firebase ni poner tokens en URLs.
      res.setHeader('Content-Type','text/event-stream; charset=utf-8');res.setHeader('X-Accel-Buffering','no');res.flushHeaders?.();
      let closed=false,running=false,again=false,timer;
      const refs=[coursePath,...versions.map(([,c])=>`plataforma_nm4/${c[0]}`)].map(p=>db.ref(p));
      const close=()=>{if(closed)return;closed=true;clearInterval(heartbeat);clearTimeout(deadline);clearTimeout(timer);refs.forEach(r=>r.off('value',changed));res.end();};
      const send=async()=>{if(closed)return;if(running){again=true;return;}running=true;try{const data=await read();if(!closed)res.write(`data: ${JSON.stringify(data)}\n\n`);}catch(_){close();}finally{running=false;if(again&&!closed){again=false;timer=setTimeout(send,80);}}};
      const changed=()=>{clearTimeout(timer);timer=setTimeout(send,80);};
      const heartbeat=setInterval(()=>{if(!closed)res.write(': conectado\n\n');},15000),deadline=setTimeout(close,45000);
      res.on('close',close);refs.forEach(r=>r.on('value',changed,close));await send();
    }catch(e){if(!res.headersSent)return res.status(e.status||500).json({error:e.status?e.message:'No se pudo cargar la planilla. Vuelve a intentarlo.'});res.end();}
  };
}
module.exports={createHandler,project,validGrade,ACTIVITIES,BASE};
