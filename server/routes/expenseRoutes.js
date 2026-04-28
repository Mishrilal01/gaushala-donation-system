/**
 * Expense Routes
 * API endpoints for expense management
 * All expense endpoints require admin authentication
 */

const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { verifyAdmin } = require('../controllers/adminController');
const { uploadExpenseImage } = require('../middleware/multerConfig');

/**
 * POST /expenses/add
 * Add new expense (admin only)
 */
router.post('/add', verifyAdmin, expenseController.addExpense);

/**
 * POST /expenses/upload-image
 * Upload expense bill image (admin only)
 * Uses multer middleware with error handling
 */
router.post('/upload-image', verifyAdmin, uploadExpenseImage, expenseController.uploadExpenseImage);

/**
 * GET /expenses/all
 * Get all expenses (public - for displaying on user dashboard)
 */
router.get('/all', expenseController.getAllExpenses);

/**
 * DELETE /expenses/delete
 * Delete expense (admin only)
 */
router.delete('/delete', verifyAdmin, expenseController.deleteExpense);

module.exports = router;
