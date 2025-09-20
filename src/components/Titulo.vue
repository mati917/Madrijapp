<template>
    <div id="headering" class="bg-primary bg-opacity-25 text-primary p-3 my-4 rounded row justify-content-between">
        <h1 class="col">{{ titulo }}</h1>
        <slot></slot>
    </div>
</template>

<script setup>
defineProps({
    titulo: {
        type: String,
        default: 'Título'
    }
})
</script>