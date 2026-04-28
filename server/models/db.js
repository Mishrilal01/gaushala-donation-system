/**
 * Database Module - Supabase Integration
 * Replaces SQLite with cloud-based Supabase
 * Provides helper functions for common queries
 */

const { supabase, testConnection } = require('../lib/supabaseClient');

// Initialize database connection
testConnection().then(success => {
  if (success) {
    initializeDatabase();
  }
});

/**
 * Initialize database - ensure default stats row exists
 */
const initializeDatabase = async () => {
  try {
    // Check if stats table has a default row
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .eq('id', 1);

    if (error) throw error;

    if (!data || data.length === 0) {
      // Insert default row
      const { error: insertError } = await supabase
        .from('stats')
        .insert({ id: 1, total_trees: 0 });

      if (insertError && !insertError.message.includes('duplicate')) {
        throw insertError;
      }
      console.log('✅ Stats table initialized');
    }
  } catch (error) {
    console.error('⚠️ Database initialization note:', error.message);
  }
};

/**
 * ===== DONATIONS QUERIES =====
 */

/**
 * Insert new donation
 */
exports.insertDonation = async (name, amount, suggestion, is_public, status = 'pending') => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .insert({
        name,
        amount,
        suggestion,
        is_public,
        status,
        date: new Date().toISOString()
      })
      .select();

    if (error) throw error;

    return {
      success: true,
      id: data[0]?.id,
      data: data[0]
    };
  } catch (error) {
    console.error('❌ Error inserting donation:', error);
    throw error;
  }
};

/**
 * Get approved donations for public display
 */
exports.getApprovedDonations = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('id, name, amount, date, is_public, suggestion')
      .eq('status', 'approved')
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Hide names if is_public is false
    const filteredData = data.map(donation => ({
      ...donation,
      name: donation.is_public ? donation.name : 'Anonymous'
    }));

    return filteredData || [];
  } catch (error) {
    console.error('❌ Error fetching approved donations:', error);
    throw error;
  }
};

/**
 * Get all donations (admin only)
 */
exports.getAllDonations = async () => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('❌ Error fetching all donations:', error);
    throw error;
  }
};

/**
 * Get pending donations (admin only)
 */
exports.getPendingDonations = async () => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'pending')
      .order('date', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('❌ Error fetching pending donations:', error);
    throw error;
  }
};

/**
 * Update donation status (admin only)
 */
exports.updateDonationStatus = async (donationId, newStatus) => {
  try {
    const { error } = await supabase
      .from('donations')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', donationId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('❌ Error updating donation status:', error);
    throw error;
  }
};

/**
 * Get top supporters (public donors only)
 */
exports.getTopSupporters = async (limit = 3) => {
  try {
    // Get distinct donors with is_public = true
    const { data, error } = await supabase
      .from('donations')
      .select('name, amount')
      .eq('status', 'approved')
      .eq('is_public', true)
      .order('amount', { ascending: false });

    if (error) throw error;

    // Group by name and sum amounts
    const grouped = {};
    data.forEach(donation => {
      if (!grouped[donation.name]) {
        grouped[donation.name] = { name: donation.name, totalAmount: 0, donationCount: 0 };
      }
      grouped[donation.name].totalAmount += donation.amount;
      grouped[donation.name].donationCount += 1;
    });

    // Convert to array and sort
    const supporters = Object.values(grouped)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, limit);

    return supporters;
  } catch (error) {
    console.error('❌ Error fetching top supporters:', error);
    throw error;
  }
};

/**
 * Get donation statistics
 */
exports.getDonationStats = async () => {
  try {
    // Get total from approved donations
    const { data: donations, error: donationError } = await supabase
      .from('donations')
      .select('amount')
      .eq('status', 'approved');

    if (donationError) throw donationError;

    const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalDonors = new Set(
      (await supabase
        .from('donations')
        .select('name')
        .eq('status', 'approved')).data.map(d => d.name)
    ).size;

    return {
      totalAmount,
      totalDonors,
      totalDonations: donations.length
    };
  } catch (error) {
    console.error('❌ Error fetching donation stats:', error);
    throw error;
  }
};

/**
 * ===== EXPENSES QUERIES =====
 */

/**
 * Insert new expense
 */
exports.insertExpense = async (title, amount, description, image_url) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        title,
        amount,
        description,
        image_url,
        date: new Date().toISOString()
      })
      .select();

    if (error) throw error;

    return {
      success: true,
      id: data[0]?.id,
      data: data[0]
    };
  } catch (error) {
    console.error('❌ Error inserting expense:', error);
    throw error;
  }
};

/**
 * Get all expenses
 */
exports.getAllExpenses = async () => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('❌ Error fetching expenses:', error);
    throw error;
  }
};

/**
 * Get expense by ID
 */
exports.getExpenseById = async (expenseId) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', expenseId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return data;
  } catch (error) {
    console.error('❌ Error fetching expense:', error);
    throw error;
  }
};

/**
 * Delete expense
 */
exports.deleteExpense = async (expenseId) => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting expense:', error);
    throw error;
  }
};

/**
 * Get expense statistics
 */
exports.getExpenseStats = async () => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('amount');

    if (error) throw error;

    const totalUsed = data.reduce((sum, e) => sum + (e.amount || 0), 0);

    return { totalUsed };
  } catch (error) {
    console.error('❌ Error fetching expense stats:', error);
    throw error;
  }
};

/**
 * ===== STATS QUERIES =====
 */

/**
 * Get total trees
 */
exports.getTotalTrees = async () => {
  try {
    const { data, error } = await supabase
      .from('stats')
      .select('total_trees')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return data?.total_trees || 0;
  } catch (error) {
    console.error('❌ Error fetching total trees:', error);
    return 0;
  }
};

/**
 * Update total trees
 */
exports.updateTotalTrees = async (newTotal) => {
  try {
    const { error } = await supabase
      .from('stats')
      .update({
        total_trees: newTotal,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('❌ Error updating total trees:', error);
    throw error;
  }
};

/**
 * ===== STORAGE QUERIES =====
 */

/**
 * Upload file to Supabase storage
 */
exports.uploadFile = async (bucket, path, file) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: false,
        contentType: file.type
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return {
      success: true,
      path: data?.path,
      publicUrl: publicUrl?.publicUrl
    };
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete file from storage
 */
exports.deleteFile = async (bucket, path) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    throw error;
  }
};

module.exports.supabase = supabase;
