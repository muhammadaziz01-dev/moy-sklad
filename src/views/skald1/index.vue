<script setup>

import Navbar from "@/components/header/index.vue";

const propsDate = {
  title: "Склад 1",
  ruot: "/menu",
};
</script>


<template>
  <Navbar :props="propsDate" />
  <div>Sklad 1</div>
</template>


<style lang="scss" scoped src="./style.scss"></style>
