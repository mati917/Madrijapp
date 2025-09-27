<template>
	<div class="container-md my-4">
		<Titulo titulo="Hadrajot">
			<button v-if="isLoggedIn && can(['ADM', 'HNG', 'MZK', 'JNJ'])" type="button"
				class="btn btn-outline-primary col-2" @click="modal_addHdrj = true">
				Añadir
			</button>
		</Titulo>

		<div v-if="errorMessage" class="alert alert-danger row">{{ errorMessage }}</div>
		<div v-if="successMessage" class="alert alert-success row">{{ successMessage }}</div>

		<div v-else-if="can(['ADM', 'HNG', 'MZK', 'JNJ'])">
			<!-- Hadrajot actuales -->
			<main class="row">
				<Subtitulo titulo="Hadrajot actuales" />
				<table class="table">
					<thead>
						<tr>
							<th>Año</th>
							<th>Ken</th>
							<th>Nombre</th>
							<th>Shijvá</th>
							<th>Madrijim</th>
							<th>Roshei Shijvá</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="hdrj in hadrajotActuales" :key="hdrj.id_hdrj" class="align-middle hover-effect"
							@dblclick="openEditModal(hdrj)">
							<th>{{ hdrj.cicloLectivo }}</th>
							<td>{{ hdrj.ken }}</td>
							<td>{{ kvutzaMap(hdrj.id_kvutza) }}</td>
							<td>{{ hdrj.shijvaActual }}</td>
							<td>
								<a v-for="mdrj in hdrj.id_mdrjm" :key="mdrj" :href="'/boguer/' + mdrj">
									{{ boguerMap(mdrj) }}<br />
								</a>
							</td>
							<td>
								<a v-for="rshj in hdrj.id_roshShijva" :key="rshj" :href="'/boguer/' + rshj">
									{{ boguerMap(rshj) }}<br />
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</main>

			<!-- Hadrajot actuales -->
			<section class="row mt-5">
				<Subtitulo titulo="Otras hadrajot actuales" class="p-1">
					<button class="btn btn-primary" type="button" data-bs-toggle="collapse"
						data-bs-target="#otras-hadrajot" aria-expanded="false" aria-controls="collapseExample">
						Ver <i class="bi bi-eye-fill"></i>
					</button>
				</Subtitulo>

				<table class="table collapse" id="otras-hadrajot">
					<thead>
						<tr>
							<th>Año</th>
							<th>Ken</th>
							<th>Nombre</th>
							<th>Shijvá</th>
							<th>Madrijim</th>
							<th>Roshei Shijvá</th>
							<th>Tipo</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="hdrj in hadrajotActualesOtras" :key="hdrj.id_hdrj" class="align-middle hover-effect"
							@dblclick="openEditModal(hdrj)">
							<th>{{ hdrj.cicloLectivo }}</th>
							<td>{{ hdrj.ken }}</td>
							<td>{{ kvutzaMap(hdrj.id_kvutza) }}</td>
							<td>{{ hdrj.shijvaActual }}</td>
							<td>
								<a v-for="mdrj in hdrj.id_mdrjm" :key="mdrj" :href="'/boguer/' + mdrj">
									{{ boguerMap(mdrj) }}<br />
								</a>
							</td>
							<td>
								<a v-for="rshj in hdrj.id_roshShijva" :key="rshj" :href="'/boguer/' + rshj">
									{{ boguerMap(rshj) }}<br />
								</a>
							</td>
							<td>{{ hdrj.tipo }}</td>
						</tr>
					</tbody>
				</table>
			</section>

			<!-- Hadrajot históricas -->
			<section class="row mt-5">
				<Subtitulo titulo="Hadrajot históricas" />
				<table class="table">
					<thead>
						<tr>
							<th>Año</th>
							<th>Ken</th>
							<th>Nombre</th>
							<th>Shijvá</th>
							<th>Madrijim</th>
							<th>Roshei Shijvá</th>
							<th>Tipo</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="hdrj in hadrajotHistoricas" :key="hdrj.id_hdrj" class="align-middle hover-effect"
							@dblclick="openEditModal(hdrj)">
							<th>{{ hdrj.cicloLectivo }}</th>
							<td>{{ hdrj.ken }}</td>
							<td>{{ kvutzaMap(hdrj.id_kvutza) }}</td>
							<td>{{ hdrj.shijvaActual }}</td>
							<td>
								<a v-for="mdrj in hdrj.id_mdrjm" :key="mdrj" :href="'/boguer/' + mdrj">
									{{ boguerMap(mdrj) }}<br />
								</a>
							</td>
							<td>
								<a v-for="rshj in hdrj.id_roshShijva" :key="rshj" :href="'/boguer/' + rshj">
									{{ boguerMap(rshj) }}<br />
								</a>
							</td>
							<td>{{ hdrj.tipo }}</td>
						</tr>
					</tbody>
				</table>
			</section>

			<!-- Modal Añadir -->
			<Modal v-model="modal_addHdrj">
				<Hadrajot_Form :form="form" @submit="addHadrajot">
					<button class="btn btn-success mt-3" type="submit">Añadir</button>
				</Hadrajot_Form>
			</Modal>

			<!-- Modal Editar -->
			<Modal v-model="modal_editHdrj">
				<Hadrajot_Form :form="form" @submit="updateHadrajot">
					<div class="p-0">
						<button class="btn btn-success col-12 mb-2" type="submit">Actualizar</button>
						<button class="btn btn-danger col-12" type="button"
							@click="deleteHadrajot(form.id_hdrj)">Borrar</button>
					</div>
				</Hadrajot_Form>
			</Modal>
		</div>

		<div v-else class="alert alert-danger row">
			No tienes los permisos para ver esto.<br />Comunicate con tu referente
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useSupabase } from "@/services/supabase"
import { checkAuth } from "@/services/useAuthCheck"
import { useAuthRoles } from "@/services/useAuthRoles"
import { cargarKvutzot, kvutzaMap } from "@/services/mapKvutza"
import { cargarBogrim, boguerMap } from "@/services/mapBoguer"
import Titulo from "@/components/Titulo.vue"
import Subtitulo from "@/components/Subtitulo.vue"
import Modal from "@/components/Modal.vue"
import Hadrajot_Form from "@/components/Hadrajot_Form.vue"

