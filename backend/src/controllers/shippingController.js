const { db } = require('../config/firebase-admin');
const { logAction } = require('../services/auditService');

const getShippingZones = async (req, res) => {
  try {
    const snap = await db.collection('shipping_zones').get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch(e) { res.status(500).json({error: 'Failed to fetch shipping zones'}) }
};

const updateShippingZone = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'new') {
      await db.collection('shipping_zones').add(req.body);
    } else {
      await db.collection('shipping_zones').doc(id).update(req.body);
    }
    await logAction(req.user.email, 'SHIPPING_ZONE_UPDATED', `Zone updated.`);
    res.json({success: true});
  } catch(e) { res.status(500).json({error: 'Failed to update shipping zone'}) }
};

const generateManifest = async (req, res) => {
  try {
    // Dummy manifest logic until Shiprocket API is added
    const manifestId = 'MAN-' + Math.floor(Math.random() * 1000000);
    await logAction(req.user.email, 'MANIFEST_GENERATED', `Manifest ${manifestId} generated.`);
    res.json({ success: true, manifestId, downloadUrl: `https://example.com/manifest/${manifestId}.pdf` });
  } catch(e) { res.status(500).json({error: 'Failed to generate manifest'}) }
};

module.exports = { getShippingZones, updateShippingZone, generateManifest };
