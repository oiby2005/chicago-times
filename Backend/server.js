const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'WSJ Express Backend Server Running', health: '/api/health' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'WSJ Express Backend Server Running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 WSJ Backend Server running on http://localhost:${PORT}`);
  console.log(`=================================`);
});
