// src/supabase.js
import { createClient } from '@supabase/supabase-js'

// ⚠️ Cambia estas variables por las de tu proyecto en https://app.supabase.com/
const supabaseUrl = 'https://vwespeszxiobwqwomtbc.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3ZXNwZXN6eGlvYndxd29tdGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTI4MjEsImV4cCI6MjA3MzE4ODgyMX0.iIX6zRunfzU7PN3yFehtOkOjM3vTtqD0psZz7lFy-WQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function useSupabase() {
  return { supabase }
}
