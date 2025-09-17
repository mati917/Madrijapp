// services/useAuthCheck.js
import { useSupabase } from './supabase'

export async function checkAuth() {
  const { supabase } = useSupabase()
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error al verificar sesión:', error.message)
    return false
  }
  return !!data?.user
}
