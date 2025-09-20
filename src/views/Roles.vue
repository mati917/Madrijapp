<template>
    <div class="container-md my-4">
        <Titulo titulo="Roles" />
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
                        <tr v-for="rol in rols">
                            <th scope="row">{{ rol.id }}</th>
                            <td>{{ rol.name }}</td>
                            <td>{{ rol.alias }}</td>
                            <td>{{ rol.description }}</td>
                        </tr>
                    </tbody>
                </table>
            </main>
        </div>
        <div v-else class="alert alert-danger row">No tienes los permisos para ver esto.<br />Comunicate con tu
            referente</div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useSupabase } from '@/services/supabase';
import { checkAuth } from "@/services/useAuthCheck"
import { useAuthRoles } from "@/services/useAuthRoles"
import Titulo from "@/components/Titulo.vue"


const errorMessage = ref("")
const isLoggedIn = ref(false)
const { supabase } = useSupabase()
const { roles, loadUserRoles, can } = useAuthRoles()

const rols = ref([])

onMounted(async () => {
    // Chequeo de usuario
    const loggedIn = await checkAuth()
    isLoggedIn.value = loggedIn

    if (!loggedIn) {
        errorMessage.value = "⚠️ Debes iniciar sesión para ver esta página."
        return
    }

    await loadUserRoles()

    try {
        const { data, error } = await supabase
            .from("roles")
            .select("*")
            .order("id", { ascending: true })
        if (error) throw error
        rols.value = data
    } catch (error) {
        console.error(error)
        errorMessage.value = "❌ Error cargando roles: " + error.message
    }

})


</script>