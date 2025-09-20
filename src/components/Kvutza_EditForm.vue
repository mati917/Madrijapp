<template>
    <form ref="formRef" @submit.prevent="handleSubmit" :class="{ 'was-validated': validated }" novalidate
        class="p-5 border rounded bg-light container">
        <h4 class="mb-3">Editar Kvutzá</h4>

        <!-- ID Kvutza (solo lectura) -->
        <div class="mb-3">
            <label class="form-label">ID Kvutzá</label>
            <input type="text" class="form-control" :value="kvutza.id_kvutza" disabled />
        </div>

        <!-- Shijvá -->
        <div class="mb-3">
            <label class="form-label">Shijvá</label>
            <select class="form-select" id="shijva" v-model="form.shijva" required>
                <option value="Garinim Alef">Garinim Alef</option>
                <option value="Garinim Bet">Garinim Bet</option>
                <option value="Garinim Guimel">Garinim Guimel</option>
                <option value="Pre Gurim Alef">Pre Gurim Alef</option>
                <option value="Pre Gurim Bet">Pre Gurim Bet</option>
                <option value="Pre Gurim Guimel">Pre Gurim Guimel</option>
                <option value="Gurim Alef">Gurim Alef</option>
                <option value="Gurim Bet">Gurim Bet</option>
                <option value="Gurim Guimel">Gurim Guimel</option>
                <option value="Tzeirim Alef">Tzeirim Alef</option>
                <option value="Tzeirim Bet">Tzeirim Bet</option>
                <option value="Mitbagrim Alef">Mitbagrim Alef</option>
                <option value="Mitbagrim Bet">Mitbagrim Bet</option>
                <option value="Tzofim">Tzofim</option>
                <option value="Tzofim Bogrim">Tzofim Bogrim</option>
                <option value="Bogrim Alef">Bogrim Alef</option>
                <option value="Bogrim Bet">Bogrim Bet</option>
                <option value="Bogrim Olim">Bogrim Olim</option>
                <option value="Olim">Olim</option>
            </select>
            <div class="invalid-feedback">Este campo es obligatorio.</div>
        </div>

        <!-- Nombre -->
        <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input v-model="form.name" type="text" class="form-control" required />
            <div class="invalid-feedback">Este campo es obligatorio.</div>
        </div>

        <!-- Ken -->
        <div class="mb-3">
            <label class="form-label">Ken</label>
            <select class="form-select" id="ken" v-model="form.ken" required>
                <option value="Atid">Atid</option>
                <option value="Jana Szenes">Jana Szenes</option>
                <option value="Tzevet">Tzevet</option>
                <option value="Ex Bogrim">Ex Bogrim</option>
            </select>
            <div class="invalid-feedback">Este campo es obligatorio.</div>
        </div>

        <button type="submit" class="btn btn-primary col-12 mt-3">Guardar Cambios</button>

        <!-- Mensajes globales -->
        <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    </form>
</template>

<script>
import { ref } from "vue"
import { useSupabase } from "../services/supabase"
const { supabase } = useSupabase()

export default {
    props: {
        kvutza: Object
    },
    setup(props, { emit }) {
        const formRef = ref(null)
        const validated = ref(false)
        const form = ref({
            shijva: props.kvutza.shijva,
            name: props.kvutza.name,
            ken: props.kvutza.ken
        })
        const successMessage = ref("")
        const errorMessage = ref("")

        const handleSubmit = async () => {
            successMessage.value = ""
            errorMessage.value = ""
            validated.value = true

            if (!formRef.value.checkValidity()) return

            try {
                const { error } = await supabase
                    .from("Kvutzot")
                    .update(form.value)
                    .eq("id_kvutza", props.kvutza.id_kvutza)

                if (error) throw error

                successMessage.value = "✅ Kvutza actualizada correctamente."
                emit("updated") // para que el padre refresque la lista
            } catch (err) {
                console.error(err)
                errorMessage.value = "❌ Hubo un error al actualizar la Kvutza."
            }
        }

        return { formRef, validated, form, successMessage, errorMessage, handleSubmit }
    }
}
</script>
