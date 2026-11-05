<template>
  <Navbar :props="propsDate" />

  <div class="dashboard">
    <!-- 1-qadam: Sklad tanlash -->
    <template v-if="!selectedSklad">
      <h3>Выберите склад 👇</h3>
      <div class="dashboard--sklads">
        <div
          v-for="sklad in sklads"
          :key="sklad.key"
          class="dashboard--sklads__card"
          @click="selectSklad(sklad.key)"
        >
          <img :src="sklad.img" :alt="sklad.title" />
          <span>{{ sklad.title }}</span>
        </div>
      </div>
    </template>

    <!-- 2-qadam: Brend tanlash -->
    <template v-else-if="!selectedBrand">
      <div class="dashboard--table-wrap__header">
        <button class="dashboard--table-wrap__back" @click="selectedSklad = null">
          ← Назад
        </button>
        <span class="dashboard--table-wrap__title">{{ currentSklad.title }}</span>
      </div>
      <h3>Выберите бренд 👇</h3>
      <nav class="dashboard--navbar">
        <div class="dashboard--navbar__item" @click="selectBrand('RTP')">
          <img :src="RTP" alt="RTP logo" />
        </div>
        <div class="dashboard--navbar__item" @click="selectBrand('VALFEX')">
          <img :src="VALFEX" alt="Valfex logo" />
        </div>
      </nav>
    </template>

    <!-- 3-qadam: Ostatka jadvali -->
    <template v-else>
      <div class="dashboard--table-wrap">
        <div class="dashboard--table-wrap__header">
          <button class="dashboard--table-wrap__back" @click="selectedBrand = null">
            ← Назад
          </button>
          <span class="dashboard--table-wrap__title">
            {{ brandName }} — {{ currentSklad.title }}
          </span>
          <span class="dashboard--table-wrap__date">{{ today }}</span>
        </div>

        <div class="dashboard--table">
          <div class="dashboard--table__head">
            <span>#</span>
            <span class="left">Номенклатура</span>
            <span>Кол.</span>
            <span>Цена</span>
            <span>Сумма</span>
          </div>

          <template v-for="[catName, catItems] in groupedItems" :key="catName">
            <div class="dashboard--table__cat">{{ catName }}</div>
            <div
              v-for="(product, idx) in catItems"
              :key="product.id"
              class="dashboard--table__row"
              :class="{ even: idx % 2 === 1 }"
            >
              <span>{{ idx + 1 }}</span>
              <span class="left">{{ product.name }}</span>
              <span>{{ fmt(product.allResidual) }} {{ product.unit }}</span>
              <span>{{ fmt(product.price) }}</span>
              <span class="sum">{{ fmt(rowSum(product)) }}</span>
            </div>
          </template>
        </div>

        <div class="dashboard--totals">
          <div class="dashboard--totals__row">
            <span>Общая позиция:</span>
            <span>{{ totalCount }} типа</span>
          </div>
          <div class="dashboard--totals__row total">
            <span>Общая сумма:</span>
            <span>{{ fmt(totalSum) }} сом</span>
          </div>
        </div>

        <button class="dashboard--word-btn" :disabled="loadingWord" @click="downloadWord">
          {{ loadingWord ? "Загрузка..." : "📄 Скачать в формате Word" }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import RTP from "@/assets/rtp-logo.png";
import VALFEX from "@/assets/valfex-logo.png";
import Navbar from "@/components/header/index.vue";
import { generateOstatkaWord } from "@/utils/useOstatkaGenerator.js";
import skladAdir from "@/assets/skladAdir.svg";
import Sklad1 from "@/assets/sklad1.png";
import Sklad2 from "@/assets/sklad2.png";

// sklad adir
import { allDataRTPAdir } from "@/constants/data/sklad-adir/data-rtp";
import { allDataValfexAdir } from "@/constants/data/sklad-adir/data-valfex";
// sklad 1
import { allDataRTPSklad1 } from "@/constants/data/sklad1/data-rtp";
import { allDataValfexSklad1 } from "@/constants/data/sklad1/data-valfex";
// sklad 2
import { allDataRTPSklad2 } from "@/constants/data/sklad2/data-rtp";
import { allDataValfexSklad2 } from "@/constants/data/sklad2/data-valfex";

const propsDate = {
  title: "Остаток",
  ruot: "/menu",
};

// ── Skladlar ro'yxati ────────────────────────────────────────
const sklads = [
  { key: "sklad1", title: "Склад 1", img: Sklad1 },
  { key: "sklad2", title: "Склад 2", img: Sklad2 },
  { key: "skladAdir", title: "Склад Адир", img: skladAdir },
];

// Har bir sklad uchun brend ma'lumotlari
const allData = {
  skladAdir: { RTP: allDataRTPAdir, VALFEX: allDataValfexAdir },
  sklad1: { RTP: allDataRTPSklad1, VALFEX: allDataValfexSklad1 },
  sklad2: { RTP: allDataRTPSklad2, VALFEX: allDataValfexSklad2 },
};

// ── Tanlovlar ────────────────────────────────────────────────
const selectedSklad = ref(null); // null | "skladAdir" | "sklad1" | "sklad2"
const selectedBrand = ref(null); // null | "RTP" | "VALFEX"

function selectSklad(key) {
  selectedSklad.value = key;
  selectedBrand.value = null;
}

function selectBrand(key) {
  selectedBrand.value = key;
}

const currentSklad = computed(
  () => sklads.find((s) => s.key === selectedSklad.value) || {}
);

const brandName = computed(() =>
  selectedBrand.value === "RTP" ? "RTP Rostirplast" : "Valfex"
);

// Tanlangan sklad + brend bo'yicha ma'lumot
const brandData = computed(() => {
  if (!selectedSklad.value || !selectedBrand.value) return [];
  return allData[selectedSklad.value]?.[selectedBrand.value] || [];
});

// faqat qoldig'i bor tovarlar
const items = computed(() => brandData.value.filter((p) => (p.allResidual || 0) > 0));

// kategoriya bo'yicha guruhlash
const groupedItems = computed(() => {
  const groups = {};
  items.value.forEach((product) => {
    const cat = product.categoryName || product.category || "Бошқа";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(product);
  });
  return Object.entries(groups);
});

const fmt = (val) => (val || 0).toLocaleString("ru-RU");
const rowSum = (product) => (product.allResidual || 0) * (product.price || 0);

const totalSum = computed(() => items.value.reduce((acc, p) => acc + rowSum(p), 0));
const totalCount = computed(() => items.value.length);

const today = new Date().toLocaleDateString("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

// ── Word generatsiya ────────────────────────────────────────
const loadingWord = ref(false);

async function downloadWord() {
  loadingWord.value = true;
  try {
    await generateOstatkaWord({
      brandName: `${brandName.value} — ${currentSklad.value.title}`,
      date: today,
      groupedItems: groupedItems.value,
      totalSum: totalSum.value,
      totalCount: totalCount.value,
    });
  } catch (e) {
    console.error(e);
    alert("Хато юз берди");
  } finally {
    loadingWord.value = false;
  }
}
</script>

<style scoped lang="scss" src="./style.scss"></style>
