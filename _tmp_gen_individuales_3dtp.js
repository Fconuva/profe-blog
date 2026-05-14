// Genera Informes_Individuales_Pedro_Paramo_3D_TP_2026.html (v2 con retroalimentación + respuestas)
// Une CSV (notas + niveles n/3) con JSON de auditoría (texto de respuestas reales).
// Una hoja A4 portrait por estudiante, salto de página, ordenado por N° de lista.
const fs = require('fs');
const path = require('path');

const CSV = path.join('lecturas', 'adminprofe', 'reportes', 'Planilla_Pedro_Paramo_3D_TP_2026.csv');
const JSON_AUD = '_tmp_3dtp_auditoria.json';
const OUT = path.join('lecturas', 'adminprofe', 'reportes', 'Informes_Individuales_Pedro_Paramo_3D_TP_2026.html');

const raw = fs.readFileSync(CSV, 'utf8').trim();
const lines = raw.split(/\r?\n/);
lines.shift();
const csvRows = lines.map(l => {
  const c = l.split(';');
  const auto = parseInt(c[3].split('/')[0], 10);
  const p11Pts = parseInt(c[4].split(' ')[0], 10);
  const p17Pts = parseInt(c[5].split(' ')[0], 10);
  const p25Pts = parseInt(c[6].split(' ')[0], 10);
  const p11Dev = parseInt((c[4].match(/\((\d)\/3\)/)||[,'0'])[1], 10);
  const p17Dev = parseInt((c[5].match(/\((\d)\/3\)/)||[,'0'])[1], 10);
  const p25Dev = parseInt((c[6].match(/\((\d)\/3\)/)||[,'0'])[1], 10);
  const desTotal = parseInt(c[7].split('/')[0], 10);
  const total = parseInt(c[8].split('/')[0], 10);
  const pct = parseInt(c[9].replace('%',''), 10);
  const nota = parseFloat(c[10].replace(',', '.'));
  return {
    n: parseInt(c[0],10), nombre: c[1], rut: c[2],
    auto, p11Pts, p17Pts, p25Pts, p11Dev, p17Dev, p25Dev,
    desTotal, total, pct, nota, estado: c[11]
  };
});

const auditJson = JSON.parse(fs.readFileSync(JSON_AUD, 'utf8'));
const audByRut = {};
const audByName = {};
for (const s of (auditJson.submittedFull || [])) {
  if (s.rut_actual) audByRut[s.rut_actual] = s;
  if (s.rut_roster) audByRut[s.rut_roster] = s;
  if (s.nombre) audByName[s.nombre.trim().toUpperCase()] = s;
}

for (const r of csvRows) {
  const a = audByRut[r.rut] || audByName[r.nombre.trim().toUpperCase()];
  r.r11 = a?.respuestas?.pedro_11 || '';
  r.r17 = a?.respuestas?.pedro_17 || '';
  r.r25 = a?.respuestas?.pedro_25 || '';
}

const rows = csvRows.sort((a,b)=>a.n-b.n);
const N = rows.length;
const promCurso = (rows.reduce((s,r)=>s+r.nota,0)/N).toFixed(1);

const RUBRICA = {
  p11: {
    3: 'Identifica con claridad el contraste: la Comala idealizada que describe Dolores (verde, fértil, llena de vida) frente a la Comala desolada y fantasmal que encuentra Juan, con evidencia textual.',
    2: 'Reconoce el contraste pero la evidencia es parcial: menciona uno de los dos polos con detalle y el otro queda implícito o vago.',
    1: 'Solo nombra una de las dos imágenes de Comala o usa una palabra clave (verde / desolada / fantasmas) sin desarrollar el contraste.',
    0: 'No responde, copia el enunciado o se aleja del contraste solicitado entre las dos visiones de Comala.'
  },
  p17: {
    3: 'Caracteriza correctamente a Pedro Páramo en ambos fragmentos: el rasgo afectivo/nostálgico (recuerdo de Susana) y el rasgo autoritario/despiadado (poder sobre el pueblo), con evidencia.',
    2: 'Identifica un rasgo psicológico con evidencia, pero el otro queda débil, repetido o sin sustento textual.',
    1: 'Menciona un rasgo aislado (poder, amor, frialdad) sin contraste ni evidencia clara entre los dos fragmentos.',
    0: 'No responde, parafrasea sin interpretar o caracteriza a otro personaje en lugar de Pedro Páramo.'
  },
  p25: {
    3: 'Construye una visión integral de la novela: la búsqueda de Juan, el poder de Pedro Páramo, el amor por Susana, la venganza y la decadencia de Comala, articulados con coherencia.',
    2: 'Aborda dos o tres ejes de la novela con cierta articulación, pero deja fuera elementos clave o evidencia explícita.',
    1: 'Menciona solo un eje (la búsqueda, el poder o el amor) o reproduce hechos sueltos sin interpretación global.',
    0: 'No responde, repite generalidades sin foco o se desvía a otro texto/contenido.'
  }
};

