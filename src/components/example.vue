<template>
    <div class="container-md my-4">
        <div id="headering" class="bg-primary bg-opacity-25 text-primary p-3 my-4 rounded row">
            <h1>Roles</h1>
        </div>
        <!-- Error -->
        <div v-if="errorMessage" class="alert alert-danger row">{{ errorMessage }}</div>
        <div v-else-if="can(['ADM', 'HNG', 'MZK'])">
            <main class="row">
            </main>
        </div>
        <div v-else class="alert alert-danger row">No tienes los permisos para ver esto.</div>
    </div>
</template>


<script setup>
import { ref, onMounted } from "vue"
import { useSupabase } from '@/services/supabase';
import { checkAuth } from "@/services/useAuthCheck"
import { useAuthRoles } from "@/services/useAuthRoles"

const errorMessage = ref("")
const isLoggedIn = ref(false)
const { supabase } = useSupabase()
const { roles, loadUserRoles, can } = useAuthRoles()

onMounted(async () => {
    const loggedIn = await checkAuth()
    isLoggedIn.value = loggedIn

    if (!loggedIn) {
        errorMessage.value = "⚠️ Debes iniciar sesión para ver esta página."
        return
    }

    await loadUserRoles()
})


</script>

<style scoped></style>