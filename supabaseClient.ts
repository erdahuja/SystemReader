// FIX: Removed an unnecessary comment about a previous fix to clean up the code.
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your Supabase project URL and anon key.
// You can find these in your Supabase project settings under 'API'.
const supabaseUrl = 'https://epmcnivszeeyiytwgxjf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwbWNuaXZzemVleWl5dHdneGpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjgyMTgsImV4cCI6MjA3Mzk0NDIxOH0.8cnPHmgCmVpgNsplVRHmOevERJHBdc-2UeSLMZGzwQU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
