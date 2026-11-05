// stores/useOrderStore.js
import { defineStore } from "pinia"

export const useOrderStoreSklad2 = defineStore("order", {
  state: () => ({
    // Tanlangan klient
    selectedClient: null,

    // Tanlangan mahsulotlar: { productId: { product, qty } }
    orderItems: {},

    // Joriy qadam: 1 = klient, 2 = mahsulotlar, 3 = nakladnoy
    step: 1,

    // Brend filtri
    selectedBrand: "all",

    // Kategoriya filtri
    selectedCategory: "all",

    // Region filtri (klientlar uchun)
    selectedRegion: "all",
  }),

  getters: {
    // Jamlanma mahsulotlar ro'yxati (array)
    orderList: (state) => Object.values(state.orderItems),

    // Umumiy summa
    totalAmount: (state) => {
      return Object.values(state.orderItems).reduce((sum, item) => {
        return sum + item.product.price * item.qty
      }, 0)
    },

    // Umumiy pozitsiyalar soni
    totalItems: (state) => Object.values(state.orderItems).length,

    // Tanlangan mahsulot miqdorini olish
    getQty: (state) => (productId) => {
      return state.orderItems[productId]?.qty || 0
    },

    // Zakaz bo'shmi?
    isEmpty: (state) => Object.keys(state.orderItems).length === 0,
  },

  actions: {
    // Klientni tanlash
    selectClient(client) {
      this.selectedClient = client
      this.step = 2
    },

    // Qadam orqaga
    prevStep() {
      if (this.step > 1) this.step--
    },

    // Qadam oldinga
    nextStep() {
      if (this.step < 3) this.step++
    },

    // Mahsulot qo'shish yoki miqdorni o'zgartirish
    setQty(product, qty) {
      if (qty <= 0) {
        delete this.orderItems[product.id]
      } else {
        this.orderItems[product.id] = { product, qty }
      }
    },

    // Mahsulotni +1
    increment(product) {
      const current = this.orderItems[product.id]?.qty || 0
      this.setQty(product, current + 1)
    },

    // Mahsulotni -1
    decrement(product) {
      const current = this.orderItems[product.id]?.qty || 0
      if (current > 0) this.setQty(product, current - 1)
    },

    // Zakazni to'liq tozalash
    clearOrder() {
      this.orderItems = {}
      this.selectedClient = null
      this.step = 1
      this.selectedBrand = "all"
      this.selectedCategory = "all"
      this.selectedRegion = "all"
    },

    // Filterlarni set qilish
    setBrand(brand) {
      this.selectedBrand = brand
      this.selectedCategory = "all"
    },

    setCategory(category) {
      this.selectedCategory = category
    },

    setRegion(region) {
      this.selectedRegion = region
    },
  },
})