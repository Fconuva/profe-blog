(function(global){
  'use strict';
  function mount({api,student,enabled}){
    const el=id=>document.getElementById('avatarPrize'+id);
    let catalog=global.AvatarLookSystem.catalogoPremios(), checked=null, run=0, giving=false;
    function invalidate(){checked=null;el('Confirm').hidden=true;}
    function refresh(){
      const target=student(), type=el('Type').value;
      el('Catalog').replaceChildren();
      catalog.filter(p=>type==='equipos' ? p.tipo==='ropa' && p.opcion.startsWith('camiseta') : p.tipo===type).forEach(p=>{
        const card=document.createElement('div');card.className='house-item'+(p.tiene?' owned':'');
        const picture=document.createElement('div');picture.style.minHeight='130px';picture.style.display='grid';picture.style.placeItems='center';
        if(p.tipo==='logro'){picture.textContent=p.emoji;picture.style.fontSize='58px';}
        else {const look=global.AvatarLookSystem.getDefaultLook();look[p.categoria]=p.opcion;global.AvatarLookSystem.render(picture,{look,xpTotal:99999,size:130});}
        const name=document.createElement('span');name.textContent=p.nombre;
        const state=document.createElement('strong');state.textContent=p.tiene?'✓ Ya recibido':p.tipo==='logro'?'Logro del profesor':p.seccion;
        const pick=document.createElement('button');pick.type='button';pick.className='house-pick';pick.textContent=p.tiene?'✓ Ya recibido':'Regalar';
        pick.disabled=giving || !enabled() || !target || p.tiene;
        pick.addEventListener('click',()=>{
          if(pick.disabled)return;
          checked={uid:target.uid,id:p.id};el('Chosen').textContent='Regalar «'+p.nombre+'» a '+target.nombre+'.';el('Confirm').hidden=false;
          el('Confirm').scrollIntoView?.({behavior:'smooth',block:'center'});
        });
        card.append(picture,name,state,pick);el('Catalog').append(card);
      });
    }
    async function load(){
      const version=++run;invalidate();catalog=global.AvatarLookSystem.catalogoPremios();refresh();
      const target=student();
      if(!target || !enabled()){el('Status').textContent='Elige «Un estudiante» y selecciona su cuenta arriba. Puedes mirar los premios antes de elegir.';return;}
      el('Status').textContent='Consultando premios ya recibidos…';
      try{
        const data=await api('regalos-admin-avatar',{estudiante:target.uid});
        if(version!==run || target.uid!==student()?.uid)return;
        catalog=data.catalogo;refresh();el('Status').textContent='Premios de '+target.nombre+'. Elige y confirma la entrega.';
      }catch(error){if(version===run)el('Status').textContent=error.message;}
    }
    el('Type').addEventListener('change',()=>{invalidate();refresh();});
    el('Cancel').addEventListener('click',invalidate);
    el('Give').addEventListener('click',async()=>{
      if(giving || !enabled() || !checked || checked.uid!==student()?.uid)return;
      const request={...checked};giving=true;el('Give').disabled=true;refresh();
      el('Status').textContent='Entregando y comprobando el premio…';
      try{
        const data=await api('regalos-admin-avatar',{estudiante:request.uid,premio:request.id,confirmar:true});
        const premio=data.catalogo.find(p=>p.id===request.id);
        if(!premio?.tiene)throw Error('No se pudo confirmar el premio. Actualiza antes de reintentar.');
        if(student()?.uid===request.uid){catalog=data.catalogo;el('Status').textContent='✓ «'+premio.nombre+'» recibido. Ya está disponible en Mi espacio.';}
        invalidate();
      }catch(error){el('Status').textContent=error.message;invalidate();}
      finally{giving=false;el('Give').disabled=false;refresh();}
    });
    refresh();return {load,refresh};
  }
  global.PaesPremiosAdmin={mount};
})(window);
