<!-- Step3Nakladnoy.vue -->
<!-- npm install docx file-saver -->

<script setup>
import { ref, computed } from "vue";
import { useOrderStore } from "@/stores/useOrderStore.js";
import { generateNakladnoyWord } from "@/utils/usenakladnoygeneratoragenta.js";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";

const store = useOrderStore();
const router = useRouter();

// ── Zakaz raqami va sana ─────────────────────────────────────
const orderNumber = ref("ZAK-" + Date.now().toString().slice(-6));

const today = new Date().toLocaleDateString("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
}); // "11.05.2026" formatda

// ── Agent nomi (zayavka yaratayotgan shaxs) ──────────────────
const agentName =
  localStorage.getItem("agentName") || localStorage.getItem("userName") || "";

// ── Kategoriya bo'yicha guruhlash (UI uchun) ─────────────────
const groupedItems = computed(() => {
  const groups = {};
  store.orderList.forEach(({ product, qty }) => {
    const cat = product.categoryName || product.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push({ product, qty });
  });
  return Object.entries(groups);
});

// ── Jami summa ───────────────────────────────────────────────
const fmt = (val) => (val || 0).toLocaleString("ru-RU");

// ── generateNakladnoyWord uchun ma'lumotlarni tayyorlash ─────
function buildWordData() {
  const client = store.selectedClient;

  const agent = {
    fulName: agentName,
    phone: localStorage.getItem("agentPhone") || "",
    region: "",
  };

  const cart = store.orderList.map(({ product, qty }) => ({
    name: product.name,
    quantity: qty,
    unit: product.unit,
    price: product.price,
    category: product.categoryName || product.category,
  }));

  return {
    number: orderNumber.value,
    date: today,
    agent,
    clientName: client.fulName,
    comment: "",
    cart,
    totalSum: store.totalAmount,
  };
}

// ── Faqat Word yuklash ────────────────────────────────────────
const loadingWord = ref(false);

async function downloadWord() {
  loadingWord.value = true;
  try {
    await generateNakladnoyWord(buildWordData());
    message.success("Файл загружен!");
  } catch (e) {
    console.error(e);
    message.error("Произошла ошибка.");
  } finally {
    loadingWord.value = false;
  }
}

// ── Tasdiqlash: Word + tozalash ───────────────────────────────
const loadingConfirm = ref(false);

async function confirmOrder() {
  loadingConfirm.value = true;
  try {
    await generateNakladnoyWord(buildWordData());

    // API chaqirish joyi (kerak bo'lsa)
    // await api.submitOrder({ ... })

    store.clearOrder();
    router.push("/menu");
  } catch (e) {
    console.error(e);
    message.error("Произошла ошибка.");
    loadingConfirm.value = false;
  }
}
</script>

