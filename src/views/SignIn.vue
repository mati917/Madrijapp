<template>
    <div class="container-md my-5">
        <h1 class="text-center mb-3">Iniciar sesión</h1>
        <main class="row justify-content-center">
            <form @submit.prevent="handleLogin"
                class="col-10 col-md-6 mb-3 bg-secondary-subtle p-4 rounded-3 shadow-sm">
                <div class="container">
                    <div class="mb-3 row">
                        <label for="email" class="form-label">Correo electrónico</label>
                        <input v-model="email" type="email" class="form-control" id="email" aria-describedby="emailHelp"
                            required>
                    </div>
                    <div class="mb-3 row">
                        <label for="password" class="form-label">Contraseña</label>
                        <input v-model="password" type="password" class="form-control" id="password" required>
                    </div>
                    <div class="row justify-content-center mt-4">
                        <button type="submit" class="btn btn-primary col-9" :disabled="loading">
                            {{ loading ? "Ingresando..." : "Iniciar sesión" }}
                        </button>
                    </div>
                    <p v-if="errorMessage" class="text-danger text-center mt-3">{{ errorMessage }}</p>
                </div>
            </form>
        </main>

        <div id="signup" class="row justify-content-center">
            <div class="col-10 col-md-6 p-4">
                <div class="container">
                    <hr class="row" />
                    <h3 class="text-center">¿No tienes una cuenta?</h3>
                    <div class="row justify-content-center">
                        <a role="button" href="/signup" class="btn btn-primary col-9">Registrarse</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSupabase } from "../services/supabase"
import { ref } from "vue"
import { useRouter } from "vue-router"

const { supabase } = useSupabase()
const router = useRouter()

// refs para formulario
const email = ref("")
const password = ref("")
const loading = ref(false)
const errorMessage = ref("")

async function handleLogin() {
    loading.value = true
    errorMessage.value = ""

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    })

    if (error) {
        errorMessage.value = error.message
        loading.value = false
        return
    }

    // guardamos sesión en localStorage (supabase ya lo hace, pero lo forzamos)
    localStorage.setItem("sb-auth", JSON.stringify(data))

    // redirigir al home
    router.push("/")
}
</script>
