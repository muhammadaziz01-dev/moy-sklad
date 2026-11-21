<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "@/components/header/index.vue";
import ChartSklads from "@/components/chart/chartSklad.vue";
import {dataSklad} from "@/constants/data/analitic/data-all-sklad.js"
const propsDate = {
  title: "Аналитика",
  ruot: "/menu",
  link: "/analytic",
};

const userRole = ref(localStorage.getItem("userRole") || "");
const router = useRouter();
const pushRouter = (link) => {
  router.push(link);
};
</script>



<template>
  <!-- Admin uchun  -->
  <div  v-if="userRole === 'admin'" >
    <Navbar :props="propsDate" />
    <ChartSklads :sklads="dataSklad" />
    
  </div>

<!-- Boss uchun  -->
  <!-- <div  v-if="userRole === 'boss'" >
    <Navbar :props="propsDate" />
    <ChartAgents :agents="dataSklad" />
    
  </div> -->
</template>

<style lang="scss" scoped src="./style.scss"></style>
