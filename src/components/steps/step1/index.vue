<!-- Step1ClientSelect.vue -->
<script setup>
import { ref, computed, onMounted } from "vue";
import { useOrderStore } from "@/stores/useOrderStore";

const store = useOrderStore();

const agentName =
  localStorage.getItem("agentName") || localStorage.getItem("userName") || "";

const clientName = ref(store.selectedClient?.fulName || "");
const touched = ref(false);
const inputRef = ref(null);

const trimmedName = computed(() => clientName.value.trim());
const isValid = computed(() => trimmedName.value.length >= 2);
const showError = computed(() => touched.value && !isValid.value);

function clearInput() {
  clientName.value = "";
  inputRef.value?.focus();
}

function submit() {
  touched.value = true;
  if (!isValid.value) return;

  // selectClient o'zi step = 2 qiladi
  store.selectClient({
    fulName: trimmedName.value,
    region: "",
    phone: "",
    img: "",
  });
}

onMounted(() => {
  setTimeout(() => inputRef.value?.focus(), 150);
});
</script>

<template>
  <div class="step1">
    <div class="step1__hero">
      <div class="step1__hero__icon">🧾</div>
      <h3 class="step1__hero__title">Новая заявка</h3>
      <p class="step1__hero__sub">Укажите клиента, для которого оформляется заявка</p>
      <div v-if="agentName" class="step1__hero__agent">
        <span class="step1__hero__agent__dot"></span>
        Агент: <b>{{ agentName }}</b>
      </div>
    </div>

    <form class="step1__card" @submit.prevent="submit">
      <label class="step1__label" for="client-name">
        Имя клиента <span class="step1__label__req">*</span>
      </label>

      <div class="step1__field" :class="{ error: showError }">
        <span class="step1__field__icon">👤</span>
        <input
          id="client-name"
          ref="inputRef"
          v-model="clientName"
          type="text"
          class="step1__field__input"
          placeholder="Например: Алишер Каримов"
          maxlength="100"
          autocomplete="off"
          @blur="touched = true"
        />
        <button
          v-if="clientName"
          type="button"
          class="step1__field__clear"
          @click="clearInput"
        >
          ✕
        </button>
      </div>

      <p v-if="showError" class="step1__error">
        Введите имя клиента (минимум 2 символа)
      </p>

      <button type="submit" class="step1__btn" :disabled="!isValid">
        Подтвердить и продолжить →
      </button>
    </form>

    <p class="step1__note">Следующий шаг: выбор товаров</p>
  </div>
</template>

<style scoped lang="scss">
$primary: #224386;

.step1 {
  padding: 16px 14px 28px;

  &__hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 22px 16px 18px;
    margin-bottom: 14px;
    border-radius: 16px;
    background: linear-gradient(135deg, #224386 0%, #3a63b8 100%);
    color: #fff;
    box-shadow: 0 6px 18px rgba(34, 67, 134, 0.28);

    &__icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      margin-bottom: 10px;
    }

    &__title {
      margin: 0 0 4px;
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }

    &__sub {
      margin: 0;
      font-size: 12px;
      line-height: 1.4;
      color: rgba(255, 255, 255, 0.82);
      max-width: 260px;
    }

    &__agent {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 12px;
      padding: 4px 12px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.16);
      font-size: 11px;

      b {
        font-weight: 700;
      }

      &__dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #7dff9b;
      }
    }
  }

  &__card {
    background: #fff;
    border-radius: 16px;
    padding: 16px 14px 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  }

  &__label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #1a1a2e;

    &__req {
      color: #e53935;
    }
  }

  &__field {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    padding: 0 12px;
    border: 1.5px solid #d0d5e6;
    border-radius: 10px;
    background: #fff;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:focus-within {
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba(34, 67, 134, 0.12);
    }

    &.error {
      border-color: #e53935;
      box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
    }

    &__icon {
      font-size: 16px;
      flex-shrink: 0;
    }

    &__input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      font-size: 15px;
      color: #1a1a2e;

      &::placeholder {
        color: #a9aec2;
      }
    }

    &__clear {
      flex-shrink: 0;
      width: 22px;
      height: 22px;
      border: none;
      border-radius: 50%;
      background: #eceef5;
      color: #666;
      font-size: 11px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__error {
    margin: 6px 2px 0;
    font-size: 11px;
    color: #e53935;
  }

  &__btn {
    width: 100%;
    margin-top: 16px;
    height: 48px;
    border: none;
    border-radius: 12px;
    background: $primary;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(34, 67, 134, 0.3);

    &:active {
      opacity: 0.9;
    }

    &:disabled {
      background: #c9d1e8;
      box-shadow: none;
      cursor: not-allowed;
    }
  }

  &__note {
    margin: 10px 0 0;
    text-align: center;
    font-size: 11px;
    color: #9aa0b4;
  }
}
</style>