const { supabase } = useSupabase()
const errorMessage = ref("")
const successMessage = ref("")
const isLoggedIn = ref(false)
const { loadUserRoles, can } = useAuthRoles()

const modal_addHdrj = ref(false)
const modal_editHdrj = ref(false)

const hdrjt = ref([])
const bogrim = ref([])
const kvutzot = ref([])

// Form reactivo compartido con el hijo
const form = ref({
	id_hdrj: null,
	cicloLectivo: '',
	ken: '',
	kvutzaId: '',
	shijva: '',
	id_mdrjm: [],
	id_roshShijva: []
})

const hadrajotActualesOtras = computed(() => {
	const añoActual = new Date().getFullYear()
	return hdrjt.value.filter(
		h => h.cicloLectivo === añoActual
			&& h.tipo !== 'Común')
})
const hadrajotActuales = computed(() => {
	const añoActual = new Date().getFullYear()
	return hdrjt.value.filter(h => h.cicloLectivo === añoActual)
})
const hadrajotHistoricas = computed(() => {
	const añoActual = new Date().getFullYear()
	return hdrjt.value.filter(h => h.cicloLectivo < añoActual)
})

// 🔹 Cargar Hadrajot
async function fetchHadrajot() {
	try {
		const { data, error } = await supabase
			.from("Hadrajot")
			.select("*")
			.order("cicloLectivo", { ascending: false })
			.order("id_kvutza", { ascending: true })
			.order("tipo", { ascending: true })
		if (error) throw error
		hdrjt.value = data ?? []
	} catch (error) {
		console.error(error)
		errorMessage.value = "❌ Error cargando Hadrajot: " + error.message
	}
}

// 🔹 Añadir Hadrajot
async function addHadrajot(newData) {
	try {
		const { error } = await supabase.from("Hadrajot").insert([{
			cicloLectivo: newData.cicloLectivo,
			ken: newData.ken,
			id_kvutza: newData.kvutzaId,
			shijvaActual: newData.shijva,
			id_mdrjm: newData.id_mdrjm,
			id_roshShijva: newData.id_roshShijva
		}])
		if (error) throw error
		successMessage.value = "✅ Hadrajá añadida correctamente"
		modal_addHdrj.value = false
		await fetchHadrajot()
		window.location.reload();
	} catch (error) {
		console.error(error)
		errorMessage.value = "❌ Error añadiendo Hadrajá"
	}
}

// 🔹 Editar Hadrajot
function openEditModal(hdrj) {
	form.value = {
		id_hdrj: hdrj.id_hdrj,
		cicloLectivo: hdrj.cicloLectivo,
		ken: hdrj.ken,
		kvutzaId: hdrj.id_kvutza,
		shijva: hdrj.shijvaActual,
		id_mdrjm: hdrj.id_mdrjm,
		id_roshShijva: hdrj.id_roshShijva
	}
	modal_editHdrj.value = true
}

async function updateHadrajot(newData) {
	if (!newData?.id_hdrj) return
	try {
		const { error } = await supabase
			.from("Hadrajot")
			.update({
				cicloLectivo: newData.cicloLectivo,
				ken: newData.ken,
				id_kvutza: newData.kvutzaId,
				shijvaActual: newData.shijva,
				id_mdrjm: newData.id_mdrjm,
				id_roshShijva: newData.id_roshShijva
			})
			.eq("id_hdrj", newData.id_hdrj)
		if (error) throw error
		modal_editHdrj.value = false
		successMessage.value = "✅ Hadrajá actualizada correctamente"
		await fetchHadrajot()
		window.location.reload();
	} catch (error) {
		console.error(error)
		errorMessage.value = "❌ Error actualizando la hadrajá"
	}
}

// 🔹 Borrar Hadrajot
async function deleteHadrajot(id_hdrj) {
	if (!id_hdrj) return
	if (!confirm("¿Seguro que quieres borrar esta hadrajá?")) return
	try {
		const { error } = await supabase.from("Hadrajot").delete().eq("id_hdrj", id_hdrj)
		if (error) throw error
		modal_editHdrj.value = false
		successMessage.value = "✅ Hadrajá borrada correctamente"
		await fetchHadrajot()
		window.location.reload();
	} catch (error) {
		console.error(error)
		errorMessage.value = "❌ Error borrando la hadrajá"
	}
}

onMounted(async () => {
	const loggedIn = await checkAuth()
	isLoggedIn.value = loggedIn
	if (!loggedIn) {
		errorMessage.value = "⚠️ Debes iniciar sesión para ver esta página."
		return
	}
	await loadUserRoles()

	try { await cargarKvutzot() } catch (err) { console.error(err) }

	try {
		const { data: dataBogrim, error } = await supabase.from("Bogrim").select("*").order('kvutza', { ascending: true })
		if (error) throw error
		bogrim.value = dataBogrim ?? []
		await cargarBogrim(dataBogrim)
	} catch (err) { console.error(err) }

	await fetchHadrajot()
})
</script>

<style>
@import url('/src/assets/css/main.css');
</style>