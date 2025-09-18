<template>
    <div class="container my-5">
        <h1>Boguer</h1>

        <div v-if="loading">Cargando perfil del boguer...</div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-else-if="profile" class="card p-3 shadow-sm">
            <p><strong>Nombre:</strong> {{ profile.name }} {{ profile.lastname }}</p>
            <p><strong>DNI:</strong> {{ profile.dni }}</p>
            <p><strong>Kvutza:</strong> {{ profile.kvutza }}</p>
            <p><strong>Celular:</strong> {{ profile.celular }}</p>
            <p><strong>Fecha de nacimiento:</strong> {{ profile.nacimiento }}</p>
            <p><strong>Email:</strong> {{ profile.email }}</p>
        </div>
        <div v-else class="alert alert-warning">No se encontró el boguer con ese DNI</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useSupabase } from '../services/supabase'
import { useRoute } from "vue-router"

const { supabase } = useSupabase()
const route = useRoute()

const profile = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
    const dni = route.params.dni // obtenemos el DNI desde la URL
    if (!dni) {
        error.value = "No se proporcionó DNI"
        loading.value = false
        return
    }

    try {
        const { data, error: fetchError } = await supabase
            .from("Bogrim") // tabla donde están los boguers
            .select("*")
            .eq("dni", dni)
            .maybeSingle() // devuelve un solo objeto o null

        if (fetchError) throw fetchError
        profile.value = data
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
})
</script>
