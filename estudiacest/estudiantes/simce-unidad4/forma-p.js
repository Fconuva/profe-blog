(() => {
 'use strict';
 if(!firebase.apps.length)firebase.initializeApp({apiKey:'AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w',authDomain:'estudiacest.firebaseapp.com',projectId:'estudiacest'});
 const decode=text=>{const area=document.createElement('textarea');area.innerHTML=text;return area.value;};
 function p(text,target){const element=document.createElement('p');element.textContent=decode(text);target.append(element);}
 firebase.auth().onAuthStateChanged(async user=>{
  if(!user){location.replace('/lecturas/?next='+encodeURIComponent('/estudiantes/simce-unidad4/forma-p.html'));return;}
  try{const token=await user.getIdToken();const response=await fetch('/api/estudiantes?action=simce-u4-example&ensayo=1',{headers:{Authorization:`Bearer ${token}`}});const data=await response.json();if(!response.ok)throw Error(data.error || 'No se pudo leer la referencia.');
   data.texts.forEach((t,i)=>{const block=document.createElement('article');block.className='reading';const title=document.createElement('h2');title.textContent=`Texto ${i+1}. ${decode(t.title)}`;block.append(title);const body=document.createElement('div');body.className='text-body';t.paragraphs.forEach(text=>p(text,body));block.append(body);p(t.source,block);t.questions.forEach(q=>{const field=document.createElement('div');field.className='question';p(`${q.id}. ${q.prompt}`,field);q.options.forEach((o,n)=>p(`${'ABCD'[n]}. ${o}`,field));block.append(field);});(data.constructedResponses||[]).filter(q=>q.textNumber===i+1).forEach(q=>{const field=document.createElement('div');field.className='question';p(`${q.id}. Respuesta redactada: ${q.prompt}`,field);p(`Qué exige: ${q.measures}`,field);block.append(field);});document.getElementById('readings').append(block);});document.getElementById('status').textContent='Referencia cargada. Solo lectura. '+(data.referenceNote||'');
  }catch(error){document.getElementById('status').textContent=error.message;}
 });
})();
