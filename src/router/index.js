import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import SignIn from '@/views/SignIn.vue'
import SingUp from '@/views/SingUp.vue'
import Roles from '@/views/Roles.vue'
import Perfil from '@/views/Perfil.vue'
import Janijim from '../views/Janijim.vue'
import Kvutzot from '@/views/Kvutzot.vue'
import Tzevet from '@/views/Tzevet.vue'
import Boguer from '@/views/Boguer.vue'
import Hadrajot from '@/views/Hadrajot.vue'
import Hadraja from '@/views/Hadraja.vue'
import Eventos from '@/views/Eventos.vue'
import Planificacion from '@/views/Planificacion.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SingUp,
    },
    {
      path: '/janijim',
      name: 'janijim',
      component: Janijim,
    },
    {
      path: '/janijim/:dni?',
      name: 'janijim',
      component: Janijim,
      /*
      Como usar el parámetro opcional:
      1. Si no se pasa el parámetro (ej: /janijim), se muestra la lista completa de janijim.
      2. Si se pasa el parámetro (ej: /janijim/12345678), se muestra el perfil del janij con ese DNI.
      <router-link :to="`/janijim/${janij.dni}`">Ver Janij</router-link> como ejemplo.
      */
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: Perfil,
    },
    {
      path: '/kvutzot',
      name: 'kvutzot',
      component: Kvutzot,
    },
    {
      path: '/tzevet',
      name: 'tzevet',
      component: Tzevet,
    },
    {
      path: '/boguer',
      name: 'boguer',
      component: Boguer,
    },
    {
      path: '/boguer/:dni', // <-- parámetro dinámico
      name: 'boguer',
      component: Boguer,
    },
    {
      path: '/roles',
      name: 'roles',
      component: Roles,
    },
    {
      path: '/hadrajot',
      name: 'hadrajot',
      component: Hadrajot,
    },
    {
      path: '/hadraja',
      name: 'hadraja',
      component: Hadraja,
    },
    {
      path: '/eventos',
      name: 'eventos',
      component: Eventos,
    },
    {
      path: '/planificacion/:id?',
      name: 'planificacion',
      component: Planificacion,
    },
  ],
})

export default router
