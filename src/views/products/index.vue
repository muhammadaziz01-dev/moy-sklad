<script setup>
import RTP from "@/assets/rtp-logo.png";
import VALFEX from "@/assets/valfex-logo.png";
import Navbar from "@/components/header/index.vue";

const propsDate = {
  title: "Продукты",
  ruot: "/menu",
};
</script>


<template>
  <Navbar :props="propsDate" />
  <div class="products">
    <nav class="products--navbar">
      <router-link to="/products">
        <img :src="RTP" alt="RTP logo" />
      </router-link>
      <router-link to="/products/valfex">
        <img :src="VALFEX" alt="Valfex logo" />
      </router-link>
      <!-- <router-link to="/products/tim">
        <img :src="TIM" alt="logo tim" />
      </router-link> -->
    </nav>
    <router-view></router-view>
  </div>
</template>


<style lang="scss" scoped src="./style.scss"></style>
