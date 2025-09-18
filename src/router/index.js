import { createRouter, createWebHistory } from 'vue-router'
import Janijim from '../views/Janijim.vue'
import SignIn from '@/views/SignIn.vue'
import Home from '@/views/Home.vue'
import SingUp from '@/views/SingUp.vue'
import Perfil from '@/views/Perfil.vue'
import Kvutzot from '@/views/Kvutzot.vue'
import Tzevet from '@/views/Tzevet.vue'
import Boguer from '@/views/Boguer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/janijim',
      name: 'Janijim',
      component: Janijim,
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
      path: '/perfil',
      name: 'Perfil',
      component: Perfil,
    },
    {
      path: '/kvutzot',
      name: 'Kvutzot',
      component: Kvutzot,
    },
    {
      path: '/tzevet',
      name: 'Tzevet',
      component: Tzevet,
    },
    {
      path: '/boguer',
      name: 'boguer',
      component: Boguer,
    },
  ],
})

export default router
