<template>
    <div class="container-md my-4">
        <Titulo titulo="Eventos">
            <button v-if="isLoggedIn && (can(['ADM', 'HNG', 'MZK', 'BTJ']))" type="button"
                class="btn btn-outline-primary col-2" @click="openAddForm">
                Añadir
            </button>
        </Titulo>

        <!-- Error -->
        <div v-if="errorMessage" class="alert alert-danger row">{{ errorMessage }}</div>

        <!-- Próximos -->
        <main class="row">
            <Subtitulo titulo="Próximos eventos🔥"></Subtitulo>
            <div v-if="eventos_prox.length === 0" class="col-12">
                <p class="text-center">No hay eventos próximos.</p>
            </div>
            <div v-else class="row">
                <div v-for="evento in eventos_prox" :key="evento.id" @click="openEditForm(evento)"
                    class="col-12 col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm hover-effect"
                        :class="event_urgency(evento.fecha_inicio, evento.fecha_final)">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">{{ evento.nombre }}</h5>
                            <span class="badge badge-custom" :class="badge(evento.tipo)">{{ evento.tipo }}</span>

                            <p class="card-text mb-1">
                                <strong><i class="bi bi-calendar2-event-fill"></i> Inicio:</strong>
                                {{ formatFecha(evento.fecha_inicio) }}
                            </p>
                            <p class="card-text mb-1">
                                <strong><i class="bi bi-calendar2-event-fill"></i> Final:</strong>
                                {{ formatFecha(evento.fecha_final) }}
                            </p>
                            <p class="card-text mb-1">
                                <strong><i class="bi bi-geo-alt-fill"></i> Lugar:</strong> {{ evento.lugar }}
                            </p>
                            <p class="card-text mb-1">
                                <strong><i class="bi bi-house-fill"></i> Keinim:</strong> {{ evento.keinim.join(', ') ||
                                    '' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Históricos -->
        <aside class="row mt-5">
            <Subtitulo titulo="Eventos históricos" class="p-1">
                <button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                    data-bs-target="#eventos-historicos" aria-expanded="false" aria-controls="collapseExample">
                    Ver <i class="bi bi-eye-fill"></i>
                </button>
            </Subtitulo>
            <div v-if="eventos_historicos.length === 0" class="col-12">
                <p class="text-center">No hay eventos históricos.</p>
            </div>
            <div v-else class="row collapse" id="eventos-historicos">
                <div v-for="evento in eventos_historicos" :key="evento.id" @click="openEditForm(evento)"
                    class="col-12 col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm hover-effect bg-light"
                        :class="event_urgency(evento.fecha_inicio, evento.fecha_final)">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">{{ evento.nombre }}</h5>
                            <span class="badge badge-custom" :class="badge(evento.tipo)">{{ evento.tipo }}</span>

                            <p class="card-text mb-1">
                                <strong><i class="bi bi-calendar2-event-fill"></i> Inicio:</strong>
                                {{ formatFecha(evento.fecha_inicio) }}
                            </p>
                            <p class="card-text mb-1">
                                <strong><i class="bi bi-calendar2-event-fill"></i> Final:</strong>
                                {{ formatFecha(evento.fecha_final) }}
                            </p>
                            <p class="card-text mb-1">
                                <strong><i class="bi bi-geo-alt-fill"></i> Lugar:</strong> {{ evento.lugar }}
                            </p>
                            <p class="card-text mb-1">
                                <strong><i class="bi bi-house-fill"></i> Keinim:</strong> {{ evento.keinim.join(', ') ||
                                    '' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- MODAL AÑADIR -->
        <Modal v-model="modal_addEvent">
            <div class="container p-4">
                <h4>Añadir evento</h4>
                <Eventos_Form :form="form" @submit="addEvento">
                    <div class="row mt-3">
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary w-100">
                                Añadir evento
                            </button>
                        </div>
                    </div>
                </Eventos_Form>
            </div>
        </Modal>

        <!-- MODAL EDITAR -->
        <Modal v-model="modal_editEvent">
            <div class="container p-4">
                <h4>Editar evento</h4>
                <Eventos_Form :form="form">
                    <div class="row mt-3" v-if="can(['ADM', 'HNG', 'MZK', 'BTJ'])">
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary w-100" @click="updateEvento">Guardar
                                cambios</button>
                        </div>
                        <div class="col-12 mt-2">
                            <button type="button" class="btn btn-danger w-100" @click="deleteEvento">Eliminar
                                evento</button>
                        </div>
                    </div>
                </Eventos_Form>
            </div>
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useSupabase } from '@/services/supabase';
import { checkAuth } from "@/services/useAuthCheck"
import { useAuthRoles } from "@/services/useAuthRoles"
import Titulo from "@/components/Titulo.vue";
import Subtitulo from "@/components/Subtitulo.vue";
import Modal from "@/components/Modal.vue";
import Eventos_Form from "@/components/Eventos_Form.vue";

const errorMessage = ref("")
const isLoggedIn = ref(false)
const { supabase } = useSupabase()
const { roles, loadUserRoles, can } = useAuthRoles()


const modal_editEvent = ref(false)
const modal_addEvent = ref(false)

const eventos = ref([])
const selectedEvento = ref(null)

// 🔹 Todos los campos que maneja la tabla + keinimStr (auxiliar)
const form = ref({
    nombre: "",
    lugar: "",
    fecha_inicio: "",
    fecha_final: "",
    fecha_inicio_staff: "",
    fecha_final_staff: "",
    keinimStr: "",
    cant_pub: null,
    cant_staff: null,
    cant_total: null,
    tipo: "",
    magnitud: "",
    organizador: "",
    estado_tnua: "",
    btjn_mfkd: null,
    btjn_estado: "",
    btjn_inicio: "",
    btjn_final: ""
})

const eventos_prox = computed(() => {
    const hoy = new Date()
    const semanaAtras = new Date(hoy)
    semanaAtras.setDate(hoy.getDate() - 7)
    const dosMesesAdelante = new Date(hoy)
    dosMesesAdelante.setMonth(hoy.getMonth() + 2)

    return eventos.value.filter(e => {
        const inicio = new Date(e.fecha_inicio)
        return inicio >= semanaAtras && inicio <= dosMesesAdelante
    })
})

const eventos_historicos = computed(() => {
    const hoy = new Date()
    const semanaAtras = new Date(hoy)
    semanaAtras.setDate(hoy.getDate() - 7)

    return eventos.value.filter(e => new Date(e.fecha_inicio) < semanaAtras)
})

onMounted(async () => {
    const loggedIn = await checkAuth()
    isLoggedIn.value = loggedIn
    if (!loggedIn) {
        errorMessage.value = "⚠️ Debes iniciar sesión para ver esta página."
        return
    }
    await loadUserRoles()
    await fetchEventos()

})

async function fetchEventos() {
    try {
        const { data, error } = await supabase.from("Eventos").select("*").order("fecha_inicio")
        if (error) throw error
        eventos.value = data
    } catch (err) {
        console.error(err)
        errorMessage.value = "⚠️ Error al cargar los eventos."
    }
}

function openAddForm() {
    resetForm()
    modal_addEvent.value = true
}

function openEditForm(evento) {
    selectedEvento.value = evento
    form.value = {
        ...evento,
        keinimStr: (evento.keinim || []).join(", ")
    }
    modal_editEvent.value = true
}

function resetForm() {
    form.value = {
        nombre: "",
        lugar: "",
        fecha_inicio: "",
        fecha_final: "",
        fecha_inicio_staff: "",
        fecha_final_staff: "",
        keinimStr: "",
        cant_pub: null,
        cant_staff: null,
        cant_total: null,
        tipo: "",
        magnitud: "",
        organizador: "",
        estado_tnua: "",
        btjn_mfkd: null,
        btjn_estado: "",
        btjn_inicio: "",
        btjn_final: ""
    }
}

async function addEvento() {
    try {
        const { keinimStr, ...rest } = form.value
        const nuevo = {
            ...rest,
            keinim: keinimStr.split(",").map(k => k.trim()).filter(Boolean)
        }

        const { error } = await supabase.from("Eventos").insert([nuevo])
        if (error) throw error
        await fetchEventos()
        modal_addEvent.value = false
    } catch (err) {
        console.error(err)
        errorMessage.value = "⚠️ Error al añadir evento."
    }
}

async function updateEvento() {
    try {
        const { keinimStr, ...rest } = form.value
        const actualizado = {
            ...rest,
            keinim: keinimStr.split(",").map(k => k.trim()).filter(Boolean)
        }

        const { error } = await supabase
            .from("Eventos")
            .update(actualizado)
            .eq("id", selectedEvento.value.id)

        if (error) throw error
        await fetchEventos()
        modal_editEvent.value = false
    } catch (err) {
        console.error(err)
        errorMessage.value = "⚠️ Error al actualizar evento."
    }
}
async function deleteEvento() {
    try {
        const { error } = await supabase.from("Eventos").delete().eq("id", selectedEvento.value.id)
        if (error) throw error
        await fetchEventos()
        modal_editEvent.value = false
    } catch (err) {
        console.error(err)
        errorMessage.value = "⚠️ Error al eliminar evento."
    }
}

function formatFecha(fecha) {
    return new Date(fecha).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
}


/* CSS Dinámico */

function event_urgency(inicio) {
    // 1. Normalizar 'hoy' y 'inicio' a la medianoche (00:00:00) para un cálculo de días preciso.
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Establece la hora a 00:00:00

    const f_inicio = new Date(inicio);
    if (isNaN(f_inicio)) {
        // Manejar caso de fecha inválida.
        console.error('Fecha de inicio inválida:', inicio);
        return 'bg-secondary';
    }
    f_inicio.setHours(0, 0, 0, 0); // Establece la hora de inicio a 00:00:00

    // 2. Calcular la diferencia en días.
    const oneDay = 1000 * 60 * 60 * 24; // Milisegundos en un día
    // Diferencia redondeada para obtener días completos (floor para contar días completos restantes)
    const diff_dias = Math.floor((f_inicio.getTime() - hoy.getTime()) / oneDay);

    // 3. Aplicar la lógica según los requisitos
    // NOTA: El requisito "Si el evento está entre 3 días a hoy" incluye 0, 1, 2, 3 días restantes.
    // El requisito "Si el evento ya pasó" significa diff_dias < 0.

    if (diff_dias < 0) {
        // Si la fecha de inicio es anterior a hoy (diff < 0)
        return 'border border-danger-subtle'; // 🔴 Si el evento ya pasó
    } else if (diff_dias >= 0 && diff_dias <= 3) {
        // Si el evento está entre hoy (0) y los próximos 3 días (1, 2, 3)
        return 'border border-warning-subtle'; // ⚠️ Si el evento está entre 3 días a hoy
    } else if (diff_dias > 3 && diff_dias <= 7) {
        // Si el evento está a 4, 5, 6, o 7 días de distancia
        return 'border border-success-subtle'; // ✅ Si el evento está entre 3 días a 1 semana (4 a 7 días)
    } else if (diff_dias > 7) {
        // Si el evento está a más de 7 días (8+)
        return 'border border-primary-subtle'; // 🟦 Si el evento está a más de 1 semana
    } else {
        // Fallback para cualquier otro caso (aunque la lógica anterior debería cubrir todo con diff_dias)
        return 'border border-secondary'; // Por default
    }
}

function badge(tipo) {
    switch (tipo) {
        case "Común": return 'badge-evento-comun'
        case "Especial": return "badge-evento-especial"
        case "No formal": return 'badge-evento-no-formal'
        case "Informal": return 'badge-evento-informal'
        case "Campamento": return 'badge-campamento'
        case "Traslado": return 'badge-traslado'
        case "Alquiler": return 'badge-alquiler'
        case "Nigdal": return 'badge-comunidad'
        default: return 'badge-secondary'
    }
}
</script>


<style scoped>
/* Clase base para aplicar la estilización personalizada */
.badge-custom {
    /* Ajustes visuales generales */
    padding: 0.35em 0.6em;
    /* Ajusta el padding para un mejor aspecto */
    font-weight: 600;
    /* Hace que el texto sea un poco más fuerte */
    border-width: 2px;
    /* Establece el grosor del borde */
    border-style: solid;
    /* Asegura que el borde sea sólido */
    color: #333;
    /* Color de texto oscuro por defecto */
    background-color: transparent !important;
    /* Asegura que el fondo sea transparente por defecto */
}

/* 1. Evento común (Verde/Azul sutil - para algo estándar y positivo) */
.badge-evento-comun {
    --color-base: #17a2b8;
    /* Teal/Cian */
    background-color: rgba(23, 162, 184, 0.1) !important;
    /* Fondo muy claro (10% opacidad) */
    border-color: var(--color-base);
    /* Borde fuerte */
    color: var(--color-base);
    /* Color de texto que coincida con el borde */
}

/* 2. Evento especial (Dorado/Naranja - para algo destacado) */
.badge-evento-especial {
    --color-base: #ffc107;
    /* Dorado/Amarillo */
    background-color: rgba(255, 193, 7, 0.15) !important;
    /* Fondo ligeramente más visible */
    border-color: var(--color-base);
    color: #856404;
    /* Color de texto más oscuro para legibilidad sobre el fondo claro */
}

/* 3. Evento no formal (Púrpura - para algo diferente) */
.badge-evento-no-formal {
    --color-base: #6f42c1;
    /* Púrpura */
    background-color: rgba(111, 66, 193, 0.1) !important;
    border-color: var(--color-base);
    color: var(--color-base);
}

/* 4. Evento informal (Verde lima - para algo casual) */
.badge-evento-informal {
    --color-base: #28a745;
    /* Verde */
    background-color: rgba(40, 167, 69, 0.1) !important;
    border-color: var(--color-base);
    color: var(--color-base);
}

/* 5. Campamento (Marrón/Tierra - para naturaleza/aire libre) */
.badge-campamento {
    --color-base: #6c757d;
    /* Gris cálido */
    background-color: rgba(108, 117, 125, 0.1) !important;
    border-color: var(--color-base);
    color: var(--color-base);
}

/* 6. Traslado (Azul oscuro - para movimiento/logística) */
.badge-traslado {
    --color-base: #007bff;
    /* Azul primario */
    background-color: rgba(0, 123, 255, 0.1) !important;
    border-color: var(--color-base);
    color: var(--color-base);
}

/* 7. Alquiler (Rojo/Rosa oscuro - para transacción/disponibilidad) */
.badge-alquiler {
    --color-base: #dc3545;
    /* Rojo */
    background-color: rgba(220, 53, 69, 0.1) !important;
    border-color: var(--color-base);
    color: var(--color-base);
}

/* 8. Comunidad (Rosa - para enfoque en grupo/social) */
.badge-comunidad {
    --color-base: #e83e8c;
    /* Rosa fuerte */
    background-color: rgba(232, 62, 140, 0.1) !important;
    border-color: var(--color-base);
    color: var(--color-base);
}
</style>