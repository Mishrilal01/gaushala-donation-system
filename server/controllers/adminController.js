/**
 * Admin Controller
 * Handles admin operations with simple authentication
 * - Login
 * - View pending donations
 * - Approve/Reject donations
 * - Manage trees count
 */

const db = require('../models/db');

// Simple hardcoded admin credentials (can be moved to env for production)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gaushala123';

/**
 * Admin login with simple password authentication
 */
exports.login = (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password required'
      });
    }

    if (password === ADMIN_PASSWORD) {
      // Generate simple token (in production, use JWT)
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }
  } catch (error) {
    console.error('❌ Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Login error'
    });
  }
};

/**
 * Middleware to verify admin token
 */
exports.verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  // Simple token verification (in production, use proper JWT verification)
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    if (decoded.startsWith('admin:')) {
      next();
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

/**
 * Get all pending donations for admin review
 */
exports.getPendingDonations = async (req, res) => {
  try {
    const pendingDonations = await db.getPendingDonations();

    console.log('📋 Pending donations:', pendingDonations);

    res.status(200).json({
      success: true,
      data: pendingDonations
    });
  } catch (error) {
    console.error('❌ Error fetching pending donations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending donations'
    });
  }
};

/**
 * Get all donations (including approved and rejected) for admin dashboard
 */
exports.getAllDonations = async (req, res) => {
  try {
    const allDonations = await db.getAllDonations();

    res.status(200).json({
      success: true,
      data: allDonations
    });
  } catch (error) {
    console.error('❌ Error fetching all donations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching donations'
    });
  }
};

/**
 * Approve a pending donation
 * Changes status from 'pending' to 'approved'
 */
exports.approveDonation = async (req, res) => {
  try {
    const { donationId } = req.body;

    if (!donationId) {
      return res.status(400).json({
        success: false,
        message: 'Donation ID required'
      });
    }

    // Update donation status to approved
    await db.updateDonationStatus(donationId, 'approved');

    console.log('✅ Donation approved:', donationId);
    res.status(200).json({
      success: true,
      message: 'Donation approved successfully'
    });
  } catch (error) {
    console.error('❌ Error approving donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving donation'
    });
  }
};

/**
 * Reject a pending donation
 * Changes status from 'pending' to 'rejected'
 */
exports.rejectDonation = async (req, res) => {
  try {
    const { donationId } = req.body;

    if (!donationId) {
      return res.status(400).json({
        success: false,
        message: 'Donation ID required'
      });
    }

    // Update donation status to rejected
    await db.updateDonationStatus(donationId, 'rejected');

    res.status(200).json({
      success: true,
      message: 'Donation rejected'
    });
  } catch (error) {
    console.error('❌ Error rejecting donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting donation'
    });
  }
};

/**
 * Update total trees planted count
 * Admin can manually set the number of trees planted
 */
exports.updateTotalTrees = async (req, res) => {
  try {
    const { totalTrees } = req.body;

    if (totalTrees === undefined || totalTrees < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid tree count required'
      });
    }

    // Update total_trees in stats table
    await db.updateTotalTrees(parseInt(totalTrees));

    res.status(200).json({
      success: true,
      message: 'पेड़ों की संख्या अपडेट की गई / Trees count updated',
      totalTrees: totalTrees
    });
  } catch (error) {
    console.error('❌ Error updating trees count:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating trees count'
    });
  }
};

/**
 * Get total trees planted count
 */
exports.getTotalTrees = async (req, res) => {
  try {
    const totalTrees = await db.getTotalTrees();

    res.status(200).json({
      success: true,
      data: { totalTrees }
    });
  } catch (error) {
    console.error('❌ Error fetching trees count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trees count'
    });
  }
};
