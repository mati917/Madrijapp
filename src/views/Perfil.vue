<template>
    <div class="container my-5">
        <Titulo titulo="Perfil" />

        <div v-if="loading">Cargando perfil...</div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-else-if="profile" class="card p-3 shadow-sm">
            <p><strong>Nombre:</strong> {{ profile.name }} {{ profile.lastname }}</p>
            <p><strong>DNI:</strong> {{ profile.dni }}</p>
            <p><strong>Kvutza:</strong> {{ kvutzaMap(profile.kvutza) }}</p>
            <p><strong>Celular:</strong> {{ profile.celular }}</p>
            <p><strong>Fecha de nacimiento:</strong> {{ formatDate(profile.nacimiento) }}</p>
            <p><strong>Email:</strong> {{ authUser.email }}</p>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from "vue"
import { useSupabase } from '../services/supabase'
import { cargarKvutzot } from "@/services/kvutzaMapper"
import { kvutzaMap } from "@/services/kvutzaMapper"
import { formatDate } from "@/services/formats"
import Header from "@/components/Titulo.vue"
import Titulo from "@/components/Titulo.vue"

const { supabase } = useSupabase()
const authUser = ref(null)
const profile = ref(null)
const loading = ref(true)
const error = ref(null)


onMounted(async () => {
    await cargarKvutzot()
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
