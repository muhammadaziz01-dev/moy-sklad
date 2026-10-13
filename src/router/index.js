import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/login/index.vue'
import DashboardAdmin from "@/dashboards/index.vue"
import Sklad1 from "@/views/sklad1/index.vue"
import Sklad2 from "@/views/sklad2/index.vue"
import SkladAdir from "@/views/sklad-adir/index.vue"
import Profil from "@/views/profil/index.vue"
import Settings from "@/views/settings/index.vue"
import Praducts from "@/views/products/index.vue"
import Pradaja from "@/views/pradaja/index.vue"
import Ostatok from "@/views/ostatok/index.vue"
import Agents from "@/views/agents/index.vue"
import Zayafca from "@/views/zayafca/index.vue"
import ProductRTP from "@/views/products/rtp/index.vue"
import ProductValfe from "@/views/products/valfex/index.vue"
import AdirRTP from "@/views/sklad-adir/rtp.vue"
import AdirValfex from "@/views/sklad-adir/valfex.vue"
import Sklad1RTP from "@/views/sklad1/rtp.vue"
import Sklad1Valfex from "@/views/sklad1/valfex.vue"
import Sklad2RTP from "@/views/sklad2/rtp.vue"  
import Sklad2Valfex from "@/views/sklad2/valfex.vue"

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
      component: Sklad1,
      children: [
        {
          path: "",
          name: "sklad1-rtp",
          component: Sklad1RTP,
        },
        {
          path: "valfex",
          name: "sklad1-valfex",
          component: Sklad1Valfex,
        },
      ]
    },
    {
      path: "/sklad2",
      name: "Sklad2",
      component: Sklad2,
      children: [
        {
          path: "",
          name: "sklad2-rtp",
          component: Sklad2RTP,
        },
        {
          path: "valfex",
          name: "sklad2-valfex",
          component: Sklad2Valfex,
        },
      ]
    },
    {
      path: "/sklad-adir",
      name: "Sklad-adir",
      component: SkladAdir,
      children: [
        {
          path: "",
          name: "adir-rtp",
          component: AdirRTP,
        },
        {
          path: "valfex",
          name: "adir-valfex",
          component: AdirValfex,
        },
      ]
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
      children: [
        {
          path: "",
          name: "rtp",
          component: ProductRTP,
        },
        {
          path: "valfex",
          name: "valfex",
          component: ProductValfe,
        },
      ]
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
    {
      path: "/zayafca",
      name: "Zayafca",
      component: Zayafca,
    },

  ],
})

export default router
