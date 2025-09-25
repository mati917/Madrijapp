<template>
    <main class="container p-3">
        <Titulo titulo="Janijim">
            <!-- Botón visible solo si hay sesión -->
            <button v-if="isLoggedIn" type="button" id="add-janij" class="btn btn-outline-primary col-3 col-md-2"
                @click="showModal = true">
                Añadir
            </button>
        </Titulo>


        <!-- Error -->
        <div v-if="errorMessage" class="alert alert-danger row" role="alert">
            {{ errorMessage }}
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center my-4">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <!-- Cards -->
        <div v-else class="row g-4">
            <div v-for="janij in janijim" :key="janij.id" class="col-12 col-md-6 col-lg-4">
                <div class="card p-2 hover-effect" @click="abrirDetalles(janij)">
                    <Janij :janij="janij" :kvutzot="kvutzot" />
                </div>
            </div>
        </div>
    </main>

    <!-- Modal JanijForm -->
    <Transition name="modal-slide">
        <div v-if="showModal" class="modal-slide">
            <div class="modal-content">
                <button class="btn btn-close close-btn" @click="showModal = false" aria-label="Cerrar"></button>
                <JanijForm />
            </div>
            <div class="modal-backdrop" @click="showModal = false"></div>
        </div>
    </Transition>

    <!-- Modal JanijDetails -->
    <Transition name="modal-slide">
        <div v-if="showDetails" class="modal-slide">
            <div class="modal-content">
                <button class="btn btn-close close-btn" @click="cerrarDetalles" aria-label="Cerrar"></button>
                <JanijDetails :janij="janijSeleccionado" />
            </div>
            <div class="modal-backdrop" @click="cerrarDetalles"></div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { useSupabase } from "../services/supabase"
import { checkAuth } from "../services/useAuthCheck"
import { useAuthRoles } from "@/services/useAuthRoles"
import Titulo from "@/components/Titulo.vue"
import Janij from "../components/Janij.vue"
import JanijForm from "@/components/JanijForm.vue"
import JanijDetails from "@/components/JanijDetails.vue"


const { supabase } = useSupabase();
const { roles, loadUserRoles, can } = useAuthRoles()
const janijim = ref([])
const kvutzot = ref([])
const loading = ref(true)
const errorMessage = ref("")
const showModal = ref(false)
const showDetails = ref(false)
const janijSeleccionado = ref(null)
const isLoggedIn = ref(false)

onMounted(async () => {
    const loggedIn = await checkAuth()
    isLoggedIn.value = loggedIn

    if (!loggedIn) {
        errorMessage.value = "⚠️ Debes iniciar sesión para ver los janijim."
        loading.value = false
        return
    }
    await loadUserRoles();


    try {
        // Traer kvutzot
        const { data: kvData, error: kvError } = await supabase
            .from("Kvutzot")
            .select("id_kvutza, name")
        if (kvError) throw kvError
        kvutzot.value = kvData

        // Traer janijim
        const { data, error } = await supabase
            .from("Janijim")
            .select("*")
            .order("kvutza", { ascending: true })
        if (error) throw error
        janijim.value = data

        // Reemplazar id_kvutza por name para mostrar
        janijim.value = janijim.value.map(j => {
            const kv = kvutzot.value.find(k => k.id_kvutza === j.kvutza)
            return { ...j, kvutzaName: kv ? kv.name : j.kvutza }
        })


    } catch (err) {
        console.error(err)
        errorMessage.value = "No se pudieron cargar los janijim."
    } finally {
        loading.value = false
    }
})

function abrirDetalles(janij) {
    janijSeleccionado.value = { ...janij }
    showDetails.value = true
}

function cerrarDetalles() {
    showDetails.value = false
    janijSeleccionado.value = null
}

function handleEsc(event) {
    if (event.key === "Escape" && showDetails.value) {
        cerrarDetalles()
    }
}

watch(showDetails, (visible) => {
    if (visible) {
        window.addEventListener("keydown", handleEsc)
    } else {
        window.removeEventListener("keydown", handleEsc)
    }
})
</script>


<style scoped>
@import url(../assets/css/main.css);

.card {
    height: 9rem;
}

/* Transición para el modal */
.modal-slide-enter-active,
.modal-slide-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.modal-slide-enter-from,
.modal-slide-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

.modal-slide-enter-to,
.modal-slide-leave-from {
    opacity: 1;
    transform: translateX(0);
}

/* Responsive: animación vertical */
@media (max-width: 991.98px) {

    .modal-slide-enter-from,
    .modal-slide-leave-to {
        opacity: 0;
        transform: translateY(100%);
    }

    .modal-slide-enter-to,
    .modal-slide-leave-from {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-slide {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    z-index: 1050;
    display: flex;
    justify-content: flex-end;
    align-items: stretch;
}

.modal-content {
    width: 50vw;
    max-width: 50vw;
    height: 100%;
    padding: 0;
    position: relative;
    animation: slideInRight 0.3s;
    box-shadow: none;
    border: none;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background: #fff;
}

.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
}

/* Responsive modal for md and below */
@media (max-width: 991.98px) {
    .modal-slide {
        justify-content: center;
        align-items: flex-end;
    }

    .modal-content {
        width: 100% !important;
        max-width: 100vw;
        height: 80vh;
        max-height: 80vh;
        border-radius: 1rem 1rem 0 0;
        animation: slideInBottom 0.3s;
        overflow-y: auto;
        z-index: 1000;
    }

    .close-btn {
        top: 0.75rem;
        right: 1rem;
    }

    .modal-backdrop {
        width: 100vw !important;
        height: 100vh;
        bottom: 0;
        left: 0;
        z-index: 500 !important;
    }
}

/* Animations */
@keyframes slideInRight {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(0);
    }
}

@keyframes slideInBottom {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 50vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.2);
    z-index: 900;
}
</style>
