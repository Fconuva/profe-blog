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

// Get access token using refresh token (for personal OneDrive / Microsoft 365)
async function getAccessToken() {
  const clientId = process.env.ONEDRIVE_CLIENT_ID;
  const clientSecret = process.env.ONEDRIVE_CLIENT_SECRET;
  const refreshToken = process.env.ONEDRIVE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Faltan variables de entorno OneDrive (ONEDRIVE_CLIENT_ID, ONEDRIVE_CLIENT_SECRET, ONEDRIVE_REFRESH_TOKEN)');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    scope: 'Files.ReadWrite.All offline_access'
  });

  const resp = await fetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error('Error obteniendo token: ' + err);
  }

  const data = await resp.json();
  return data.access_token;
}

// Create folder in OneDrive
async function graphCreateFolder(token, parentPath, folderName) {
  const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${parentPath}:/children`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: folderName,
      folder: {},
      '@microsoft.graph.conflictBehavior': 'fail'
    })
  });

  if (resp.status === 409) {
    // Folder already exists, get it
    const getResp = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${parentPath}/${folderName}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!getResp.ok) throw new Error('Carpeta existe pero no se pudo obtener');
    return await getResp.json();
  }

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error('Error creando carpeta: ' + err);
  }
  return await resp.json();
}

// Create sharing link for a folder
async function graphCreateShareLink(token, itemId) {
  const url = `https://graph.microsoft.com/v1.0/me/drive/items/${itemId}/createLink`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'edit',
      scope: 'anonymous'
    })
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error('Error creando link compartido: ' + err);
  }
  return await resp.json();
}

// ACTION: create-folder — Creates client folder structure + sharing link
async function handleCreateFolder(req, res) {
  const { callerUid, clientUid, clientName } = req.body || {};

  if (!callerUid || !clientUid || !clientName) {
    return res.status(400).json({ error: 'Faltan datos (callerUid, clientUid, clientName)' });
  }
  if (callerUid !== ADMIN_UID) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    const token = await getAccessToken();
    const basePath = 'Portafolios-Clientes';
    const safeName = clientName.replace(/[<>:"/\\|?*]/g, '_').substring(0, 80);
    const folderName = safeName + ' (' + clientUid.substring(0, 6) + ')';

    // Create base folder
    try {
      await graphCreateFolder(token, '', 'Portafolios-Clientes');
    } catch (e) { /* ignore if exists */ }

    // Create client folder
    const clientFolder = await graphCreateFolder(token, basePath, folderName);

    // Create subfolders for each module
    const subfolders = ['Modulo-1-Planificacion', 'Modulo-2-Clase-Grabada', 'Modulo-3-Reflexion', 'Documentos-Generales'];
    for (const sub of subfolders) {
      try {
        await graphCreateFolder(token, basePath + '/' + folderName, sub);
      } catch (e) { /* ignore if exists */ }
    }

    // Create sharing link
    const shareResult = await graphCreateShareLink(token, clientFolder.id);
    const shareUrl = shareResult.link ? shareResult.link.webUrl : null;

    // Save to Firebase
    const fb = initFirebase();
    const db = fb.database();
    await db.ref('portafolios/' + clientUid + '/oneDrive').set({
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
    console.error('onedrive create-folder error:', err);
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}

// ACTION: get-folder — Returns the share URL for a client
async function handleGetFolder(req, res) {
  const { clientUid } = req.body || {};

  if (!clientUid) {
    return res.status(400).json({ error: 'Falta clientUid' });
  }

  try {
    const fb = initFirebase();
    const db = fb.database();
    const snap = await db.ref('portafolios/' + clientUid + '/oneDrive').once('value');
    const data = snap.val();

    if (!data || !data.shareUrl) {
      return res.status(404).json({ error: 'No hay carpeta OneDrive para este cliente' });
    }

    return res.status(200).json({ success: true, shareUrl: data.shareUrl, folderName: data.folderName });
  } catch (err) {
    console.error('onedrive get-folder error:', err);
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { action } = req.body || {};

  switch (action) {
    case 'create-folder':
      return handleCreateFolder(req, res);
    case 'get-folder':
      return handleGetFolder(req, res);
    default:
      return res.status(400).json({ error: 'Acción no válida. Use action: "create-folder" o "get-folder"' });
  }
};
