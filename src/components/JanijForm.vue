<template>
    <div class="row">
        <form @submit.prevent="handleSubmit" class="p-4 border rounded bg-light container needs-validation" novalidate>
            <!-- DATOS DEL JANIJ -->
            <h4 class="mb-3">Datos del Janij</h4>
            <div class="row mb-3">
                <div class="col-md-6 col-sm-12">
                    <label class="form-label">Nombre</label>
                    <input type="text" v-model="form.name" class="form-control" required />
                    <div class="invalid-feedback">Debes llenar el campo</div>
                </div>
                <div class="col-md-6 col-sm-12">
                    <label class="form-label">Apellido</label>
                    <input type="text" v-model="form.lastname" class="form-control" required />
                    <div class="invalid-feedback">Debes llenar el campo</div>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6 col-sm-12">
                    <label class="form-label">Fecha de nacimiento</label>
                    <input type="date" v-model="form.birthdate" class="form-control" required />
                    <div class="invalid-feedback">Debes llenar el campo</div>
                </div>
                <div class="col-md-6 col-sm-12">
                    <label class="form-label">Kvutza</label>
                    <select v-model="form.kvutza" class="form-select" required>
                        <option disabled value="">Seleccione una kvutza</option>
                        <option v-for="kv in kvutzot" :key="kv.id_kvutza" :value="kv.id_kvutza">
                            {{ kv.name }}
                        </option>
                    </select>
                    <div class="invalid-feedback">Debes llenar el campo</div>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6 col-sm-12">
                    <label class="form-label">Teléfono del janij</label>
                    <input type="text" v-model="form.janij_cellphone" class="form-control" />
                </div>
                <div class="col-md-6 col-sm-12">
                    <label class="form-label">Dirección</label>
                    <input type="text" v-model="form.janij_address" class="form-control" required />
                    <div class="invalid-feedback">Debes llenar el campo</div>
                </div>
                <div class="col-12">
                    <label class="form-label" for="form-dni">DNI</label>
                    <input type="number" id="form-dni" v-model="form.dni" class="form-control">
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-md-6 col-sm-12">
                    <label class="form-label">Foto del Janij</label>
                    <input type="file" @change="handlePicChange" class="form-control" />
                </div>
                <div class="col-md-6 col-sm-12">
                    <label class="form-label" for="janijtype">Tipo de janij</label>
                    <select name="janijtype" id="janijtype" v-model="form.type_janij" class="form-select">
                        <option disabled value="">Seleccione un tipo</option>
                        <option value="Fijo">Fijo</option>
                        <option value="Rotativo">Rotativo</option>
                        <option value="Esporádico">Esporádico</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
            </div>

            <h4 class="mb-3">Datos de los tutores</h4>
            <div class="row mb-3">
                <div class="col-md-6 col-sm-12">
                    <label class="form-label">Nombre tutor 1</label>
                    <input type="text" v-model="form.parent_name" class="form-control" required />
                    <div class="invalid-feedback">Debes llenar el campo</div>
                </div>
                <div class="col-md-6 col-sm-12">
                    <label class="form-label">Teléfono tutor 1</label>
                    <input type="text" v-model="form.parent_cellphone" class="form-control" required />
                    <div class="invalid-feedback">Debes llenar el campo</div>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6 col-sm-12">
                    <label class="form-label">Nombre tutor 2</label>
                    <input type="text" v-model="form.parent2_name" class="form-control" />
                </div>
                <div class="col-md-6 col-sm-12">
                    <label class="form-label">Teléfono tutor 2</label>
                    <input type="text" v-model="form.parent2_cellphone" class="form-control" />
                </div>
            </div>

            <button type="submit" class="btn btn-primary col-12 mt-4">Subir</button>
        </form>
    </div>
</template>

<script>
import { useSupabase } from "../services/supabase";
const { supabase } = useSupabase();

export default {
    name: "JanijForm",
    data() {
        return {
            form: {
                name: "",
                lastname: "",
                birthdate: "",
                dni: "",
                kvutza: "",
                janij_cellphone: "",
                janij_address: "",
                type_janij: "",
                parent_name: "",
                parent_cellphone: "",
                parent2_name: "",
                parent2_cellphone: "",
            },
            picFile: null,
            kvutzot: [],
        };
    },
    async mounted() {
        // Traer kvutzot desde Supabase, excluyendo Tzevet
        const { data, error } = await supabase
            .from("Kvutzot")
            .select("id_kvutza, name")
            .neq("ken", "Tzevet")
            .order("id_kvutza");
        if (!error) this.kvutzot = data;
    },
    methods: {
        handlePicChange(e) {
            this.picFile = e.target.files[0];
        },
        async handleSubmit() {
            const formEl = this.$el.querySelector('form');

            // Validación Bootstrap
            if (!formEl.checkValidity()) {
                formEl.classList.add('was-validated');
                return; // No seguimos si el formulario es inválido
            }

            try {
                // Tu código de inserción/subida de foto
                const { data: insertData, error: insertError } = await supabase
                    .from("Janijim")
                    .insert([{ ...this.form }])
                    .select();

                if (insertError) throw insertError;

                const janijId = insertData[0].id;
                let picUrl = null;
                let picName = null;

                if (this.picFile) {
                    const ext = this.picFile.name.split('.').pop();
                    picName = `${janijId}-janijim.${ext}`;

                    const { error: uploadError } = await supabase.storage
                        .from("JanijimPic")
                        .upload(picName, this.picFile, { upsert: true });

                    if (uploadError) throw uploadError;

                    picUrl = supabase.storage.from("JanijimPic").getPublicUrl(picName).data.publicUrl;

                    const { error: updateError } = await supabase
                        .from("Janijim")
                        .update({ pic: picUrl, pic_name: picName })
                        .eq("id", janijId);
                    if (updateError) throw updateError;
                }

                alert("Janij agregado correctamente");
                window.location.reload();

            } catch (err) {
                console.error(err);
                alert("Error al guardar el Janij");
            }
        }
    },
};
</script>
