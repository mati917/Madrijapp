<template>
    <main class="container p-3">
        <div id="headering" class="bg-primary text-white p-3 mb-4 rounded row">
            <h1 class="col-10">Janijim</h1>
            <button type="button" id="add-janij" class="btn btn-outline-light col-2"
                @click="showModal = true">Añadir</button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center my-4">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <!-- Error -->
        <div v-else-if="errorMessage" class="alert alert-danger my-4 text-center">
            {{ errorMessage }}
        </div>

        <!-- Cards -->
        <div v-else class="row row-cols-12 justify-content-evenly">
            <div v-for="janij in janijim" :key="janij.id" class="card p-2 col-12 col-md-5 col-lg-5 g-1 mb-2">
                <Janij :janij="janij" />
            </div>
        </div>
    </main>

    <!-- Modal JanijForm -->
    <div v-if="showModal" class="modal-slide">
        <div class="modal-content">
            <button class="btn btn-close close-btn" @click="showModal = false" aria-label="Cerrar"></button>
            <JanijForm />
        </div>
        <div class="modal-backdrop" @click="showModal = false"></div>
    </div>
</template>

<script setup>
import { useSupabase } from "../composables/supabase"
const { supabase } = useSupabase();
import { ref, onMounted } from "vue"
import Janij from "../components/Janij.vue"
import JanijForm from "@/components/JanijForm.vue"

const janijim = ref([])
const loading = ref(true)
const errorMessage = ref("")
const showModal = ref(false)

onMounted(async () => {
    try {
        const { data, error } = await supabase
            .from('Janijim')
            .select('*');
        console.log(data)
        console.log(error)
        if (error) throw error
        janijim.value = data
    } catch (err) {
        console.error("Error cargando janijim:", err.message)
        errorMessage.value = "No se pudieron cargar los janijim."
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
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
    z-index: 2;
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
    z-index: 1049;
}
</style>