const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config();

let resendInstance = null;

if (process.env.RESEND_API_KEY) {
  resendInstance = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('Resend API key missing. Emails will not be sent.');
}

module.exports = resendInstance;
