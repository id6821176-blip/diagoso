import { createClient } from '@supabase/supabase-js';

// Fonctionne en local ET sur Vercel
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL 
  || 'https://flwiuhaqizjyypyxzkbn.supabase.co';

const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY 
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2l1aGFxaXpqeXlweXh6a2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MTQ0NTgsImV4cCI6MjA5NTE5MDQ1OH0.qiq6zf7S0FC51_Lu_uM8PFZvgmwMpRUDD7pO64qZIx4';

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