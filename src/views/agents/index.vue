<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "@/components/header/index.vue";
import AgentCard from "@/components/cards/agent/index.vue";
import { dataAgents } from "@/constants/agents/agent-list.js";
import {dataAgentsSklad2} from "@/constants/agents/agentData-sklad2.js";
import ChartAgents from "@/components/chart/index.vue";
const propsDate = {
  title: "Агенты",
  ruot: "/menu",
  link: "/agents",
};

const userRole = ref(localStorage.getItem("userRole") || "");
const router = useRouter();
const pushRouter = (link) => {
  router.push(link);
};

</script>

<template >
  <!-- Admin uchun  -->
  <div  v-if="userRole === 'admin'" >
    <Navbar :props="propsDate" />
    <ChartAgents :agents="dataAgents" />
    <div class="wrapper-cards" v-for="el in dataAgents" :key="el?.id">
      <AgentCard :agent="el" />
    </div>
  </div>

<!-- Boss uchun  -->
  <div  v-if="userRole === 'boss'" >
    <Navbar :props="propsDate" />
    <ChartAgents :agents="dataAgents" />
    <div class="wrapper-cards" v-for="el in dataAgents" :key="el?.id">
      <AgentCard :agent="el" />
    </div>
  </div>


  <!-- Worker sklad 2 uchun  -->
  <div  v-if="userRole === 'worker-sklad2'" >
    <Navbar :props="propsDate" />
    <ChartAgents :agents="dataAgentsSklad2" />
    <div class="wrapper-cards" v-for="el in dataAgentsSklad2" :key="el?.id">
      <AgentCard :agent="el" />
    </div>
  </div>

  
</template>



<style lang="scss" scoped src="./style.scss"></style>
