<script setup>
import Navbar from "@/components/header/index.vue";

const propsDate = {
  title: "Агенты",
  ruot: "/menu",
};
</script>


<template>
  <Navbar :props="propsDate" />
  <div>Agents</div>
</template>


<style lang="scss" scoped src="./style.scss"></style>
