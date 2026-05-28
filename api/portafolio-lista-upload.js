const admin = require('firebase-admin');
const crypto = require('crypto');

function normalizePrivateKey(raw) {
    let key = (raw || '').trim();
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1);
    }
    if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');
    const packed = key.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
    if (packed) {
        const lines = packed[1].match(/.{1,64}/g) || [];
        key = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
    }
    return key;
}

let initError = null;
try {
    if (!admin.apps.length) {
        const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
        if (!privateKey) {
            initError = 'FIREBASE_PRIVATE_KEY no configurada';
        } else {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey
                }),
                databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com',
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'profe-blog.firebasestorage.app'
            });
        }
    }
} catch (error) {
    initError = error.message;
}

function safeFileName(name) {
    const cleaned = String(name || 'lista-estudiantes')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 120);
    return cleaned || 'lista-estudiantes';
}

function parseDataUrl(dataUrl) {
    const match = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;
    return {
        contentType: match[1] || 'application/octet-stream',
        buffer: Buffer.from(match[2], 'base64')
    };
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Metodo no permitido' });
    }
    if (initError) return res.status(500).json({ error: 'Firebase no configurado: ' + initError });

    try {
        const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
        if (!token) return res.status(401).json({ error: 'Sesion requerida' });

        const decoded = await admin.auth().verifyIdToken(token);
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        if (body.uid && body.uid !== decoded.uid) return res.status(403).json({ error: 'No autorizado' });

        const fileInput = body.file || {};
        const parsed = parseDataUrl(fileInput.dataUrl);
        if (!parsed) return res.status(400).json({ error: 'Archivo invalido' });

        const maxBytes = 3 * 1024 * 1024;
        if (parsed.buffer.length > maxBytes) {
            return res.status(413).json({ error: 'El archivo supera 3 MB. Sube una version mas liviana o pega la lista como texto.' });
        }

        const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET || 'profe-blog.firebasestorage.app');
        const originalName = safeFileName(fileInput.name);
        const uploadedAt = new Date().toISOString();
        const tokenId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
        const storagePath = `portafolio-listas/${decoded.uid}/${Date.now()}-${originalName}`;
        const storageFile = bucket.file(storagePath);

        await storageFile.save(parsed.buffer, {
            resumable: false,
            metadata: {
                contentType: fileInput.type || parsed.contentType || 'application/octet-stream',
                metadata: {
                    firebaseStorageDownloadTokens: tokenId,
                    uploadedBy: decoded.uid,
                    originalName: fileInput.name || originalName
                }
            }
        });

        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media&token=${tokenId}`;
        const payload = {
            name: fileInput.name || originalName,
            contentType: fileInput.type || parsed.contentType || 'application/octet-stream',
            size: parsed.buffer.length,
            storagePath,
            downloadUrl,
            uploadedAt
        };

        const db = admin.database();
        await db.ref().update({
            [`portafolios/${decoded.uid}/datosPortafolio/listaArchivo`]: payload,
            [`portafolios/${decoded.uid}/datosPortafolio/listaActualizadaEn`]: uploadedAt,
            [`portafolios/${decoded.uid}/updatedAt`]: uploadedAt
        });

        return res.status(200).json({ success: true, file: payload });
    } catch (error) {
        console.error('[portafolio-lista-upload]', error);
        return res.status(500).json({ error: error.message || 'No se pudo subir la lista' });
    }
};