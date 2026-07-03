const { auth, db } = require('../config/firebase-admin');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('[Auth Error]', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Check role in Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return res.status(403).json({ error: 'Forbidden: User not found in database' });
    }
    
    const userData = userDoc.data();
    if (userData.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('[Admin Auth Error]', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = { requireAuth, requireAdmin };
