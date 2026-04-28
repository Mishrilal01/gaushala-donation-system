/**
 * Supabase Client Configuration
 * Initializes connection to Supabase database and storage
 */

const { createClient } = require('@supabase/supabase-js');

// Get credentials from environment
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in environment variables!');
  console.error('   Please set SUPABASE_URL and SUPABASE_KEY in .env');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
});

/**
 * Test database connection
 */
const testConnection = async () => {
  try {
    // Try a simple query
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('✅ Connected to Supabase database');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
};

module.exports = {
  supabase,
  testConnection
};
