const { db } = require('../config/firebase-admin');
const { logAction } = require('../services/auditService');
const emailService = require('../services/emailService');

const getTickets = async (req, res) => {
  try {
    const snap = await db.collection('supportTickets').get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch(e) { res.status(500).json({error: 'Failed to fetch tickets'}) }
};

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('supportTickets').doc(id).update(req.body);
    await logAction(req.user.email, 'TICKET_UPDATED', `Ticket ${id} updated.`);
    res.json({success: true});
  } catch(e) { res.status(500).json({error: 'Failed to update ticket'}) }
};

const replyTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    
    const ref = db.collection('supportTickets').doc(id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({error: 'Not found'});
    
    const data = doc.data();
    const newReplies = [...(data.replies || []), { 
      message: reply, 
      from: req.user.email, 
      timestamp: new Date().toISOString() 
    }];
    
    await ref.update({ replies: newReplies, status: 'Answered', updatedAt: new Date().toISOString() });
    
    // Attempt to email customer via resend (optional if configured)
    if (data.email) {
      try {
        await emailService.sendEmail({
          to: data.email,
          subject: `Re: [Ticket ${id}] ${data.subject}`,
          html: `<p>Hello ${data.customer},</p><p>${reply}</p>`
        });
      } catch (err) {
        console.warn('Email send failed', err);
      }
    }
    
    await logAction(req.user.email, 'TICKET_REPLIED', `Replied to ticket ${id}.`);
    res.json({success: true});
  } catch(e) { res.status(500).json({error: 'Failed to reply'}) }
};

module.exports = { getTickets, updateTicket, replyTicket };
