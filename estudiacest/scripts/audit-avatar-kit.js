// Contrato del kit: cincuenta PNG distintos, transparencias y gestos compartidos.
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),zlib=require('node:zlib'),crypto=require('node:crypto');
const avatar=require('../estudiantes/js/personaje-iso'),salas=require('../api/_salas');
const {createHouseFixture}=require('./audit-paes-house-admin');
const root=path.join(__dirname,'..');
function rgba(file){
  const b=fs.readFileSync(file);assert.equal(b.subarray(1,4).toString(),'PNG');
  const w=b.readUInt32BE(16),h=b.readUInt32BE(20);assert.equal(b[24],8);assert.equal(b[25],6,'PNG RGBA, sin fondo opaco');
  const parts=[];for(let i=8;i<b.length;){const n=b.readUInt32BE(i),type=b.toString('ascii',i+4,i+8);if(type==='IDAT')parts.push(b.subarray(i+8,i+8+n));i+=n+12;}
  const compressed=zlib.inflateSync(Buffer.concat(parts)),stride=w*4,data=Buffer.alloc(w*h*4);
  for(let y=0;y<h;y++){
    const f=compressed[y*(stride+1)];
    for(let x=0;x<stride;x++){
      const i=y*stride+x,a=x>=4?data[i-4]:0,c=y&&x>=4?data[i-stride-4]:0,d=y?data[i-stride]:0;
      let pred=0;if(f===1)pred=a;else if(f===2)pred=d;else if(f===3)pred=Math.floor((a+d)/2);else if(f===4){const p=a+d-c,pa=Math.abs(p-a),pb=Math.abs(p-d),pc=Math.abs(p-c);pred=pa<=pb&&pa<=pc?a:pb<=pc?d:c;}else assert.equal(f,0);
      data[i]=(compressed[y*(stride+1)+1+x]+pred)&255;
    }
  }
  return {w,h,data,hash:crypto.createHash('sha256').update(b).digest('hex')};
}
async function main(){
  const kit=avatar.KIT;assert.equal(kit.length,50);assert.equal(new Set(kit.map(p=>p.id)).size,50);
  const hashes=new Set();
  for(const type of ['ojos','boca','pelo','gesto','pose'])assert.equal(kit.filter(p=>p.tipo===type).length,10);
  for(const p of kit){
    assert.match(p.url,/^\/estudiantes\/assets\/avatar-kit\/[a-zA-Z0-9-]+\.png$/);
    const png=rgba(path.join(root,p.url));hashes.add(png.hash);
    assert.ok(png.w<=160&&png.h<=168);let visible=0;
    for(let y=0;y<png.h;y++)for(let x=0;x<png.w;x++){const a=png.data[(y*png.w+x)*4+3];if(a>8)visible++;if(x===0||y===0||x===png.w-1||y===png.h-1)assert.equal(a,0,'Margen transparente de '+p.id);}
    assert.ok(visible>1000,'Recurso visible: '+p.id);
    if(['ojos','boca','pelo'].includes(p.tipo))assert.ok(avatar.CATALOGO[p.tipo].opciones.some(o=>o.id===p.opcion));
  }
  assert.equal(hashes.size,50,'No repetir una imagen para simular cincuenta recursos');
  assert.equal(avatar.GESTOS.length,10);assert.equal(new Set(avatar.GESTOS.map(p=>p.id)).size,10);
  assert.equal(avatar.normalizeLook({arriba:'camisetaRangers'},{xpTotal:0,regalos:{ropa__arriba__camisetaRangers:{tipo:'docente'}}}).arriba,'camisetaRangers');
  const {db,state}=createHouseFixture(),original=db.ref;
  db.ref=key=>{const ref=original(key);ref.update=value=>ref.transaction(old=>({...old,...value}));return ref;};
  state.datos.plataforma_estudiantes.configuracion={mi_espacio:{enabled:true}};
  state.datos.plataforma_estudiantes.salas={studentA:{presentes:{studentA:{ts:Date.now()}}}};
  const academicBefore=JSON.stringify(state.datos.plataforma_paes),avatarBefore=JSON.stringify(state.datos.plataforma_estudiantes.avatar);
  async function heartbeat(gesto,dir='SE'){
    let result;const res={setHeader(){},status(code){this.code=code;return this;},json(data){result={code:this.code,data};}};
    await salas.manejar({method:'POST',headers:{authorization:'Bearer ficticio'},body:{sala:'studentA',col:2,fila:3,gesto,dir}},res,'latido',db,{verifyIdToken:async()=>({uid:'studentA'})});assert.equal(result.code,200);
    return state.datos.plataforma_estudiantes.salas.studentA.presentes.studentA;
  }
  for(const g of avatar.GESTOS){const r=await heartbeat(g.id,'NW');assert.equal(r.gesto,g.id);assert.equal(r.dir,'NW');assert.ok(r.gestoHasta>Date.now());}
  const last=await heartbeat('<script>','../admins');assert.equal(last.gesto,avatar.GESTOS.at(-1).id);assert.equal(last.dir,'NW');
  assert.equal(JSON.stringify(state.datos.plataforma_paes),academicBefore);assert.equal(JSON.stringify(state.datos.plataforma_estudiantes.avatar),avatarBefore);
  console.log('Kit: 50 PNG RGBA únicos, márgenes transparentes, 30 opciones de cara/pelo, diez gestos reales, cuatro direcciones, ropa/XP/notas conservados: OK.');
}
main().catch(e=>{console.error(e.stack);process.exitCode=1;});
