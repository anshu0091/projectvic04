import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Helper function to store email during signup process
export const storeSignupEmail = (email: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('signupEmail', email);
  }
};

// Helper function to retrieve stored email
export const getStoredEmail = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('signupEmail');
  }
  return null;
};