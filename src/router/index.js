import { createRouter, createWebHistory } from 'vue-router'
import Janijim from '../views/Janijim.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/janijim',
      name: 'Janijim',
      component: Janijim,
    },
  ],
})

export default router
