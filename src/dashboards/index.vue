<template>
  <div class="wrapper">
    <Navbar :props="propsDate" />

    <!-- Faqat admin uchun -->
    <div class="wrapper--menu  menu-admin"  v-if="userRole === 'admin'">
      <div class="wrapper--menu--card" @click="pushRouter(`/sklad1`)">
        <img :src="Sklad3" alt="sclad icon" />
        <p>Склад 1</p>
      </div>

      <div class="wrapper--menu--card" @click="pushRouter(`/sklad2`)">
        <img :src="Sklad2" alt="agents icon" />
        <p>Склад 2</p>
      </div>

      <div class="wrapper--menu--card" @click="pushRouter(`/sklad-adir`)">
        <img :src="skladAdir" alt="sclad icon" />
        <p>Склад адир</p>
      </div>

      <div class="wrapper--menu--card" @click="pushRouter(`/agents`)">
        <img :src="AgentsImg" alt="agents icon" />
        <p>Агенты</p>
      </div>

      <div class="wrapper--menu--card" @click="pushRouter(`/products`)">
        <img :src="Product" alt="sclad icon" />
        <p>Продукты</p>
      </div>

      <div class="wrapper--menu--card" @click="pushRouter(`/pradaja`)" >
        <img :src="Truck" alt="truck icon" />
        <p>Продажа</p>
      </div>

      <div class="wrapper--menu--card" @click="pushRouter(`/ostatok`)">
        <img :src="IconAstatok" alt=" icon" />
        <p>Остаток</p>  
      </div>

      <div class="wrapper--menu--card" @click="pushRouter(`/profil`)">
        <img :src="Person" alt="agents icon" />
        <p>Профил</p>
      </div>

      <div class="wrapper--menu--card" @click="pushRouter(`/settings`)">
        <img :src="Settings" alt="agents icon" />
        <p>Настройки</p>
      </div>

    </div>

    <!-- MUHIM QISM -->
    <router-view />
  </div>
</template>

<script setup>
import Navbar from "@/components/header/index.vue";
import AgentsImg from "@/assets/users.svg";
import Sklad from "@/assets/sclad.png";
import skladAdir from "@/assets/skladAdir.svg";
import Truck from "@/assets/truck.svg"
import IconAstatok from "@/assets/iconAstatok.svg"
import { useRouter } from "vue-router";
import Person from "@/assets/person.svg"
import Settings from "@/assets/gear.svg"
import Product from "@/assets/praduct.svg";
import Sklad3 from "@/assets/sklad1.png";
import Sklad2 from "@/assets/sklad2.png";


import { ref } from "vue";
const propsDate = {
  title: "Меню",
  ruot: "/",
};

const router = useRouter();
const userRole = ref(localStorage.getItem("userRole") || "");

const pushRouter = (link) => {
  router.push(link);
};
</script>

<style lang="scss" scoped src="./style.scss"></style>
