<template>
    <div class="container-md my-5">
        <h1 class="text-center mb-3">Registrarse</h1>
        <main class="row justify-content-center">
            <form @submit.prevent="handleSignUp"
                class="col-10 col-md-6 mb-3 bg-secondary-subtle p-4 rounded-3 shadow-sm needs-validation" novalidate>
                <div class="container">
                    <div class="mb-3 row">
                        <div class="col-12 col-md-6">
                            <label for="name">Nombre</label>
                            <input v-model="nombre" type="text" id="name" class="form-control"
                                :class="inputClass('nombre')" required />
                            <div v-if="errors.nombre" class="invalid-feedback">{{ errors.nombre }}</div>
                        </div>
                        <div class="col-12 col-md-6">
                            <label for="lastname">Apellido</label>
                            <input v-model="apellido" type="text" id="lastname" class="form-control"
                                :class="inputClass('apellido')" required />
                            <div v-if="errors.apellido" class="invalid-feedback">{{ errors.apellido }}</div>
                        </div>
                    </div>

                    <div class="mb-3 row">
                        <div class="col-12 col-md-6">
                            <label for="dni">DNI</label>
                            <input v-model="dni" type="number" id="dni" class="form-control" :class="inputClass('dni')"
                                required />
                            <div v-if="errors.dni" class="invalid-feedback">{{ errors.dni }}</div>
                        </div>
                        <div class="col-12 col-md-6">
                            <label for="kvutza">Kvutzá</label>
                            <select v-model="kvutza" class="form-select" id="kvutza" :class="inputClass('kvutza')"
                                required>
                                <option value="">Selecciona una opción</option>
                                <option value="Meiujad">Meiujad</option>
                                <option value="Atzumim">Atzumim</option>
                                <option value="Balagan">Balagán</option>
                                <option value="Jalutzim">Jalutzim</option>
                                <option value="Melajim">Melajim</option>
                            </select>
                            <div v-if="errors.kvutza" class="invalid-feedback">{{ errors.kvutza }}</div>
                        </div>
                    </div>

                    <div class="mb-3 row">
                        <div class="col-12 col-md-6">
                            <label for="phone">Celular</label>
                            <input v-model="celular" type="tel" id="phone" class="form-control" placeholder="1133332222"
                                :class="inputClass('celular')" required />
                            <div v-if="errors.celular" class="invalid-feedback">{{ errors.celular }}</div>
                        </div>
                        <div class="col-12 col-md-6">
                            <label for="birthdate">Fecha de nacimiento</label>
                            <input v-model="nacimiento" type="date" id="birthdate" class="form-control"
                                :class="inputClass('nacimiento')" required />
                            <div v-if="errors.nacimiento" class="invalid-feedback">{{ errors.nacimiento }}</div>
                        </div>
                    </div>

                    <div class="mb-3 row">
                        <div class="col-12">
                            <label for="email" class="form-label">Correo electrónico</label>
                            <input v-model="email" type="email" id="email" class="form-control"
                                :class="inputClass('email')" required />
                            <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                        </div>
                        <div class="col-12">
                            <label for="password" class="form-label">Contraseña</label>
                            <input v-model="password" type="password" id="password" class="form-control"
                                :class="inputClass('password')" required />
                            <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
                        </div>
                    </div>

                    <div class="row justify-content-center mt-4">
                        <button type="submit" class="btn btn-primary col-9">Registrarse</button>
                        <div v-if="errorMsg" class="alert alert-danger mt-3">{{ errorMsg }}</div>
                        <div v-if="successMsg" class="alert alert-success mt-3">{{ successMsg }}</div>
                    </div>
                </div>
            </form>
        </main>

        <div id="signup" class="row justify-content-center">
            <div class="col-10 col-md-6 p-4">
                <div class="container">
                    <hr class="row" />
                    <h3 class="text-center">¿Ya tienes una cuenta?</h3>
                    <div class="row justify-content-center">
                        <a role="button" href="/signin" class="btn btn-primary col-9">Iniciar sesión</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { signUp } from "../services/auth"
import { useRouter } from "vue-router"
const router = useRouter()

// Campos del formulario
const nombre = ref("")
const apellido = ref("")
const dni = ref("")
const kvutza = ref("")
const celular = ref("")
const nacimiento = ref("")
const email = ref("")
const password = ref("")

// Manejo de mensajes
const errorMsg = ref(null)
const successMsg = ref(null)

// Errores de validación
const errors = ref({})

// Función para clases de validación Bootstrap
const inputClass = (field) => {
    if (errors.value[field]) return 'is-invalid'
    if (errors.value._validated) return 'is-valid'
    return ''
}

// Validación de campos
const validateFields = () => {
    const newErrors = {}
    if (!nombre.value) newErrors.nombre = "El nombre es obligatorio."
    if (!apellido.value) newErrors.apellido = "El apellido es obligatorio."
    if (!dni.value || dni.value.length < 7) newErrors.dni = "DNI inválido."
    if (!kvutza.value) newErrors.kvutza = "Selecciona una kvutzá."
    if (!celular.value || !/^\d{10,}$/.test(celular.value)) newErrors.celular = "Celular inválido."
    if (!nacimiento.value) newErrors.nacimiento = "La fecha de nacimiento es obligatoria."
    if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) newErrors.email = "Correo inválido."
    if (!password.value || password.value.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres."
    newErrors._validated = true
    errors.value = newErrors
    return Object.keys(newErrors).length === 1 // solo _validated
}

// Formatear fecha a YYYY-MM-DD
function formateDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

const handleSignUp = async () => {
    errorMsg.value = null
    successMsg.value = null

    if (!validateFields()) {
        errorMsg.value = "❌ Corrige los errores antes de continuar."
        return
    }

    try {
        const user = await signUp({
            email: email.value,
            password: password.value,
            name: nombre.value,
            lastname: apellido.value,
            dni: dni.value,
            kvutza: kvutza.value,
            celular: celular.value,
            nacimiento: formateDate(nacimiento.value)
        })
        successMsg.value = "✅ Registro exitoso, revisa tu correo para confirmar la cuenta."
        console.log("Nuevo usuario:", user)
        // ✅ Redirigir al home
        router.push("/")
    } catch (err) {
        errorMsg.value = "❌ " + err.message
        console.error(err)
    }

}
</script>
