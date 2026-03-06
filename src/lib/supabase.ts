import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aznmiialvgxxnpkygvat.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6bm1paWFsdmd4eG5wa3lndmF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NjY2NzIsImV4cCI6MjA4ODM0MjY3Mn0.OiD1WHlWe1YWyXBW3KF-KJXZlntiQ-_b2acpOFfilV4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
