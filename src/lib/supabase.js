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

export const ADMIN_EMAIL = 'id6821176@gmail.com';
export const MONTHLY_FEE = 5000;
export const CURRENCY    = 'FCFA';
export const APP_NAME    = 'DIAGOSO';
