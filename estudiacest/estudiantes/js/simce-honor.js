(function(global){
 'use strict';
 const ROOT='/estudiantes/assets/honor-simce-2026/';
 const LOGO='/estudiantes/assets/insignia_talca_1.png';
 let active=null,dialog=null,host=null,expiryTimer=null;
 const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
 function avatar(winner,size){const node=el('div',null,'honor-avatar');global.AvatarLookSystem.render(node,{look:winner.avatar.look,xpTotal:winner.avatar.xpTotal,size,gesto:'saludar',t:0});return node;}
 function image(url){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('No se pudo cargar una imagen del diploma.'));img.src=url;});}
 function wrap(ctx,text,x,y,max,lineHeight){const words=text.split(/\s+/),lines=[];let line='';for(const word of words){if(ctx.measureText((line?line+' ':'')+word).width>max&&line){lines.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)lines.push(line);lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineHeight));return lines.length;}
 async function diploma(winner,data){
  const [background,logo]=await Promise.all([image(ROOT+'diploma-fondo-ia.png'),image(LOGO)]);
  const cv=document.createElement('canvas');cv.width=1800;cv.height=1200;const cx=cv.getContext('2d');cx.drawImage(background,0,0,1800,1200);cx.drawImage(logo,145,125,95,120);
  cx.textAlign='center';cx.fillStyle='#172747';cx.font='24px Georgia';cx.fillText('CENTRO EDUCATIVO SALESIANOS TALCA',960,170);
  cx.font='bold 64px Georgia';cx.fillText('DIPLOMA DE HONOR',900,290);cx.font='27px Georgia';cx.fillText('Cuadro de honor 2026 · SIMCE',900,350);
  const av=avatar(winner,230);cx.drawImage(av.querySelector('canvas'),785,375,230,230);
  cx.fillStyle='#806020';cx.font='bold 28px Georgia';cx.fillText(winner.rank===1?'PRIMER LUGAR COMPARTIDO':'SEGUNDO LUGAR COMPARTIDO',900,650);
  if(data.winners.filter(w=>w.rank===winner.rank).length===1){cx.clearRect(420,619,960,45);cx.drawImage(background,420/1800*background.width,619/1200*background.height,960/1800*background.width,45/1200*background.height,420,619,960,45);cx.fillText('PRIMER LUGAR',900,650);}
  cx.fillStyle='#172747';cx.font='bold 43px Georgia';const lines=wrap(cx,winner.name,900,725,1420,53);
  cx.font='28px Georgia';cx.fillText(data.course.replace('-',' '),900,745+lines*53);
  cx.font='25px Georgia';wrap(cx,'Por su destacado desempeño lector en el Ensayo SIMCE N.º 3 y el Miniensayo 1 de la Unidad 4.',900,850,1380,36);
  cx.font='23px Georgia';cx.fillText('Prof. Francisco Javier Núñez Valenzuela',900,915);cx.font='21px Georgia';cx.fillText('Lengua y Literatura · Reconocimiento 2026',900,945);
  return cv;
 }
 function download(canvas,name){return new Promise((resolve,reject)=>canvas.toBlob(blob=>{if(!blob){reject(new Error('No se pudo crear el diploma.'));return;}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);resolve();},'image/png'));}
 async function podium(data){
  const [bg,logo]=await Promise.all([image(ROOT+'diploma-fondo-ia.png'),image(LOGO)]);const cv=document.createElement('canvas');cv.width=1800;cv.height=1200;const cx=cv.getContext('2d');cx.drawImage(bg,0,0,1800,1200);cx.drawImage(logo,130,100,90,115);cx.textAlign='center';cx.fillStyle='#172747';cx.font='bold 58px Georgia';cx.fillText('CUADRO DE HONOR 2026',960,170);cx.font='32px Georgia';cx.fillText('SIMCE · '+data.course.replace('-',' '),900,235);
  const tied=data.winners.every(w=>w.rank===1),ordered=tied?data.winners:[data.winners[1],data.winners[0],data.winners[2]];
  ordered.forEach((w,i)=>{const x=375+i*525,y=tied?495:(w.rank===1?425:495),node=avatar(w,260);cx.drawImage(node.querySelector('canvas'),x-130,y-160,260,260);cx.fillStyle=w.rank===1?'#b18a37':'#8e9aaa';cx.fillRect(x-220,y+120,440,tied?280:(w.rank===1?350:280));cx.fillStyle='#fff';cx.font='bold 34px Georgia';cx.fillText(w.rank+'°'+(tied||w.rank===2?' compartido':''),x,y+175);cx.font='bold 27px Georgia';wrap(cx,w.name,x,y+230,390,36);});
  cx.fillStyle='#172747';cx.font='25px Georgia';wrap(cx,data.basis,900,960,1390,38);cx.font='22px Georgia';cx.fillText('Centro Educativo Salesianos Talca · Lengua y Literatura',900,1040);return cv;
 }
 function show(){if(active&&dialog&&!dialog.open)dialog.showModal();}
 function remove(){clearTimeout(expiryTimer);if(dialog?.open)dialog.close();dialog?.remove();host?.remove();active=null;}
 async function mount(user){
  remove();let response;try{const token=await user.getIdToken();response=await fetch('/api/estudiantes?action=simce-honor',{headers:{Authorization:'Bearer '+token},cache:'no-store'});if(!response.ok)return;response=await response.json();}catch{return;}
  const data=response.recognition;if(!data)return;active=data;
  host=el('aside',null,'honor-banner');host.setAttribute('aria-label','Reconocimiento del curso');const logo=el('img');logo.src=LOGO;logo.alt='CEST';host.append(logo,el('div','Cuadro de honor 2026 · '+data.course.replace('-',' ')));const open=el('button','Ver reconocimiento');open.type='button';open.onclick=show;host.append(open);
  const target=document.querySelector('.main-container')||document.querySelector('main')||document.body;target.prepend(host);
  dialog=el('dialog',null,'honor-dialog');dialog.setAttribute('aria-labelledby','honorTitle');const panel=el('div',null,'honor-panel');const head=el('header');const brand=el('img');brand.src=LOGO;brand.alt='Insignia oficial CEST';head.append(brand,el('p','Centro Educativo Salesianos Talca','honor-kicker'));const title=el('h2',data.title);title.id='honorTitle';head.append(title,el('p','Desempeño destacado · '+data.course.replace('-',' ')));panel.append(head);
  const tied=data.winners.every(w=>w.rank===1),grid=el('div',null,'honor-podium'+(tied?' honor-tied':''));const ordered=tied?data.winners:[data.winners[1],data.winners[0],data.winners[2]];
  ordered.forEach(w=>{const card=el('article',null,'honor-winner honor-rank-'+w.rank);card.append(avatar(w,132));const pedestal=el('div',null,'honor-pedestal');pedestal.append(el('p',w.rank+'°'+(tied||w.rank===2?' compartido':''),'honor-rank'),el('h3',w.name));const button=el('button','Descargar diploma');button.type='button';button.onclick=async()=>{button.disabled=true;try{await download(await diploma(w,data),'diploma-honor-'+w.uid+'.png');}catch(e){status.textContent=e.message;}finally{button.disabled=false;}};pedestal.append(button);card.append(pedestal);grid.append(card);});
  panel.append(grid,el('p',data.basis,'honor-basis'));const status=el('p','', 'honor-status');status.setAttribute('role','status');panel.append(status);const footer=el('footer'),save=el('button','Descargar podio del curso');save.type='button';save.onclick=async()=>{save.disabled=true;try{await download(await podium(data),'podio-honor-'+data.course+'.png');}catch(e){status.textContent=e.message;}finally{save.disabled=false;}};const close=el('button','Continuar a mis clases');close.type='button';close.className='honor-continue';close.onclick=()=>dialog.close();footer.append(save,close);panel.append(footer);dialog.append(panel);document.body.append(dialog);
  const remaining=Math.max(0,data.expiresAt-data.serverNow);expiryTimer=setTimeout(remove,Math.min(remaining,2147483647));
  const key=data.id+':'+user.uid;let seen=false;try{seen=sessionStorage.getItem(key)==='1';if(!seen)sessionStorage.setItem(key,'1');}catch{}if(!seen)show();
 }
 global.SimceHonor={mount,diploma,podium};
})(window);
