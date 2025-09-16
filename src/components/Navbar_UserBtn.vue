<template>
    <button :class="[
        'btn mx-lg-2 my-2 my-lg-0',
        isLoggedIn && currentRoute === '/perfil'
            ? 'btn-outline-danger'
            : 'btn-outline-secondary'
    ]" @click="handleClick">
        {{ buttonText }}
    </button>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useSupabase } from "@/services/supabase"
import { useRouter, useRoute } from "vue-router"

const { supabase } = useSupabase()
const router = useRouter()
const route = useRoute()

const isLoggedIn = ref(false)
const currentRoute = computed(() => route.path)

// Inicializar sesión
onMounted(async () => {
    const { data } = await supabase.auth.getSession()
    isLoggedIn.value = !!data.session

    supabase.auth.onAuthStateChange((_event, session) => {
        isLoggedIn.value = !!session
    })
})

// Texto dinámico
const buttonText = computed(() => {
    if (!isLoggedIn.value) return "Iniciar sesión"
    if (currentRoute.value === "/perfil") return "Cerrar sesión"
    return "Ver perfil"
})

// Acción según estado
async function handleClick() {
    if (!isLoggedIn.value) {
        router.push("/signin")
    } else if (currentRoute.value === "/perfil") {
        await supabase.auth.signOut()
        router.push("/")
    } else {
        router.push("/perfil")
    }
}
</script>
