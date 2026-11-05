<script setup>
import Navbar from "@/components/header/index.vue";
import { useOrderStore } from "@/stores/useOrderStore.js";
import Step1ClientSelect from "@/components/steps/step1/index.vue";
import Step1Sklad2ClientSelect from "@/components/steps/step1-sklad2/index.vue";
import Step2ProductSelect from "@/components/steps/step2/index.vue";
import Step2Sklad2ProductSelect from "@/components/steps/step2-sklad2/index.vue";
import Step3Nakladnoy from "@/components/steps/step3/index.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const store = useOrderStore();

const propsDate = {
  title: "Продажа",
  ruot: "/menu",
};


const userRole = ref(localStorage.getItem("userRole") || "");
const router = useRouter();
const pushRouter = (link) => {
  router.push(link);
};

// Qadam sarlavhalari
const stepTitles = {
  1: "Выбор агента",
  2: "Выбор продукта",
  3: "Накладной",
};
</script>

<template>
  <div class="zayavka">
    <Navbar :props="propsDate" />

    <!-- Stepper indikatori -->
    <div class="zayavka__stepper">
      <div
        v-for="n in 3"
        :key="n"
        class="zayavka__stepper__item"
        :class="{
          done: store.step > n,
          active: store.step === n,
        }"
      >
        <div class="zayavka__stepper__item__circle">
          <span v-if="store.step > n">✓</span>
          <span v-else>{{ n }}</span>
        </div>
        <span class="zayavka__stepper__item__label">{{ stepTitles[n] }}</span>
      </div>

      <!-- Connector chiziqlar -->
      <div class="zayavka__stepper__line line1" :class="{ done: store.step > 1 }"></div>
      <div class="zayavka__stepper__line line2" :class="{ done: store.step > 2 }"></div>
    </div>

    <!-- Step content -->

    <!-- Admin uchun  -->
    <div class="zayavka__content"  v-if="userRole === 'admin'">
      <transition name="slide" mode="out-in"  >
        <Step1ClientSelect v-if="store.step === 1" key="step1" />
        <Step2ProductSelect v-else-if="store.step === 2" key="step2" />
        <Step3Nakladnoy v-else-if="store.step === 3" key="step3" />
      </transition>
    </div>


    <!-- Worker sklad 2 uxhun  -->
    <div class="zayavka__content"  v-if="userRole === 'worker-sklad2'">
      <transition name="slide" mode="out-in"  >
        <Step1Sklad2ClientSelect v-if="store.step === 1" key="step1" />
        <Step2Sklad2ProductSelect v-else-if="store.step === 2" key="step2" />
        <Step3Nakladnoy v-else-if="store.step === 3" key="step3" />
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.zayavka {
  min-height: 100vh;
  background: #f7f8fc;

  &__stepper {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 14px 24px 10px;
    background: #fff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
    margin-bottom: 4px;

    &__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      z-index: 1;

      &__circle {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #d0d0d0;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        color: #aaa;
        transition: all 0.2s;
      }

      &__label {
        font-size: 9px;
        color: #aaa;
        text-align: center;
        max-width: 70px;
        line-height: 1.2;
      }

      &.active {
        .zayavka__stepper__item__circle {
          border-color: #224386;
          background: #224386;
          color: #fff;
        }

        .zayavka__stepper__item__label {
          color: #224386;
          font-weight: 600;
        }
      }

      &.done {
        .zayavka__stepper__item__circle {
          border-color: #52c41a;
          background: #52c41a;
          color: #fff;
        }
      }
    }

    &__line {
      position: absolute;
      top: 26px;
      height: 2px;
      background: #e0e0e0;
      transition: background 0.3s;
      z-index: 0;

      &.done {
        background: #52c41a;
      }

      &.line1 {
        left: calc(24px + 14px + 35px);
        right: calc(50% + 14px);
      }

      &.line2 {
        left: calc(50% + 14px);
        right: calc(24px + 14px + 35px);
      }
    }
  }

  &__content {
    overflow: hidden;
  }
}

/* Sahifa o'tish animatsiyasi */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
