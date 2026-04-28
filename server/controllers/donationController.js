/**
 * Donation Controller
 * Handles all donation-related operations with Supabase
 * - Submit new donation
 * - Fetch approved donations
 * - Calculate statistics
 */

const db = require('../models/db');

/**
 * Submit new donation
 * Receives name, amount, suggestion, and privacy preference
 * Stores as pending - admin must approve
 */
exports.submitDonation = async (req, res) => {
  try {
    const { name, amount, suggestion, isPublic } = req.body;

    // Validation
    if (!name || !amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'कृपया नाम और राशि दर्ज करें'
      });
    }

    // Convert isPublic to boolean
    const isPublicValue = isPublic === true || isPublic === 'true';

    // Insert into database with 'pending' status
    const result = await db.insertDonation(
      name,
      parseInt(amount),
      suggestion || null,
      isPublicValue,
      'pending'
    );

    res.status(201).json({
      success: true,
      message: 'धन्यवाद! आपका दान प्रस्तुत किया गया है। Admin अनुमोदन के बाद दिखाई देगा।',
      donationId: result.id
    });
  } catch (error) {
    console.error('❌ Error submitting donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting donation'
    });
  }
};

/**
 * Get all approved donations for public display
 * Returns only approved donations with visibility preferences respected
 */
exports.getApprovedDonations = async (req, res) => {
  try {
    const donations = await db.getApprovedDonations(50);

    res.status(200).json({
      success: true,
      data: donations
    });
  } catch (error) {
    console.error('❌ Error fetching donations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching donations'
    });
  }
};

/**
 * Calculate and return dashboard statistics
 * - Total amount collected
 * - Total amount used (from expenses)
 * - Remaining balance
 * - Total trees planted
 * - Total donors count
 * - Progress percentage
 */
exports.getStats = async (req, res) => {
  try {
    // Get donation stats
    const donationStats = await db.getDonationStats();
    
    // Get expense stats
    const expenseStats = await db.getExpenseStats();
    
    // Get total trees
    const totalTrees = await db.getTotalTrees();

    const totalAmount = donationStats.totalAmount;
    const totalUsed = expenseStats.totalUsed;
    const remaining = totalAmount - totalUsed;
    const goalTrees = 100;
    const progressPercentage = Math.min((totalTrees / goalTrees) * 100, 100);

    res.status(200).json({
      success: true,
      data: {
        totalAmount: totalAmount,
        totalUsed: totalUsed,
        remaining: remaining,
        treesPlanted: totalTrees,
        totalDonors: donationStats.totalDonors,
        goalTrees: goalTrees,
        progressPercentage: Math.round(progressPercentage)
      }
    });
  } catch (error) {
    console.error('❌ Error calculating stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating statistics'
    });
  }
};

/**
 * Get top 3 supporters/donors
 * Shows donors who opted for public visibility
 */
exports.getTopSupporters = async (req, res) => {
  try {
    const topSupporters = await db.getTopSupporters(3);

    res.status(200).json({
      success: true,
      data: topSupporters
    });
  } catch (error) {
    console.error('❌ Error fetching top supporters:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top supporters'
    });
  }
};
