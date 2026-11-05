<!-- views/zayavka/components/Step1ClientSelect.vue -->
<script setup>
import { ref, computed } from "vue";
import { useOrderStore } from "@/stores/useOrderStore";
import { dataAgents } from "@/constants/agents/agent-list.js";

const store = useOrderStore();

// Unikal regionlar
const regions = computed(() => {
  const all = dataAgents.map((c) => c.region).filter(Boolean);
  return ["all", ...new Set(all)];
});

const filteredClients = computed(() => {
  if (store.selectedRegion === "all") return dataAgents;
  return dataAgents.filter((c) => c.region === store.selectedRegion);
});

function selectClient(client) {
  store.selectClient(client);
}

function formatSum(val) {
  return val?.toLocaleString("ru-RU") || "0";
}
</script>

<template>
  <div class="step1">
    <h3 class="step1__title">Выбор агента</h3>

    <!-- Region filter -->
    <div class="step1__regions">
      <a-tag
        v-for="region in regions"
        :key="region"
        :color="store.selectedRegion === region ? 'blue' : 'default'"
        class="step1__regions__tag"
        @click="store.setRegion(region)"
      >
        {{ region === "all" ? "Все" : region }}
      </a-tag>
    </div>

    <!-- Klientlar ro'yxati -->
    <div class="step1__list">
      <div
        v-for="client in filteredClients"
        :key="client.id"
        class="step1__list__card"
        @click="selectClient(client)"
      >
        <a-avatar :src="client.img" :size="46" />
        <div class="step1__list__card__info">
          <p class="step1__list__card__info__name">{{ client?.fulName }}</p>
          <p class="step1__list__card__info__region">📍 {{ client?.region }}</p>
          <p class="step1__list__card__info__phone">📞 {{ client?.phone }}</p>
        </div>
        <div class="step1__list__card__debt">
          <span class="step1__list__card__debt__label">Задолженность</span>
          <span class="step1__list__card__debt__amount">
            {{ formatSum(client.totalDebt) }} {{ client.currency }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.step1 {
  padding: 12px;

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #224386;
    margin-bottom: 12px;
    text-align: center;
  }

  &__regions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 14px;

    &__tag {
      cursor: pointer;
      border-radius: 20px;
      font-size: 12px;
      padding: 3px 10px;
      user-select: none;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      background: #fff;
      cursor: pointer;
      transition: all 0.2s ease;

      &:active {
        box-shadow: 0 4px 14px rgba(34, 67, 134, 0.3);
        background: #f0f5ff;
      }

      &__info {
        flex: 1;
        min-width: 0;

        &__name {
          font-size: 13px;
          font-weight: 600;
          color: #1a1a2e;
          margin: 0 0 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &__region,
        &__phone {
          font-size: 11px;
          color: #666;
          margin: 0;
        }
      }

      &__debt {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        min-width: 80px;

        &__label {
          font-size: 10px;
          color: #999;
        }

        &__amount {
          font-size: 12px;
          font-weight: 600;
          color: #e53935;
        }
      }
    }
  }
}
</style>
