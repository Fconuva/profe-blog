'use strict';
// Entregas previas conservan su catálogo y denominador originales.
const V1=require('./_paes-tp-catalog-v1'),G24=require('./_paes-g24-catalog');
const LEGACY_VERSION='2026-10-26-tp-v1',VERSION='2026-10-27-tp-v2';
const EXTRA_CLIPS={"26": {"page": 29, "top": 77.13, "bottom": 184.14, "left": 60, "right": 570}, "27": {"page": 29, "top": 222.0, "bottom": 329.13, "left": 60, "right": 570}, "28": {"page": 30, "top": 77.13, "bottom": 211.74, "left": 60, "right": 570}, "29": {"page": 30, "top": 249.6, "bottom": 370.41, "left": 60, "right": 570}, "30": {"page": 31, "top": 77.13, "bottom": 184.14, "left": 60, "right": 570}, "31": {"page": 31, "top": 222.0, "bottom": 342.93, "left": 60, "right": 570}};
const EXTRA_KEYS={"26": "A", "27": "A", "28": "C", "29": "A", "30": "B", "31": "D"};
const EXTRA_REASONS={26:'La emisora aplica la concepción de lenguaje de Maturana al problema de la inclusión; no se limita a exponer su influencia cultural o teórica.',27:'El lenguaje surge de la interacción entre seres humanos. Ese énfasis permite reconocer su carácter social.',28:'La síntesis integra la configuración de la realidad con la interacción humana. No excluye al observador ni reduce el lenguaje a significados aislados.',29:'El texto vincula la coordinación conductual consensual con la interpretación de significados a partir de las interacciones.',30:'La objetividad sin paréntesis supone una realidad independiente del lenguaje. No debe confundirse con la construcción compartida de la realidad.',31:'La objetividad entre paréntesis admite que la realidad se construye con otros; no promete una descripción sin interpretación ni una verdad única.'};
function catalog(lesson,version=VERSION){
 const legacy=V1.catalog(lesson);if(version===LEGACY_VERSION)return legacy;
 if(version!==VERSION)throw Object.assign(new Error('Versión no válida.'),{status:409});
 const n=Number(lesson),old=legacy.publicActivity(false),extra=n===1?{id:4,title:'Lectura oficial 4',genre:'Artículo especializado',paragraphs:[],pdfPages:[26,27,28]}:{...G24.texts.find(t=>t.id===(n===2?2:3)),id:4};
 const added=n===1?Object.entries(EXTRA_KEYS).map(([id,key])=>({id:'q'+id,textId:4,text:'Pregunta oficial '+id,options:['A','B','C','D'],pdfClip:EXTRA_CLIPS[id],key,skill:'Lectura integrada',task:'Referencia oficial',reason:EXTRA_REASONS[id],evidence:'Forma 101, pregunta '+id,failures:['','','','']})):
  G24.questionsFor(false).filter(q=>q.textId===(n===2?2:3)).map((q,i)=>({...q,id:'q'+(19+i),textId:4}));
 const questions=[...legacy.questionsFor(false),...added],texts=[...old.texts,extra];
 const questionsFor=g=>g?legacy.questionsFor(true):questions;
 const grade=(answers,g)=>{if(g)return legacy.grade(answers,true);const correct=questions.filter(q=>answers[q.id]===q.key).length;return {score:correct,correct,total:questions.length,skills:Object.fromEntries([...new Set(questions.map(q=>q.skill))].map(skill=>{const qs=questions.filter(q=>q.skill===skill);return [skill,{correct:qs.filter(q=>answers[q.id]===q.key).length,total:qs.length}];}))};};
 return {...legacy,VERSION,LEGACY:legacy,questionsFor,grade,publicActivity(g){const base=legacy.publicActivity(g);return {...base,version:VERSION,previousVersion:LEGACY_VERSION,...(!g?{texts,questions:questions.map(({key,skill,task,reason,evidence,failures,...q})=>q)}:{})};}};
}
module.exports={catalog,LEGACY_VERSION,VERSION,gradeNote:V1.gradeNote,achievement:V1.achievement,order:V1.order};
