const resend = require('../config/resend');

const sendOrderConfirmation = async (email, orderId, amount, customerName) => {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: 'ClothingVault <orders@clothingvault.com>',
      to: email,
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Thank you for your order, ${customerName}!</h2>
          <p>Your order <strong>${orderId}</strong> has been confirmed.</p>
          <p>Total Amount: ₹${amount}</p>
          <p>We will notify you once it ships.</p>
        </div>
      `
    });
  } catch (err) {
    console.error('[Email Error]', err);
  }
};

const sendOrderUpdate = async (email, orderId, status) => {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: 'ClothingVault <updates@clothingvault.com>',
      to: email,
      subject: `Order ${status} - ${orderId}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Your order has been ${status.toLowerCase()}</h2>
          <p>Order ID: <strong>${orderId}</strong></p>
          <p>Thank you for shopping with ClothingVault.</p>
        </div>
      `
    });
  } catch (err) {
    console.error('[Email Error]', err);
  }
};

module.exports = {
  sendOrderConfirmation,
  sendOrderUpdate
};
