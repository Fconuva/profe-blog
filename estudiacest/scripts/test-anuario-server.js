/* Entorno local aislado: API real, Firebase en memoria y una sola identidad ficticia.
 * No carga credenciales ni se conecta a la base de producción. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {createRequire} = require('node:module');
const assert = require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const uid='anuario_111111111';
const base='plataforma_estudiantes/nm4/4dtp/anuario_2026/students/111111111';
const store={plataforma_estudiantes:{admins:{qa_admin:true},nm4:{'4dtp':{anuario_2026:{students:{}}}}}};
const clone=value=>value==null?null:JSON.parse(JSON.stringify(value));
function ref(location){
  const parts=location.split('/');
  const get=()=>parts.reduce((value,key)=>value?.[key],store)??null;
  const set=async value=>{let node=store;for(const key of parts.slice(0,-1))node=node[key]??=( {} );node[parts.at(-1)]=clone(value);};
  return {once:async()=>({val:()=>clone(get())}),set,update:async value=>set({...get(),...value}),transaction:async fn=>{const value=fn(clone(get()));await set(value);return{committed:true,snapshot:{val:()=>clone(value)}};},child:key=>ref(location+'/'+key)};
}
const fakeAdmin={apps:[{}],database:()=>({ref}),auth:()=>({verifyIdToken:async token=>{if(token==='qa-student')return{uid,anuario4dtp:true};if(token==='qa-admin')return{uid:'qa_admin'};throw new Error('No autorizado');},createCustomToken:async()=> 'qa-student'}),storage:()=>({bucket:()=>({file:()=>({getSignedUrl:async()=>['http://127.0.0.1:4173/qa-audio.wav']})})})};
let source=fs.readFileSync(path.join(ROOT,'api/anuario-4dtp.js'),'utf8').replace(/const ROSTER_ROWS = \[[\s\S]*?\n\];/,"const ROSTER_ROWS = [['111111111','ESTUDIANTE FICTICIO QA']];");
const mod={exports:{}};const apiRequire=createRequire(path.join(ROOT,'api/anuario-4dtp.js'));
vm.runInNewContext(source+'\nmodule.exports.testing={sanitizeBookSections,sanitizeWrittenProducts,sanitizeInterviews,studentRecord};',{module:mod,exports:mod.exports,require:name=>name==='firebase-admin'?fakeAdmin:apiRequire(name),process:{env:{}},console:{error:()=>{}},Buffer,URL,setTimeout,clearTimeout});
const api=mod.exports;
const fixture=api.testing.studentRecord({name:'ESTUDIANTE FICTICIO QA',rut:'111111111',course:'4DTP'},null);
fixture.interviews.forEach((item,i)=>{item.interviewee='Persona ficticia '+(i+1);item.transcription=('Respuesta de prueba ficticia para comprobar el guardado y la revisión. ').repeat(5);item.audioFileId='qa-audio-'+(i+1);fixture.files[item.audioFileId]={id:item.audioFileId,name:'Entrevista de prueba '+(i+1)+'.wav',category:'interview_audio',slot:i+1,contentType:'audio/wav',size:32044,storagePath:'anuario_2026/4dtp/111111111/prueba.wav',createdAt:Date.now()};});
ref(base).set(fixture);
async function call(action,body,token='qa-student',query={}){let status=200;let data;await api({method:body===undefined?'GET':'POST',headers:{authorization:'Bearer '+token},query:{action,...query},body},{setHeader(){},status(n){status=n;return this;},json(value){data=value;return this;},end(){}});return{status,data};}
async function tests(){
  const saved=await call('save',{interviews:fixture.interviews,writtenProducts:{memoryText:'á'.repeat(18000)},bookSections:{portada:'Mi portada de prueba',jefes:'Texto de prueba',unexpected:'rechazar'}});
  assert.equal(saved.status,200);
  const state=(await call('state')).data.state;
  assert.equal(state.bookSections.portada,'Mi portada de prueba');assert.equal(state.writtenProducts.memoryText.length,18000);assert.equal(state.bookSections.unexpected,undefined);
  await call('save',{interviews:fixture.interviews,writtenProducts:{projectText:'Conservar lo anterior'}});
  assert.equal((await call('state')).data.state.bookSections.jefes,'Texto de prueba');
  assert.equal((await call('state')).data.state.writtenProducts.memoryText.length,18000);
  assert.equal((await call('submit-activity1',{})).status,200);
  assert.equal((await call('submit-activity2',{})).status,200);
  const admin=(await call('admin-detail',undefined,'qa-admin',{rut:'111111111'})).data.state;
  assert.equal(admin.activity1Status,'submitted');assert.equal(admin.activity2Status,'submitted');assert.equal(admin.bookSections.portada,'Mi portada de prueba');
  assert.equal((await call('admin-detail',undefined,'qa-student',{rut:'111111111'})).status,401);
  assert.equal((await call('admin-file-url',undefined,'qa-admin',{rut:'111111111',fileId:'missing'})).status,404);
  assert.equal((await call('admin-file-url',undefined,'qa-admin',{rut:'111111111',fileId:'qa-audio-1'})).status,200);
  assert.equal(api.testing.sanitizeInterviews([{slot:1,transcription:'a'.repeat(59000),audioFileId:'forged'}],fixture.interviews)[0].transcription.length,59000);
  assert.equal(api.testing.sanitizeInterviews([{slot:1,audioFileId:'forged'}],fixture.interviews)[0].audioFileId,'qa-audio-1');
  console.log('API real aislada: guardado, conservación, lectura, entregas, permisos y audio: 15 comprobaciones OK.');
}
const sdk=`(()=>{const isAdmin=location.pathname.endsWith('admin.html');const auth={currentUser:isAdmin?{getIdToken:async()=> 'qa-admin'}:null,setPersistence:async()=>{},signInWithCustomToken:async()=>{auth.currentUser={getIdToken:async()=> 'qa-student'};},signInWithEmailAndPassword:async()=>{},signOut:async()=>{auth.currentUser=null},onAuthStateChanged:fn=>setTimeout(()=>fn(auth.currentUser),0)};const factory=()=>auth;factory.Auth={Persistence:{NONE:'none',LOCAL:'local'}};window.firebase={initializeApp(){},auth:factory,storage:()=>({})};})();`;
const wav=Buffer.alloc(32044);wav.write('RIFF');wav.writeUInt32LE(32036,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(16000,24);wav.writeUInt32LE(32000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(32000,40);
for(let i=0;i<16000;i++)wav.writeInt16LE(Math.round(Math.sin(i*2*Math.PI*440/16000)*1200),44+i*2);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf'};
tests().then(()=>{
 if(process.argv.includes('--test-only'))return;
 http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1:4173');
  if(url.pathname==='/qa-sdk.js'){res.setHeader('Content-Type','text/javascript');return res.end(sdk);}
  if(url.pathname==='/qa-audio.wav'){res.setHeader('Content-Type','audio/wav');return res.end(wav);}
  if(url.pathname==='/api/anuario-4dtp'){const chunks=[];for await(const chunk of req)chunks.push(chunk);req.body=JSON.parse(Buffer.concat(chunks).toString()||'{}');req.query=Object.fromEntries(url.searchParams);res.status=n=>{res.statusCode=n;return res};res.json=data=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));};return api(req,res);}
  let relative=decodeURIComponent(url.pathname);if(relative.endsWith('/'))relative+='index.html';const target=path.resolve(ROOT,'.'+relative);
  if(!target.startsWith(ROOT+path.sep)||!fs.existsSync(target)){res.statusCode=404;return res.end('No encontrado');}
  res.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');
  let content=fs.readFileSync(target);
  if(target.endsWith('.html'))content=content.toString().replace(/<script src="https:\/\/www\.gstatic\.com\/firebasejs\/[^\"]+"><\/script>/g,'').replace('</head>','<script src="/qa-sdk.js"></script></head>');
  res.end(content);
 }).listen(4173,'127.0.0.1',()=>console.log('QA aislado disponible en http://127.0.0.1:4173/4dtp/'));
}).catch(error=>{console.error(error);process.exitCode=1;});
