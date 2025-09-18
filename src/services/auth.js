import { useSupabase } from './supabase'
const { supabase } = useSupabase()

export async function signUp({
  email,
  password,
  name,
  lastname,
  dni,
  kvutza,
  celular,
  nacimiento,
}) {
  // 1. Crear usuario en Auth
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  const user = data.user

  // 2. Insertar perfil en tabla Bogrim, incluyendo el email
  const { error: dbError } = await supabase.from('Bogrim').insert([
    {
      id_auth: user.id,
      name,
      lastname,
      dni,
      kvutza,
      celular,
      nacimiento,
      email, // ✅ Guardamos email también en Bogrim
    },
  ])

  if (dbError) throw dbError

  return user
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getProfile(authId) {
  const { data, error } = await supabase.from('Bogrim').select('*').eq('id_auth', authId).single()
  if (error) throw error
  return data
}
