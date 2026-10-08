<script setup>
import Navbar from "@/components/header/index.vue";

const propsDate = {
  title: "Продажа",
  ruot: "/menu",
};
</script>


<template>
  <Navbar :props="propsDate" />
  <div>Pradaja</div>
</template>


<style lang="scss" scoped src="./style.scss"></style>
