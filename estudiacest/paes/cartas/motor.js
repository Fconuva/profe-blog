/* Motor original de Crónicas del Umbral. El servidor es la autoridad del duelo. */
(function(root,factory){const engine=factory();if(typeof module==='object'&&module.exports)module.exports=engine;else root.Umbral=engine;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const CARDS={
  guardian:{name:'Guardiana del umbral',type:'Aliado',cost:2,attack:2,hp:7,guard:true,art:'guardian',text:'Custodia: el rival debe atacar a esta aliada antes de atacar tu refugio.'},
  cronista:{name:'Cronista de las mareas',type:'Aliado',cost:2,attack:2,hp:4,draw:1,art:'cronista',text:'Al entrar, roba una carta. Relaciona las piezas antes de elegir tu próximo paso.'},
  exploradora:{name:'Exploradora del paso',type:'Aliado',cost:1,attack:2,hp:3,art:'exploradora',text:'Una aliada de bajo coste. Podrá atacar desde tu siguiente turno.'},
  centinela:{name:'Centinela de bronce',type:'Aliado',cost:3,attack:4,hp:6,art:'centinela',text:'Su fuerza permite despejar el camino. Puede atacar una vez por turno.'},
  testigo:{name:'Testigo del sendero',type:'Aliado',cost:2,attack:3,hp:4,art:'testigo',text:'Después de una Cita viva este turno, entra con 1 fuerza adicional.',citedBonus:1},
  bibliotecario:{name:'Custodio del archivo',type:'Aliado',cost:2,attack:1,hp:6,guard:true,draw:1,art:'bibliotecario',text:'Custodia. Al entrar, roba una carta.'},
  fuego:{name:'Llama reveladora',type:'Hechizo',cost:1,damage:5,art:'llama',text:'Inflige 5 de daño a un objetivo rival. Respeta Custodia.'},
  escudo:{name:'Sello protector',type:'Hechizo',cost:1,block:7,art:'sello',text:'Tu refugio obtiene 7 de escudo hasta el inicio de tu próximo turno.'},
  cura:{name:'Luz reparadora',type:'Hechizo',cost:1,heal:5,art:'cura',text:'Recupera 5 de vida de tu refugio, sin superar su máximo.'},
  fuente:{name:'Consulta las fuentes',type:'Hechizo',cost:1,draw:2,art:'fuentes',text:'Roba 2 cartas. Tu mano admite hasta 8.'},
  relacion:{name:'Hilo de inferencia',type:'Hechizo',cost:2,damage:7,citedDamage:3,art:'relacion',text:'Inflige 7 de daño. Después de una Cita viva este turno, inflige 10.'},
  contraste:{name:'Contraste de voces',type:'Hechizo',cost:2,area:3,art:'contraste',text:'Inflige 3 de daño a cada aliado rival. Puede atravesar Custodia.'},
  armadura:{name:'Armadura de argumentos',type:'Reliquia',cost:1,buff:2,art:'armadura',text:'Un aliado propio obtiene 2 de fuerza y 2 de vida. Elige a quién proteger.'},
  cita:{name:'Cita viva',type:'Lectura',cost:0,pact:true,art:'cita',text:'Elige un fragmento y explica una relación con tu estrategia. Gana 1 energía, 3 de escudo y roba 1 carta. Una vez por turno.'},
  replica:{name:'Réplica fundada',type:'Hechizo',cost:1,damage:3,citedDamage:3,art:'replica',text:'Inflige 3 de daño. Si ya citaste este turno, inflige 6.'},
  faro:{name:'Faro del criterio',type:'Hechizo',cost:2,block:10,draw:1,art:'faro',text:'Obtén 10 de escudo y roba 1 carta. El escudo se disipa al comenzar tu próximo turno.'}
 };
 const PRESETS={
  guardian:{name:'La guardiana',art:'guardian',description:'Protege tu refugio y fortalece tus aliados.',deck:['guardian','guardian','bibliotecario','bibliotecario','centinela','exploradora','escudo','escudo','cura','fuego','fuego','armadura','armadura','cita','cita','fuente','replica','faro']},
  cronista:{name:'El cronista',art:'cronista',description:'Roba cartas y combina citas con hechizos.',deck:['cronista','cronista','bibliotecario','guardian','testigo','exploradora','fuego','fuego','relacion','relacion','cita','cita','fuente','fuente','replica','escudo','cura','contraste']},
  exploradora:{name:'La exploradora',art:'exploradora',description:'Despliega aliados y presiona con ataques.',deck:['exploradora','exploradora','testigo','testigo','centinela','centinela','guardian','cronista','fuego','fuego','armadura','armadura','cita','cita','replica','escudo','cura','contraste']}
 };
 const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
 function random(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
 function shuffle(s,items){const result=items.slice();for(let i=result.length-1;i>0;i--){const j=Math.floor(random(s)*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
 function draw(s,p,count){for(let i=0;i<count&&p.hand.length<8;i++){if(!p.deck.length){p.deck=shuffle(s,p.discard);p.discard=[];}if(!p.deck.length)break;p.hand.push({id:'c'+(++s.serial),card:p.deck.shift()});}}
 function player(s,identity,archetype){if(!PRESETS[archetype])fail('Elige un mazo disponible.');return {uid:identity.uid,name:identity.nombre.slice(0,120),archetype,hp:32,maxHp:32,block:0,energy:3,maxEnergy:3,deck:shuffle(s,PRESETS[archetype].deck),discard:[],hand:[],board:[],citedTurn:0,actions:0};}
 function create(identity,archetype,seed,now,code){const s={code,curso:identity.curso,phase:'waiting',seed:seed>>>0,serial:0,revision:0,turn:0,order:[identity.uid],players:{},createdAt:now,updatedAt:now,log:[],winner:null};s.players[identity.uid]=player(s,identity,archetype);return s;}
 function note(s,text){s.log.push(text);s.log=s.log.slice(-20);}
 function join(raw,identity,archetype,now){const s=structuredClone(raw);if(s.curso!==identity.curso)fail('La sala pertenece a otro curso.',403);if(s.players[identity.uid])return s;if(s.phase!=='waiting'||s.order.length!==1)fail('La sala ya tiene dos participantes.',409);if(now-s.createdAt>86400000)fail('Esta sala expiró. Crea una nueva.',410);s.players[identity.uid]=player(s,identity,archetype);s.order.push(identity.uid);for(const uid of s.order)draw(s,s.players[uid],5);s.phase='active';s.turn=1;s.activeUid=s.order[0];s.revision++;s.updatedAt=now;note(s,'El duelo comienza. Cada refugio tiene 32 de vida.');return s;}
 function foeOf(s,uid){return s.players[s.order.find(id=>id!==uid)];}
 function availableTargets(s,uid){const foe=foeOf(s,uid);if(!foe)return [];const guards=foe.board.filter(b=>CARDS[b.card].guard);return guards.length?guards.map(b=>b.id):['hero',...foe.board.map(b=>b.id)];}
 function hurt(p,n){const absorbed=Math.min(p.block,n);p.block-=absorbed;p.hp=Math.max(0,p.hp-(n-absorbed));}
 function hit(s,uid,target,damage){const foe=foeOf(s,uid);if(!availableTargets(s,uid).includes(target))fail('Custodia protege al refugio. Elige un objetivo disponible.');if(target==='hero')hurt(foe,damage);else{const unit=foe.board.find(b=>b.id===target);unit.hp-=damage;}}
 function clean(s){for(const p of Object.values(s.players)){const dead=p.board.filter(b=>b.hp<=0);p.discard.push(...dead.map(b=>b.card));p.board=p.board.filter(b=>b.hp>0);}for(const p of Object.values(s.players))if(p.hp<=0){s.phase='ended';s.winner=s.order.find(uid=>uid!==p.uid);note(s,'El duelo terminó. El resultado académico se revisa por separado.');}}
 function apply(raw,uid,action,now,proof){const s=structuredClone(raw);if(!s.players[uid])fail('No participas en esta sala.',403);if(action.revision!==s.revision)fail('La sala cambió. Recupera el turno actual.',409);if(s.phase==='waiting'&&action.kind==='concede'){s.phase='ended';s.revision++;s.updatedAt=now;return s;}if(s.phase!=='active')fail('Este duelo no está activo.',409);const p=s.players[uid],foe=foeOf(s,uid);
  if(action.kind==='concede'){s.phase='ended';s.winner=foe.uid;note(s,p.name+' se retira del duelo. Su lectura se conserva.');}
  else{if(s.activeUid!==uid)fail('Es el turno de tu compañero. Espera su jugada.',409);
   if(action.kind==='play'){
    const instance=p.hand.find(c=>c.id===action.card),card=instance&&CARDS[instance.card];if(!card)fail('La carta ya no está en tu mano.',409);if(p.energy<card.cost)fail('Te falta energía para esta carta.');if(card.type==='Aliado'&&p.board.length>=3)fail('Tu fila tiene tres aliados.');if(card.pact&&(p.citedTurn===s.turn))fail('Ya usaste Cita viva en este turno.');
    p.hand=p.hand.filter(c=>c.id!==instance.id);
    if(card.pact){if(!proof)fail('Elige un fragmento y explica su relación.');p.citedTurn=s.turn;p.energy++;p.block+=3;draw(s,p,1);s.pacts||=[];s.pacts.push({uid,turn:s.turn,...proof});s.pacts=s.pacts.slice(-80);}
    if(card.damage)hit(s,uid,action.target,card.damage+(p.citedTurn===s.turn?(card.citedDamage||0):0));
    if(card.buff){const unit=p.board.find(b=>b.id===action.target);if(!unit)fail('Elige un aliado propio para la reliquia.');unit.attack+=card.buff;unit.hp+=card.buff;unit.maxHp+=card.buff;}
    if(card.type==='Aliado')p.board.push({id:'u'+(++s.serial),card:instance.card,attack:card.attack+(p.citedTurn===s.turn?(card.citedBonus||0):0),hp:card.hp,maxHp:card.hp,ready:false});
    if(card.area){for(const unit of foe.board)unit.hp-=card.area;}
    if(card.block)p.block+=card.block;if(card.heal)p.hp=Math.min(p.maxHp,p.hp+card.heal);if(card.draw)draw(s,p,card.draw);
    p.energy-=card.cost;p.hand=p.hand.filter(c=>c.id!==instance.id);if(card.type!=='Aliado')p.discard.push(instance.card);note(s,p.name+' juega '+card.name+'.');p.actions++;clean(s);
   }else if(action.kind==='attack'){
    const unit=p.board.find(b=>b.id===action.ally);if(!unit||!unit.ready)fail('Este aliado aún no puede atacar.');const defender=foe.board.find(b=>b.id===action.target);hit(s,uid,action.target,unit.attack);if(defender)unit.hp-=defender.attack;unit.ready=false;p.actions++;note(s,CARDS[unit.card].name+' ataca'+(action.target==='hero'?' al refugio rival.':'.'));clean(s);
   }else if(action.kind==='end'){
    p.discard.push(...p.hand.map(c=>c.card));p.hand=[];s.activeUid=foe.uid;s.turn++;foe.maxEnergy=Math.min(6,foe.maxEnergy+(s.turn>2?1:0));foe.energy=foe.maxEnergy;foe.block=0;foe.board.forEach(b=>b.ready=true);if(s.turn>2)draw(s,foe,5);note(s,'Nuevo turno: '+foe.name+'.');
   }else fail('Jugada desconocida.');
  }
  s.revision++;s.updatedAt=now;return s;
 }
 function publicRoom(s,uid){if(!s.players[uid])fail('No participas en esta sala.',403);const p=s.players[uid],foe=foeOf(s,uid);const visible=(v,self)=>({name:v.name,archetype:v.archetype,hp:v.hp,maxHp:v.maxHp,block:v.block,energy:v.energy,maxEnergy:v.maxEnergy,board:v.board,handCount:v.hand.length,deckCount:v.deck.length,discardCount:v.discard.length,...(self?{hand:v.hand,citedTurn:v.citedTurn}: {})});return {code:s.code,phase:s.phase,revision:s.revision,turn:s.turn,yourTurn:s.activeUid===uid,me:visible(p,true),foe:foe?visible(foe,false):null,targets:availableTargets(s,uid),log:s.log.slice(-8),winner:s.phase==='ended'&&s.winner?(s.winner===uid?'me':'foe'):null,updatedAt:s.updatedAt};}
 return {CARDS,PRESETS,create,join,apply,publicRoom,availableTargets};
});
