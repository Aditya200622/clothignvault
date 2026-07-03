const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuth, createOrder);
router.post('/verify', requireAuth, verifyPayment);

module.exports = router;
