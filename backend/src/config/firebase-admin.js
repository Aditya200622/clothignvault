const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Assuming service account is passed via base64 env var or standard FIREBASE_CONFIG in production
// In local dev, you would load a serviceAccountKey.json
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const buff = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64');
    serviceAccount = JSON.parse(buff.toString('utf-8'));
  }
} catch (error) {
  console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64', error);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault()
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
