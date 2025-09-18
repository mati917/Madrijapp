/*
    Este service controla quién puede o no ver
    las secciones según su rol institucional
===== CÓMO USAR =====
1.
        import { useAuthRoles } from "@/service/useAuthRoles"
        const { roles, loadUserRoles, can } = useAuthRoles()

        onMounted(() => {
        loadUserRoles()
        })
2. 
    <div v-if="can(['rosh','madrij'])">
        <p>Esto lo ven Rosh o Madrijim</p>
    </div>
        
    <div v-else>
        <p>Acceso básico (Boguer)</p>
    </div>
*/
import { ref } from 'vue'
import { useSupabase } from '@/services/supabase'

const { supabase } = useSupabase()

const currentUser = ref(null)
const roles = ref([])

export function useAuthRoles() {
  async function loadUserRoles() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('Bogrim')
      .select('roles')
      .eq('id_auth', user.id)
      .maybeSingle() // 👈 mejor que .single()

    if (error) {
      console.error('Error cargando roles:', error)
      roles.value = ['BGR']
      return
    }

    roles.value = data?.roles || [] // 👈 evita null
    console.log('Roles asignados en helper:', roles.value)

    currentUser.value = user
  }

  function hasRole(role) {
    return roles.value.includes(role)
  }

  function can(allowedRoles) {
    if (typeof allowedRoles === 'string') {
      return hasRole(allowedRoles)
    }
    return allowedRoles.some((r) => hasRole(r))
  }

  return { currentUser, roles, loadUserRoles, hasRole, can }
}
