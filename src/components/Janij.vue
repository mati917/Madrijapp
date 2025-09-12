<template>
    <div class="card-body">
        <h5 class="card-title">{{ janij.name }} {{ janij.lastname }}</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">{{ janij.kvutza }}</h6>
        <p class="card-text">{{ janij.janij_address }}</p>
        <a href="#" class="card-link">Whatsapp</a>
    </div>
</template>

<style scoped>
.card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
</style>

<script>

export default {
    name: "Janij",
    props: {
        janij: {
            type: Object,
            required: true
        }
    }
}
</script>