const { db } = require('../config/firebase-admin');

const logAction = async (adminEmail, action, details, ip = null) => {
  try {
    await db.collection('auditLogs').add({
      adminEmail: adminEmail || 'system',
      action,
      details,
      ip,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Audit Log Error]', error);
  }
};

module.exports = {
  logAction
};
