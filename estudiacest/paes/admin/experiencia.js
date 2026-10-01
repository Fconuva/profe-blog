(function(global){
  'use strict';
  function mount({api,student,enabled}){
    const el=id=>document.getElementById('teacherXp'+id);
    let state=null,checked=null,busy=false,run=0,lastUid='';
    const target=()=>student();
    const valid=()=>enabled()&&state&&state.estudiante.uid===target()?.uid;
    function invalidate(){checked=null;el('Confirm').hidden=true;}
    function refresh(){
      el('Review').disabled=busy||!valid();el('Give').disabled=busy||!valid()||!checked;
      el('Amount').max=el('Type').value==='nivel'?200:10000;
      el('AmountLabel').textContent=el('Type').value==='nivel'?'Nivel al que quieres subirlo':'XP que quieres regalar';
    }
    function show(value){state=value;el('Current').textContent='Nivel '+value.nivel+' · '+value.xpTotal+' XP'+(value.xpManual?' · '+value.xpManual+' XP regalados':'');}
    async function load(){
      const version=++run,person=target();invalidate();state=null;refresh();
      if(!person||!enabled()){el('Current').textContent='Selecciona un estudiante arriba para consultar su nivel.';return;}
      if(lastUid!==person.uid){el('Reason').value='';el('Type').value='xp';el('Amount').value=100;lastUid=person.uid;}
      el('Current').textContent='Consultando nivel y experiencia…';
      try{const data=await api('experiencia-admin',{estudiante:person.uid});if(version===run&&person.uid===target()?.uid){show(data);el('Status').textContent='Dar experiencia no modifica sus notas ni entregas.';}}
      catch(error){if(version===run)el('Status').textContent=error.message;}
      refresh();
    }
    ['Type','Amount','Reason'].forEach(id=>el(id).addEventListener(id==='Type'?'change':'input',()=>{invalidate();refresh();}));
    el('Cancel').addEventListener('click',()=>{invalidate();refresh();});
    el('Review').addEventListener('click',async()=>{
      if(busy||!valid())return;const person=target(),version=run;busy=true;refresh();invalidate();
      try{
        const data=await api('experiencia-admin',{estudiante:person.uid,modo:'simular',tipo:el('Type').value,cantidad:Number(el('Amount').value),motivo:el('Reason').value});
        if(version!==run||person.uid!==target()?.uid)return;
        checked={...data,uid:person.uid};el('Chosen').textContent='Para '+person.nombre+': '+data.antes.xpTotal+' → '+data.despues.xpTotal+' XP · Nivel '+data.antes.nivel+' → '+data.despues.nivel+'. Motivo: '+data.motivo;
        el('Confirm').hidden=false;el('Status').textContent='Vista previa: todavía no se entregó experiencia.';
      }catch(error){el('Status').textContent=error.message;}
      finally{busy=false;refresh();}
    });
    el('Give').addEventListener('click',async()=>{
      if(busy||!valid()||!checked||checked.uid!==target()?.uid)return;
      const request={estudiante:checked.uid,modo:'confirmar',tipo:checked.tipo,cantidad:checked.cantidad,motivo:checked.motivo,revision:checked.revision,operacion:checked.operacion};
      busy=true;refresh();el('Status').textContent='Entregando y comprobando la experiencia…';
      try{
        let data;
        try{data=await api('experiencia-admin',request);}
        catch(error){const reread=await api('experiencia-admin',{estudiante:request.estudiante,operacion:request.operacion});if(!reread.recibido)throw error;data=reread;}
        if(data.recibido!==true)throw Error('No se pudo confirmar. Reintenta esta misma operación.');
        if(request.estudiante===target()?.uid){show(data);el('Status').textContent='✓ Experiencia recibida: nivel '+data.nivel+' · '+data.xpTotal+' XP.';invalidate();}
      }catch(error){if(request.estudiante===target()?.uid)el('Status').textContent=error.message+' No se duplicará al reintentar la misma confirmación.';}
      finally{busy=false;refresh();}
    });
    refresh();return {load,refresh};
  }
  global.PaesExperienciaAdmin={mount};
})(window);
