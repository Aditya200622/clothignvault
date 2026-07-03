const { db } = require('../config/firebase-admin');

const generateReport = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    // Basic implementation: just fetch all relevant collection data
    // In production, you'd aggregate based on the date range
    let collectionName = 'orders';
    if (type === 'customers') collectionName = 'customers';
    if (type === 'inventory') collectionName = 'products';
    if (type === 'returns') collectionName = 'returns';
    if (type === 'support') collectionName = 'supportTickets';

    const snap = await db.collection(collectionName).limit(100).get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Send JSON, the frontend will convert to CSV for download
    res.json(data);
  } catch(e) { res.status(500).json({error: 'Failed to generate report'}) }
};

module.exports = { generateReport };
