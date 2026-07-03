const { db } = require('../config/firebase-admin');

const getAuditLogs = async (req, res) => {
  try {
    const snap = await db.collection('auditLogs').orderBy('timestamp', 'desc').limit(100).get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch(e) { res.status(500).json({error: 'Failed to fetch audit logs'}) }
};

module.exports = { getAuditLogs };
