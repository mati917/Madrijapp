// services/mapHadraja.js
import { ref } from 'vue'
import { useSupabase } from '@/services/supabase'

const hadrajaCache = ref([])

export async function cargarHadrajot() {
  const { supabase } = useSupabase()
  const { data, error } = await supabase
    .from('Hadrajot')
    .select('id_hdrj, tipo, id_kvutza, shijvaActual, id_mdrjm, id_roshShijva')
  if (error) throw error
  hadrajaCache.value = data
}

export function mapHadraja_type(id) {
  const item = hadrajaCache.value.find((h) => h.id_hdrj === id)
  return item ? item.tipo : 'Desconocido'
}
export function mapHadraja_kvutza(id) {
  const item = hadrajaCache.value.find((h) => h.id_hdrj === id)
  return item ? item.id_kvutza : 'Desconocida'
}
export function mapHadraja_shijva(id) {
  const item = hadrajaCache.value.find((h) => h.id_hdrj === id)
  return item ? item.shijvaActual : 'Desconocida'
}
export function mapHadraja_mdrjm(id) {
  const item = hadrajaCache.value.find((h) => h.id_hdrj === id)
  return item ? item.id_mdrjm : 'Desconocidos'
}
export function mapHadraja_rshShijva(id) {
  const item = hadrajaCache.value.find((h) => h.id_hdrj === id)
  return item ? item.id_roshShijva : 'Desconocidos'
}
