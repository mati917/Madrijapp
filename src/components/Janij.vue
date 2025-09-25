<template>
    <div class="row g-0">
        <div class="col col-md-4 col-3">
            <img :src="picUrl" :alt="janij.name" class="picjanij align-self-center border rounded-start" />
        </div>
        <div class="col align-self-center">
            <div class="card-body d-flex flex-column">
                <h6 class="card-title">{{ janij.name }} {{ janij.lastname }}</h6>
                <p class="card-subtitle mb-2 text-body-secondary">{{ kvutzaName }}</p>
                <div class="mt-auto d-flex justify-content-start">

                    <div :class="badgeClass" class="badge mt-auto">{{ janij.type_janij }}</div>

                </div>
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
            required: true
        },
        kvutzot: {
            type: Array,
            required: true
        }
    },
    computed: {
        kvutzaName() {
            const kv = this.kvutzot.find(k => k.id_kvutza === this.janij.kvutza);
            return kv ? kv.name : this.janij.kvutza;
        },
        picUrl() {
            // Si no existe janij.pic o está vacío, usar el avatar por defecto
            return this.janij.pic && this.janij.pic !== ""
                ? this.janij.pic
                : "https://37assets.37signals.com/svn/765-default-avatar.png"; // archivo dentro de /public
        },
        badgeClass() {
            // Mapeamos los tipos a clases de Bootstrap con bg-light + border oscuro
            const map = {
                "Fijo": "bg-success-subtle text-success border border-success",
                "Rotativo": "bg-primary-subtle text-primary border border-primary",
                "Esporádico": "bg-warning-subtle text-warning border border-warning",
                "Inactivo": "bg-danger-subtle text-danger border border-danger"
            }
            return map[this.janij.type_janij] || "bg-secondary text-secondary border border-secondary"
        }
    }
}
</script>

<style scoped>
.picjanij {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

.row>.col {
    height: 100%;
}

.row>.col-md-4 {
    height: 100%;
}

.card {
    width: 80%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.2s;
}

.card>.row {
    height: 100%;
}

.card-body {
    height: 100%;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
</style>
