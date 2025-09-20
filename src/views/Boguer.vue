<template>
    <div class="container my-5">
        <Titulo titulo="Boguer" />


        <div v-if="loading">Cargando perfil del boguer...</div>
        <div v-else-if="error" class="alert alert-danger row">{{ error }}</div>

        <main v-else-if="profile" class="card shadow-sm p-3">
            <div class="row align-items-center">
                <!-- Imagen -->
                <div class="col-12 col-md-4 text-center text-md-start mb-3 mb-md-0">
                    <img :src="picUrl" :alt="profile.name" class="picboguer border rounded" />
                </div>

                <!-- Card body -->
                <div class="col-12 col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">{{ profile.name }} {{ profile.lastname }}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">{{ kvutzaName }}</h6>
                        <p class="card-text"><strong>DNI:</strong> {{ profile.dni }}</p>
                        <p class="card-text"><strong>Celular:</strong> <a :href="walink(profile.celular)">{{
                            profile.celular }}</a></p>
                        <p class="card-text"><strong>Fecha de nacimiento:</strong> {{ formatDate(profile.nacimiento,
                            'DD/MM/YYYY') }}</p>
                        <p class="card-text"><strong>Email:</strong> <a :href="'mailto:' + profile.email">{{
                            profile.email
                                }}</a></p>
                        <p class="card-text"><strong>Tafkidim:</strong> {{ profile.tafkidim.join(', ') }}</p>
                        <p v-if="can('ADM', 'HNG', 'MZK')">
                            <strong>Roles: </strong>{{ profile.roles.join(', ') }}
                        </p>
                    </div>
                </div>
            </div>
        </main>


        <div v-else class="alert alert-warning">No se encontró el boguer con ese DNI</div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import { useSupabase } from '../services/supabase'
import { checkAuth } from "@/services/useAuthCheck"
import { useAuthRoles } from "@/services/useAuthRoles"
import { formatDate } from "@/services/formats"
import { walink } from "@/services/walink"
import Titulo from "@/components/Titulo.vue"

const { supabase } = useSupabase()
const route = useRoute()
const { roles, loadUserRoles, can } = useAuthRoles()

const profile = ref(null)
const kvutzot = ref([]) // tabla de kvutzot
const loading = ref(true)
const error = ref(null)
const isLoggedIn = ref(false)


// Computed para el nombre de la kvutza
const kvutzaName = computed(() => {
    if (!profile.value || kvutzot.value.length === 0) return ''
    const kv = kvutzot.value.find(k => k.id_kvutza === profile.value.kvutza)
    return kv ? kv.name : profile.value.kvutza
})

// Computed para la foto del boguer
const picUrl = computed(() => {
    return profile.value?.pic && profile.value.pic !== ""
        ? profile.value.pic
        : "https://37assets.37signals.com/svn/765-default-avatar.png" // fallback
})

onMounted(async () => {
    const loggedIn = await checkAuth()
    isLoggedIn.value = loggedIn

    if (!loggedIn) {
        error.value = "⚠️ Debes iniciar sesión para ver esta página."
        return
    }
    await loadUserRoles();

    const dni = route.params.dni
    if (!dni) {
        error.value = "No se proporcionó DNI"
        loading.value = false
        return
    }

    try {
        // Traer los kvutzot
        const { data: kvData, error: kvError } = await supabase.from("Kvutzot").select("*")
        if (kvError) throw kvError
        kvutzot.value = kvData

        // Traer perfil del boguer
        const { data: boguerData, error: boguerError } = await supabase
            .from("Bogrim")
            .select("*")
            .eq("dni", dni)
            .maybeSingle()
        if (boguerError) throw boguerError
        profile.value = boguerData

    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.picboguer {
    width: 100%;
    max-width: 200px;
    /* opcional, para no ser demasiado grande */
    height: auto;
    object-fit: cover;
    border-radius: 8px;
}


.card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.2s;
}

.card>.row {
    height: 100%;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
</style>
