<template>
    <div class="container my-5">
        <Titulo titulo="Boguer">
            <button v-if="isLoggedIn && can(['ADM', 'HNG'])" type="button" class="btn btn-outline-primary col-2"
                @click="openEditForm">
                Editar
            </button>
        </Titulo>

        <div v-if="loading">Cargando perfil del boguer...</div>
        <div v-else-if="error" class="alert alert-danger row">{{ error }}</div>

        <main v-else-if="profile" class="card shadow-sm p-3 hover-effect">
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
                        <p class="card-text">
                            <strong>Celular: </strong>
                            <a :href="walink(profile.celular)"> {{ profile.celular }}</a>
                        </p>
                        <p class="card-text">
                            <strong>Fecha de nacimiento: </strong>
                            {{ formatDate(profile.nacimiento, "DD/MM/YYYY") }}
                        </p>
                        <p class="card-text">
                            <strong>Email: </strong>
                            <a :href="'mailto:' + profile.email"> {{ profile.email }}</a>
                        </p>
                        <p class="card-text">
                            <strong>Tafkidim:</strong> {{ profile.tafkidim.join(", ") }}
                        </p>
                        <p v-if="can('ADM', 'HNG', 'MZK')">
                            <strong>Roles: </strong> {{ profile.roles.join(", ") }}
                        </p>
                    </div>
                </div>
            </div>
        </main>

        <div v-else class="alert alert-warning">No se encontró el boguer con ese DNI</div>

        <!-- Modal -->
        <Modal v-model="modal_editProfile">
            <form class="border rounded bg-light" @submit.prevent="handleSubmit" novalidate>
                <div class="container p-4">
                    <h4 class="mb-3">Editar perfil</h4>

                    <div class="row mb-3">
                        <div class="col-12 col-md-6">
                            <label for="profile-name" class="form-label">Nombre</label>
                            <input v-model="formData.name" type="text" id="profile-name" class="form-control"
                                required />
                            <div class="invalid-feedback">Debes completar los datos correctamente</div>
                        </div>
                        <div class="col-12 col-md-6">
                            <label for="profile-lastname" class="form-label">Apellido</label>
                            <input v-model="formData.lastname" type="text" id="profile-lastname" class="form-control"
                                required />
                            <div class="invalid-feedback">Debes completar los datos correctamente</div>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-12 col-md-6">
                            <label for="profile-dni" class="form-label">DNI</label>
                            <input v-model="formData.dni" type="number" id="profile-dni" class="form-control"
                                required />
                            <div class="invalid-feedback">Debes completar los datos correctamente</div>
                        </div>
                        <div class="col-12 col-md-6">
                            <label for="profile-nacimiento" class="form-label">Nacimiento</label>
                            <input v-model="formData.nacimiento" type="date" id="profile-nacimiento"
                                class="form-control" />
                            <div class="invalid-feedback">Debes completar los datos correctamente</div>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-12 col-md-6">
                            <label for="profile-celular" class="form-label">Celular</label>
                            <input v-model="formData.celular" type="text" id="profile-celular" class="form-control"
                                required />
                            <div class="invalid-feedback">Debes completar los datos correctamente</div>
                        </div>
                        <div class="col-12 col-md-6">
                            <label for="profile-email" class="form-label">E-Mail</label>
                            <input v-model="formData.email" type="email" id="profile-email" class="form-control"
                                required />
                            <div class="invalid-feedback">Debes completar los datos correctamente</div>
                        </div>
                    </div>

                    <div class="row mb-3" v-if="can(['ADM', 'HNG'])">
                        <div class="col-12">
                            <label for="profile-tafkidim" class="form-label">Tafkidim</label>
                            <textarea id="profile-tafkidim" v-model="formData.tafkidim" class="form-control" rows="3"
                                placeholder="Rosh kvutza&#10;Madrij&#10;Boguer"></textarea>
                            <div class="invalid-feedback">Debes completar los datos correctamente</div>
                        </div>

                        <div class="col-12 col-md-6 mt-3">
                            <label for="profile-roles" class="form-label">Roles</label>
                            <select id="profile-roles" v-model="formData.roles" class="form-select" multiple required>
                                <option value="" disabled>Elegir un rol</option>
                                <option value="BGR">BGR</option>
                                <option value="ADM">ADM</option>
                                <option value="HNG">HNG</option>
                                <option value="MZK">MZK</option>
                                <option value="JNJ">JNJ</option>
                                <option value="BTJ">BTJ</option>
                                <option value="HDR">HDR</option>
                            </select>
                            <div class="invalid-feedback">Debes completar los datos correctamente</div>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <button class="btn btn-primary col-12 mb-3" type="submit">Actualizar</button>
                        <button class="btn btn-danger col-12" type="button" @click="handleDelete">Borrar</button>
                    </div>
                </div>
            </form>
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useSupabase } from "../services/supabase"
import { checkAuth } from "@/services/useAuthCheck"
import { useAuthRoles } from "@/services/useAuthRoles"
import { formatDate } from "@/services/formats"
import { walink } from "@/services/walink"
import Titulo from "@/components/Titulo.vue"
import Modal from "@/components/Modal.vue"