function nivelDesempeno(pct) {
  if (pct >= 85) return ['Avanzado', '#2563eb'];
  if (pct >= 70) return ['Satisfactorio', '#16a34a'];
  if (pct >= 50) return ['Elemental', '#d97706'];
  return ['Insuficiente', '#dc2626'];
}
function nivelDevLabel(d) {
  if (d === 3) return ['3/3 Logrado', '#16a34a', '#dcfce7'];
  if (d === 2) return ['2/3 Medianamente logrado', '#d97706', '#fed7aa'];
  if (d === 1) return ['1/3 Por lograr', '#dc2626', '#fee2e2'];
  return ['0/3 No logrado', '#6b7280', '#e5e7eb'];
}
function feedbackGlobal(r) {
  if (r.nota >= 6.0) return '<b>Excelente desempeño.</b> Manejas con solvencia los contenidos de Pedro Páramo y argumentas con evidencia.';
  if (r.nota >= 5.0) return '<b>Buen desempeño.</b> Dominas la lectura literal y avanzas en interpretación. Refuerza la justificación argumentada con cita textual.';
  if (r.nota >= 4.0) return '<b>Desempeño suficiente.</b> Comprendes lo central pero la interpretación es general. Trabaja la profundidad de evidencia y evita la literalización.';
  if (r.nota >= 3.0) return '<b>Desempeño insuficiente.</b> La comprensión global y la argumentación con evidencia textual requieren refuerzo sistemático.';
  return '<b>Bajo lo esperado.</b> Se sugiere acompañamiento pedagógico y relectura guiada de la novela con foco en personajes y trama.';
}

function escapeHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function devBlock(label, hab, pts, max, dev, respuesta, rubricaKey) {
  const [lvlLab, lvlCol, lvlBg] = nivelDevLabel(dev);
  const respShown = respuesta && respuesta.trim()
    ? `<div class="resp-text">"${escapeHtml(respuesta.trim())}"</div>`
    : `<div class="resp-empty">— Sin respuesta registrada —</div>`;
  const feedback = RUBRICA[rubricaKey][dev] || '';
  return `<div class="dev-q">
    <div class="dev-q-head">
      <span class="dev-q-label">${label}</span>
      <span class="dev-q-hab">${hab}</span>
      <span class="dev-q-pts">${pts}/${max} pts</span>
      <span class="dev-q-lvl" style="background:${lvlBg};color:${lvlCol};">${lvlLab}</span>
    </div>
    ${respShown}
    <div class="resp-fb"><b>¿Por qué este nivel?</b> ${feedback}</div>
  </div>`;
}

