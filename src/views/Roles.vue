<template>
    <div class="container-md my-4">
        <div id="headering" class="bg-primary bg-opacity-25 text-primary p-3 my-4 rounded row">
            <h1>Roles</h1>
        </div>
        <!-- Error -->
        <div v-if="errorMessage" class="alert alert-danger row">{{ errorMessage }}</div>
        <div v-else-if="can(['ADM', 'HNG', 'MZK'])">
            <main class="row">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Alias</th>
                            <th scope="col">Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                    </tbody>
                </table>
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

    await loadUserRoles() // 👈 espera a que se llenen los roles
})


</script>