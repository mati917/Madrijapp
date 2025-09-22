import { useSupabase } from './supabase'
const { supabase } = useSupabase()

let kvutzaCache = {}

export async function cargarKvutzot() {
  const { data, error } = await supabase.from('Kvutzot').select('id_kvutza, name')
  if (error) throw error

  kvutzaCache = {}
  data.forEach((k) => {
    kvutzaCache[k.id_kvutza] = k.name
  })
}

// Función síncrona
export function kvutzaMap(id) {
  return kvutzaCache[id] || id
}
