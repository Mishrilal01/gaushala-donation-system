/**
 * Admin Routes
 * Protected admin operations
 * - Login
 * - View pending donations
 * - Approve/Reject donations
 * - Manage trees count
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

/**
 * POST /api/admin/login
 * Admin login with password
 * Body: { password }
 * Returns: { token }
 */
router.post('/login', adminController.login);

/**
 * Middleware to verify admin token for protected routes
 */
router.use((req, res, next) => {
  // Skip verification for login route
  if (req.path === '/login') {
    return next();
  }
  adminController.verifyAdmin(req, res, next);
});

/**
 * GET /api/admin/pending
 * Get all pending donations (requires auth)
 */
router.get('/pending', adminController.getPendingDonations);

/**
 * GET /api/admin/all-donations
 * Get all donations including approved/rejected (requires auth)
 */
router.get('/all-donations', adminController.getAllDonations);

/**
 * POST /api/admin/approve
 * Approve a pending donation (requires auth)
 * Body: { donationId }
 */
router.post('/approve', adminController.approveDonation);

/**
 * POST /api/admin/reject
 * Reject a pending donation (requires auth)
 * Body: { donationId }
 */
router.post('/reject', adminController.rejectDonation);

/**
 * POST /api/admin/update-trees
 * Update total trees planted count (requires auth)
 * Body: { totalTrees }
 */
router.post('/update-trees', adminController.updateTotalTrees);

/**
 * GET /api/admin/total-trees
 * Get total trees planted count (requires auth)
 */
router.get('/total-trees', adminController.getTotalTrees);

module.exports = router;