function pageHTML(r) {
  const [nivel, colorNivel] = nivelDesempeno(r.pct);
  const colorNota = r.nota >= 6.0 ? '#16a34a' : r.nota >= 4.0 ? '#7c3aed' : '#dc2626';
  const bgEstado = r.estado === 'Aprobado' ? '#dcfce7' : '#fee2e2';
  const colorEstado = r.estado === 'Aprobado' ? '#16a34a' : '#dc2626';
  const pctAuto = Math.round(r.auto/25*100);
  const pctDes = Math.round(r.desTotal/12*100);

  return `<section class="page">
    <header class="hdr">
      <div>
        <div class="t1">Informe Individual — Pedro Páramo</div>
        <div class="t2">Lengua y Literatura NM3 · 3°D T.P. · 2026 · Prof. Francisco Javier Núñez V.</div>
      </div>
      <div class="curso">3°D T.P.</div>
    </header>

    <div class="student">
      <div class="num">N° ${String(r.n).padStart(2,'0')}</div>
      <div class="info">
        <div class="nombre">${escapeHtml(r.nombre)}</div>
        <div class="rut">RUT: ${r.rut}</div>
      </div>
      <div class="nota-mini">
        <div class="nota-num" style="color:${colorNota};">${r.nota.toFixed(1)}</div>
        <div class="nota-lbl">${r.pct}% logro</div>
      </div>
      <div class="estado-col">
        <span class="estado-badge" style="background:${bgEstado};color:${colorEstado};">${r.estado.toUpperCase()}</span>
        <span class="nivel-pill" style="background:${colorNivel};">${nivel}</span>
      </div>
    </div>

    <div class="resumen-line">
      <span><b>Sec. I — Alternativas:</b> ${r.auto}/25 (${pctAuto}%)</span>
      <span class="sep">·</span>
      <span><b>Sec. II — Desarrollo:</b> ${r.desTotal}/12 (${pctDes}%)</span>
      <span class="sep">·</span>
      <span><b>Total:</b> ${r.total}/37</span>
      <span class="sep">·</span>
      <span>Promedio curso: <b>${promCurso}</b></span>
    </div>

    <div class="seccion-title">Respuestas de Desarrollo y Retroalimentación</div>

    ${devBlock('P11', 'Localizar / Reconocer · Contraste de las dos Comalas', r.p11Pts, 4, r.p11Dev, r.r11, 'p11')}
    ${devBlock('P17', 'Interpretar e Integrar · Caracterización de Pedro Páramo', r.p17Pts, 3, r.p17Dev, r.r17, 'p17')}
    ${devBlock('P25', 'Reflexionar y Evaluar · Visión integral de la novela', r.p25Pts, 5, r.p25Dev, r.r25, 'p25')}

    <div class="msg-box">
      <div class="msg-title">Retroalimentación general</div>
      <div class="msg-text">${feedbackGlobal(r)}</div>
    </div>

    <footer class="ftr">
      <span>www.profefranciscopancho.com</span>
      <span>Hoja ${r.n} de ${N}</span>
    </footer>
  </section>`;
}

