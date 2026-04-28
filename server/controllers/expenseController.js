/**
 * Expense Controller
 * Handles expense management operations with Supabase
 * - Add new expense
 * - Fetch all expenses
 * - Upload expense bill image to Supabase storage
 * - Delete expense
 */

const db = require('../models/db');
const fs = require('fs');
const path = require('path');

/**
 * Add new expense
 * Receives title, amount, description, image_url, and optional date
 */
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, description, image_url, date } = req.body;

    // Validation
    if (!title || !amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'कृपया शीर्षक और राशि दर्ज करें / Please provide title and amount'
      });
    }

    // Use provided date or current timestamp
    const expenseDate = date || new Date().toISOString();

    // Log before saving
    console.log('💾 Saving expense to database:', {
      title,
      amount,
      description,
      image_url,
      date: expenseDate
    });

    // Insert into database
    const result = await db.insertExpense(
      title,
      parseInt(amount),
      description || null,
      image_url || null
    );

    console.log('✅ Expense saved successfully:', {
      expenseId: result.id,
      imageUrl: image_url
    });

    res.status(201).json({
      success: true,
      message: 'खर्च सफलतापूर्वक जोड़ा गया / Expense added successfully',
      expenseId: result.id,
      imageUrl: image_url
    });
  } catch (error) {
    console.error('❌ Error adding expense:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding expense'
    });
  }
};

/**
 * Upload expense bill image to Supabase storage
 * Receives file upload and returns public URL
 */
exports.uploadExpenseImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'कोई फाइल नहीं दी गई / No file provided'
      });
    }

    // Create unique file name with cleaned characters
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    
    // Clean filename: remove spaces and special characters
    const cleanName = req.file.originalname
      .toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .replace(/[^\w.-]/g, '');    // Remove special characters, keep only alphanumeric, dots, hyphens
    
    const fileName = `${timestamp}-${randomString}-${cleanName}`;

    // Upload to Supabase storage
    const { supabase } = db;
    
    const fileBuffer = req.file.buffer;
    const fileType = req.file.mimetype;

    console.log('📤 Uploading file:', { originalName: req.file.originalname, cleanName, fileName });

    const { data, error } = await supabase.storage
      .from('expense-bills')
      .upload(fileName, fileBuffer, {
        contentType: fileType,
        upsert: false
      });

    if (error) {
      console.error('❌ Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('✅ File uploaded to Supabase:', { path: data?.path, fileName });

    // Get public URL using the uploaded file path
    const { data: publicUrlData } = supabase.storage
      .from('expense-bills')
      .getPublicUrl(data?.path || fileName);

    const imageUrl = publicUrlData?.publicUrl;

    // Log for debugging
    console.log('✅ Image uploaded successfully:', {
      originalName: req.file.originalname,
      cleanName: fileName,
      storagePath: data?.path,
      publicUrl: imageUrl
    });

    res.status(200).json({
      success: true,
      message: 'बिल की छवि सफलतापूर्वक अपलोड की गई / Bill image uploaded successfully',
      imagePath: imageUrl,
      filename: fileName
    });
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading image'
    });
  }
};

/**
 * Get all expenses
 * Returns all expenses from the database with image URLs
 */
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await db.getAllExpenses();

    console.log('📋 Fetching all expenses:', {
      count: expenses.length,
      hasImages: expenses.filter(e => e.image_url).length,
      sample: expenses[0] ? { id: expenses[0].id, title: expenses[0].title, image_url: expenses[0].image_url } : 'No expenses'
    });

    res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    console.error('❌ Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses'
    });
  }
};

/**
 * Delete an expense (admin only)
 * Also deletes associated image file from Supabase if exists
 */
exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.body;

    if (!expenseId) {
      return res.status(400).json({
        success: false,
        message: 'Expense ID required'
      });
    }

    // Get expense details to check for image
    const expense = await db.getExpenseById(expenseId);

    if (expense && expense.image_url) {
      try {
        // Extract file name from URL
        const url = new URL(expense.image_url);
        const fileName = url.pathname.split('/').pop();
        
        // Delete from Supabase storage
        const { supabase } = db;
        await supabase.storage
          .from('expense-bills')
          .remove([fileName]);
      } catch (error) {
        console.error('⚠️ Warning: Could not delete image:', error.message);
        // Continue with expense deletion even if image delete fails
      }
    }

    // Delete expense from database
    await db.deleteExpense(expenseId);

    res.status(200).json({
      success: true,
      message: 'खर्च हटाया गया / Expense deleted'
    });
  } catch (error) {
    console.error('❌ Error deleting expense:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting expense'
    });
  }
};
