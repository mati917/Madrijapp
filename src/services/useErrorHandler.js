/* ===== CÓMO USAR ======
<script setup>
import { useErrorHandler } from "@/composables/useErrorHandler"

const { setError, clearError } = useErrorHandler()

async function guardar() {
  try {
    // código que puede fallar
    throw new Error("Fallo el guardado")
  } catch (e) {
    setError(e.message)
  }
}
</script>

<template>
  <button @click="guardar">Guardar</button>
</template>

*/

import { ref } from 'vue'

const errorMessage = ref('')

export function useErrorHandler() {
  function setError(msg) {
    errorMessage.value = msg
  }

  function clearError() {
    errorMessage.value = ''
  }

  return { errorMessage, setError, clearError }
}
