// Genera Informe_Final_Pedro_Paramo_3D_TP_2026_v2.html con el estilo del Informe NM4 4D-TP
const fs = require('fs');
const path = require('path');

const CSV = path.join('lecturas', 'adminprofe', 'reportes', 'Planilla_Pedro_Paramo_3D_TP_2026.csv');
const OUT = path.join('lecturas', 'adminprofe', 'reportes', 'Informe_Final_Pedro_Paramo_3D_TP_2026_v2.html');

const raw = fs.readFileSync(CSV, 'utf8').trim();
const lines = raw.split(/\r?\n/);
const header = lines.shift().split(';');
// Columnas: N;Nombre;RUT;Auto/25;P11;P17;P25;Des/12;Total/37;Porcentaje;Nota;Estado
const rows = lines.map(l => {
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

const N = rows.length;
const aprob = rows.filter(r => r.nota >= 4.0).length;
const repr = N - aprob;
const promNota = (rows.reduce((s,r)=>s+r.nota,0)/N).toFixed(1);
const promPct = Math.round(rows.reduce((s,r)=>s+r.pct,0)/N);
const notaMax = Math.max(...rows.map(r=>r.nota)).toFixed(1);
const notaMin = Math.min(...rows.map(r=>r.nota)).toFixed(1);

// Niveles
const avanzado = rows.filter(r => r.pct >= 85).length;
const satis = rows.filter(r => r.pct >= 70 && r.pct < 85).length;
const elem = rows.filter(r => r.pct >= 50 && r.pct < 70).length;
const insuf = rows.filter(r => r.pct < 50).length;

// Promedios por sección
const sumAuto = rows.reduce((s,r)=>s+r.auto,0);
const promAuto = (sumAuto/N).toFixed(1);
const pctAuto = Math.round((sumAuto/N)/25*100);

const sumP11 = rows.reduce((s,r)=>s+r.p11Pts,0);
const sumP17 = rows.reduce((s,r)=>s+r.p17Pts,0);
const sumP25 = rows.reduce((s,r)=>s+r.p25Pts,0);
const promP11 = (sumP11/N).toFixed(1);
const promP17 = (sumP17/N).toFixed(1);
const promP25 = (sumP25/N).toFixed(1);
const pctP11 = Math.round((sumP11/N)/4*100);
const pctP17 = Math.round((sumP17/N)/3*100);
const pctP25 = Math.round((sumP25/N)/5*100);

const sumDes = rows.reduce((s,r)=>s+r.desTotal,0);
const promDes = (sumDes/N).toFixed(1);
const pctDes = Math.round((sumDes/N)/12*100);

// Color helper
function colorByPct(p) {
  if (p >= 70) return '#16a34a';
  if (p >= 50) return '#d97706';
  return '#dc2626';
}
function dificultad(p) {
  if (p >= 70) return ['Fácil', '#16a34a'];
  if (p >= 50) return ['Media', '#d97706'];
  return ['Difícil', '#dc2626'];
}

// Sort por nota desc para tabla individual
const sortedRows = [...rows].sort((a,b) => b.nota - a.nota || a.nombre.localeCompare(b.nombre));

// Construir HTML
const filasIndiv = sortedRows.map(r => {
  const colorNota = r.nota >= 6.0 ? '#16a34a' : r.nota >= 4.0 ? '#1e3a5f' : '#dc2626';
  const bgEstado = r.estado === 'Aprobado' ? '#dcfce7' : '#fee2e2';
  const colorEstado = r.estado === 'Aprobado' ? '#16a34a' : '#dc2626';
  return `<tr>
    <td class="name-cell" title="${r.nombre}">${r.nombre}</td>
    <td style="text-align:center;font-size:10px;color:#666;">${r.rut}</td>
    <td class="mc-cell">${r.auto}/25</td>
    <td class="dev-cell">${r.p11Pts}/4 <span style="color:#999;">(${r.p11Dev}/3)</span></td>
    <td class="dev-cell">${r.p17Pts}/3 <span style="color:#999;">(${r.p17Dev}/3)</span></td>
    <td class="dev-cell">${r.p25Pts}/5 <span style="color:#999;">(${r.p25Dev}/3)</span></td>
    <td class="mc-cell">${r.desTotal}/12</td>
    <td class="mc-cell" style="font-weight:700;">${r.total}/37</td>
    <td class="mc-cell">${r.pct}%</td>
    <td class="mc-cell" style="font-size:14px;font-weight:800;color:${colorNota};">${r.nota.toFixed(1)}</td>
    <td style="text-align:center;"><span style="background:${bgEstado};color:${colorEstado};padding:3px 8px;border-radius:6px;font-size:9px;font-weight:700;">${r.estado.toUpperCase()}</span></td>
  </tr>`;
}).join('\n');

// Análisis por pregunta de desarrollo
const filasDev = [
  { p:'P11', hab:'Localizar / Reconocer', total:4, prom:promP11, pct:pctP11 },
  { p:'P17', hab:'Interpretar e Integrar', total:3, prom:promP17, pct:pctP17 },
  { p:'P25', hab:'Reflexionar y Evaluar', total:5, prom:promP25, pct:pctP25 },
].map(it => {
  const [dif, colDif] = dificultad(it.pct);
  return `<tr>
    <td style="text-align:center;font-weight:600;">${it.p}</td>
    <td style="text-align:center;">Desarrollo</td>
    <td style="text-align:center;">${it.hab}</td>
    <td style="text-align:center;font-weight:700;">${it.prom}/${it.total}</td>
    <td style="width:30%;"><div style="background:#e5e7eb;border-radius:8px;height:16px;width:100%;position:relative;"><div style="background:${colorByPct(it.pct)};border-radius:8px;height:100%;width:${it.pct}%;min-width:2px;"></div><span style="position:absolute;right:6px;top:0;line-height:16px;font-size:10px;font-weight:600;">${it.pct}%</span></div></td>
    <td style="text-align:center;color:${colDif};font-weight:600;">${dif}</td>
  </tr>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Informe Final — Pedro Páramo NM3 — 3°D T.P. — 2026</title>
<style>
@page { size: A4 landscape; margin: 8mm; }
@media print {
  body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { box-shadow: none; margin: 0; padding: 12px; }
  .no-print { display: none !important; }
  .section-block { page-break-inside: avoid; }
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #f0f2f5; color: #1a1a2e; font-size: 12px; line-height: 1.5; }
.page { max-width: 1300px; margin: 20px auto; background: #fff; border-radius: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 28px 32px; }
.header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 14px; margin-bottom: 18px; border-bottom: 3px solid #7c3aed; }
.header-left h1 { font-size: 22px; color: #7c3aed; line-height: 1.2; }
.header-left h2 { font-size: 14px; color: #555; font-weight: 400; margin-top: 2px; }
.header-left .sub { font-size: 11px; color: #999; margin-top: 4px; }
.curso-badge { background: linear-gradient(135deg,#7c3aed,#a855f7); color: #fff; padding: 10px 24px; border-radius: 10px; font-size: 20px; font-weight: 800; text-align: center; letter-spacing: 0.5px; }
.exig-label { font-size: 11px; color: #888; text-align: center; margin-top: 4px; }
.cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 18px 0; }
.card { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; text-align: center; }
.card-big { font-size: 28px; font-weight: 800; color: #7c3aed; line-height: 1; }
.card-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
.card-sub { font-size: 11px; color: #555; margin-top: 2px; }
.card-highlight { border-color: #7c3aed; border-width: 2px; }
.apr-bar { display: flex; height: 28px; border-radius: 8px; overflow: hidden; margin: 8px 0; font-size: 11px; font-weight: 700; }
.apr-ok { background: #16a34a; color: #fff; display: flex; align-items: center; justify-content: center; }
.apr-no { background: #dc2626; color: #fff; display: flex; align-items: center; justify-content: center; }
.section-title { font-size: 15px; font-weight: 700; color: #7c3aed; margin: 22px 0 10px; padding-bottom: 6px; border-bottom: 2px solid #e5e7eb; }
table { width: 100%; border-collapse: collapse; font-size: 11px; }
th { background: #7c3aed; color: #fff; padding: 6px 8px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.3px; }
td { padding: 5px 8px; border-bottom: 1px solid #eee; }
tbody tr:nth-child(even) { background: #fafbfc; }
tbody tr:hover { background: #faf5ff; }
.name-cell { font-weight: 600; font-size: 10px; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mc-cell { text-align: center; font-weight: 700; font-size: 11px; }
.dev-cell { text-align: center; font-size: 10px; font-weight: 600; }
.print-bar { text-align: center; margin: 16px 0; }
.print-bar button { padding: 10px 32px; background: linear-gradient(135deg,#7c3aed,#a855f7); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
.print-bar button:hover { opacity: 0.9; }
.footer { text-align: center; font-size: 10px; color: #aaa; margin-top: 16px; padding-top: 10px; border-top: 1px solid #eee; }
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="header-left">
      <h1>Informe de Resultados — Prueba Pedro Páramo</h1>
      <h2>Lengua y Literatura NM3 — 3°D T.P. — Año 2026</h2>
      <p class="sub">Centro Educativo Salesianos Talca &nbsp;|&nbsp; Prof. Francisco Javier Núñez Valenzuela</p>
    </div>
    <div>
      <div class="curso-badge">3°D T.P.</div>
      <div class="exig-label">Exigencia: 60% &nbsp;|&nbsp; Escala 1.0 – 7.0</div>
    </div>
  </div>

  <div class="print-bar no-print">
    <button onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
  </div>

  <!-- RESUMEN GENERAL -->
  <div class="section-title">Resumen General</div>
  <div class="cards">
    <div class="card card-highlight">
      <div class="card-big">${N}</div>
      <div class="card-label">Estudiantes Evaluados</div>
    </div>
    <div class="card">
      <div class="card-big">${promNota}</div>
      <div class="card-label">Promedio del Curso</div>
      <div class="card-sub">${promPct}% logro promedio</div>
    </div>
    <div class="card">
      <div class="card-big">${notaMax}</div>
      <div class="card-label">Nota Más Alta</div>
      <div class="card-sub">${notaMin} más baja</div>
    </div>
    <div class="card">
      <div class="card-big" style="color:#16a34a;">${aprob}</div>
      <div class="card-label">Aprobados</div>
      <div class="card-sub">${repr} reprobados</div>
    </div>
  </div>

  <!-- BARRA APROBACIÓN -->
  <div class="apr-bar">
    <div class="apr-ok" style="width:${Math.round(aprob/N*100)}%;">✔ ${aprob} Aprobados (${Math.round(aprob/N*100)}%)</div>
    <div class="apr-no" style="width:${Math.round(repr/N*100)}%;">✘ ${repr} (${Math.round(repr/N*100)}%)</div>
  </div>

  <!-- DISTRIBUCIÓN NIVELES -->
  <div class="section-title">Distribución por Nivel de Desempeño</div>
  <div style="max-width:600px;">
    ${[
      ['Avanzado (≥85%)', avanzado, '#2563eb'],
      ['Satisfactorio (70–84%)', satis, '#16a34a'],
      ['Elemental (50–69%)', elem, '#d97706'],
      ['Insuficiente (<50%)', insuf, '#dc2626'],
    ].map(([lab,cnt,col]) => {
      const pc = Math.round(cnt/N*100);
      return `<div style="display:flex;align-items:center;gap:10px;margin:6px 0;">
        <span style="width:180px;font-weight:700;font-size:12px;color:${col};">${lab}</span>
        <div style="flex:1;background:#e5e7eb;border-radius:8px;height:22px;position:relative;">
          <div style="width:${pc}%;background:${col};height:100%;border-radius:8px;min-width:${cnt?2:0}px;"></div>
        </div>
        <span style="width:90px;text-align:right;font-size:12px;font-weight:600;">${cnt} (${pc}%)</span>
      </div>`;
    }).join('\n')}
  </div>

  <!-- RENDIMIENTO POR SECCIÓN -->
  <div class="section-block">
  <div class="section-title">Rendimiento por Sección de la Prueba</div>
  <table>
    <thead><tr><th>Sección</th><th style="text-align:left;">Contenido</th><th>Prom. Ptje</th><th>% Logro Promedio</th></tr></thead>
    <tbody>
      <tr>
        <td style="text-align:center;font-weight:700;padding:8px;">Sección I</td>
        <td style="padding:8px;">Alternativas — Comprensión Lectora (25 ítems)</td>
        <td style="text-align:center;padding:8px;">${promAuto} / 25</td>
        <td style="padding:8px 12px;width:35%;"><div style="background:#e5e7eb;border-radius:8px;height:16px;width:100%;position:relative;"><div style="background:${colorByPct(pctAuto)};border-radius:8px;height:100%;width:${pctAuto}%;min-width:2px;"></div><span style="position:absolute;right:6px;top:0;line-height:16px;font-size:10px;font-weight:600;">${pctAuto}%</span></div></td>
      </tr>
      <tr>
        <td style="text-align:center;font-weight:700;padding:8px;">Sección II</td>
        <td style="padding:8px;">Desarrollo — Preguntas de Análisis (P11, P17, P25)</td>
        <td style="text-align:center;padding:8px;">${promDes} / 12</td>
        <td style="padding:8px 12px;width:35%;"><div style="background:#e5e7eb;border-radius:8px;height:16px;width:100%;position:relative;"><div style="background:${colorByPct(pctDes)};border-radius:8px;height:100%;width:${pctDes}%;min-width:2px;"></div><span style="position:absolute;right:6px;top:0;line-height:16px;font-size:10px;font-weight:600;">${pctDes}%</span></div></td>
      </tr>
    </tbody>
  </table>
  </div>

  <!-- PREGUNTAS DE DESARROLLO -->
  <div class="section-block">
  <div class="section-title">Análisis por Pregunta de Desarrollo</div>
  <table>
    <thead><tr><th>Pregunta</th><th>Sección</th><th>Habilidad</th><th>Prom. Ptje</th><th>% Logro</th><th>Dificultad</th></tr></thead>
    <tbody>
      ${filasDev}
    </tbody>
  </table>
  </div>

  <!-- TABLA INDIVIDUAL -->
  <div class="section-block">
  <div class="section-title">Resultados Individuales — ${N} estudiantes (ordenados por nota)</div>
  <table>
    <thead>
      <tr>
        <th style="text-align:left;">Estudiante</th>
        <th>RUT</th>
        <th>Alt.</th>
        <th>P11<br><span style="font-weight:400;font-size:8px;">(4 pts)</span></th>
        <th>P17<br><span style="font-weight:400;font-size:8px;">(3 pts)</span></th>
        <th>P25<br><span style="font-weight:400;font-size:8px;">(5 pts)</span></th>
        <th>Desar.</th>
        <th>Total</th>
        <th>%</th>
        <th>Nota</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      ${filasIndiv}
    </tbody>
  </table>
  </div>

  <div class="footer">
    Informe generado automáticamente — ${new Date().toLocaleDateString('es-CL', { year:'numeric', month:'long', day:'numeric' })}<br>
    Plataforma: www.profefranciscopancho.com — Prof. Francisco Javier Núñez Valenzuela
  </div>

</div>
</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');
console.log('Generado:', OUT);
console.log('Estudiantes:', N, '| Aprobados:', aprob, '| Reprobados:', repr, '| Promedio:', promNota);
console.log('Niveles → Avanzado:', avanzado, '| Satisfactorio:', satis, '| Elemental:', elem, '| Insuficiente:', insuf);
console.log('Sección I (alternativas):', promAuto, '/25 →', pctAuto+'%');
console.log('Sección II (desarrollo):', promDes, '/12 →', pctDes+'%');
console.log('  P11:', promP11, '/4 →', pctP11+'%');
console.log('  P17:', promP17, '/3 →', pctP17+'%');
console.log('  P25:', promP25, '/5 →', pctP25+'%');
