<template>
    <div class="container-md p-4">

        <!-- Banner -->
        <section class="section row" id="banner">
            <!-- Saludo -->
            <div id="greeting"
                class="col-12 mb-4 text-center text-white d-flex flex-column justify-content-center align-items-center">
                <h1 v-if="loading">Cargando...</h1>
                <h1 v-else-if="error">Bienvenido a Madrijapp</h1>
                <h1 v-else>Hola, {{ profile.name }}</h1>
            </div>
        </section>

        <!-- Instagram -->
        <section class="section row mt-5 justify-content-center" id="instagram">
            <h2>Mirá lo nuevo en Instagram👇</h2>
            <div class="igwrapper col-12 col-md-9">
                <blockquote class="instagram-media" :data-instgrm-permalink="instagramUrl" data-instgrm-version="14"
                    style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; min-width:326px; padding:0; width:99.375%;width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
                </blockquote>
            </div>
        </section>

        <!-- Recursos -->
        <section id="recursos" class="section row mt-5">
            <h2>Recursos para tu peulá😁</h2>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useSupabase } from "@/services/supabase"

const { supabase } = useSupabase()

// Datos del usuario
const profile = ref(null)
const loading = ref(true)
const error = ref(null)

// URL del post de Instagram (puedes reemplazarlo dinámicamente)
const instagramUrl = "https://www.instagram.com/tnua.israel.hatzeira" // reemplazar con tu post

onMounted(async () => {
    try {
        // Obtener sesión
        const { data, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (!data.session) {
            error.value = "No estás logueado"
            return
        }

        const authUser = data.session.user

        // Traer perfil del usuario
        const { data: userData, error: dbError } = await supabase
            .from("Bogrim")
            .select("name")
            .eq("id_auth", authUser.id)
            .maybeSingle()

        if (dbError) throw dbError
        if (!userData) {
            error.value = "Perfil no encontrado"
            return
        }

        profile.value = userData



        // ===== Instagram embed =====
        // 1. Cargar script si no está
        if (!document.getElementById("instagram-embed")) {
            const script = document.createElement("script")
            script.id = "instagram-embed"
            script.src = "https://www.instagram.com/embed.js"
            script.async = true
            document.body.appendChild(script)

            script.onload = () => {
                if (window.instgrm) window.instgrm.Embeds.process()
            }
        } else {
            // 2. Si ya cargado, procesar embeds
            if (window.instgrm) window.instgrm.Embeds.process()
        }

    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
#banner {
    position: relative;
    background-image: url('/img/Banner.jpg');
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 500px;
    overflow: hidden;
}

/* Pseudo-elemento para blur + degradado */
#banner::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Degradado azul-blanco muy sutil */
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(107, 214, 250, 0.3));
    /* Blur muy tenue */
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);
    z-index: 1;
}

/* Para que el contenido del banner quede por encima del overlay */
#banner>* {
    position: relative;
    z-index: 2;
}

#greeting>h1 {
    text-shadow: 2px 2px 5px rgb(1, 0, 22);
    font-size: 3rem;
    font-weight: bold;
}

.igwrapper {
    background: #fff;
    position: relative;
}

.igwrapper iframe {
    border: 0;
    position: relative;
    z-index: 2;
}

.igwrapper a {
    color: rgba(0, 0, 0, 0);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
}
</style>
