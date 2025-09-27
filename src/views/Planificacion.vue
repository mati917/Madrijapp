<template>
    <div class="container-md my-4">
        <Titulo :titulo="'Planificación'"></Titulo>

        <!-- Error -->
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

        <div v-else-if="can(['ADM', 'HDR', 'JNJ'])">
            <main class="row">
                <!-- Formulario principal -->
                <div class="col-12 mb-4">
                    <form class="border rounded p-4 bg-light" @submit.prevent="actualizarPeula">
                        <div class="mb-3">
                            <label class="form-label">Nombre</label>
                            <input type="text" class="form-control" v-model="planificacion.nombre" />
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label class="form-label">Fecha</label>
                                <input type="date" class="form-control" v-model="planificacion.fecha" />
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Hora inicio</label>
                                <input type="time" class="form-control" v-model="planificacion.hora_inicio" />
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Hora final</label>
                                <input type="time" class="form-control" v-model="planificacion.hora_final" />
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label class="form-label">Kvutzá</label>
                                <input type="text" class="form-control" disabled
                                    :value="kvutzaMap(mapHadraja_kvutza(planificacion.hadraja))" />
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Shijvá</label>
                                <input type="text" class="form-control" disabled
                                    :value="mapHadraja_shijva(planificacion.hadraja)" />
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Janijim estimados</label>
                                <input type="number" class="form-control" v-model="planificacion.cant_jnjm" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Madrijim</label>
                                <input type="text" class="form-control" disabled :value="nombres_mdrjm" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Madrijim extra</label>
                                <input type="text" class="form-control" v-model="planificacion.extra_mdrjm"
                                    placeholder="Madrij1, Madrij2..." />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Archivo / Notas</label>
                            <textarea class="form-control" rows="4" v-model="planificacion.file"></textarea>
                        </div>

                        <!-- 🔹 BOTÓN ACTUALIZAR -->
                        <div class="text-end">
                            <button type="submit" class="btn btn-primary">
                                Actualizar peulá
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Feedback -->
                <Subtitulo :titulo="'Feedback y Extras'"></Subtitulo>
                <div class="row mb-3">
                    <div class="col-12">
                        <label class="form-label">Feedback de la peulá</label>
                        <textarea class="form-control" rows="4" v-model="planificacion.fdbk_comments"></textarea>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-12">
                        <label for="puntaje" class="form-label">Puntaje de la peulá</label>
                        <input type="range" class="form-range" min="1" max="5" step="1" id="puntaje"
                            v-model="planificacion.fdbk_value" />
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="form-check form-switch col ms-3">
                        <input class="form-check-input" type="checkbox" role="switch" v-model="planificacion.jnj_sup"
                            :disabled="!can(['JNJ'])" />
                        <label class="form-check-label">¿Supervisada?</label>
                    </div>
                </div>

                <div class="mb-3">
                    <div class="col-12">
                        <label class="form-label">Feedback de Roshei Shijvá</label>
                        <textarea class="form-control" rows="4" v-model="planificacion.jnj_feedback"
                            :disabled="!can(['JNJ'])"></textarea>
                    </div>
                </div>
            </main>
        </div>

        <div v-else class="alert alert-danger">
            No tienes los permisos para ver esto.<br />Comunicate con tu referente
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import { useSupabase } from '@/services/supabase';
import { checkAuth } from "@/services/useAuthCheck"
import { useAuthRoles } from "@/services/useAuthRoles"
import { cargarKvutzot, kvutzaMap } from "@/services/mapKvutza"
import { cargarBogrim, boguerMap } from "@/services/mapBoguer"
import {
    cargarHadrajot,
    mapHadraja_kvutza,
    mapHadraja_shijva,
    mapHadraja_mdrjm,
    mapHadraja_rshShijva
} from "@/services/mapHadraja"
import Titulo from "@/components/Titulo.vue";
import Subtitulo from "@/components/Subtitulo.vue";

const { supabase } = useSupabase()
const route = useRoute()
const { loadUserRoles, can } = useAuthRoles()

const errorMessage = ref("")
const planificacion = ref({
    nombre: "",
    fecha: "",
    hora_inicio: "",
    hora_final: "",
    file: "",
    hadraja: "",
    cant_jnjm: 0,
    mdrjm: "",
    extra_mdrjm: "",
    fdbk_comments: "",
    fdbk_value: 0,
    jnj_sup: false,
    jnj_feedback: ""
})

const nombres_mdrjm = computed(() => {
    if (!planificacion.value.hadraja) return ""
    return mapHadraja_mdrjm(planificacion.value.hadraja).map(dni => boguerMap(dni)).join(", ")
})
const nombres_roshShijva = computed(() => {
    if (!planificacion.value.hadraja) return ""
    return mapHadraja_rshShijva(planificacion.value.hadraja).map(dni => boguerMap(dni)).join(", ")
})

onMounted(async () => {
    const loggedIn = await checkAuth()
    if (!loggedIn) {
        errorMessage.value = "⚠️ Debes iniciar sesión para ver esta página."
        return
    }

    await loadUserRoles()
    await cargarKvutzot()
    await cargarHadrajot()

    const { data: dataBogrim, error: errorBogrim } = await supabase
        .from("Bogrim")
        .select("dni, name, lastname")
    if (errorBogrim) throw errorBogrim
    cargarBogrim(dataBogrim)

    const { id } = route.params
    const { data, error } = await supabase
        .from('Planificaciones')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error) {
        errorMessage.value = `Error cargando la planificación: ${error.message}`
        return
    }

    planificacion.value = data
})

/* 🔹 Función para actualizar en Supabase */
async function actualizarPeula() {
    try {
        const { id } = route.params
        const { error } = await supabase
            .from("Planificaciones")
            .update(planificacion.value)
            .eq("id", id)

        if (error) {
            errorMessage.value = `Error al actualizar: ${error.message}`
        } else {
            alert("✅ Peulá actualizada correctamente")
            window.location.reload()
        }
    } catch (err) {
        errorMessage.value = `Error inesperado: ${err.message}`
    }
}
</script>
