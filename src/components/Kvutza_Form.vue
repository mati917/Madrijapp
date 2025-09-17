<template>
    <form @submit.prevent="handleSubmit" class="p-4 border rounded bg-light container" novalidate>
        <h4 class="mb-3">Datos de la Kvutza</h4>

        <!-- ID Kvutza -->
        <div class="input-group mb-3">
            <span class="input-group-text">#KV_</span>
            <input type="text" class="form-control" placeholder="2023" v-model="idKvutzaNumber"
                :class="{ 'is-invalid': idError }" maxlength="4" inputmode="numeric"
                @input="idError = false; errorMessage = ''" required />
            <select class="form-select" v-model="idKvutzaDif">
                <option value="">Variante (opcional)</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
            </select>
            <div class="invalid-feedback">
                Debe ingresar un número de 4 dígitos.
            </div>
        </div>

        <!-- Shijvá -->
        <div class="mb-3">
            <label for="shijva" class="form-label">Shijvá</label>
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
            <label for="name" class="form-label">Nombre</label>
            <input id="name" v-model="form.name" type="text" class="form-control" required />
            <div class="invalid-feedback">Este campo es obligatorio.</div>
        </div>

        <!-- Ken -->
        <div class="mb-3">
            <label for="ken" class="form-label">Ken</label>
            <select class="form-select" id="ken" v-model="form.ken" required>
                <option value="Atid">Atid</option>
                <option value="Jana Szenes">Jana Szenes</option>
                <option value="Tzevet">Tzevet</option>
            </select>
            <div class="invalid-feedback">Este campo es obligatorio.</div>
        </div>

        <button type="submit" class="btn btn-primary col-12 mt-3">Añadir Kvutza</button>

        <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    </form>
</template>

<script>
import { ref } from "vue"
import { useSupabase } from "../services/supabase"
const { supabase } = useSupabase()

export default {
    name: "KvutzaForm",
    setup() {
        const form = ref({ id_kvutza: "", shijva: "", name: "", ken: "" })
        const idKvutzaNumber = ref("")
        const idKvutzaDif = ref("")
        const idError = ref(false)
        const successMessage = ref("")
        const errorMessage = ref("")

        const handleSubmit = async () => {
            successMessage.value = ""
            errorMessage.value = ""

            // Validar ID
            if (!/^\d{4}$/.test(idKvutzaNumber.value)) {
                idError.value = true
                errorMessage.value = "❌ El número de Kvutza debe tener exactamente 4 dígitos numéricos."
                return
            }

            if (!form.value.shijva || !form.value.name || !form.value.ken) {
                errorMessage.value = "❌ Completa todos los campos obligatorios."
                return
            }

            // Construir id_kvutza final
            form.value.id_kvutza = `#KV_${idKvutzaNumber.value}${idKvutzaDif.value ? "-" + idKvutzaDif.value : ""}`

            try {
                const { data, error } = await supabase.from("Kvutzot").insert([form.value]).select("id_kvutza")
                if (error) throw error
                successMessage.value = `✅ Kvutza añadida con ID: ${data[0].id_kvutza}`

                // Reset
                form.value = { id_kvutza: "", shijva: "", name: "", ken: "" }
                idKvutzaNumber.value = ""
                idKvutzaDif.value = ""
                idError.value = false
                window.location.reload();
            } catch (err) {
                console.error(err)
                errorMessage.value = "❌ Hubo un error al agregar la Kvutza."
            }
        }

        return { form, idKvutzaNumber, idKvutzaDif, idError, successMessage, errorMessage, handleSubmit }
    },
}
</script>
