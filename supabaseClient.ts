// FIX: Removed an unnecessary comment about a previous fix to clean up the code.
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your Supabase project URL and anon key.
// You can find these in your Supabase project settings under 'API'.
const supabaseUrl = 'https://mpaembqwoutvfebwxcbd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wYWVtYnF3b3V0dmZlYnd4Y2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MjU1NzIsImV4cCI6MjA3ODIwMTU3Mn0.IpqMMHmP5G8dwuhZqbReR55NfUl0IB51vhzA_SnE9-8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

