<template>
    <tr>
        <td class="d-flex gap-2 justify-content-center">
            <button class="btn btn-sm btn-outline-primary" @click="$emit('edit-kvutza', kvutza)">
                <i class="bi bi-pencil-square"></i>
            </button>

            <button class="btn btn-sm btn-outline-danger" @click="$emit('delete-kvutza', kvutza.id_kvutza)">
                <i class="bi bi-trash-fill"></i>
            </button>
        </td>
        <th scope="row">{{ kvutza.id_kvutza }}</th>
        <td>{{ kvutza.name }}</td>
        <td>{{ kvutza.shijva }}</td>
        <td>{{ kvutza.ken }}</td>
    </tr>
</template>

<script setup>
defineProps({ kvutza: Object })
defineEmits(["delete-kvutza", "edit-kvutza"])
</script>
