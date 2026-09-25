// Videos de la Clase 3 de NM3 (rodaje): el docente elimina o reemplaza videos
// desde el plenario. No es una función propia de Vercel (el plan Hobby admite
// 12): la sirve api/odisea-cine.js cuando llega ?modulo=videos-nm3.
//
// Los estudiantes suben sin sesión y las reglas de Storage no les permiten
// borrar ni modificar. Por eso el borrado pasa por aquí, con token de
// administrador verificado en el servidor.
//
// Acción: POST ?modulo=videos-nm3&action=admin-delete  { path }  (Bearer token)

const BUCKET = 'estudiacest.firebasestorage.app';
const PREFIX = 'videos_nm3/u3_clase3/';
const CURSOS = new Set(['3A_TP', '3B_TP', '3D_TP', '3C_TP', '3E_HC', '3F_HC']);

function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

// Solo rutas de la forma videos_nm3/u3_clase3/{curso}/{archivo}, sin subcarpetas ni «..».
function safePath(value) {
  const path = String(value || '');
  if (!path.startsWith(PREFIX) || path.includes('..') || path.includes('\\')) return null;
  const rest = path.slice(PREFIX.length).split('/');
  if (rest.length !== 2 || !CURSOS.has(rest[0]) || !rest[1]) return null;
  return path;
}

module.exports = async function videosNm3(req, res, { admin, verifyAdmin }) {
  res.setHeader('Cache-Control', 'no-store');
  const action = String((req.query && req.query.action) || '');
  try {
    if (action !== 'admin-delete' || req.method !== 'POST') return res.status(400).json({ error: 'Acción no reconocida.' });
    await verifyAdmin(req);
    const path = safePath(body(req).path);
    if (!path) return res.status(400).json({ error: 'Ruta de video no válida.' });
    const file = admin.storage().bucket(BUCKET).file(path);
    const [exists] = await file.exists();
    if (!exists) return res.status(404).json({ error: 'El video ya no existe.' });
    await file.delete();
    return res.status(200).json({ ok: true, deleted: path });
  } catch (error) {
    const status = /no autorizado|token requerido|token/i.test(error.message) ? 401 : 500;
    console.error('[videos-nm3]', action, error.message);
    return res.status(status).json({ error: status === 401 ? 'No autorizado.' : 'No se pudo eliminar el video.' });
  }
};
