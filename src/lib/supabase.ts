import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://pmamatrdzfywhdpnigon.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'sb_publishable_r0fNEgG4EpOdFUWdrypfIQ_rX-L0yPR';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('YOUR_SUPABASE')
);

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'
);

