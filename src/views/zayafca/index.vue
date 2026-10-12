<script setup>
import Navbar from "@/components/header/index.vue";

const propsDate = {
  title: "Заявка",
  ruot: "/menu",
};
</script>

<template>
  <Navbar :props="propsDate" />
  <div>Заявка</div>
</template>

<style lang="scss" scoped src="./style.scss"></style>
x