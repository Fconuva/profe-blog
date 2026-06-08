const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const admin = require('firebase-admin');

function initFirebase() {
  if (admin.apps && admin.apps.length) return admin;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT not configured');

  let sa;
  if (raw.trim().startsWith('{')) {
    sa = JSON.parse(raw);
  } else {
    sa = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  }

  admin.initializeApp({
    credential: admin.credential.cert(sa),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  return admin;
}

const searchEmail = "k.msotog@gmail.com";

async function main() {
  const fb = initFirebase();
  const db = fb.database();

  console.log('Searching all users for email:', searchEmail);
  const usersSnap = await db.ref('users').once('value');
  const users = usersSnap.val() || {};

  let exactMatch = null;
  let partialMatches = [];

  Object.keys(users).forEach(uid => {
    const u = users[uid];
    if (u.email && u.email.toLowerCase().trim() === searchEmail.toLowerCase().trim()) {
      exactMatch = { uid, ...u };
    } else if (u.email && u.email.toLowerCase().includes('sotog') || (u.nombre && u.nombre.toLowerCase().includes('soto'))) {
      partialMatches.push({ uid, ...u });
    }
  });

  if (exactMatch) {
    console.log('\nEXACT MATCH FOUND:');
    console.log(exactMatch);
    
    // Check portfolio
    const portSnap = await db.ref('portafolios/' + exactMatch.uid).once('value');
    if (portSnap.exists()) {
      console.log('\nPortfolio for this user:');
      console.log(portSnap.val());
    }
  } else {
    console.log('\nNo exact match for email k.msotog@gmail.com.');
  }

  if (partialMatches.length > 0) {
    console.log('\nPARTIAL MATCHES (based on "sotog" or name "soto"):');
    partialMatches.forEach(u => {
      console.log(`- UID: ${u.uid} | Name: ${u.nombre} | Email: ${u.email} | Phone: ${u.telefono}`);
    });
  } else {
    console.log('\nNo partial matches found for name containing "soto" or email containing "sotog".');
  }

  // Also print all recent users who registered around the time of this payment or have status 'pre-inscrito' but have a plan set.
  console.log('\nRecent registrations / users with payment pending:');
  let count = 0;
  Object.keys(users).forEach(uid => {
    const u = users[uid];
    if (u.createdAt && u.createdAt.includes('2026-05')) {
      count++;
      if (count < 15) {
        console.log(`- Name: ${u.nombre} | Email: ${u.email} | Status: ${u.status} | CreatedAt: ${u.createdAt}`);
      }
    }
  });

  process.exit(0);
}

main();
