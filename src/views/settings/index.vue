<script setup>
import Navbar from "@/components/header/index.vue";

const propsDate = {
  title: "Настройки",
  ruot: "/menu",
};

</script>


<template>
  <Navbar :props="propsDate" />
  <div>Settings</div>
</template>


<style lang="scss" scoped src="./style.scss"></style>