<template>
  <div class="step3">
    <!-- Sarlavha -->
    <div class="step3__header">
      <h3 class="step3__header__title">Накладной</h3>
      <span class="step3__header__num">№ {{ orderNumber }}</span>
    </div>

    <!-- Klient va agent ma'lumoti -->
    <div class="step3__client" v-if="store.selectedClient">
      <div class="step3__client__row">
        <span class="step3__client__row__label">Клиент:</span>
        <span class="step3__client__row__value">{{ store.selectedClient.fulName }}</span>
      </div>
      <div class="step3__client__row">
        <span class="step3__client__row__label">Агент:</span>
        <span class="step3__client__row__value">{{ agentName || "—" }}</span>
      </div>
      <div class="step3__client__row">
        <span class="step3__client__row__label">Дата:</span>
        <span class="step3__client__row__value">{{ today }}</span>
      </div>
    </div>

    <a-divider style="margin: 10px 0" />

    <!-- Jadval (UI preview) -->
    <div class="step3__table">
      <div class="step3__table__head">
        <span>#</span>
        <span class="left">Номенклатура</span>
        <span>Кол.</span>
        <span>Цена</span>
        <span>Сумма</span>
      </div>

      <template v-for="[catName, items] in groupedItems" :key="catName">
        <div class="step3__table__cat">{{ catName }}</div>
        <div
          v-for="(row, idx) in items"
          :key="row.product.id"
          class="step3__table__row"
          :class="{ even: idx % 2 === 1 }"
        >
          <span>{{ idx + 1 }}</span>
          <span class="left">{{ row.product.name }}</span>
          <span>{{ row.qty }} {{ row.product.unit }}</span>
          <span>{{ fmt(row.product.price) }}</span>
          <span class="sum">{{ fmt(row.product.price * row.qty) }}</span>
        </div>
      </template>
    </div>

    <a-divider style="margin: 10px 0" />

    <!-- Jami -->
    <div class="step3__totals">
      <div class="step3__totals__row">
        <span>Общее количество:</span>
        <span>{{ store.totalItems }} позиций</span>
      </div>
      <div class="step3__totals__row total">
        <span>Общая сумма:</span>
        <span>{{ fmt(store.totalAmount) }} сом</span>
      </div>
    </div>

    <!-- Tugmalar -->
    <div class="step3__actions">
      <a-button class="step3__actions__back" @click="store.prevStep()">
        ← Назад
      </a-button>

      <a-button class="step3__actions__word" :loading="loadingWord" @click="downloadWord">
        📄 Word
      </a-button>

      <a-button
        type="primary"
        :loading="loadingConfirm"
        class="step3__actions__confirm"
        @click="confirmOrder"
      >
        ✓ Подтвердить
      </a-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.step3 {
  padding: 12px 12px 30px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    &__title {
      font-size: 16px;
      font-weight: 700;
      color: #224386;
      margin: 0;
    }
    &__num {
      font-size: 12px;
      color: #999;
      background: #f5f5f5;
      padding: 3px 8px;
      border-radius: 6px;
    }
  }

  &__client {
    background: #f8f9ff;
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    &__row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      &__label {
        color: #888;
        min-width: 60px;
      }
      &__value {
        font-weight: 600;
        color: #1a1a2e;
        text-align: right;
      }
    }
  }

  &__table {
    width: 100%;

    &__head {
      display: grid;
      grid-template-columns: 18px 1fr 52px 52px 62px;
      gap: 3px;
      padding: 5px 4px;
      background: #224386;
      color: #fff;
      border-radius: 6px 6px 0 0;
      font-weight: 600;
      font-size: 9px;

      span {
        text-align: center;
      }
      .left {
        text-align: left;
      }
    }

    &__cat {
      background: #e8f0fe;
      color: #224386;
      font-weight: 700;
      font-size: 10px;
      padding: 4px 8px;
      margin-top: 4px;
    }

    &__row {
      display: grid;
      grid-template-columns: 18px 1fr 52px 52px 62px;
      gap: 3px;
      padding: 5px 4px;
      border-bottom: 1px solid #f0f0f0;
      align-items: center;

      &.even {
        background: #fafafa;
      }

      span {
        font-size: 10px;
        text-align: center;
        color: #333;
      }
      .left {
        text-align: left !important;
        line-height: 1.3;
      }
      .sum {
        font-weight: 700;
        color: #224386 !important;
      }
    }
  }

  &__totals {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 4px;

    &__row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #555;

      &.total {
        font-size: 15px;
        font-weight: 700;
        color: #224386;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;

    &__back {
      flex: 1;
      height: 44px;
      border-radius: 10px;
      font-size: 13px;
    }

    &__word {
      flex: 1;
      height: 44px;
      border-radius: 10px;
      font-size: 13px;
      border-color: #224386 !important;
      color: #224386 !important;
      font-weight: 600;
    }

    &__confirm {
      flex: 1.8;
      height: 30px;
      background: #224386;
      border-color: #224386;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      padding: 3px 20px 0px;
      color: #fff;
    }
  }
}
</style>
