import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Admin credentials (for initial setup only)
export const ADMIN_EMAIL = 'id6821176@gmail.com';
export const ADMIN_PASSWORD = 'Diak7278';

export const MONTHLY_FEE = 10000;
export const CURRENCY = 'FCFA';
export const APP_NAME = 'DIAGOSO';
