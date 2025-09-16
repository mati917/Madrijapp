import { useSupabase } from './supabase'

export function useAuth() {
  const { supabase } = useSupabase()

  const login_MagicLink = async ({ email }) => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) throw error
  }

  return { login_MagicLink }
}
