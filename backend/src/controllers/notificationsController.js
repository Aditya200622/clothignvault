const { db } = require('../config/firebase-admin');

const getNotifications = async (req, res) => {
  try {
    const snap = await db.collection('notifications').orderBy('timestamp', 'desc').limit(50).get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch(e) { res.status(500).json({error: 'Failed to fetch notifications'}) }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('notifications').doc(id).update({ read: true });
    res.json({success: true});
  } catch(e) { res.status(500).json({error: 'Failed to mark notification read'}) }
};

module.exports = { getNotifications, markAsRead };
