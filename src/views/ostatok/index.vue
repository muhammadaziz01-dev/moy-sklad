<script setup>
import Navbar from "@/components/header/index.vue";

const propsDate = {
  title: "Остаток",
  ruot: "/menu",
};

</script>


<template>
  <Navbar :props="propsDate" />
  <div>Ostatok</div>
</template>


<style lang="scss" scoped src="./style.scss"></style>
