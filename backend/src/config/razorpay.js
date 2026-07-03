const Razorpay = require('razorpay');
const dotenv = require('dotenv');

dotenv.config();

let razorpayInstance = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('Razorpay keys are missing. Payment routes will fail.');
}

module.exports = razorpayInstance;
