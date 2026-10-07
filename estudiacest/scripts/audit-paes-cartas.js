'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const C=require('../api/_paes-cartas-catalog'),B=require('../api/_paes-cartas'),D=require('../api/_paes-cartas-duel'),E=require('../paes/cartas/motor');
function database(cold=false){
 const state={plataforma_estudiantes:{estudiantes:{alumno:{nombre:'Lector ficticio A',curso:'3°A HC',rut:'000000001'},pareja:{nombre:'Lector ficticio B',curso:'3°A HC',rut:'000000002'},intruso:{nombre:'Lector ficticio C',curso:'3°A HC',rut:'000000003'},apoyo:{nombre:'Cuenta ficticia con apoyo',curso:'3°A HC',rut:['229','327','739'].join('')},otro:{nombre:'Otro curso',curso:'2°A HC'},otrohc:{nombre:'Otro curso HC',curso:'4°A HC'}}}};
 const get=p=>p.split('/').reduce((o,k)=>o?.[k],state)??null;
 const set=(p,value)=>{const parts=p.split('/'),key=parts.pop();let o=state;for(const k of parts)o=o[k]||={};o[key]=value;};
 const clone=v=>v===undefined?undefined:JSON.parse(JSON.stringify(v));
 return {state,ref:p=>({once:async()=>({val:()=>clone(get(p))}),set:async v=>set(p,clone(v)),transaction:async fn=>{if(cold&&get(p)!==null&&fn(null)===undefined)return {committed:false,snapshot:{val:()=>get(p)}};const next=fn(clone(get(p)));if(next===undefined)return {committed:false,snapshot:{val:()=>get(p)}};set(p,clone(next));return {committed:true,snapshot:{val:()=>clone(get(p))}};}})};
}
const auth={verifyIdToken:async token=>{if(!['alumno','pareja','apoyo','otro','otrohc','intruso','profesor'].includes(token))throw Error('token inválido');return {uid:token};}};
async function call(db,action,token,body,mode='regular',isAdmin=false,query={}){
 const req={method:body?'POST':'GET',headers:{authorization:token?'Bearer '+token:''},query:{mode,...query},body};let status=200,output;
 const res={setHeader(){},status(n){status=n;return this;},json(v){output=v;return this;}};
 await B.handle(action,req,res,{db,auth,adminUid:isAdmin?'profesor':undefined});return {status,body:output};
}
function full(guided=false){return {version:C.VERSION,answers:Object.fromEntries(C.questionsFor(guided).map(q=>[q.id,q.key])),decisions:Object.fromEntries(C.missions.map(m=>[m.id,0])),evidence:Object.fromEntries(C.missions.map(m=>[m.id,'Una pista textual comprobable.'])),reflection:{comprendi:'Relacioné los documentos.',evidencia:'Comparé distintas pistas.',mejorare:'Volveré al texto antes de elegir.'}};}
async function audit(){let checks=0;const check=value=>{assert.ok(value);checks++;};const db=database();
 db.state.plataforma_estudiantes.estudiantes.alumno.ocultarDeCasas=true;check((await call(db,'cards-state','alumno')).status===200);let r=await call(db,'cards-preview');check(r.status===200&&r.body.activity.questions.length===18);check(!/"(?:key|reason|failures)"/.test(JSON.stringify(r.body)));
 check((await call(db,'cards-state')).status===401);check((await call(db,'cards-state','falso')).status===401);check((await call(db,'cards-state','otro')).status===403);
 r=await call(db,'cards-state','apoyo');check(r.body.redirect==='/paes/cartas/guiada.html');r=await call(db,'cards-state','apoyo',null,'guided');check(r.body.activity.questions.length===6);
 check((await call(db,'cards-state','alumno',null,'guided')).body.redirect==='/paes/cartas/');
 check((await call(db,'cards-save','alumno',{version:C.VERSION,answers:{q99:'A'}})).status===400);check((await call(db,'cards-save','alumno',{version:C.VERSION,answers:{q1:'E'}})).status===400);check((await call(db,'cards-submit','alumno',{version:C.VERSION,answers:{}})).status===400);
 r=await call(db,'cards-save','alumno',{...full(),uid:'apoyo',score:999,completada:true});check(r.status===200&&!r.body.attempt.completada&&!('score' in r.body.attempt));
 const concurrent=await Promise.all([call(db,'cards-submit','alumno',full()),call(db,'cards-submit','alumno',{...full(),answers:Object.fromEntries(C.questionsFor(false).map(q=>[q.id,'A']))})]);check(concurrent.filter(r=>r.status===200).length===1&&concurrent.filter(r=>r.status===409).length===1);
 const raw=(await db.ref(B.BASE+'/'+C.SESSION+'/alumno').once('value')).val();check(raw.uid==='alumno'&&raw.score===18&&raw.total===18&&raw.submitted&&raw.completada&&raw.submittedAt===raw.completadaAt);
 r=await call(db,'cards-state','alumno');check(!('result' in r.body.attempt)&&!('review' in r.body.attempt));check((await call(db,'cards-save','alumno',full())).status===409);check((await call(db,'admin-cards-list','alumno')).status===403);
 await call(db,'admin-cards-release','profesor',{curso:'3A-HC',published:true},'regular',true);r=await call(db,'cards-state','alumno');check(r.body.attempt.result.score===18&&r.body.attempt.review.length===18);
 await call(db,'admin-cards-release','profesor',{curso:'3A-HC',published:false},'regular',true);r=await call(db,'cards-state','alumno');check(!('result' in r.body.attempt));
 await call(db,'admin-cards-reset','profesor',{uid:'alumno',sessionId:C.SESSION},'regular',true);r=await call(db,'cards-state','alumno');const resetAt=r.body.resetAt;check(r.body.attempt===null&&resetAt>0);check((await call(db,'cards-save','alumno',full())).status===409);check((await call(db,'cards-submit','alumno',{...full(),resetAt})).status===200);
 const badAnswers=Object.fromEntries(C.questionsFor(true).map(q=>[q.id,'ABCD'.split('').find(v=>v!==q.key)]));r=await call(db,'cards-submit','apoyo',{...full(true),answers:badAnswers,evidence:{},reflection:{comprendi:'Leí',evidencia:'Río',mejorare:'Ver'}},'guided');check(r.status===200&&r.body.attempt.completada);check((await db.ref(B.BASE+'/'+C.SESSION+'-guiada/apoyo').once('value')).val().score===0);
 const coldDB=database(true);await call(coldDB,'cards-submit','alumno',full());check((await call(coldDB,'admin-cards-reset','profesor',{uid:'alumno',sessionId:C.SESSION},'regular',true)).status===200);
 const roomBody={version:C.VERSION,archetype:'guardian'};check((await call(db,'cards-room-create',null,roomBody)).status===401);check((await call(db,'cards-room-create','alumno',{...roomBody,archetype:'inexistente'})).status===400);
 r=await call(db,'cards-room-create','alumno',roomBody);check(r.status===200&&r.body.room.phase==='waiting');const code=r.body.room.code;check(/^[A-HJ-NP-Z2-9]{6}$/.test(code));
 check((await call(db,'cards-room-join','otrohc',{...roomBody,code})).status===403);
 r=await call(db,'cards-room-join','pareja',{...roomBody,code,archetype:'cronista'});check(r.status===200&&r.body.room.phase==='active'&&!r.body.room.yourTurn);check(r.body.room.me.hand.length===5&&r.body.room.foe.handCount===5&&!('hand' in r.body.room.foe));check(!('seed'in r.body.room)&&!('order'in r.body.room)&&!('uid'in r.body.room.foe));
 check((await call(db,'cards-room-state','intruso',null,'regular',false,{code})).status===403);check((await call(db,'cards-room-join','intruso',{...roomBody,code})).status===409);
 const rev=r.body.room.revision;
 check((await call(db,'cards-room-act','pareja',{version:C.VERSION,code,revision:rev,kind:'end'})).status===409);
 const turns=await Promise.all([call(db,'cards-room-act','alumno',{version:C.VERSION,code,revision:rev,kind:'end'}),call(db,'cards-room-act','alumno',{version:C.VERSION,code,revision:rev,kind:'end'})]);check(turns.filter(r=>r.status===200).length===1&&turns.filter(r=>r.status===409).length===1);
 r=await call(db,'cards-room-state','pareja',null,'regular',false,{code});check(r.body.room.yourTurn&&r.body.room.turn===2&&r.body.room.me.hand.length===5);const r2=r.body.room.revision;
 check((await call(db,'cards-room-act','pareja',{version:C.VERSION,code,revision:r2,kind:'play',card:'inventada'})).status===409);
 check((await call(db,'cards-room-act','pareja',{version:C.VERSION,code,revision:r2,kind:'play',proof:{mission:'archivo',paragraph:0,explanation:'x'}})).status===400);
 check((await call(db,'cards-room-act','pareja',{version:C.VERSION,code,revision:r2,kind:'concede'})).body.room.phase==='ended');
 let game=E.create({uid:'a',nombre:'A',curso:'X'},'guardian',1,0,'ABC234');game=E.join(game,{uid:'b',nombre:'B',curso:'X'},'cronista',1);
 const inject=(card)=>{game.players.a.hand=[{id:'fixture',card}];game.players.a.energy=6;};const play=(card,extra={},proof)=>{inject(card);game=E.apply(game,'a',{kind:'play',card:'fixture',revision:game.revision,...extra},2,proof);};
 play('guardian');check(game.players.a.board.length===1&&!game.players.a.board[0].ready);assert.throws(()=>E.apply(game,'a',{kind:'attack',ally:game.players.a.board[0].id,target:'hero',revision:game.revision},2));checks++;
 game.players.b.board=[{id:'guard',card:'guardian',attack:2,hp:7,maxHp:7,ready:false}];check(E.availableTargets(game,'a').join()==='guard');inject('fuego');assert.throws(()=>E.apply(game,'a',{kind:'play',card:'fixture',target:'hero',revision:game.revision},2));checks++;
 play('fuego',{target:'guard'});check(game.players.b.board[0].hp===2);play('contraste');check(game.players.b.board.length===0&&game.players.b.discard.includes('guardian'));
 play('escudo');check(game.players.a.block===7);game=E.apply(game,'a',{kind:'end',revision:game.revision},3);check(game.players.a.block===7);
 game.players.b.hand=[{id:'blast',card:'fuego'}];game=E.apply(game,'b',{kind:'play',card:'blast',target:game.players.a.board[0].id,revision:game.revision},4);game=E.apply(game,'b',{kind:'end',revision:game.revision},5);check(game.players.a.block===0&&game.players.a.board[0].ready&&game.players.a.energy===4);
 play('cita',{}, {mission:'archivo',paragraph:0,explanation:'Relaciono la condición con mi estrategia.'});check(game.players.a.citedTurn===game.turn&&game.players.a.block===3&&game.pacts.length===1);
 inject('cita');assert.throws(()=>E.apply(game,'a',{kind:'play',card:'fixture',revision:game.revision},6,{explanation:'Otra cita'}));checks++;
 const hp=game.players.b.hp;play('relacion',{target:'hero'});check(game.players.b.hp===hp-10);
 play('armadura',{target:game.players.a.board[0].id});check(game.players.a.board[0].attack===4&&game.players.a.board[0].maxHp===9);
 game.players.a.hp=31;play('cura');check(game.players.a.hp===32);
 game.players.a.hand=Array.from({length:8},(_,i)=>({id:i?'full'+i:'fixture',card:i?'fuego':'fuente'}));game.players.a.energy=5;game=E.apply(game,'a',{kind:'play',card:'fixture',revision:game.revision},7);check(game.players.a.hand.length===8);
 game.players.b.hp=1;play('fuego',{target:'hero'});check(game.phase==='ended'&&game.winner==='a');
 const jsonRoundTrip=JSON.parse(JSON.stringify(game,(k,v)=>Array.isArray(v)&&!v.length?undefined:v));check(D.hydrate(jsonRoundTrip).players.a.board.length===1&&Array.isArray(D.hydrate(jsonRoundTrip).players.b.board));
 const waiting=E.create({uid:'a',nombre:'A',curso:'X'},'guardian',1,0,'ABC234');check(E.apply(waiting,'a',{kind:'concede',revision:0},1).phase==='ended');
 let cited=E.create({uid:'alumno',nombre:'A',curso:'3A-HC'},'guardian',1,Date.now(),'CETA23');cited=E.join(cited,{uid:'pareja',nombre:'B',curso:'3A-HC'},'cronista',Date.now());cited.players.alumno.hand=[{id:'fixture-cita',card:'cita'}];await db.ref(D.BASE+'/CETA23').set(cited);
 const citation='Relaciono la condici?n con mi estrategia de proteger el refugio.';r=await call(db,'cards-room-act','alumno',{version:C.VERSION,code:'CETA23',revision:cited.revision,kind:'play',card:'fixture-cita',proof:{mission:'archivo',paragraph:0,explanation:citation}});check(r.status===200&&r.body.room.me.block===3);check(!JSON.stringify(r.body.room).includes(citation));
 r=await call(db,'admin-cards-list','profesor',null,'regular',true);check(r.body.rooms.some(room=>room.code==='CETA23'&&room.pacts.some(p=>p.explanation===citation)));check(!/"(?:hand|deck|seed)":/.test(JSON.stringify(r.body.rooms)));
 for(const q of [...C.questionsFor(false),...C.questionsFor(true)]){check(q.options.length===4&&'ABCD'.includes(q.key)&&q.reason.length>20);check(q.failures.filter(Boolean).length===3&&q.failures[q.key.charCodeAt(0)-65]==='');check(q.options[q.key.charCodeAt(0)-65].length<=Math.max(...q.options.filter((_,i)=>i!==q.key.charCodeAt(0)-65).map(v=>v.length))*1.15);}
 check(new Set(Object.values(E.CARDS).map(c=>c.art)).size===16);for(const card of Object.values(E.CARDS))check(fs.existsSync(path.join(__dirname,'../paes/cartas/assets',card.art+'.webp')));
 for(const q of C.questionsFor(true))check(C.missions.find(m=>m.id===q.mission).guided.join(' ').includes(q.evidence));
 for(const name of ['juego.js','docente.js','portal.js'])new Function(fs.readFileSync(path.join(__dirname,'../paes/cartas',name),'utf8'));
 const rules=JSON.parse(fs.readFileSync(path.join(__dirname,'../firebase-rules.json'))).rules;check(rules['.read']===false&&rules['.write']===false&&!rules.plataforma_paes);
 console.log(`Cartas: ${checks} comprobaciones superadas. Turnos, manos privadas, concurrencia, combate, identidad, entrega y resultados. Solo fixtures.`);return checks;
}
module.exports={database,auth,call,full,audit};if(require.main===module)audit().catch(e=>{console.error(e);process.exitCode=1;});
