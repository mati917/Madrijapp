<template>
    <div class="row">
        <form @submit.prevent="handleSubmit" class="p-4 border rounded bg-light container">
            <!-- DATOS DEL JANIJ -->
            <h4 class="mb-3">Datos del Janij</h4>
            <div class="row mb-3">
                <div class="col-md-6 col-sm-12">
                    <label for="name" class="form-label">Nombre</label>
                    <input type="text" id="name" v-model="form.name" class="form-control" required />
                </div>
                <div class="col-md-6 col-sm-12">
                    <label for="lastname" class="form-label">Apellido</label>
                    <input type="text" id="lastname" v-model="form.lastname" class="form-control" required />
                </div>
            </div>
            <div class="mb-3 row">
                <div class="col-md-6 col-sm-12">
                    <label for="birthdate" class="form-label">Fecha de nacimiento</label>
                    <input type="date" id="birthdate" v-model="form.birthdate" class="form-control" required />
                </div>
                <div class="col-md-6 col-sm-12">
                    <label for="kvutza" class="form-label">Kvutza</label>
                    <select id="kvutza" v-model="form.kvutza" class="form-select" required>
                        <option value="Shigaón">Shigaón</option>
                        <option value="Kosmim">Kosmim</option>
                        <option value="Metukim">Metukim</option>
                        <option value="Guiborim">Guiborim</option>
                        <option value="Nedarim">Nedarim</option>
                        <option value="Jajamim">Jajamim</option>
                        <option value="Amitzim">Amitzim</option>
                        <option value="Alufim">Alufim</option>
                    </select>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6 col-sm-12">
                    <label for="janij_cellphone" class="form-label">Teléfono del janij</label>
                    <input type="text" id="janij_cellphone" v-model="form.janij_cellphone" class="form-control" />
                </div>
                <div class="col-md-6 col-sm-12">
                    <label for="janij_address" class="form-label">Dirección</label>
                    <input type="text" id="janij_address" v-model="form.janij_address" class="form-control" required />
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-12">
                    <label for="pic">Foto del Janij</label>
                    <input type="file" id="pic" @change="handlePicChange" class="form-control" />
                </div>
            </div>

            <!-- DATOS DE LOS PADRES -->
            <h4 class="mb-3">Datos de los tutores</h4>
            <div class="mb-3 row">
                <div class="col-md-6 col-sm-12">
                    <label for="parent_name" class="form-label">Nombre tutor 1</label>
                    <input type="text" id="parent_name" v-model="form.parent_name" class="form-control" />
                </div>
                <div class="col-md-6 col-sm-12">
                    <label for="parent_cellphone" class="form-label">Teléfono tutor 1</label>
                    <input type="text" id="parent_cellphone" v-model="form.parent_cellphone" class="form-control" />
                </div>
            </div>
            <div class="mb-3 row">
                <div class="col-md-6 col-sm-12">
                    <label for="parent2_name" class="form-label">Nombre tutor 2</label>
                    <input type="text" id="parent2_name" v-model="form.parent2_name" class="form-control" />
                </div>
                <div class="col-md-6 col-sm-12">
                    <label for="parent2_cellphone" class="form-label">Teléfono tutor 2</label>
                    <input type="text" id="parent2_cellphone" v-model="form.parent2_cellphone" class="form-control" />

                </div>
            </div>
            <button type="submit" class="btn btn-primary col-12 mt-4">Subir</button>
        </form>
    </div>
</template>

<script>
import { useSupabase } from "../composables/supabase"
const { supabase } = useSupabase();

export default {
    name: "JanijForm",
    data() {
        return {
            form: {
                name: "",
                lastname: "",
                birthdate: "",
                kvutza: "",
                janij_cellphone: "",
                janij_address: "",
                parent_name: "",
                parent_cellphone: "",
                parent2_name: "",
                parent2_cellphone: "",
            },
            picFile: null,
        };
    },
    methods: {
        async handleSubmit() {
            try {
                let picUrl = null;

                // 1. Subir foto
                if (this.picFile) {
                    const { data, error } = await supabase.storage
                        .from("JanijimPic")
                        .upload(`${Date.now()}-janijim`, this.picFile, {
                            cacheControl: "3600",
                            upsert: false,
                        });

                    if (error) throw error;

                    const { data: publicData } = supabase.storage
                        .from("JanijimPic")
                        .getPublicUrl(data.path);

                    picUrl = publicData.publicUrl;
                }

                // 2. Insertar en tabla
                const { data, error } = await supabase
                    .from("Janijim")
                    .insert([{ ...this.form, pic: picUrl }])
                    .select("id");

                if (error) throw error;

                alert(`Registro guardado con id: ${data[0].id}`);

                // 3. Reset
                this.form = {
                    name: "",
                    lastname: "",
                    birthdate: "",
                    kvutza: "",
                    janij_cellphone: "",
                    janij_address: "",
                    parent_name: "",
                    parent_cellphone: "",
                    parent2_name: "",
                    parent2_cellphone: "",
                };
                this.picFile = null;
                document.getElementById("pic").value = "";
            } catch (error) {
                console.error(error);
                alert("Hubo un error al guardar el registro");
            }
        },

        handlePicChange(e) {
            this.picFile = e.target.files[0];
        }
    },
};
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí si lo deseas */
</style>