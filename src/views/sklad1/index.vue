<script setup>
import RTP from "@/assets/rtp-logo.png";
import VALFEX from "@/assets/valfex-logo.png";
import Navbar from "@/components/header/index.vue"

const propsDate = {
  title: "Склад 1",
  ruot: "/menu",
};
</script>

<template>
  <Navbar :props="propsDate"/>
  <div class="dashboard">
    <nav class="dashboard--navbar" >
      <router-link to="/sklad1">
        <img :src="RTP" alt="RTP logo">
      </router-link> 
      <router-link to="/sklad1/valfex">
      <img :src="VALFEX" alt="Valfex logo">
      </router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped src="./style.scss">

</style>