<template>
    <button :class="[
        'btn mx-lg-2 my-2 my-lg-0',
        buttonClass
    ]" @click="handleClick">
        {{ buttonText }}
    </button>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '@/services/supabase'
import { useRouter, useRoute } from 'vue-router'

const { supabase } = useSupabase()
const router = useRouter()
const route = useRoute()

const isLoggedIn = ref(false)
const userDni = ref(null)

// Reactivo a la ruta
const currentRoute = computed(() => route.fullPath)

// Verifica si es tu propio perfil
const isOwnProfile = computed(() => {
    return isLoggedIn.value && userDni.value && currentRoute.value === `/boguer/${userDni.value}`
})

// Clase dinámica del botón
const buttonClass = computed(() => {
    if (!isLoggedIn.value) return 'btn-outline-secondary'
    if (isOwnProfile.value) return 'btn-outline-danger'
    return 'btn-outline-secondary'
})

// Texto dinámico
const buttonText = computed(() => {
    if (!isLoggedIn.value) return 'Iniciar sesión'
    if (isOwnProfile.value) return 'Cerrar sesión'
    return 'Ver perfil'
})

// Inicializar sesión y obtener DNI
async function initUser() {
    const { data } = await supabase.auth.getSession()
    isLoggedIn.value = !!data.session

    if (data.session?.user?.id) {
        const { data: bogrimData, error } = await supabase
            .from('Bogrim')
            .select('dni')
            .eq('id_auth', data.session.user.id)
            .maybeSingle()

        if (!error && bogrimData) {
            userDni.value = bogrimData.dni
        }
    }
}

// Escucha cambios de sesión
supabase.auth.onAuthStateChange((_event, session) => {
    isLoggedIn.value = !!session
    if (!session) userDni.value = null
})

// Ejecutar al montar
onMounted(initUser)

// Función para verificar que la ruta exista
function routeExists(path) {
    return router.getRoutes().some(r => {
        // Maneja rutas dinámicas con ":dni"
        if (r.path.includes(':')) {
            const pattern = new RegExp('^' + r.path.replace(/:\w+/g, '[^/]+') + '$')
            return pattern.test(path)
        }
        return r.path === path
    })
}

// Acción según estado
async function handleClick() {
    if (!isLoggedIn.value) {
        router.push('/signin')
    } else if (isOwnProfile.value) {
        await supabase.auth.signOut()
        router.push('/')
    } else if (userDni.value) {
        const targetPath = `/boguer/${userDni.value}`
        if (routeExists(targetPath)) {
            router.push(targetPath)
        } else {
            console.warn(`Ruta "${targetPath}" no existe en el router`)
        }
    }
}
</script>
