<template>
    <form class="border rounded bg-light" @submit.prevent="handleSubmit" novalidate>
        <div class="container p-4">
            <h4 class="mb-3">{{ form.id_hdrj ? 'Editar Hadrajá' : 'Nueva Hadrajá' }}</h4>

            <!-- Ciclo lectivo -->
            <div class="row mb-3">
                <div class="col-12">
                    <label for="hdrj_year" class="form-label">Ciclo lectivo</label>
                    <input type="number" id="hdrj_year" class="form-control" v-model="form.cicloLectivo" required />
                </div>
            </div>

            <!-- Ken -->
            <div class="row mb-3">
                <div class="col-12">
                    <label for="hdrj_ken" class="form-label">Ken</label>
                    <select class="form-select" id="hdrj_ken" v-model="form.ken" required>
                        <option value="Atid">Atid</option>
                        <option value="Jana Szenes">Jana Szenes</option>
                        <option value="Tzevet">Tzevet</option>
                        <option value="Ex Bogrim">Ex Bogrim</option>
                    </select>
                </div>
            </div>

            <!-- Kvutza / Shijvá -->
            <div class="row mb-3">
                <div class="col-12 col-md-6">
                    <label for="hdrj_kvutza" class="form-label">Kvutzá</label>
                    <select class="form-select" id="hdrj_kvutza" v-model="form.kvutzaId" required>
                        <option value="" disabled>Seleccionar kvutzá...</option>
                        <option v-for="k in kvutzot" :key="k.id_kvutza" :value="k.id_kvutza">
                            {{ k.name }}
                        </option>
                    </select>
                </div>

                <div class="col-12 col-md-6">
                    <label for="hdrj_shijva" class="form-label">Shijvá actual</label>
                    <select class="form-select" id="hdrj_shijva" v-model="form.shijva" required>
                        <option value="" disabled>Seleccionar shijvá...</option>
                        <option v-for="s in shijvot" :key="s" :value="s">{{ s }}</option>
                    </select>
                </div>
                <div class="col-12">
                    <label for="hdrj_tipo" class="form-label">Tipo de hadrajá</label>
                    <select class="form-select" id="hdrj_shijva" v-model="form.tipo">
                        <option value="" disabled>Seleccionar tipo...</option>
                        <option v-for="ht in hadrajot_types" :key="ht" :value="ht">{{ ht }}</option>
                    </select>
                </div>
            </div>

            <!-- Madrijim / Roshei Shijvá -->
            <div class="row mb-3">
                <div class="col-12 col-md-6">
                    <label class="form-label">Madrijim</label>
                    <select class="form-select" multiple v-model="form.id_mdrjm">
                        <option v-for="b in bogrimHDR" :key="b.dni" :value="b.dni">
                            {{ b.name }} {{ b.lastname }}
                        </option>
                    </select>
                </div>
                <div class="col-12 col-md-6">
                    <label class="form-label">Roshei Shijvá</label>
                    <select class="form-select" multiple v-model="form.id_roshShijva">
                        <option v-for="b in bogrimJNJ" :key="b.dni" :value="b.dni">
                            {{ b.name }} {{ b.lastname }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Botón slot -->
            <div class="row mt-2 justify-content-center p-3">
                <slot></slot>
            </div>
        </div>
    </form>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { shijvot } from '@/assets/js/shijvot'
import { useSupabase } from '@/services/supabase'
import { hadrajot_types } from "@/assets/js/hadrajot_type"


const emit = defineEmits(['submit'])
const props = defineProps({
    form: {
        type: Object,
        required: true
    }
})

const { supabase } = useSupabase()

const kvutzot = ref([])
const bogrim = ref([])
const bogrimHDR = computed(() => bogrim.value.filter(b => b.roles?.includes('HDR')))
const bogrimJNJ = computed(() => bogrim.value.filter(b => b.roles?.includes('JNJ')))


function handleSubmit() {
    emit('submit', { ...props.form }) // se emite el form que viene del padre
}

onMounted(async () => {
    try {
        const { data: dataBogrim, error } = await supabase.from("Bogrim").select("*")
        if (error) throw error
        bogrim.value = dataBogrim ?? []
    } catch (err) {
        console.error(err)
    }

    try {
        const { data: dataKvutzot, error: errorKvutzot } = await supabase
            .from('Kvutzot')
            .select('id_kvutza, name')
            .neq('ken', 'Tzevet')
            .neq('ken', 'Ex Bogrim')
        if (errorKvutzot) throw errorKvutzot
        kvutzot.value = dataKvutzot ?? []
    } catch (errorKvutzot) {
        console.error(errorKvutzot)
    }
})
</script>
