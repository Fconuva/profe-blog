'use strict';
// Servidor de prueba: base en memoria, identidades ficticias y API real de salas.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const salas = require('../../api/_salas.js');
const specs = require('./assets.json');
const root = path.resolve(__dirname,'../..');
function crear() {
  const copy = value => value == null ? null : JSON.parse(JSON.stringify(value));
  const regalos = Object.fromEntries(specs.map(({id})=>[id,{tipo:'docente',de:'Docente de prueba',ts:1}]));
  const pieza = specs.map(({id},i)=>({id,col:1+(i%4)*2,fila:1+Math.floor(i/4)*2,dir:'SE'}));
  const datos = {plataforma_estudiantes:{configuracion:{mi_espacio:{enabled:true}},estudiantes:{
    qaStudentA:{nombre:'ESTUDIANTE PRUEBA A',curso:'2A-HC'},qaStudentB:{nombre:'ESTUDIANTE PRUEBA B',curso:'2A-HC'}
  },avatar:{qaStudentA:{casa:{tamano:'9x9',piso:'madera',muro:'blanco'},pieza,regalos},
    qaStudentB:{casa:{tamano:'5x5',piso:'madera',muro:'blanco'},pieza:[],regalos:{}}}}};
  const leer = key => key.split('/').filter(Boolean).reduce((v,k)=>v?.[k],datos);
  const escribir = (key,value) => {
    const parts=key.split('/').filter(Boolean);let current=datos;
    for(const part of parts.slice(0,-1))current=current[part]??(current[part]={});
    if(value==null)delete current[parts.at(-1)];else current[parts.at(-1)]=copy(value);
  };
  const snapshot=value=>({val:()=>copy(value),exists:()=>value!=null});
  const ref=key=>({once:async()=>snapshot(leer(key)),set:async value=>escribir(key,value),
    remove:async()=>escribir(key,null),update:async value=>Object.entries(value).forEach(([k,v])=>escribir(key+'/'+k,v)),
    transaction:async fn=>{const value=fn(copy(leer(key)));if(value===undefined)return{committed:false};escribir(key,value);return{committed:true,snapshot:snapshot(value)};},
    orderByChild:field=>({equalTo:value=>({once:async()=>snapshot(Object.fromEntries(Object.entries(leer(key)||{}).filter(([,v])=>v[field]===value)))})})});
  const db={ref};const auth={verifyIdToken:async uid=>({uid})};
  const fallos=[];const peticiones=[];
  const servidor=http.createServer(async(req,res)=>{
    const url=new URL(req.url,'http://127.0.0.1');
    if(url.pathname==='/favicon.ico'){res.writeHead(204);return res.end();}
    const json=(value,status=200)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value??null));};
    try {
      if(url.pathname==='/qa-state')return json(leer('plataforma_estudiantes/avatar/'+url.searchParams.get('uid')));
      if(url.pathname==='/qa-read')return json(leer(url.searchParams.get('key')));
      if(url.pathname==='/qa-store'||url.pathname==='/api/estudiantes') {
        let raw='';for await(const chunk of req)raw+=chunk;const body=JSON.parse(raw||'{}');
        if(url.pathname==='/qa-store'){escribir(body.key,body.value);return json({ok:true});}
        let status=200;const output={status(code){status=code;return this;},json(value){peticiones.push({action:body.action,status,ok:value.ok});json(value,status);}};
        return await salas.manejar({method:req.method,headers:req.headers,body},output,String(body.action||'').replace(/^salas-/,''),db,auth);
      }
      const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
      if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){fallos.push(url.pathname);res.writeHead(404);return res.end('No existe');}
      const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'}[path.extname(file)]||'application/octet-stream';
      res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
    }catch(error){fallos.push(error.message);if(!res.headersSent)json({error:'Prueba fallida'},500);else res.end();}
  });
  return{servidor,leer,escribir,peticiones,fallos};
}
module.exports={crear};
