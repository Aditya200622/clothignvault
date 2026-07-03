const { db } = require('../config/firebase-admin');
const { logAction } = require('../services/auditService');

const getReviews = async (req, res) => {
  try {
    const snap = await db.collection('reviews').get();
    const reviews = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(reviews);
  } catch(e) { res.status(500).json({error: 'Failed to fetch reviews'}) }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('reviews').doc(id).update(req.body);
    await logAction(req.user.email, 'REVIEW_UPDATED', `Review ${id} updated.`);
    res.json({success: true});
  } catch(e) { res.status(500).json({error: 'Failed to update review'}) }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('reviews').doc(id).delete();
    await logAction(req.user.email, 'REVIEW_DELETED', `Review ${id} deleted.`);
    res.json({success: true});
  } catch(e) { res.status(500).json({error: 'Failed to delete review'}) }
};

module.exports = { getReviews, updateReview, deleteReview };
