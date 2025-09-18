<template>
    <div class="container">
        <div id="headering" class="bg-primary bg-opacity-25 text-primary p-3 my-4 rounded row">
            <h1 class="col-10">Kvutzot</h1>
            <button v-if="isLoggedIn" type="button" class="btn btn-outline-primary col-2" @click="showModal = true">
                Añadir
            </button>
        </div>

        <!-- Mensajes -->
        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

        <!-- Tabla -->
        <main v-else class="row">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" class="bg-primary bg-opacity-10 text-center" id="actioncol">Actions</th>
                        <th scope="col" class="bg-primary bg-opacity-10">ID</th>
                        <th scope="col" class="bg-primary bg-opacity-10">Nombre</th>
                        <th scope="col" class="bg-primary bg-opacity-10">Shijvá</th>
                        <th scope="col" class="bg-primary bg-opacity-10">Ken</th>
                    </tr>
                </thead>
                <tbody>
                    <Kvutza_row v-for="kvutza in kvutzot" :key="kvutza.id_kvutza" :kvutza="kvutza"
                        @delete-kvutza="deleteKvutza" @edit-kvutza="editKvutza" />
                </tbody>
            </table>
        </main>

        <!-- Modal Añadir Kvutza -->
        <transition name="modal-slide">
            <div v-if="showModal" class="modal-slide">
                <div class="modal-content">
                    <button class="btn btn-close close-btn" @click="showModal = false" aria-label="Cerrar"></button>
                    <KvutzaForm @added="refreshKvutzot" />
                </div>
                <div class="modal-backdrop" @click="showModal = false"></div>
            </div>
        </transition>

        <!-- Modal Editar Kvutza -->
        <transition name="modal-slide">
            <div v-if="editingKvutza" class="modal-slide">
                <div class="modal-content">
                    <button class="btn btn-close close-btn" @click="editingKvutza = null" aria-label="Cerrar"></button>
                    <KvutzaEditForm :kvutza="editingKvutza" @updated="refreshKvutzot" />
                </div>
                <div class="modal-backdrop" @click="editingKvutza = null"></div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useSupabase } from "../services/supabase"
import { checkAuth } from "../services/useAuthCheck"
import Kvutza_row from "../components/Kvutza_row.vue"
import KvutzaForm from "../components/Kvutza_Form.vue"
import KvutzaEditForm from "../components/Kvutza_EditForm.vue"

const { supabase } = useSupabase()
const errorMessage = ref("")
const successMessage = ref("")
const kvutzot = ref([])
const showModal = ref(false)
const editingKvutza = ref(null)
const isLoggedIn = ref(false)

onMounted(async () => {
    const loggedIn = await checkAuth()
    isLoggedIn.value = loggedIn

    if (!loggedIn) {
        errorMessage.value = "⚠️ Debes iniciar sesión para ver las kvutzot."
        return
    }

    await fetchKvutzot()
})

async function fetchKvutzot() {
    const { data, error } = await supabase
        .from("Kvutzot")
        .select("*")
        .order("id_kvutza", { ascending: true })

    if (error) {
        errorMessage.value = "❌ Error cargando datos: " + error.message
    } else {
        kvutzot.value = data
    }
}

async function deleteKvutza(id) {
    const { error } = await supabase
        .from("Kvutzot")
        .delete()
        .eq("id_kvutza", id)

    if (error) {
        errorMessage.value = "❌ No se pudo eliminar: " + error.message
    } else {
        successMessage.value = "✅ Kvutza eliminada correctamente."
        kvutzot.value = kvutzot.value.filter(k => k.id_kvutza !== id)
    }

    setTimeout(() => {
        errorMessage.value = ""
        successMessage.value = ""
    }, 3000)
}

function editKvutza(kv) {
    editingKvutza.value = { ...kv }
}

async function refreshKvutzot() {
    await fetchKvutzot()
    showModal.value = false
    editingKvutza.value = null
}
</script>



<style scoped>
@import url(../assets/css/main.css);

#actioncol {
    width: 10%;
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

.modal-content>form {
    height: 100%;
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
    width: 50vw !important;
    height: 100vh;
    background: rgba(0, 0, 0, 0.2);
    z-index: 900;
}
</style>
