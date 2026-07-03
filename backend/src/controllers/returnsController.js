const { db } = require('../config/firebase-admin');
const { logAction } = require('../services/auditService');

const getReturns = async (req, res) => {
  try {
    const snap = await db.collection('returns').get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch(e) { res.status(500).json({error: 'Failed to fetch returns'}) }
};

const updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, refundAmount, adminNotes } = req.body;
    const updateData = { status, updatedAt: new Date().toISOString() };
    if (refundAmount !== undefined) updateData.refundAmount = refundAmount;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    
    await db.collection('returns').doc(id).update(updateData);
    
    // If refund approved, create refund record
    if (status === 'Refund Approved' && refundAmount) {
      await db.collection('refunds').add({
        returnId: id,
        amount: refundAmount,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
    }

    await logAction(req.user.email, 'RETURN_UPDATED', `Return ${id} status to ${status}.`);
    res.json({success: true});
  } catch(e) { res.status(500).json({error: 'Failed to update return'}) }
};

const getRefunds = async (req, res) => {
  try {
    const snap = await db.collection('refunds').get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch(e) { res.status(500).json({error: 'Failed to fetch refunds'}) }
};

const updateRefundStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, razorpayRefundId } = req.body;
    await db.collection('refunds').doc(id).update({
      status, 
      razorpayRefundId,
      updatedAt: new Date().toISOString()
    });
    await logAction(req.user.email, 'REFUND_UPDATED', `Refund ${id} status to ${status}.`);
    res.json({success: true});
  } catch(e) { res.status(500).json({error: 'Failed to update refund'}) }
};

module.exports = { getReturns, updateReturnStatus, getRefunds, updateRefundStatus };
