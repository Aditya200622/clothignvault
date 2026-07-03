const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const { db } = require('../config/firebase-admin');
const emailService = require('../services/emailService');

const createOrder = async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    
    if (!razorpay) {
      return res.status(500).json({ error: 'Razorpay not configured' });
    }

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json({ id: order.id, currency: order.currency, amount: order.amount });
  } catch (error) {
    console.error('[Razorpay Create Error]', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Process order in Firestore securely
    const orderRef = db.collection('orders').doc(orderDetails.id);
    const orderSnap = await orderRef.get();
    
    if (orderSnap.exists) {
      return res.status(400).json({ error: 'Duplicate Order' });
    }

    // Save order
    const orderData = {
      ...orderDetails,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      date: new Date().toISOString()
    };
    
    await orderRef.set(orderData);

    // Deduct inventory securely via batch
    const batch = db.batch();
    for (const item of orderDetails.items) {
      const productRef = db.collection('products').doc(item.product.id);
      const prodSnap = await productRef.get();
      if (prodSnap.exists) {
        const prodData = prodSnap.data();
        const newStock = Math.max(0, prodData.stock - item.quantity);
        batch.update(productRef, { stock: newStock });
      }
    }
    await batch.commit();

    // Send email
    if (orderData.shippingAddress && orderData.shippingAddress.email) {
      await emailService.sendOrderConfirmation(
        orderData.shippingAddress.email,
        orderData.id,
        orderData.total,
        orderData.shippingAddress.fullName
      );
    }

    res.json({ success: true, message: 'Payment verified and order created' });
  } catch (error) {
    console.error('[Verify Payment Error]', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

module.exports = { createOrder, verifyPayment };
