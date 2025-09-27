<template>
    <div class="container-md my-4">
        <Titulo titulo="Hadrajá">
        </Titulo>
        <!-- Error -->
        <div v-if="errorMessage" class="alert alert-danger row">{{ errorMessage }}</div>

        <div v-else>
            <!-- Bloque para Madrij -->
            <div id="madrij" v-if="can(['ADM', 'HDR'])">
                <main class="row mb-3" id="mi-hadraja">
                    <Subtitulo titulo="Mi Hadrajá"></Subtitulo>
                    <div id="basic-data" class="mb-2">
                        <h3 class="text-primary">Datos básicos</h3>
                        <table class="table">
                            <thead>
                                <tr class="text-center">
                                    <th scope="col">Kvutzá</th>
                                    <th scope="col">Shijvá</th>
                                    <th scope="col">Ken</th>
                                    <th scope="col">Madrijim</th>
                                    <th scope="col">Roshei Shijvá</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="hdr in hdrj" :key="hdr.id_hdrj" class="align-middle text-center">
                                    <th class="hover-effect" scope="row">{{ kvutzaMap(hdr.id_kvutza) }}</th>
                                    <td class="hover-effect">{{ hdr.shijvaActual }}</td>
                                    <td class="hover-effect">{{ hdr.ken }}</td>
                                    <td class="hover-effect">
                                        <a v-for="mdrj in hdr.id_mdrjm" :key="mdrj" :href="'/boguer/' + mdrj">
                                            {{ boguerMap(mdrj) }}<br />
                                        </a>
                                    </td>
                                    <td class="hover-effect">
                                        <a v-for="rshj in hdr.id_roshShijva" :key="rshj" :href="'/boguer/' + rshj">
                                            {{ boguerMap(rshj) }}<br />
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>

                <div id="mis-janijim">
                    <h3 class="text-primary">
                        Mis janijim
                        <button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"> Ver
                            lista
                            <span class="badge bg-primary-subtle text-primary">{{ janijim_hdrj.length }}</span>
                        </button>
                    </h3>
                    <div class="collapse" id="collapseExample">
                        <div class="card card-body">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Apellido</th>
                                        <th scope="col">DNI</th>
                                        <th scope="col">Celular</th>
                                        <th scope="col">Tutor</th>
                                        <th scope="col">Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(janij, index) in janijim_hdrj" class="hover-effect"
                                        @dblclick="router.push('/janijim/' + janij.dni)">
                                        <th scope="row">{{ index + 1 }}</th>
                                        <td>{{ janij.name }}</td>
                                        <td>{{ janij.lastname }}</td>
                                        <td>{{ janij.dni }}</td>
                                        <td>
                                            <a :href="'https://wa.me/54' + janij.janij_cellphone" target="_blank">{{
                                                janij.janij_cellphone }}</a>

                                        </td>
                                        <td>
                                            <a :href="'https:wa.me/54' + janij.parent_cellphone" target="_blank">
                                                {{ janij.parent_name }} - {{ janij.parent_cellphone }}
                                            </a>
                                        </td>
                                        <td>
                                            <div class="badge" :class="badgeClass(janij?.type_janij)">
                                                {{ janij?.type_janij || 'Desconocido' }}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div id="mis-peulot">
                    <h3 class="text-primary">
                        Mis janijim
                        <button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"> Ver
                            peulot
                            <span class="badge bg-primary-subtle text-primary"></span>
                        </button>
                    </h3>
                    <div class="card card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Fecha</th>
                                    <th>Nombre</th>
                                    <td>Kvutzá</td>
                                    <td>Tipo hadrajá</td>
                                    <th>Supervisada</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Bloque para Rosh Shijvá -->
            <aside class="row" id="mi-roshado" v-if="can(['JNJ'])">
                <Subtitulo titulo="Roshei Shijvá"></Subtitulo>
                <div class="mb-2">
                    <h3 class="text-primary">Datos básicos</h3>
                    <table class="table">
                        <thead>
                            <tr class="text-center">
                                <th scope="col">Kvutzá</th>
                                <th scope="col">Shijvá</th>
                                <th scope="col">Ken</th>
                                <th scope="col">Madrijim</th>
                                <th scope="col">Roshei Shijvá</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="hdr in hdrj_jnj" :key="hdr.id_hdrj"
                                class="align-middle text-center hover-effect">
                                <th class=" hover-effect" scope="row">{{ kvutzaMap(hdr.id_kvutza) }}</th>
                                <td class="hover-effect">{{ hdr.shijvaActual }}</td>
                                <td class="hover-effect">{{ hdr.ken }}</td>
                                <td class="hover-effect">
                                    <a v-for="mdrj in hdr.id_mdrjm" :key="mdrj" :href="'/boguer/' + mdrj">
                                        {{ boguerMap(mdrj) }}<br />
                                    </a>
                                </td>
                                <td class="hover-effect">
                                    <a v-for="rshj in hdr.id_roshShijva" :key="rshj" :href="'/boguer/' + rshj">
                                        {{ boguerMap(rshj) }}<br />
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <h3 class="text-primary">
                        Janijim de la kvutzá
                        <button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                            data-bs-target="#janijim_jnj" aria-expanded="false" aria-controls="janijim_jnj"> Ver
                            lista
                            <span class="badge bg-primary-subtle text-primary">{{ janijim_hdrj_jnj.length }}</span>
                        </button>
                    </h3>
                    <div class="collapse" id="janijim_jnj">
                        <div class="card card-body">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Apellido</th>
                                        <th scope="col">DNI</th>
                                        <th scope="col">Celular</th>
                                        <th scope="col">Tutor</th>
                                        <th scope="col">Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(janij, index) in janijim_hdrj_jnj" class="hover-effect"
                                        @dblclick="router.push('/janijim/' + janij.dni)">
                                        <th scope="row">{{ index + 1 }}</th>
                                        <td>{{ janij.name }}</td>
                                        <td>{{ janij.lastname }}</td>
                                        <td>{{ janij.dni }}</td>
                                        <td>
                                            <a :href="'https://wa.me/54' + janij.janij_cellphone" target="_blank">{{
                                                janij.janij_cellphone }}</a>

                                        </td>
                                        <td>
                                            <a :href="'https:wa.me/54' + janij.parent_cellphone" target="_blank">
                                                {{ janij.parent_name }} - {{ janij.parent_cellphone }}
                                            </a>
                                        </td>
                                        <td>
                                            <div class="badge" :class="badgeClass(janij?.type_janij)">
                                                {{ janij?.type_janij || 'Desconocido' }}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

    </div>
