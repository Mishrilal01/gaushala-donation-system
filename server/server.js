/**
 * Main Server File
 * Express server setup with Supabase integration
 * Runs on specified port
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const donationRoutes = require('./routes/donationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Middleware Configuration
 */
// Enable CORS for frontend communication
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

/**
 * API Routes
 */
// Public donation routes
app.use('/api/donations', donationRoutes);

// Expense routes
app.use('/api/expenses', expenseRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

/**
 * Default route
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Gaushala Tree Donation Transparency System API',
    version: '2.0.0',
    database: 'Supabase',
    endpoints: {
      public: '/api/donations',
      admin: '/api/admin'
    }
  });
});

/**
 * 404 Error Handling
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   Gaushala Donation System Running    ║
  ║   Database: Supabase (Cloud)          ║
  ║   Storage: Supabase Storage           ║
  ╚════════════════════════════════════════╝
  
  Server running on port ${PORT}
  Health check: http://localhost:${PORT}/health
  API Base: http://localhost:${PORT}/api
  
  Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
  Node: ${process.env.NODE_ENV || 'development'}
  `);
});

module.exports = app;
