<template>
    <div class="container my-4">
        <Titulo titulo="Tzevet" />

        <!-- Mensajes -->
        <div v-if="errorMessage" class="alert alert-danger row">{{ errorMessage }}</div>
        <div v-else-if="can(['ADM', 'HNG', 'MZK'])" id="Correct">
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
                        <tr v-for="bogrim in bogrimTzevet" :key="bogrim.dni" class="align-middle hover-effect"
                            @dblclick="goToBoguer(bogrim)" style="cursor: pointer;">
                            <td>{{ bogrim.name }}</td>
                            <td>{{ bogrim.lastname }}</td>
                            <td>{{ bogrim.dni }}</td>
                            <td>{{ bogrim.kvutza }}</td>
                            <td> <a :href="walink(bogrim.celular)" target="_blank">{{ bogrim.celular }}</a></td>
                            <td>{{ formatDate(bogrim.nacimiento, 'DD/MM/YYYY') }}</td>
                            <td>{{ bogrim.tafkidim.join(', ') }}</td>
                            <td>{{ bogrim.roles.join(', ') }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
        <div v-else class="alert alert-danger row">No tienes los permisos para ver esto.<br />Comunicate con tu
            referente</div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useSupabase } from "../services/supabase"
import { checkAuth } from "../services/useAuthCheck"
import { useAuthRoles } from "@/services/useAuthRoles"
import { formatDate } from "../services/formats"
import { walink } from "../services/walink"
import Titulo from "@/components/Titulo.vue"


const router = useRouter()
const { supabase } = useSupabase()
const { roles, loadUserRoles, can } = useAuthRoles()
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
    await loadUserRoles();

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

function goToBoguer(boguer) {
    router.push('/boguer/' + boguer.dni)
}

</script>



<style scoped>
@import url(../assets/css/main.css);
</style>
