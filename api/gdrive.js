const admin = require('firebase-admin');

function initFirebase() {
  if (admin.apps && admin.apps.length) return admin;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT not configured');
  let sa;
  if (raw.trim().startsWith('{')) sa = JSON.parse(raw);
  else sa = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(sa),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  return admin;
}

const ADMIN_UID = 'DmsJlSiutEbVk5HgpNGF7PAfs693';

// Get access token using Google service account
async function getAccessToken() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('Falta variable GOOGLE_SERVICE_ACCOUNT');

  let key;
  if (raw.trim().startsWith('{')) key = JSON.parse(raw);
  else key = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  const now = Math.floor(Date.now() / 1000);

  // Build JWT
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: key.client_email,
    sub: key.client_email,
    scope: 'https://www.googleapis.com/auth/drive',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  })).toString('base64url');

  const crypto = require('crypto');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(header + '.' + payload);
  const signature = sign.sign(key.private_key, 'base64url');

  const jwt = header + '.' + payload + '.' + signature;

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error('Error obteniendo token Google: ' + err);
  }
  const data = await resp.json();
  return data.access_token;
}

// Create folder in Google Drive
async function createFolder(token, name, parentId) {
  const resp = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : []
    })
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error('Error creando carpeta: ' + err);
  }
  return await resp.json();
}

// Share folder with anyone who has the link (viewer) + specific email (editor)
async function shareFolder(token, fileId, ownerEmail) {
  // Make link-shareable (anyone with link = viewer)
  await fetch('https://www.googleapis.com/drive/v3/files/' + fileId + '/permissions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: 'writer', type: 'anyone' })
  });

  // Share with the owner email as editor
  if (ownerEmail) {
    await fetch('https://www.googleapis.com/drive/v3/files/' + fileId + '/permissions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'writer',
        type: 'user',
        emailAddress: ownerEmail
      })
    });
  }
}

// ACTION: create-folder
async function handleCreateFolder(req, res) {
  const { callerUid, clientUid, clientName, clientEmail } = req.body || {};

  if (!callerUid || !clientUid || !clientName) {
    return res.status(400).json({ error: 'Faltan datos (callerUid, clientUid, clientName)' });
  }
  if (callerUid !== ADMIN_UID) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    const token = await getAccessToken();
    const parentFolderId = process.env.GDRIVE_PARENT_FOLDER_ID || '';

    const safeName = clientName.replace(/[<>:"/\\|?*]/g, '_').substring(0, 80);
    const folderName = safeName + ' (' + clientUid.substring(0, 6) + ')';

    // Create main client folder
    const clientFolder = await createFolder(token, folderName, parentFolderId || undefined);

    // Create subfolders
    const subs = ['Módulo 1 - Planificación', 'Módulo 2 - Clase Grabada', 'Módulo 3 - Reflexión', 'Documentos Generales'];
    for (const sub of subs) {
      await createFolder(token, sub, clientFolder.id);
    }

    // Share folder
    await shareFolder(token, clientFolder.id, clientEmail || null);

    const shareUrl = 'https://drive.google.com/drive/folders/' + clientFolder.id;

    // Save to Firebase
    const fb = initFirebase();
    const db = fb.database();
    await db.ref('portafolios/' + clientUid + '/googleDrive').set({
      folderId: clientFolder.id,
      folderName: folderName,
      shareUrl: shareUrl,
      createdAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      shareUrl: shareUrl,
      folderName: folderName
    });
  } catch (err) {
    console.error('gdrive create-folder error:', err);
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { action } = req.body || {};

  switch (action) {
    case 'create-folder':
      return handleCreateFolder(req, res);
    default:
      return res.status(400).json({ error: 'Acción no válida. Use action: "create-folder"' });
  }
};
