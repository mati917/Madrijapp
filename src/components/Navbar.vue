<template>
    <header>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">
                    <img src="../../public/favicon.png" height="20" alt="Madrijapp logo"
                        class="d-inline-block align-text-middle" />
                    Madrijapp
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" href="/janijim">Janijim</a>
                        </li>
                        <li v-if="can(['ADM', 'HNG', 'MZK', 'HDR'])" class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                Harjavá
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#">Confirmación</a></li>
                                <li><a class="dropdown-item" href="#">Asistencia</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="#">Métricas</a></li>
                            </ul>
                        </li>
                        <li v-if="can(['ADM', 'HDR', 'JNJ'])" class="nav-item">
                            <a class="nav-link" href="/hadraja">Hadrajá</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link">Eventos</a>
                        </li>
                        <li v-if="can('ADM', 'HNG', 'MZK', 'JNJ')" class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                Admin
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/kvutzot">Kvutzot</a></li>
                                <li><a class="dropdown-item" href="/tzevet">Tzevet</a></li>
                                <li><a class="dropdown-item" href="/hadrajot">Hadrajot</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="/roles">Roles</a></li>
                            </ul>
                        </li>
                    </ul>
                    <!--<form class="d-flex" role="search">
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>-->
                    <Navbar_UserBtn class="col-12 col-lg-2" />
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { onMounted } from 'vue';
import Navbar_UserBtn from './Navbar_UserBtn.vue'
import { useAuthRoles } from '@/services/useAuthRoles';
const { roles, loadUserRoles, can } = useAuthRoles()

onMounted(async () => {
    await loadUserRoles();
})

</script>