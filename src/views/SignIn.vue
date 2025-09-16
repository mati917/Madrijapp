<template>
    <div class="container-md my-5">
        <h1 class="text-center mb-3">Iniciar sesión</h1>
        <main class="row justify-content-center">
            <form action="" method="post" class="col-10 col-md-6 mb-3 bg-secondary-subtle p-4 rounded-3 shadow-sm">
                <div class="container">
                    <div class="mb-3 row">
                        <label for="email" class="form-label">Correo electrónico</label>
                        <input type="email" class="form-control" id="email" aria-describedby="emailHelp">
                    </div>
                    <div class="mb-3 row">
                        <label for="password" class="form-label">Contraseña</label>
                        <input type="password" class="form-control" id="password">
                    </div>
                    <div class="row justify-content-center mt-4">
                        <button type="submit" class="btn btn-primary col-9">Iniciar sesión</button>
                    </div>
                </div>
            </form>
        </main>
        <div id="signup" class="row justify-content-center">
            <div class="col-10 col-md-6 p-4">
                <div class="container">
                    <hr class="row">
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
import { useSupabase } from "../composables/supabase"
const { supabase } = useSupabase();
import { ref } from "vue"


</script>