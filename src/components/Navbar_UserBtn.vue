<template>
    <button class="btn btn-outline-secondary mx-lg-2 my-2 my-lg-0" @click="handleClick">
        {{ isLoggedIn ? 'Ver perfil' : 'Iniciar sesión' }}
    </button>
</template>

<script setup>
import { ref } from 'vue'

// Simulación de estado de sesión (reemplaza con tu lógica real)
const isLoggedIn = ref(false)

function handleClick() {
    if (isLoggedIn.value) {
        // Redirige al perfil
        window.location.href = '/perfil'
    } else {
        // Redirige a login
        window.location.href = '/signin'
    }
}
</script>