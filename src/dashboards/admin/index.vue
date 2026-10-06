<template>
  <div class="wrapper">
    <Navbar :props="propsDate" />

    <div>
        Admin deshbpoard
    </div>

    <!-- Faqat admin uchun -->
    <div class="wrapper--menu">
      <div class="wrapper--menu--card" @click="pushRouter(`/sklad`)">
        <img :src="Product" alt="sclad icon" />
        <p>Продукты</p>
      </div>

      <div class="wrapper--menu--card" @click="pushRouter(`/agents`)">
        <img :src="AgentsImg" alt="agents icon" />
        <p>Агенты</p>
      </div>

    </div>

    <!-- MUHIM QISM -->
    <router-view />
  </div>
</template>

<script setup>
import Navbar from "../../components/header/index.vue";
import AgentsImg from "../../assets/users.svg";
import { useRouter } from "vue-router";
import Product from "@/assets/praduct.svg";

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
