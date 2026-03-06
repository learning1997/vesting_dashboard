import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jtprtmltaciwhbqmclcn.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cHJ0bWx0YWNpd2hicW1jbGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTk3MTYsImV4cCI6MjA4ODM3NTcxNn0.du_bLN_XeMyoxHHlNliuH6YK07pBrauMh4eAs36MhsA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
