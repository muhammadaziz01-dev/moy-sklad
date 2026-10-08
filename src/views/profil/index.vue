<script setup>
import Navbar from "@/components/header/index.vue";

const propsDate = {
  title: "Профил",
  ruot: "/menu",
};
</script>


<template>
  <Navbar :props="propsDate" />
  <div>Profil</div>
</template>


<style lang="scss" scoped src="./style.scss"></style>
