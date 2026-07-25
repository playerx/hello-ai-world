import { createClient } from '@supabase/supabase-js';

// Paste your Supabase project URL and anon public key here to turn on
// Google sign-in and cloud storage. Get these from the Supabase dashboard:
// Project Settings -> API -> Project URL / anon public key.
// Until this is filled in, the journal keeps working exactly as before,
// saving to this browser only.
const supabaseUrl = 'https://zyucwxyofdeiqkobpwkm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dWN3eHlvZmRlaXFrb2Jwd2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5OTg1MDAsImV4cCI6MjEwMDU3NDUwMH0.sYmYEpnlDu4-_kJ-l8xowU8kuqyL0q1Vf87nV9aSFw4';

export const supabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = supabaseEnabled ? createClient(supabaseUrl, supabaseAnonKey) : null;
