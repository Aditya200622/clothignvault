const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security and middleware
app.use(helmet());
app.use(cors({
  origin: [
    "https://clothingvault.in",
    "https://www.clothingvault.in",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// We will mount routes here
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
