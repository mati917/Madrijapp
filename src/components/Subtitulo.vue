<template>
    <h2 class="mb-4 text-primary my-3 border-bottom border-primary">{{ titulo }}</h2>
</template>

<script setup>
defineProps({
    titulo: {
        type: String,
        default: 'Título'
    }
})
</script>