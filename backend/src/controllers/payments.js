const admin = require('firebase-admin');
const { logAction } = require('../services/auditService');

exports.getPayments = async (req, res) => {
  try {
    const ordersSnapshot = await admin
      .firestore()
      .collection('orders')
      .orderBy('date', 'desc')
      .get();

    // Payments are generated from Orders
    const payments = [];

    ordersSnapshot.forEach((doc) => {
      const order = doc.data();

      if (order.paymentMethod) {
        payments.push({
          id: `PAY-${doc.id}`,
          razorpayPaymentId: order.razorpayPaymentId || null,
          razorpayOrderId: order.razorpayOrderId || null,
          customer:
            order.shippingAddress?.fullName ||
            order.userEmail ||
            "Unknown Customer",
          orderId: doc.id,
          amount: order.total || 0,
          paymentMethod: order.paymentMethod || "COD",
          status:
            order.paymentStatus ||
            (order.paymentMethod === "COD" ? "Pending" : "Paid"),
          date: order.date || new Date().toISOString(),
          refundStatus:
            order.paymentStatus === "Refunded"
              ? "Refunded"
              : null,
        });
      }
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};