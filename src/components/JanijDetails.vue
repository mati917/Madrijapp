<template>
    <form ref="formEl" v-if="editable" @submit.prevent="guardarCambios"
        class="border rounded bg-light container p-4 needs-validation" novalidate>

        <!-- DATOS DEL JANIJ -->
        <h4 class="mb-3">Datos del Janij</h4>
        <div class="row mb-3">
            <div class="col-md-6 col-sm-12">
                <label for="name" class="form-label">Nombre</label>
                <input type="text" id="name" v-model="janij.name" class="form-control" required />
                <div class="invalid-feedback">Debes llenar el campo</div>

            </div>
            <div class="col-md-6 col-sm-12">
                <label for="lastname" class="form-label">Apellido</label>
                <input type="text" id="lastname" v-model="janij.lastname" class="form-control" required />
                <div class="invalid-feedback">Debes llenar el campo</div>

            </div>
        </div>
        <div class="mb-3 row">
            <div class="col-md-6 col-sm-12">
                <label for="birthdate" class="form-label">Fecha de nacimiento</label>
                <input type="date" id="birthdate" v-model="janij.birthdate" class="form-control" required />
                <div class="invalid-feedback">Debes llenar el campo</div>

            </div>
            <div class="col-md-6 col-sm-12">
                <label for="kvutza" class="form-label">Kvutzá</label>
                <select v-model="localJanij.kvutza" class="form-select" required>
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
                <label for="janij_cellphone" class="form-label">Teléfono del janij</label>
                <input type="text" id="janij_cellphone" v-model="janij.janij_cellphone" class="form-control" />
            </div>
            <div class="col-md-6 col-sm-12">
                <label for="janij_address" class="form-label">Dirección</label>
                <input type="text" id="janij_address" v-model="janij.janij_address" class="form-control" required />
                <div class="invalid-feedback">Debes llenar el campo</div>
            </div>
        </div>
        <div class="row mb-5">
            <div class="col-12">
                <label for="pic">Foto del janij</label>
                <input type="file" id="pic" @change="handlePicChange" class="form-control" />
            </div>
            <div class="col-12 mt-1">
                <label class="form-label" for="janijtype">Tipo de janij</label>
                <select name="janijtype" id="janijtype" v-model="janij.type_janij" class="form-select">
                    <option disabled value="">Seleccione una kvutza</option>
                    <option value="Fijo">Fijo</option>
                    <option value="Rotativo">Rotativo</option>
                    <option value="Esporádico">Esporádico</option>
                    <option value="Inactivo">Inactivo</option>
                </select>
            </div>
        </div>

        <!-- DATOS DE LOS PADRES -->
        <h4 class="mb-3">Datos de los tutores</h4>
        <div class="mb-3 row">
            <div class="col-md-6 col-sm-12">
                <label for="parent_name" class="form-label">Nombre tutor 1</label>
                <input type="text" id="parent_name" v-model="janij.parent_name" class="form-control" required />
                <div class="invalid-feedback">Debes llenar el campo</div>
            </div>
            <div class="col-md-6 col-sm-12">
                <label for="parent_cellphone" class="form-label">Teléfono tutor 1</label>
                <input type="text" id="parent_cellphone" v-model="janij.parent_cellphone" class="form-control"
                    required />
                <div class="invalid-feedback">Debes llenar el campo</div>

            </div>
        </div>
        <div class="mb-3 row">
            <div class="col-md-6 col-sm-12">
                <label for="parent2_name" class="form-label">Nombre tutor 2</label>
                <input type="text" id="parent2_name" v-model="janij.parent2_name" class="form-control" />
            </div>
            <div class="col-md-6 col-sm-12">
                <label for="parent2_cellphone" class="form-label">Teléfono tutor 2</label>
                <input type="text" id="parent2_cellphone" v-model="janij.parent2_cellphone" class="form-control" />
            </div>
        </div>
        <button type="submit" class="btn btn-primary col-12 mt-4">Subir</button>
    </form>

    <div v-else class="p-4">
        <h4 class="mb-3">Detalles del janij</h4>
        <p><strong>Nombre:</strong> {{ janij.name }}</p>
        <p><strong>Apellido:</strong> {{ janij.lastname }}</p>
        <p><strong>Fecha de nacimiento:</strong> {{ formatDate(janij.birthdate) }}</p>
        <p><strong>Kvutza:</strong> {{ kvutzaName }}</p>
        <p>
            <strong>Teléfono del janij: </strong>
            <a v-if="janij.janij_cellphone" :href="'https:/wa.me/54' + janij.janij_cellphone" target="_blank">
                {{ janij.janij_cellphone }}
            </a>
            <span v-else>-</span>
        </p>
        <p><strong>Tipo de janij: </strong>{{ janij.type_janij }}</p>
        <p><strong>Dirección:</strong> {{ janij.janij_address }}</p>
        <p><strong>Nombre tutor 1:</strong> {{ janij.parent_name }}</p>
        <p>
            <strong>Teléfono tutor 1: </strong>
            <a v-if="janij.parent_cellphone" :href="'https:/wa.me/54' + janij.parent_cellphone" target="_blank">
                {{ janij.parent_cellphone }}
            </a>
            <span v-else>-</span>
        </p>
        <p><strong>Nombre tutor 2:</strong> {{ janij.parent2_name }}</p>
        <p>
            <strong>Teléfono tutor 2: </strong>
            <a v-if="janij.parent2_cellphone" :href="'https:/wa.me/54' + janij.parent2_cellphone" target="_blank">
                {{ janij.parent2_cellphone }}
            </a>
            <span v-else>-</span>
        </p>

        <!-- Botones -->
        <button class="btn btn-primary col-12 mt-4" @click="editar">Editar</button>
        <button class="btn btn-danger col-12 mt-2" @click="showDeleteModal = true">Eliminar</button>

        <!-- Modal Eliminar -->
        <div v-if="showDeleteModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar eliminación</h5>
                        <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
                    </div>
                    <div class="modal-body">
                        ¿Estás seguro de que deseas eliminar a
                        <strong>{{ janij.name }} {{ janij.lastname }}</strong>?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showDeleteModal = false">Cancelar</button>
                        <button type="button" class="btn btn-danger" @click="eliminarJanij">Sí, eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useSupabase } from "../services/supabase"
