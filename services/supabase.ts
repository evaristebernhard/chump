import { createClient } from '@supabase/supabase-js';

// Project URL and Key provided by user
const supabaseUrl = 'https://cjdkfwcnomlbpkqfsany.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqZGtmd2Nub21sYnBrcWZzYW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDY1NjYsImV4cCI6MjA4MjMyMjU2Nn0.KNBbLcuOn7mTiLk5t2Bd8yQi4MY8_FNiiXnyUVRGOHk';

export const supabase = createClient(supabaseUrl, supabaseKey);
