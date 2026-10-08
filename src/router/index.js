import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/login/index.vue'
import DashboardAdmin from "@/dashboards/index.vue"
import Sklad1 from "@/views/skald1/index.vue"
import Sklad2 from "@/views/sklad2/index.vue"
import SkladAdir from "@/views/sklad-adir/index.vue"
import Profil from "@/views/profil/index.vue"
import Settings from "@/views/settings/index.vue"
import Praducts from "@/views/products/index.vue"
import Pradaja from "@/views/pradaja/index.vue"
import Ostatok from "@/views/ostatok/index.vue"
import Agents from "@/views/agents/index.vue"

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
      component: DashboardAdmin,
    },
    {
      path: "/sklad1",
      name: "Sklad1",
      component: Sklad1
    },
    {
      path: "/sklad2",
      name: "Sklad2",
      component: Sklad2,
    },
    {
      path: "/sklad-adir",
      name: "Sklad-adir",
      component: SkladAdir,
    },
    {
      path: "/profil",
      name: "Profil",
      component: Profil,
    },
    {
      path: "/settings",
      name: "Settings",
      component: Settings,
    },
    {
      path: "/products",
      name: "Praducts",
      component: Praducts,
    },
    {
      path: "/pradaja",
      name: "Pradaja",
      component: Pradaja,
    },
    {
      path: "/ostatok",
      name: "Ostatok",
      component: Ostatok,
    },
    {
      path: "/agents",
      name: "Agents",
      component: Agents,
    },

  ],
})

export default router
