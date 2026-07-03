const { db } = require('../config/firebase-admin');
const emailService = require('../services/emailService');

const getAnalytics = async (req, res) => {
  try {
    const ordersSnap = await db.collection('orders').get();
    const productsSnap = await db.collection('products').get();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let todayRev = 0;
    let monthRev = 0;
    let totalRev = 0;
    let pending = 0;
    let delivered = 0;
    let cancelled = 0;

    const orders = ordersSnap.docs.map(d => d.data());
    const products = productsSnap.docs.map(d => d.data());

    // Analytics processing
    const last7DaysMap = {};
    for(let i=6; i>=0; i--) {
      const d = new Date(now.getTime() - i * 24*60*60*1000);
      const name = d.toLocaleDateString('en-US', { weekday: 'short' });
      last7DaysMap[name] = { name, revenue: 0, orders: 0 };
    }

    const categoryMap = {};
    const productSalesMap = {};

    orders.forEach(o => {
      const ts = o.date ? new Date(o.date).getTime() : Date.now();
      
      if (o.status !== 'Cancelled') {
        totalRev += o.total;
        if (ts >= today) todayRev += o.total;
        if (ts >= thisMonth) monthRev += o.total;
        
        // 7 days trend
        for(let i=0; i<7; i++) {
          const d = new Date(now.getTime() - i * 24*60*60*1000);
          if (new Date(ts).toDateString() === d.toDateString()) {
            const name = d.toLocaleDateString('en-US', { weekday: 'short' });
            if (last7DaysMap[name]) {
              last7DaysMap[name].revenue += o.total;
              last7DaysMap[name].orders += 1;
            }
          }
        }

        // Category & Products (only from non-cancelled)
        o.items?.forEach(item => {
          // Category
          const cat = item.product.category || 'Other';
          categoryMap[cat] = (categoryMap[cat] || 0) + (item.quantity * item.product.price);
          
          // Product Sales
          const pName = item.product.name;
          productSalesMap[pName] = (productSalesMap[pName] || 0) + item.quantity;
        });
      }

      if (o.status === "Processing") pending++;
      else if (o.status === "Delivered") delivered++;
      else if (o.status === "Cancelled") cancelled++;
    });

    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    // Formatting for charts
    const salesData = Object.values(last7DaysMap);
    const categoryData = Object.keys(categoryMap).map(name => ({ name, value: categoryMap[name] }));
    const topProductsData = Object.keys(productSalesMap).map(name => ({ name, sales: productSalesMap[name] })).sort((a,b) => b.sales - a.sales).slice(0, 5);

    // Derive Customers
    const customersMap = new Map();
    orders.forEach(o => {
      const email = o.shippingAddress?.email;
      if (email) {
        const existing = customersMap.get(email);
        if (existing) {
          existing.orderCount += 1;
          existing.totalSpent += o.total;
        } else {
          customersMap.set(email, {
            email,
            fullName: o.shippingAddress.fullName,
            phone: o.shippingAddress.phone,
            address: o.shippingAddress.address,
            city: o.shippingAddress.city,
            orderCount: 1,
            totalSpent: o.total
          });
        }
      }
    });

    res.json({
      stats: { todayRev, monthRev, totalRev, pending, delivered, cancelled, lowStock, outOfStock },
      charts: { salesData, categoryData, topProductsData },
      customers: Array.from(customersMap.values())
    });

  } catch (error) {
    console.error('[Analytics Error]', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const orderRef = db.collection('orders').doc(id);
    const snap = await orderRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'Order not found' });
    
    await orderRef.update({ status });
    
    // Send email update
    const data = snap.data();
    if (data.shippingAddress?.email && (status === 'Shipped' || status === 'Delivered')) {
      await emailService.sendOrderUpdate(data.shippingAddress.email, id, status);
    }
    
    res.json({ success: true, message: `Status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

const updateOrderTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber } = req.body;
    
    const orderRef = db.collection('orders').doc(id);
    const snap = await orderRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'Order not found' });
    
    await orderRef.update({ trackingNumber });
    
    res.json({ success: true, message: `Tracking updated` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tracking number' });
  }
};

// Generic CRUD handlers for categories/coupons
const addDocument = (collectionName) => async (req, res) => {
  try {
    const docRef = await db.collection(collectionName).add(req.body);
    res.json({ id: docRef.id, ...req.body });
  } catch(e) { res.status(500).json({ error: 'Error adding document' }); }
};

const updateDocument = (collectionName) => async (req, res) => {
  try {
    await db.collection(collectionName).doc(req.params.id).update(req.body);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Error updating document' }); }
};

const deleteDocument = (collectionName) => async (req, res) => {
  try {
    await db.collection(collectionName).doc(req.params.id).delete();
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Error deleting document' }); }
};

const updateSettings = async (req, res) => {
  try {
    await db.collection('settings').doc('general').set(req.body, { merge: true });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Error updating settings' }); }
};

const updateBanners = async (req, res) => {
  try {
    await db.collection('settings').doc('banners').set(req.body, { merge: true });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Error updating banners' }); }
};

module.exports = { 
  getAnalytics, 
  updateOrderStatus,
  updateOrderTracking,
  addCategory: addDocument('categories'),
  updateCategory: updateDocument('categories'),
  deleteCategory: deleteDocument('categories'),
  addCoupon: addDocument('coupons'),
  updateCoupon: updateDocument('coupons'),
  deleteCoupon: deleteDocument('coupons'),
  addProduct: addDocument('products'),
  updateProduct: updateDocument('products'),
  deleteProduct: deleteDocument('products'),
  updateSettings,
  updateBanners
};
