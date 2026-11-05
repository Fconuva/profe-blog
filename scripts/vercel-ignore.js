// Paso «Ignored Build Step» de Vercel para profefranciscopancho.com (proyecto profefconuva).
// estudiacest/ es otro proyecto y se despliega aparte con `npm run deploy:prod:safe`; si un
// push solo toca esa carpeta, este sitio no se reconstruye.
// Vercel: salida 0 = omitir el build; salida 1 = construir. Ante cualquier duda, se construye.
const { spawnSync } = require('node:child_process');

function build(reason) {
  console.log(`[vercel-ignore] Se construye: ${reason}`);
  process.exit(1);
}

const base = process.env.VERCEL_GIT_PREVIOUS_SHA || 'HEAD^';
const diff = spawnSync('git', ['diff', '--name-only', base, 'HEAD', '--'], { encoding: 'utf8' });

if (diff.error || diff.status !== 0) {
  build(`no se pudo comparar con ${base} (${(diff.stderr || String(diff.error || '')).trim().split('\n')[0]})`);
}

const files = diff.stdout.split('\n').map((f) => f.trim()).filter(Boolean);
if (files.length === 0) build('el diff viene vacío');

const outside = files.filter((f) => !f.startsWith('estudiacest/'));
if (outside.length > 0) build(`${outside.length} archivo(s) fuera de estudiacest/, p. ej. ${outside[0]}`);

console.log(`[vercel-ignore] Se omite: los ${files.length} archivo(s) cambiados son de estudiacest/.`);
process.exit(0);
