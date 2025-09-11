<template>
  <h1>Hola</h1>
  <h2>{{ contador }}</h2>
  <button @click="contador++">+</button>
  <button @click="contador--">-</button>
</template>

<script setup>
import { ref } from 'vue'
const contador = ref(0);
</script>

<style scoped></style>
