<!-- Dashboard RTP&.vue -->

<script setup>
import { ref, computed } from "vue"
import { dataRTP } from "@/constants/product/product-rtp.js"

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

const categories = getCategoryOptions(dataRTP);

const selectedCategory = ref("all");

const filterByCategory = (categoryValue) => {
  selectedCategory.value = categoryValue;
};

const filteredProducts = computed(() => {
  if (selectedCategory.value === "all") return dataRTP;
  return dataRTP.filter(item => item.category === selectedCategory.value);
});

const userRole = localStorage.getItem("userRole");
</script>

<template>
  <div class="wrapper">
    <h3 class="wrapper--title"><span>Rosturplast</span> продукты</h3>
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

<style scoped lang="scss" >
.wrapper {

&--title {
    text-align: center;
    padding-bottom: 20px;

    span {
        color: #224386;
    }
}

&--filter {
    display: grid;
    grid-template-columns: auto auto auto;
    gap: 5px;

    &--category {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        border: 1px solid #000000;
        border-radius: 3px;
        cursor: pointer;

        &.active {
            // o'zingizga mos stil, masalan:
            background: #224386;
            color: #FFFF !important;
            border: 1px solid #224386;
        }
    }
}

&--parent-card {
    max-width: 410px;
    // background-color: #224386;
    display: grid;
    grid-template-columns: auto auto;
    gap: 10px;
    padding: 5px;
    margin-top: 10px;


    &--card {
        display: flex;
        flex-direction: column;
        justify-content: space-between; 
        height: 100%; 
        padding: 10px 7px 15px 7px;
        border-radius: 10px;
        box-shadow: 0 4px 7px 0 rgba(0, 0, 0, 0.2);

        &--img-container {
            width: 100%;
            height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        &--img {
            width: 100%;
            height: 100%;
            object-fit: contain; 
        }

        &--wrapper-title {
            p {

                font-size: 12px;
                font-weight: 500;
                text-align: center;
                padding-bottom: 5px;
                color: #0e0f0f;
            }


            &--property {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            &--property__item {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                gap: 4px;
            }

            &--property__text {
                color: #0e0f0f;
                font-size: 10px;
                font-weight: 400;
            }

            &--property__empty {
                border-bottom: 1px dashed #0e0f0f;
                flex: 1 1 auto;
            }
        }


    }
}
}
</style>