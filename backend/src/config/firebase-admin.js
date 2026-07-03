const dotenv = require("dotenv");
dotenv.config();

const { initializeApp, cert, applicationDefault, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

let serviceAccount = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const decoded = Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      "base64"
    ).toString("utf8");

    serviceAccount = JSON.parse(decoded);
  }
} catch (err) {
  console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64:", err.message);
}

if (!getApps().length) {
  initializeApp({
    credential: serviceAccount
      ? cert(serviceAccount)
      : applicationDefault(),
  });
}

const db = getFirestore();
const auth = getAuth();

module.exports = {
  db,
  auth,
};