</template>


<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useSupabase } from '@/services/supabase'
import { checkAuth } from "@/services/useAuthCheck"
import { useAuthRoles } from "@/services/useAuthRoles"
import { cargarKvutzot, kvutzaMap } from "@/services/mapKvutza"
import { cargarBogrim, boguerMap } from "@/services/mapBoguer"
import Titulo from "@/components/Titulo.vue";
import Subtitulo from "@/components/Subtitulo.vue";

const router = useRouter()
const errorMessage = ref("")
const isLoggedIn = ref(false)
const { supabase } = useSupabase()
const { roles, loadUserRoles, can } = useAuthRoles()

const usuario = ref(null) // .value = dni usuario
const hdrj = ref([]) // mi hdrj
const hdrj_jnj = ref([]) // mi hadraja rosheada
const janijim_hdrj = ref([])
const janijim_hdrj_jnj = ref([])
const yeartoday = new Date().getFullYear()


function badgeClass(type) {
    // Mapeamos los tipos a clases de Bootstrap con bg-light + border oscuro
    const map = {
        "Fijo": "bg-success-subtle text-success border border-success",
        "Rotativo": "bg-primary-subtle text-primary border border-primary",
        "Esporádico": "bg-warning-subtle text-warning border border-warning",
        "Inactivo": "bg-danger-subtle text-danger border border-danger"
    }
    return map[type] || "bg-secondary-subtle text-secondary border border-secondary"
}


onMounted(async () => {
    try {
        // 1️⃣ Chequeo usuario y roles
        const loggedIn = await checkAuth()
        isLoggedIn.value = loggedIn
        if (!loggedIn) {
            errorMessage.value = "⚠️ Debes iniciar sesión para ver esta página."
            return
        }
        await loadUserRoles()

        // 2️⃣ Cargar kvutzot y bogrim al cache
        await cargarKvutzot()

        const { data: dataBogrim, error: errorBogrim } = await supabase
            .from("Bogrim")
            .select("dni, name, lastname")
        if (errorBogrim) throw errorBogrim
        cargarBogrim(dataBogrim)

        // 3️⃣ Obtener usuario actual
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data: dataUser, error: errorUser } = await supabase
            .from('Bogrim')
            .select('dni')
            .eq('id_auth', user.id)
            .maybeSingle()
        if (errorUser) throw errorUser
        usuario.value = dataUser?.dni

        if (!usuario.value) {
            errorMessage.value = "No se pudo obtener el DNI del usuario."
            return
        }

        // 4️⃣ Obtener hadrajot según rol
        if (can('HDR')) {
            const { data: dataHdrj, error: errorHdrj } = await supabase
                .from('Hadrajot')
                .select('*')
                .eq('cicloLectivo', yeartoday)
                .eq('tipo', 'Común')
                .contains('id_mdrjm', [usuario.value])
            if (errorHdrj) throw errorHdrj
            hdrj.value = dataHdrj

            if (hdrj.value.length) {
                // extraer todos los id_kvutza
                const idsKvutza = hdrj.value.map(h => h.id_kvutza)

                const { data: dataJanijim, error: errorJanijim } = await supabase
                    .from('Janijim')
                    .select('*')
                    .in('kvutza', idsKvutza)   // 👈 aquí usamos .in() con array

                if (errorJanijim) throw errorJanijim
                janijim_hdrj.value = dataJanijim
            }
        }

        // Obtención hadraja rosheada
        if (can('JNJ')) {
            const { data: dataHdrjJnj, error: errorHdrjJnj } = await supabase
                .from('Hadrajot')
                .select('*')
                .eq('tipo', 'Común')
                .eq('cicloLectivo', yeartoday)
                .contains('id_roshShijva', [usuario.value])
            if (errorHdrjJnj) throw errorHdrjJnj
            hdrj_jnj.value = dataHdrjJnj

            if (hdrj.value.length) {
                // extraer todos los id_kvutza
                const idsKvutza = hdrj.value.map(h => h.id_kvutza)

                const { data: dataJanijimJnij, error: errorJanijimJnij } = await supabase
                    .from('Janijim')
                    .select('*')
                    .in('kvutza', idsKvutza)   // 👈 aquí usamos .in() con array

                if (errorJanijimJnij) throw errorJanijimJnij
                janijim_hdrj_jnj.value = dataJanijimJnij
            }
        }

    } catch (error) {
        console.log("Error cargando datos:", error)
        errorMessage.value = "Error cargando datos: " + error
    }
})






</script>

<style scoped>
@import url('/src/assets/css/main.css');
</style>