const { supabase } = useSupabase()
const route = useRoute()
const router = useRouter()
const { loadUserRoles, can } = useAuthRoles()

const profile = ref(null)
const kvutzot = ref([])
const loading = ref(true)
const error = ref(null)
const isLoggedIn = ref(false)

const modal_editProfile = ref(false)

const formData = ref({
    name: "",
    lastname: "",
    dni: "",
    nacimiento: "",
    celular: "",
    email: "",
    tafkidim: "",
    roles: []
})

const kvutzaName = computed(() => {
    if (!profile.value || kvutzot.value.length === 0) return ""
    const kv = kvutzot.value.find(k => k.id_kvutza === profile.value.kvutza)
    return kv ? kv.name : profile.value.kvutza
})

const picUrl = computed(() => {
    return profile.value?.pic && profile.value.pic !== ""
        ? profile.value.pic
        : "https://37assets.37signals.com/svn/765-default-avatar.png"
})

onMounted(async () => {
    const loggedIn = await checkAuth()
    isLoggedIn.value = loggedIn

    if (!loggedIn) {
        error.value = "⚠️ Debes iniciar sesión para ver esta página."
        return
    }
    await loadUserRoles()

    const dni = route.params.dni
    if (!dni) {
        error.value = "No se proporcionó DNI"
        loading.value = false
        return
    }

    try {
        const { data: kvData, error: kvError } = await supabase.from("Kvutzot").select("*")
        if (kvError) throw kvError
        kvutzot.value = kvData

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

function openEditForm() {
    if (!profile.value) return
    formData.value = {
        name: profile.value.name,
        lastname: profile.value.lastname,
        dni: profile.value.dni,
        nacimiento: profile.value.nacimiento,
        celular: profile.value.celular,
        email: profile.value.email,
        tafkidim: Array.isArray(profile.value.tafkidim)
            ? profile.value.tafkidim.join("\n")
            : "",
        roles: profile.value.roles || []
    }
    modal_editProfile.value = true
}

async function handleSubmit() {
    try {
        const updateData = {
            ...formData.value,
            tafkidim: formData.value.tafkidim
                .split(/[\n,]+/)
                .map(t => t.trim())
                .filter(t => t.length > 0)
        }

        const { error: updateError } = await supabase
            .from("Bogrim")
            .update(updateData)
            .eq("dni", profile.value.dni)

        if (updateError) throw updateError

        profile.value = { ...profile.value, ...updateData }
        modal_editProfile.value = false
        alert("✅ Perfil actualizado correctamente")
    } catch (err) {
        alert("❌ Error al actualizar: " + err.message)
    }
}

async function handleDelete() {
    if (!confirm("¿Seguro que quieres borrar este perfil?")) return
    try {
        const { error: deleteError } = await supabase
            .from("Bogrim")
            .delete()
            .eq("dni", profile.value.dni)

        if (deleteError) throw deleteError

        alert("🗑️ Perfil eliminado")
        router.push("/") // redirigir a inicio o listado
    } catch (err) {
        alert("❌ Error al borrar: " + err.message)
    }
}
</script>

<style scoped>
@import url("/src/assets/css/main.css");

form {
    height: 100% !important;
    overflow-y: scroll;
}

.picboguer {
    width: 100%;
    max-width: 200px;
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
</style>