const fecha = new Date().toLocaleDateString('es-CL', { year:'numeric', month:'long', day:'numeric' });

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Informes Individuales — Pedro Páramo — 3°D T.P. — 2026</title>
<style>
@page { size: A4 portrait; margin: 0; }
@media print {
  body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .no-print { display: none !important; }
  .page { box-shadow: none !important; margin: 0 !important; }
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #e9ecef; color: #1a1a2e; }
.no-print { position: sticky; top: 0; z-index: 10; background: #fff; padding: 10px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.no-print button { padding: 10px 28px; background: linear-gradient(135deg,#7c3aed,#a855f7); color: #fff; border: 0; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
.page {
  width: 210mm; height: 297mm;
  padding: 10mm 12mm 8mm 12mm;
  margin: 10px auto;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  page-break-after: always;
  display: flex; flex-direction: column;
  font-size: 10px; line-height: 1.35;
  overflow: hidden;
}
.page:last-child { page-break-after: auto; }

.hdr { display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; border-bottom: 2px solid #7c3aed; margin-bottom: 8px; }
.hdr .t1 { font-size: 14px; font-weight: 800; color: #7c3aed; }
.hdr .t2 { font-size: 9px; color: #666; margin-top: 1px; }
.hdr .curso { background: linear-gradient(135deg,#7c3aed,#a855f7); color: #fff; padding: 6px 14px; border-radius: 7px; font-size: 13px; font-weight: 800; }

.student { display: flex; align-items: center; gap: 10px; background: #faf5ff; border: 2px solid #7c3aed; border-radius: 9px; padding: 7px 10px; margin-bottom: 8px; }
.student .num { background: #7c3aed; color: #fff; padding: 5px 9px; border-radius: 7px; font-size: 14px; font-weight: 800; min-width: 50px; text-align: center; }
.student .info { flex: 1; min-width: 0; }
.student .nombre { font-size: 12.5px; font-weight: 800; color: #1a1a2e; line-height: 1.15; }
.student .rut { font-size: 9.5px; color: #666; margin-top: 1px; }
.nota-mini { text-align: center; padding: 0 6px; }
.nota-mini .nota-num { font-size: 28px; font-weight: 900; line-height: 1; }
.nota-mini .nota-lbl { font-size: 8.5px; color: #666; font-weight: 700; letter-spacing: 0.3px; }
.estado-col { display: flex; flex-direction: column; gap: 3px; align-items: stretch; }
.estado-badge { padding: 3px 10px; border-radius: 6px; font-size: 9px; font-weight: 800; letter-spacing: 0.4px; text-align: center; }
.nivel-pill { color: #fff; padding: 3px 10px; border-radius: 6px; font-size: 9px; font-weight: 700; text-align: center; }

.resumen-line { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 7px; padding: 6px 10px; font-size: 10px; margin-bottom: 8px; }
.resumen-line .sep { color: #ccc; }

.seccion-title { font-size: 11px; font-weight: 800; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.8px; padding-bottom: 3px; border-bottom: 1.5px solid #e5e7eb; margin: 0 0 6px; }

.dev-q { background: #fff; border: 1px solid #e5e7eb; border-left: 3px solid #7c3aed; border-radius: 6px; padding: 6px 10px; margin-bottom: 6px; }
.dev-q-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
.dev-q-label { background: #7c3aed; color: #fff; padding: 2px 7px; border-radius: 5px; font-size: 10px; font-weight: 800; }
.dev-q-hab { font-size: 10px; font-weight: 700; color: #1a1a2e; flex: 1; min-width: 150px; }
.dev-q-pts { font-size: 10px; font-weight: 700; color: #555; background: #f3f4f6; padding: 2px 7px; border-radius: 5px; }
.dev-q-lvl { padding: 2px 8px; border-radius: 5px; font-size: 9.5px; font-weight: 800; }

.resp-text { font-size: 9.5px; color: #1f2937; font-style: italic; background: #fafbfc; border-left: 2px solid #d1d5db; padding: 4px 8px; margin: 3px 0; line-height: 1.35; max-height: 60px; overflow: hidden; }
.resp-empty { font-size: 9.5px; color: #9ca3af; font-style: italic; padding: 4px 8px; margin: 3px 0; }
.resp-fb { font-size: 9.5px; color: #422006; background: #fef9c3; border-radius: 4px; padding: 4px 8px; margin-top: 3px; line-height: 1.35; }
.resp-fb b { color: #854d0e; }

.msg-box { background: linear-gradient(135deg,#faf5ff,#fff); border: 1px solid #d8b4fe; border-radius: 8px; padding: 7px 12px; margin-top: auto; }
.msg-title { font-size: 9.5px; font-weight: 800; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
.msg-text { font-size: 10px; color: #1f2937; line-height: 1.4; }

.ftr { display: flex; justify-content: space-between; font-size: 8.5px; color: #aaa; padding-top: 5px; border-top: 1px solid #eee; margin-top: 6px; }
</style>
</head>
<body>
  <div class="no-print">
    <button onclick="window.print()">🖨️ Imprimir / Guardar PDF — ${N} hojas</button>
    <div style="font-size:11px;color:#666;margin-top:6px;">Pedro Páramo · 3°D T.P. · ${fecha} · ${N} estudiantes · 1 hoja por estudiante</div>
  </div>
  ${rows.map(pageHTML).join('\n')}
</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');
console.log('Generado:', OUT);
console.log('Estudiantes:', N, '| Promedio:', promCurso);
console.log('Tamaño archivo:', (Buffer.byteLength(html,'utf8')/1024).toFixed(1), 'KB');

const sinResp = rows.filter(r => !r.r11 && !r.r17 && !r.r25);
console.log('Sin respuestas (no matcheados):', sinResp.length);
sinResp.forEach(r => console.log('  -', r.n, r.nombre, r.rut));
