import skladAdir from "@/assets/skladAdir.svg";
import Sklad3 from "@/assets/sklad1.png";
import Sklad2 from "@/assets/sklad2.png";

export const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export const MONTHS_SHORT = [
  "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
];

// outcome = chiqim: shu oyda skladdan chiqqan tovarlar qiymati
// income  = kirim:  shu oyda skladga kelib tushgan tovarlar qiymati
// Har oy uchun 12 ta son (Янв ... Дек). Hali kelmagan oylar 0 bo'lsin.

const sklads = [
  // Склад 1 — asosiy: oyiga ~40 M kiradi, ~35 M chiqadi
  {
    id: "Sklad1",
    name: "Склад 1",
    fulName: "Склад 1",
    img: Sklad3,
    phone: "",
    phoneUrl: "",
    region: "Склад каленин колхоз",
    currency: "сом",
    rol: "sklad",
    volume: {
      2025: {
        income:  [40000000, 41000000, 39000000, 42000000, 40000000, 38000000, 41000000, 43000000, 40000000, 42000000, 39000000, 44000000],
        outcome: [35000000, 34000000, 36000000, 35000000, 33000000, 36000000, 37000000, 36000000, 34000000, 38000000, 35000000, 37000000],
      },
      2026: {
        income:  [41000000, 40000000, 42000000, 39000000, 41000000, 43000000, 40000000, 42000000, 41000000, 44000000, 18000000, 0],
        outcome: [36000000, 35000000, 34000000, 36000000, 37000000, 35000000, 36000000, 38000000, 35000000, 36000000, 15000000, 0],
      },
    },
  },

  // Склад 2 — kichik: odatda ~20 M kiradi, ~17 M chiqadi;
  // ba'zi oylarda zahira sifatida 40 M kiradi, atigi 10 M chiqadi
  {
    id: "Sklad2",
    name: "Склад 2",
    fulName: "Склад 2",
    img: Sklad2,
    phone: "",
    phoneUrl: "",
    region: "Склад каленин колхоз",
    currency: "сом",
    rol: "sklad",
    volume: {
      2025: {
        income:  [20000000, 19000000, 40000000, 21000000, 18000000, 20000000, 22000000, 40000000, 19000000, 21000000, 20000000, 23000000],
        outcome: [17000000, 18000000, 10000000, 16000000, 17000000, 18000000, 19000000, 10000000, 17000000, 18000000, 16000000, 19000000],
      },
      2026: {
        income:  [21000000, 20000000, 19000000, 40000000, 22000000, 18000000, 21000000, 20000000, 40000000, 19000000, 9000000, 0],
        outcome: [18000000, 17000000, 16000000, 10000000, 18000000, 17000000, 19000000, 18000000, 10000000, 17000000, 7000000, 0],
      },
    },
  },

  // Склад адир — kichik, zahira oylari Склад 2 dan boshqacha
  {
    id: "Sklad-adir",
    name: "Склад адир",
    fulName: "Склад адир",
    img: skladAdir,
    phone: "",
    phoneUrl: "",
    region: "Склад адир",
    currency: "сом",
    rol: "sklad",
    volume: {
      2025: {
        income:  [22000000, 18000000, 20000000, 40000000, 19000000, 21000000, 18000000, 40000000, 22000000, 20000000, 19000000, 21000000],
        outcome: [18000000, 16000000, 17000000, 10000000, 17000000, 19000000, 15000000, 10000000, 18000000, 17000000, 16000000, 18000000],
      },
      2026: {
        income:  [18000000, 21000000, 40000000, 20000000, 19000000, 22000000, 40000000, 18000000, 20000000, 21000000, 10000000, 0],
        outcome: [15000000, 18000000, 10000000, 17000000, 16000000, 19000000, 10000000, 15000000, 17000000, 18000000, 8000000, 0],
      },
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────

// field: "income" | "outcome"; month: 0..11 yoki "all"
export const getVolume = (sklad, year, month, field = "outcome") => {
  const arr = sklad.volume?.[year]?.[field] || [];
  if (month === "all") return arr.reduce((s, v) => s + (v || 0), 0);
  return arr[month] || 0;
};

export const getYears = (list) => {
  const set = new Set();
  list.forEach((a) => Object.keys(a.volume || {}).forEach((y) => set.add(Number(y))));
  return [...set].sort((a, b) => b - a);
};

export const dataSklad = sklads;