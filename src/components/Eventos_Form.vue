<template>
    <div>
        <!-- Si el usuario tiene permiso, ve el formulario -->
        <form v-if="can(['ADM', 'HNG', 'MZK', 'BTJN'])" class="needs-validation" novalidate
            @submit.prevent="handleSubmit" ref="formEl">
            <!-- Nombre -->
            <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input v-model="form.nombre" type="text" class="form-control" required placeholder="Evento increíble" />
                <div class="invalid-feedback">Este campo es obligatorio</div>
            </div>

            <!-- Fechas -->
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Fecha inicio</label>
                    <input v-model="form.fecha_inicio" type="datetime-local" class="form-control" required />
                    <div class="invalid-feedback">Este campo es obligatorio</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Fecha final</label>
                    <input v-model="form.fecha_final" type="datetime-local" class="form-control" required />
                    <div class="invalid-feedback">Este campo es obligatorio</div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Fecha inicio staff</label>
                    <input v-model="form.fecha_inicio_staff" type="datetime-local" class="form-control" />
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Fecha final staff</label>
                    <input v-model="form.fecha_final_staff" type="datetime-local" class="form-control" />
                </div>
            </div>

            <!-- Keinim -->
            <div class="mb-3">
                <label class="form-label">Keinim (separados por coma)</label>
                <input v-model="form.keinimStr" type="text" class="form-control" placeholder="Atid, Jana Szenes..." />
            </div>

            <!-- Cantidades -->
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">Cantidad público</label>
                    <input v-model="form.cant_pub" type="number" min="0" class="form-control" />
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Cantidad staff</label>
                    <input v-model="form.cant_staff" type="number" min="0" class="form-control" />
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Cantidad total</label>
                    <input v-model="form.cant_total" type="number" min="1" class="form-control" required />
                    <div class="invalid-feedback">Debe ingresar un número válido</div>
                </div>
            </div>

            <!-- Tipo y magnitud -->
            <div class="row mb-3">
                <div class="col-12 col-md-6">
                    <label class="form-label">Tipo</label>
                    <select v-model="form.tipo" class="form-select" required>
                        <option value="">Seleccione...</option>
                        <option>Común</option>
                        <option>Especial</option>
                        <option>No formal</option>
                        <option>Informal</option>
                        <option>Campamento</option>
                        <option>Traslado</option>
                        <option>Alquiler</option>
                        <option>Nigdal</option>
                    </select>
                    <div class="invalid-feedback">Este campo es obligatorio</div>
                </div>
                <div class="col-12 col-md-6">
                    <label class="form-label">Magnitud</label>
                    <select v-model="form.magnitud" class="form-select" required>
                        <option value="">Seleccione...</option>
                        <option>Chico</option>
                        <option>Mediano</option>
                        <option>Grande</option>
                        <option>Enorme</option>
                    </select>
                    <div class="invalid-feedback">Este campo es obligatorio</div>
                </div>
            </div>

            <!-- Lugar -->
            <div class="mb-3">
                <label class="form-label">Dirección</label>
                <input v-model="form.lugar" type="text" class="form-control" placeholder="César Díaz 1441, CABA" />
            </div>

            <!-- Organizador -->
            <div class="mb-3">
                <label class="form-label">Organizador</label>
                <input v-model="form.organizador" type="text" class="form-control"
                    placeholder="Juan - Hanagá - 1155443322" />
            </div>

            <!-- Estado Tnua -->
            <div class="mb-3">
                <label class="form-label">Estado Tnua</label>
                <select v-model="form.estado_tnua" class="form-select">
                    <option value="">Seleccione...</option>
                    <option>En revisión</option>
                    <option>Aprobado</option>
                    <option>Desarrollo</option>
                    <option>Cancelado</option>
                </select>
            </div>

            <!-- Sección BTJN -->
            <div class="row mt-4 bg-danger-subtle p-3 rounded" v-if="can(['ADM', 'BTJN'])">
                <div class="col-md-6 mb-3">
                    <label class="form-label">BTJN MFKD</label>
                    <select v-model="form.btjn_mfkd" class="form-select">
                        <option value="">Seleccione...</option>
                        <option v-for="btjn in btjnm" :key="btjn.id" :value="btjn.dni">
                            {{ btjn.name }} {{ btjn.lastname }}
                        </option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">BTJN Estado</label>
                    <select v-model="form.btjn_estado" class="form-select">
                        <option value="">Seleccione...</option>
                        <option>Revisión</option>
                        <option>Aprobado</option>
                        <option>Previa</option>
                        <option>Finalizado</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">BTJN Inicio</label>
                    <input v-model="form.btjn_inicio" type="datetime-local" class="form-control" />
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">BTJN Final</label>
                    <input v-model="form.btjn_final" type="datetime-local" class="form-control" />
                </div>
            </div>

            <!-- Slot para los botones -->
            <slot></slot>
        </form>

        <!-- Si NO tiene permiso, ve en modo lectura -->
        <div v-else>
            <h5>{{ form.nombre }}</h5>
            <p><b>Fecha:</b> {{ formatFecha(form.fecha_inicio) }} → {{ formatFecha(form.fecha_final) }}</p>
            <p><b>Lugar:</b> {{ form.lugar }}</p>
            <p><b>Keinim:</b> {{ form.keinimStr }}</p>
            <p><b>Organizador:</b> {{ form.organizador }}</p>
            <p><b>Cantidades:</b> Público {{ form.cant_pub }}, Staff {{ form.cant_staff }}, Total {{ form.cant_total }}
            </p>
            <p><b>Tipo:</b> {{ form.tipo }} | <b>Magnitud:</b> {{ form.magnitud }}</p>
            <p><b>Estado Tnua:</b> {{ form.estado_tnua }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useAuthRoles } from "@/services/useAuthRoles"
import { useSupabase } from "@/services/supabase"

const { can } = useAuthRoles()
const { supabase } = useSupabase()
const btjnm = ref([])
const formEl = ref(null)

function formatFecha(fecha) {
    if (!fecha) return ""
    return new Date(fecha).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
}

// Emitir evento submit solo si el form es válido
function handleSubmit() {
    const form = formEl.value
    if (form && form.checkValidity()) {
        form.classList.remove("was-validated")
        emit("submit")
    } else {
        form.classList.add("was-validated")
    }
}

// Cargar BJTN
onMounted(async () => {
    try {
        const { data, error } = await supabase
            .from("Bogrim")
            .select("*")
            .contains("roles", ['BTJ']) // si roles es array
        if (error) throw error
        btjnm.value = data
    } catch (err) {
        console.error("Error al cargar los datos de BTJN:", err.message)
    }
})

const emit = defineEmits(["submit"])

defineProps({
    form: {
        type: Object,
        required: true,
    },
})
</script>