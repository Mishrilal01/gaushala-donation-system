/**
 * Donation Routes
 * Public API endpoints for donations
 * - Submit donation
 * - Fetch approved donations
 * - Get statistics
 * - Get top supporters
 */

const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

/**
 * POST /api/donations/submit
 * Submit a new donation
 * Body: { name, amount, isPublic, screenshotPath }
 */
router.post('/submit', donationController.submitDonation);

/**
 * GET /api/donations/approved
 * Fetch all approved donations (recent first)
 */
router.get('/approved', donationController.getApprovedDonations);

/**
 * GET /api/donations/stats
 * Get dashboard statistics
 * Returns: totalAmount, treesPlanted, totalDonors, goalTrees, progressPercentage
 */
router.get('/stats', donationController.getStats);

/**
 * GET /api/donations/top-supporters
 * Get top 3 donors
 */
router.get('/top-supporters', donationController.getTopSupporters);

module.exports = router;
