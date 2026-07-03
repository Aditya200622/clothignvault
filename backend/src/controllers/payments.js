const admin = require('firebase-admin');
const { logAction } = require('../services/auditService');

exports.getPayments = async (req, res) => {
  try {
    const ordersSnapshot = await admin.firestore().collection('orders').orderBy('date', 'desc').get();
    
    // In our system, payments are attached to orders.
    // We will extract payment info from the orders collection to generate the payments list.
    const payments = [];
    ordersSnapshot.forEach(doc => {
      const order = doc.data();
      if (order.paymentMethod) {
        payments.push({
          id: \PAY-\\,
          razorpayPaymentId: order.razorpayPaymentId || null,
          razorpayOrderId: order.razorpayOrderId || null,
          customer: order.shippingAddress?.fullName || order.userEmail,
          orderId: doc.id,
          amount: order.total,
          paymentMethod: order.paymentMethod,
          status: order.paymentStatus || (order.paymentMethod === 'COD' ? 'Pending' : 'Paid'),
          date: order.date,
          refundStatus: order.paymentStatus === 'Refunded' ? 'Refunded' : null
        });
      }
    });

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
