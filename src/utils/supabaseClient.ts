import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rzyskqzmosumnzyrpnxn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6eXNrcXptb3N1bW56eXJwbnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NDAzNDIsImV4cCI6MjA2MDExNjM0Mn0.zbDw1rjg9lRbzwtrxpDc-PAmK458JUy2VD-jGM6sOeA';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