const { supabase } = useSupabase();

export default {
    props: ['janij'],
    computed: {
        kvutzaName() {
            const kv = this.kvutzot.find(k => k.id_kvutza === this.janij.kvutza);
            return kv ? kv.name : this.janij.kvutza;
        }
    },
    data() {
        return {
            editable: false,
            localJanij: { ...this.janij },
            guardando: false,
            showDeleteModal: false,
            kvutzot: [],
            formEl: null, // para validar con bootstrap
        }
    },
    async mounted() {
        const { data, error } = await supabase
            .from("Kvutzot")
            .select("id_kvutza, name")
            .neq("ken", "Tzevet")
            .order("id_kvutza")

        if (!error) this.kvutzot = data
    },
    watch: {
        janij: {
            handler(newVal) {
                this.localJanij = { ...newVal }
            },
            deep: true
        }
    },
    methods: {
        editar() {
            this.editable = true
        },
        // Actualiza la foto
        async handlePicChange(e) {
            const file = e.target.files[0];
            if (!file) return;

            try {
                if (this.janij.pic_name) {
                    await supabase.storage.from("JanijimPic").remove([this.janij.pic_name]);
                }

                const ext = file.name.split('.').pop();
                const fileName = `${this.janij.id}-janijim.png`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("JanijimPic")
                    .upload(fileName, file, { upsert: true });

                if (uploadError) {
                    console.error("Error subiendo archivo:", uploadError.message);
                    return;
                }

                const { data: publicData } = supabase.storage
                    .from("JanijimPic")
                    .getPublicUrl(fileName);

                const publicUrl = `${publicData.publicUrl}?t=${Date.now()}`;

                const { data, error } = await supabase
                    .from("Janijim")
                    .update({ pic: publicUrl, pic_name: fileName })
                    .eq("id", this.janij.id)
                    .select();

                if (!error) {
                    this.janij.pic = publicUrl;
                    alert("Foto actualizada con éxito!");
                }
            } catch (err) {
                console.error("Error en handlePicChange:", err);
            }
        },
        async guardarCambios() {
            const form = this.$refs.formEl; // 🔹 accedemos al ref
            if (!form) return; // por seguridad

            // Validación Bootstrap
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            try {
                const { pic, pic_name, kvutzaName, ...updateData } = this.localJanij;

                const { error } = await supabase
                    .from("Janijim")
                    .update(updateData)
                    .eq("id", this.janij.id);

                if (error) throw error;

                Object.assign(this.janij, updateData);
                this.editable = false;
                alert("Cambios guardados correctamente!");
                window.location.reload();
            } catch (err) {
                console.error("Error guardando cambios:", err.message);
                alert("Error guardando cambios");
            }
        },
        async eliminarJanij() {
            try {
                if (this.janij.pic_name) {
                    await supabase.storage.from("JanijimPic").remove([this.janij.pic_name]);
                }

                const { error } = await supabase
                    .from('Janijim')
                    .delete()
                    .eq('id', this.janij.id);

                if (error) throw error;

                alert("Janij eliminado correctamente");
                window.location.reload();
            } catch (err) {
                alert("Error al eliminar el janij");
            } finally {
                this.showDeleteModal = false;
            }
        },
        // Formatea las fechas
        formatDate(dateStr) {
            if (!dateStr) return "-";
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                const [yyyy, mm, dd] = dateStr.split('-');
                return `${dd}/${mm}/${yyyy}`;
            }
            const d = new Date(dateStr);
            if (!isNaN(d)) {
                const dd = String(d.getDate()).padStart(2, '0');
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const yyyy = d.getFullYear();
                return `${dd}/${mm}/${yyyy}`;
            }
            return dateStr;
        }
    }
}
</script>

<style scoped>
form {
    margin: 0;
    width: 100%;
}

#deleteModal .modal-content {
    z-index: 3000;
}

@media (max-width: 576px) {
    .modal-backdrop {
        width: 100vw !important;
    }
}
</style>
