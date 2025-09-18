<template>
    <div class="container my-4">
        <div id="headering" class="bg-primary bg-opacity-25 text-primary p-3 my-4 rounded row">
            <h1>Tzevet</h1>
        </div>

        <!-- Mensajes -->
        <div v-if="errorMessage" class="alert alert-danger row">{{ errorMessage }}</div>
        <div v-else id="Correct">
            <!-- Sección Kvutzot -->
            <section id="section-kvutzot" class="section mb-4">
                <h2 class="mb-4 text-primary my-3 border-bottom border-primary">Kvutzot del tzevet</h2>
                <table class="table">
                    <thead>
                        <tr class="align-middle">
                            <th scope="col" class="bg-primary bg-opacity-10">ID</th>
                            <th scope="col" class="bg-primary bg-opacity-10">Shijvá</th>
                            <th scope="col" class="bg-primary bg-opacity-10">Nombre</th>
                            <th scope="col" class="bg-primary bg-opacity-10">Ken</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="kvutza in kvutzotTzevet" :key="kvutza.id_kvutza" class="align-middle hover-effect">
                            <th scope="row">{{ kvutza.id_kvutza }}</th>
                            <td>{{ kvutza.shijva }}</td>
                            <td>{{ kvutza.name }}</td>
                            <td>{{ kvutza.ken }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- Sección Bogrim -->
            <section id="section-bogrim" class="section mb-4">
                <h2 class="mb-4 text-primary my-3 border-bottom border-primary">Bogrim del tzevet</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col" class="bg-primary bg-opacity-10">Nombre</th>
                            <th scope="col" class="bg-primary bg-opacity-10">Apellido</th>
                            <th scope="col" class="bg-primary bg-opacity-10">DNI</th>
                            <th scope="col" class="bg-primary bg-opacity-10">Kvutzá</th>
                            <th scope="col" class="bg-primary bg-opacity-10">Celular</th>
                            <th scope="col" class="bg-primary bg-opacity-10">Nacimiento</th>
                            <th scope="col" class="bg-primary bg-opacity-10">Tafkidim</th>
                            <th scope="col" class="bg-primary bg-opacity-10">Roles</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="bogrim in bogrimTzevet" :key="bogrim.dni" class="align-middle hover-effect">
                            <td>{{ bogrim.name }}</td>
                            <td>{{ bogrim.lastname }}</td>
                            <td>{{ bogrim.dni }}</td>
                            <td>{{ bogrim.kvutza }}</td>
                            <td> <a :href="walink(bogrim.celular)" target="_blank">{{ bogrim.celular }}</a></td>
                            <td>{{ formatDate(bogrim.nacimiento, 'DD/MM/YYYY') }}</td>
                            <td>{{ bogrim.tafkidim.join(', ') }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useSupabase } from "../services/supabase"
import { checkAuth } from "../services/useAuthCheck"
import { formatDate } from "../services/formats"
import { walink } from "../services/walink"

const { supabase } = useSupabase()
const kvutzotTzevet = ref([])
const bogrimTzevet = ref([])
const errorMessage = ref("")
const isLoggedIn = ref(false)

onMounted(async () => {
    const loggedIn = await checkAuth()
    isLoggedIn.value = loggedIn

    if (!loggedIn) {
        errorMessage.value = "⚠️ Debes iniciar sesión para ver esta página."
        return
    }

    try {
        // Cargar Kvutzot del Tzevet
        const { data: kvData, error: kvError } = await supabase
            .from("Kvutzot")
            .select("id_kvutza, name, shijva, ken")
            .eq("ken", "Tzevet")
            .order("id_kvutza", { ascending: true })

        if (kvError) throw kvError
        kvutzotTzevet.value = kvData

        // Crear un mapa de id_kvutza -> name
        const kvMap = {}
        kvData.forEach(kv => {
            kvMap[kv.id_kvutza] = kv.name
        })

        // Cargar Bogrim del Tzevet
        const { data: bogData, error: bogError } = await supabase
            .from("Bogrim")
            .select("*")
            .order("kvutza", { ascending: true })

        if (bogError) throw bogError

        // Reemplazar el id_kvutza por el name de la kvutza
        bogrimTzevet.value = bogData.map(bog => ({
            ...bog,
            kvutza: kvMap[bog.kvutza] || bog.kvutza // si no encuentra, deja el ID
        }))

    } catch (err) {
        console.error(err)
        errorMessage.value = "❌ Error cargando datos del Tzevet: " + err.message
    }
})
</script>



<style scoped>
@import url(../assets/css/main.css);
</style>
