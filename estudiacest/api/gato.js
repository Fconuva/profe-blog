const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';

function normalizePrivateKey(raw) {
    let key = (raw || '').trim();
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1);
    }
    if (key.includes('\\n')) {
        key = key.replace(/\\n/g, '\n');
    }
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
            console.error('[gato.js] FIREBASE_PRIVATE_KEY is empty');
        } else {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey
                }),
                databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
            });
        }
    }
} catch (error) {
    initError = error.message;
    console.error('[gato.js] Firebase init error:', error.message);
}

const auth = admin.auth();

function resolveAllowedOrigin(req) {
    const origin = (req.headers.origin || '').trim();
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://estudiacest.com,https://www.estudiacest.com,http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    if (allowedOrigins.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
        return origin;
    }
    return 'https://estudiacest.com';
}

function normalizeGuestName(raw) {
    let name = String(raw || '').trim().replace(/\s+/g, ' ');
    name = name.replace(/[^\p{L}\p{N} ._-]/gu, '').trim().replace(/\s+/g, ' ');
    if (name.length < 2 || name.length > 24) return '';
    return name;
}

function resolveGuestUid(uidHint) {
    const hint = String(uidHint || '').trim();
    if (/^gato_guest_[a-z0-9_-]{8,80}$/i.test(hint)) {
        return hint;
    }
    return 'gato_guest_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
}

async function handleGuestLogin(req, res) {
    const name = normalizeGuestName(req.body && req.body.name);
    if (!name) {
        return res.status(400).json({ error: 'Nombre invalido. Usa entre 2 y 24 caracteres.' });
    }

    const uid = resolveGuestUid(req.body && req.body.uidHint);
    const token = await auth.createCustomToken(uid, { gatoGuest: true });
    return res.status(200).json({ success: true, token, uid, name });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', resolveAllowedOrigin(req));
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo no permitido' });

    if (initError) {
        return res.status(500).json({ error: 'Firebase no inicializado: ' + initError });
    }

    try {
        const action = req.query.action || (req.body && req.body.action) || 'guest-login';
        if (action !== 'guest-login') {
            return res.status(400).json({ error: 'Accion no soportada' });
        }
        return await handleGuestLogin(req, res);
    } catch (error) {
        console.error('[gato.js] Request error:', error.message);
        return res.status(500).json({ error: error.message || 'Error interno' });
    }
};