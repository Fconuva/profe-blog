// Funciones reales con base y perfiles ficticios; nunca usa Firebase real.
const http=require('http'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../../..');
const {database,auth}=require('../../../scripts/audit-paes-cartas'),B=require('../../../api/_paes-cartas');const db=database();
const stub=`window.PaesStudentSession={restore:async()=>({user:{getIdToken:async()=>document.body.classList.contains('guided')?'apoyo':location.search.includes('pareja')?'pareja':'alumno'}}),signIn:async()=>({user:{getIdToken:async()=>document.body.classList.contains('guided')?'apoyo':location.search.includes('pareja')?'pareja':'alumno'}}),errorMessage:e=>e.message,client:async()=>({auth:{currentUser:{getIdToken:async()=>'profesor'},signInWithEmailAndPassword:async()=>{}}})};`;
http.createServer(async(req,res)=>{
 try{const u=new URL(req.url,'http://localhost');
 if(u.pathname==='/__evidencia'){
  if(req.method==='POST'){
   let data='';for await(const chunk of req)data+=chunk;if(data.length>8000000)throw Error('Captura demasiado grande');
   const form=new URLSearchParams(data),label=form.get('label');if(!/^[a-z-]{3,30}$/.test(label))throw Error('Etiqueta no válida');
   const bytes=Buffer.from(form.get('image')||'','base64');if(bytes[0]!==255||bytes[1]!==216)throw Error('Se requiere JPEG');
   fs.writeFileSync(path.join(__dirname,'captura-'+label+'.jpg'),bytes);res.setHeader('Content-Type','text/html; charset=utf-8');return res.end('<h1>Captura guardada</h1><p>'+label+'</p>');
  }
  res.setHeader('Content-Type','text/html; charset=utf-8');return res.end('<html lang="es"><h1>Conservar evidencia local</h1><form method="POST"><label>Etiqueta<input name="label" required></label><label>Imagen JPEG en base64<textarea name="image" required></textarea></label><button type="submit">Guardar captura</button></form></html>');
 }
 if(u.pathname==='/api/paes'){
  let data='';for await(const chunk of req)data+=chunk;req.body=data?JSON.parse(data):undefined;req.query=Object.fromEntries(u.searchParams);res.status=n=>{res.statusCode=n;return res;};res.json=v=>res.end(JSON.stringify(v));res.setHeader('Content-Type','application/json');return B.handle(req.query.action,req,res,{db,auth,adminUid:req.headers.authorization==='Bearer profesor'?'profesor':undefined});
 }
 if(u.pathname==='/paes/js/student-session.js'){res.setHeader('Content-Type','text/javascript');return res.end(stub);}
 const file=path.resolve(root,'.'+decodeURIComponent(u.pathname));if(!file.startsWith(root+path.sep)){res.statusCode=403;return res.end();}
 const target=fs.existsSync(file)&&fs.statSync(file).isDirectory()?path.join(file,'index.html'):file;
 if(!fs.existsSync(target)||target.includes(path.sep+'api'+path.sep)||target.includes(path.sep+'produccion'+path.sep)||target.includes(path.sep+'originales'+path.sep)){res.statusCode=404;return res.end('No encontrado');}
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf'};res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');fs.createReadStream(target).pipe(res);
 }catch(e){res.statusCode=500;res.end(e.message);}
}).listen(Number(process.env.CARTAS_TEST_PORT||8770),'127.0.0.1',()=>console.log('Cartas: servidor de funciones con fixtures en 127.0.0.1:8770'));
