<script setup>
import Navbar from "@/components/header/index.vue";

const propsDate = {
  title: "Склад адир",
  ruot: "/menu",
};
</script>


<template>
  <Navbar :props="propsDate" />
  <div>Sklad adir</div>
</template>


<style lang="scss" scoped src="./style.scss"></style>
