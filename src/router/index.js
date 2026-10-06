import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/login/index.vue'
import DashboardAdmin from "@/dashboards/admin/index.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage,
    },
    {
      path:'/menu',
      name: "Menu",
      component: DashboardAdmin
    }
  ],
})

export default router
