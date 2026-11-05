<script setup>
import Navbar from "@/components/header/index.vue";
import AgentCard from "@/components/cards/agent/index.vue";
import {dataAgents} from "@/constants/agents/agent-list.js";
import {ref , computed} from "vue"

const propsDate = {
  title: "Профил",
  ruot: "/menu",
};


const userId = ref(localStorage.getItem("userId") || "");

const filterData = computed(() => {
    return dataAgents.filter((el) => el?.id == userId.value)
})

</script>

<template>
  <Navbar :props="propsDate" />
  <div class="wrapper-cards" v-for="el in filterData" :key="el?.id">
    <AgentCard :agent="el"  />
  </div>
</template>

<style lang="scss" scoped>
.wrapper-cards{
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 15px;
    margin: 0 auto;
    padding: 0 5px;
}
</style>