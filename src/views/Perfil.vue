<template>
    <div class="container my-5">
        <h1>Perfil</h1>

        <div v-if="loading">Cargando perfil...</div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-else-if="profile" class="card p-3 shadow-sm">
            <p><strong>Nombre:</strong> {{ profile.name }} {{ profile.lastname }}</p>
            <p><strong>DNI:</strong> {{ profile.dni }}</p>
            <p><strong>Kvutza:</strong> {{ profile.kvutza }}</p>
            <p><strong>Celular:</strong> {{ profile.celular }}</p>
            <p><strong>Fecha de nacimiento:</strong> {{ profile.nacimiento }}</p>
            <p><strong>Email:</strong> {{ authUser.email }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useSupabase } from '../services/supabase'

const { supabase } = useSupabase()
const authUser = ref(null)
const profile = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
    try {
        // Obtener sesión
        const { data, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (!data.session) throw new Error("No hay sesión activa")

        authUser.value = data.session.user

        // Traer perfil de la tabla
        const { data: userData, error } = await supabase
            .from("Bogrim")
            .select("*")
            .eq("id_auth", authUser.value.id)
            .maybeSingle()
        console.log(userData, error)

        if (error) throw error
        profile.value = userData
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false

    }
})
</script>
