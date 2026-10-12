<!-- Dashboard Valfex.vue -->

<script setup>
import { ref, computed } from "vue"
import{ dataValfex } from "@/constants/product/product-valfex.js"

const getCategoryOptions = (data) => {
  const map = new Map();

  data.forEach(item => {
    if (!map.has(item.category)) {
      map.set(item.category, {
        label: item.categoryName,
        value: item.category,
      });
    }
  });

  // "Все" tugmasi boshida
  return [{ label: "Все", value: "all" }, ...Array.from(map.values())];
};

const categories = getCategoryOptions(dataValfex);

const selectedCategory = ref("all");

const filterByCategory = (categoryValue) => {
  selectedCategory.value = categoryValue;
};

const filteredProducts = computed(() => {
  if (selectedCategory.value === "all") return dataValfex;
  return dataValfex.filter(item => item.category === selectedCategory.value);
});

const userRole = localStorage.getItem("userRole");


</script>
<template>
  <div class="wrapper">
    <h3 class="wrapper--title"><span>Valfex</span> продукты</h3>
    <div class="wrapper--filter">
      <p
        v-for="item in categories"
        :key="item.value"
        class="wrapper--filter--category"
        :class="{ active: selectedCategory === item.value }"
        @click="filterByCategory(item.value)"
      >
        {{ item.label }}
      </p>
    </div>
    <div class="wrapper--parent-card">
      <div class="wrapper--parent-card--card" v-for="item in filteredProducts" :key="item.id">
        <div class="wrapper--parent-card--card--img-container">

        <img :src="item.img" alt="Truba PPR" class="wrapper--parent-card--card--img" />
        </div>
        <div class="wrapper--parent-card--card--wrapper-title">
          <p>{{ item.name }}</p>
          <ul class="wrapper--parent-card--card--wrapper-title--property">
            <li class="wrapper--parent-card--card--wrapper-title--property__item">
              <div class="wrapper--parent-card--card--wrapper-title--property__text">Бренд</div>
              <div class="wrapper--parent-card--card--wrapper-title--property__empty"></div>
              <div class="wrapper--parent-card--card--wrapper-title--property__text">{{ item.brand }}</div>
            </li>
            <li class="wrapper--parent-card--card--wrapper-title--property__item">
              <div class="wrapper--parent-card--card--wrapper-title--property__text">Количество</div>
              <div class="wrapper--parent-card--card--wrapper-title--property__empty"></div>
              <div class="wrapper--parent-card--card--wrapper-title--property__text">{{ item?.quantity}}</div>
            </li>
            <li class="wrapper--parent-card--card--wrapper-title--property__item">
              <div class="wrapper--parent-card--card--wrapper-title--property__text">Цена </div>
              <div class="wrapper--parent-card--card--wrapper-title--property__empty"></div>
              <div class="wrapper--parent-card--card--wrapper-title--property__text">{{ item?.price }} сом</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped lang="scss" src="./style.scss"></style>
