<template>
    <div class="col-md-3 mb-3">
        <div class="card shadow-sm h-100">
            <div class="card-body">
                <h5 class="card-title">{{ janij.name }} {{ janij.lastname }}</h5>
                <!--<p class="card-text">
                    Fecha de nacimiento: {{ formatDate(janij.birthdate) }}
                </p>
                <button class="btn btn-primary w-100" @click="$emit('verDetalles', janij)">
                    Ver detalles
                </button>-->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Janij",
    props: {
        janij: {
            type: Object,
            required: true,
        },
    },
    methods: {
        formatDate(date) {
            if (!date) return "Sin fecha";
            const d = new Date(date);
            return d.toLocaleDateString("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        },
    },
};
</script>
