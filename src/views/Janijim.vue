<template>
    <main class="container-fluid">
        <h1>Janijim</h1>

        <!-- Loading -->
        <div v-if="loading" class="text-center my-4">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <!-- Error -->
        <div v-else-if="errorMessage" class="alert alert-danger my-4 text-center">
            {{ errorMessage }}
        </div>

        <!-- Cards -->
        <div v-else class="row justify-content-evenly">
            <Janij v-for="janij in janijim" :key="janij.id" :janij="janij" @verDetalles="mostrarDetalles" />
        </div>
    </main>
</template>

<script>
import Janij from "../components/Janij.vue";
import { supabase } from "../supabase";

export default {
    components: { Janij },
    data() {
        return {
            janijim: [],
            loading: true,        // arranca cargando
            errorMessage: null,   // mensaje si hay error
        };
    },
    async mounted() {
        console.log("Cargando datos desde Supabase...");
        console.log("Datos recibidos:", data);
        const { data, error } = await supabase
            .from("Janijim") // 👈 asegurate que el nombre sea igual al de la tabla
            .select("id, name, lastname, birthdate");

        if (error) {
            console.error("Error cargando janijim:", error.message);
            this.errorMessage = "No se pudieron cargar los datos. Intente nuevamente más tarde.";
        } else {
            console.log("Datos recibidos:", data);
            this.janijim = data;
        }

        this.loading = false;
    },
    methods: {
        mostrarDetalles(janij) {
            console.log("Detalles del Janij:", janij);
            // acá podrías abrir un modal o navegar a JanijDetails.vue
        },
    },
};
</script>

<style scoped>
main {
    padding: 2% 10%;
}
</style>
