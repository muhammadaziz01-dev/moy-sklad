<template>
  <section class="dash">
    <!-- Header + yil -->
    <header class="dash__head">
      <div class="dash__head-text">
        <h2 class="dash__title">Статистика складов</h2>
        <p class="dash__sub">{{ rows.length }} склада · {{ periodLabel }}</p>
      </div>

      <div class="seg" role="group" aria-label="Год">
        <button
          v-for="y in years"
          :key="y"
          type="button"
          :class="['seg__btn', { 'seg__btn--active': selectedYear === y }]"
          @click="selectedYear = y"
        >
          {{ y }}
        </button>
      </div>
    </header>

    <!-- Oylar -->
    <div class="months" ref="monthsRef" role="group" aria-label="Месяц">
      <button
        type="button"
        :class="['chip', { 'chip--active': selectedMonth === 'all' }]"
        @click="selectedMonth = 'all'"
      >
        Весь год
      </button>
      <button
        v-for="(m, i) in MONTHS_SHORT"
        :key="i"
        type="button"
        :class="[
          'chip',
          { 'chip--active': selectedMonth === i, 'chip--empty': !monthHasData[i] },
        ]"
        @click="selectedMonth = i"
      >
        {{ m }}
      </button>
    </div>

    <!-- Metrikalar -->
    <div class="metrics" style="grid-template-columns: repeat(2, minmax(0, 1fr))">
      <div class="metric metric--danger">
        <span class="metric__label">Расход</span>
        <span class="metric__value"
          >{{ formatShort(totalOutcome) }}<small> сом</small></span
        >
        <span class="metric__note">вышло со складов</span>
      </div>
      <div class="metric metric--success">
        <span class="metric__label">Приход</span>
        <span class="metric__value"
          >{{ formatShort(totalIncome) }}<small> сом</small></span
        >
        <span class="metric__note">поступило на склады</span>
      </div>
    </div>

    <!-- Tablar -->
    <div class="tabs" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.key"
        :class="['tab', { 'tab--active': activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Sklad bo'yicha grafik -->
    <div class="card">
      <p class="card__label">{{ activeTabLabel }} по складам · {{ periodLabel }}</p>

      <div
        v-show="hasData"
        class="chart-wrapper"
        :style="{ height: barChartHeight + 'px' }"
      >
        <canvas ref="barCanvasRef"></canvas>
      </div>
      <div v-if="!hasData" class="empty">Нет данных за выбранный период</div>

      <div v-if="hasData" class="legend">
        <span class="legend__item" v-for="item in legendItems" :key="item.label">
          <span class="legend__dot" :style="{ background: item.color }"></span>
          {{ item.label }}
        </span>
      </div>
    </div>

    <!-- Oyma-oy trend (tanlangan yil, barcha skladlar yig'indisi) -->
    <div v-if="hasYearData" class="card">
      <p class="card__label">Динамика по месяцам · {{ selectedYear }} · все склады</p>
      <div class="chart-wrapper" style="height: 220px">
        <canvas ref="trendCanvasRef"></canvas>
      </div>
      <div class="legend">
        <span class="legend__item">
          <span class="legend__dot" :style="{ background: colorMap.income }"></span>Приход
        </span>
        <span class="legend__item">
          <span class="legend__dot" :style="{ background: colorMap.outcome }"></span
          >Расход
        </span>
      </div>
    </div>

    <!-- Skladlar ro'yxati -->
    <div v-if="hasData" class="card card--list">
      <p class="card__label">Склады · {{ periodLabel }}</p>
      <ul class="list">
        <li v-for="(r, i) in rows" :key="r.id" class="agent">
          <span :class="['agent__rank', rankClass(i)]">{{ i + 1 }}</span>

          <div class="agent__info">
            <span class="agent__name">{{ r.fullName || r.name }}</span>
            <span class="agent__region">{{ r.region }}</span>
          </div>

          <div class="agent__stats">
            <span class="agent__sales" :style="{ color: colorMap.outcome }">
              Расход {{ formatShort(r.outcome) }}
            </span>
            <span class="agent__sales" :style="{ color: colorMap.income }">
              Приход {{ formatShort(r.income) }}
            </span>
          </div>

          <a
            v-if="r.phoneUrl"
            class="agent__call"
            :href="r.phoneUrl"
            :aria-label="'Позвонить: ' + r.name"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
              />
            </svg>
          </a>
          <span v-else class="agent__call agent__call--off"></span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import Chart from "chart.js/auto";
// Yo'lni o'zingizning loyihangizga moslang
import { MONTHS, MONTHS_SHORT, getVolume, getYears } from "@/constants/data/analitic/data-all-sklad.js";

const props = defineProps({
  sklads: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// ─── State ───────────────────────────────────────────────
const dataYears = getYears(props.sklads);
const nowYear = new Date().getFullYear();
const nowMonth = new Date().getMonth();

const activeTab = ref("all");
const selectedYear = ref(dataYears.includes(nowYear) ? nowYear : dataYears[0] ?? nowYear);
const selectedMonth = ref(selectedYear.value === nowYear ? nowMonth : "all");

const barCanvasRef = ref(null);
const trendCanvasRef = ref(null);
const monthsRef = ref(null);
let barChartInstance = null;
let trendChartInstance = null;

const tabs = [
  { key: "all", label: "Все" },
  { key: "income", label: "Приход" },
  { key: "outcome", label: "Расход" },
];

const colorMap = {
  income: "#1D9E75",
  outcome: "#D85A30",
};

const legendAll = [
  { key: "outcome", label: "Расход", color: colorMap.outcome },
  { key: "income", label: "Приход", color: colorMap.income },
];

// ─── Computed ─────────────────────────────────────────────
const skladList = computed(() => props.sklads.filter((a) => a.rol === "sklad"));

const years = computed(() => {
  const list = getYears(props.sklads);
  return list.length ? list : [nowYear];
});

const periodLabel = computed(() =>
  selectedMonth.value === "all"
    ? `${selectedYear.value} год`
    : `${MONTHS[selectedMonth.value]} ${selectedYear.value}`
);

const monthHasData = computed(() =>
  MONTHS.map((_, i) =>
    skladList.value.some(
      (a) =>
        getVolume(a, selectedYear.value, i, "income") > 0 ||
        getVolume(a, selectedYear.value, i, "outcome") > 0
    )
  )
);

const activeTabLabel = computed(
  () => tabs.find((t) => t.key === activeTab.value)?.label || ""
);

const rows = computed(() => {
  const list = skladList.value.map((a) => {
    const income = getVolume(a, selectedYear.value, selectedMonth.value, "income");
    const outcome = getVolume(a, selectedYear.value, selectedMonth.value, "outcome");
    return {
      id: a.id,
      name: a.name,
      fullName: (a.fulName || "").trim(),
      region: a.region,
      phoneUrl: a.phoneUrl,
      income,
      outcome,
    };
  });
  const key = activeTab.value === "all" ? "outcome" : activeTab.value;
  return list.sort((a, b) => b[key] - a[key]);
});

const totalIncome = computed(() => rows.value.reduce((s, r) => s + r.income, 0));
const totalOutcome = computed(() => rows.value.reduce((s, r) => s + r.outcome, 0));

const hasData = computed(() => rows.value.some((r) => r.income || r.outcome));

// Tanlangan yil bo'yicha oyma-oy yig'indi (trend grafik uchun)
const monthlyTotals = computed(() => {
  const income = MONTHS.map((_, i) =>
    skladList.value.reduce((s, a) => s + getVolume(a, selectedYear.value, i, "income"), 0)
  );
  const outcome = MONTHS.map((_, i) =>
    skladList.value.reduce(
      (s, a) => s + getVolume(a, selectedYear.value, i, "outcome"),
      0
    )
  );
  return { income, outcome };
});

const hasYearData = computed(
  () =>
    monthlyTotals.value.income.some((v) => v) ||
    monthlyTotals.value.outcome.some((v) => v)
);

const legendItems = computed(() =>
  activeTab.value === "all"
    ? legendAll
    : legendAll.filter((l) => l.key === activeTab.value)
);

const barChartHeight = computed(() => {
  const perRow = activeTab.value === "all" ? 90 : 42;
  return Math.max(rows.value.length * perRow + 40, 200);
});

// ─── Helpers ──────────────────────────────────────────────
const formatShort = (v) => {
  if (!v) return "0";
  const sign = v < 0 ? "-" : "";
  const a = Math.abs(v);
  if (a >= 1_000_000) return sign + (a / 1_000_000).toFixed(1) + " M";
  if (a >= 1_000) return sign + (a / 1_000).toFixed(0) + " K";
  return sign + a.toString();
};

const formatFull = (v) => (v || 0).toLocaleString("ru-RU") + " сом";

const rankClass = (i) =>
  i === 0
    ? "agent__rank--gold"
    : i === 1
    ? "agent__rank--silver"
    : i === 2
    ? "agent__rank--bronze"
    : "";

// ─── Bar chart (skladlar bo'yicha) ────────────────────────
const datasetFor = (key, label, extra = {}) => ({
  label,
  data: rows.value.map((r) => r[key]),
  backgroundColor: colorMap[key],
  borderRadius: 4,
  ...extra,
});

const getBarDatasets = () => {
  if (activeTab.value === "all") {
    return legendAll.map((l) =>
      datasetFor(l.key, l.label, { barPercentage: 0.85, categoryPercentage: 0.8 })
    );
  }
  return [
    datasetFor(activeTab.value, activeTabLabel.value, {
      borderRadius: 5,
      barPercentage: 0.7,
      categoryPercentage: 0.85,
    }),
  ];
};

const buildBarChart = () => {
  if (barChartInstance) {
    barChartInstance.destroy();
    barChartInstance = null;
  }
  if (!barCanvasRef.value) return;

  const textColor = "#6b7280";
  const gridColor = "rgba(100,116,139,0.14)";

  barChartInstance = new Chart(barCanvasRef.value, {
    type: "bar",
    data: {
      labels: rows.value.map((r) => r.name),
      datasets: getBarDatasets(),
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", axis: "y", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${formatFull(ctx.raw)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            callback: (v) => formatShort(v),
            font: { size: 11 },
            color: textColor,
            maxTicksLimit: 5,
          },
          grid: { color: gridColor },
          border: { display: false },
        },
        y: {
          ticks: {
            font: { size: 12 },
            color: textColor,
            callback(value) {
              const l = this.getLabelForValue(value);
              return l.length > 11 ? l.slice(0, 10) + "…" : l;
            },
          },
          grid: { display: false },
          border: { display: false },
        },
      },
    },
  });
};

// ─── Trend chart (oyma-oy) ────────────────────────────────
const buildTrendChart = () => {
  if (trendChartInstance) {
    trendChartInstance.destroy();
    trendChartInstance = null;
  }
  if (!trendCanvasRef.value) return;

  const textColor = "#6b7280";
  const gridColor = "rgba(100,116,139,0.14)";

  trendChartInstance = new Chart(trendCanvasRef.value, {
    type: "line",
    data: {
      labels: MONTHS_SHORT,
      datasets: [
        {
          label: "Приход",
          data: monthlyTotals.value.income,
          borderColor: colorMap.income,
          backgroundColor: colorMap.income,
          tension: 0.3,
          pointRadius: 3,
          borderWidth: 2,
        },
        {
          label: "Расход",
          data: monthlyTotals.value.outcome,
          borderColor: colorMap.outcome,
          backgroundColor: colorMap.outcome,
          tension: 0.3,
          pointRadius: 3,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${formatFull(ctx.raw)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { font: { size: 11 }, color: textColor },
          grid: { display: false },
          border: { display: false },
        },
        y: {
          ticks: {
            callback: (v) => formatShort(v),
            font: { size: 11 },
            color: textColor,
            maxTicksLimit: 5,
          },
          grid: { color: gridColor },
          border: { display: false },
        },
      },
    },
  });
};

const refreshCharts = async () => {
  await nextTick();

  if (!barChartInstance) {
    buildBarChart();
  } else {
    barChartInstance.data.labels = rows.value.map((r) => r.name);
    barChartInstance.data.datasets = getBarDatasets();
    barChartInstance.resize();
    barChartInstance.update();
  }

  // Trend canvas v-if bilan chiqadi/yo'qoladi — shuning uchun qayta quramiz
  buildTrendChart();
};

const scrollActiveMonthIntoView = () => {
  const el = monthsRef.value?.querySelector(".chip--active");
  el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
};

// ─── Watchers ─────────────────────────────────────────────
watch([activeTab, selectedYear, selectedMonth], refreshCharts);

watch(selectedMonth, async () => {
  await nextTick();
  scrollActiveMonthIntoView();
});

watch(
  () => props.sklads,
  async () => {
    await nextTick();
    buildBarChart();
    buildTrendChart();
  },
  { deep: true }
);

// ─── Lifecycle ────────────────────────────────────────────
onMounted(async () => {
  await nextTick();
  buildBarChart();
  buildTrendChart();
  scrollActiveMonthIntoView();
});

onBeforeUnmount(() => {
  barChartInstance?.destroy();
  trendChartInstance?.destroy();
  barChartInstance = null;
  trendChartInstance = null;
});
</script>

<style scoped>
.dash {
  /* Faqat yorug' mavzu: qora fon yo'q */
  color-scheme: light;
  --text: #111827;
  --muted: #6b7280;
  --faint: #9ca3af;
  --border: #e6eaf1;
  --surface: #ffffff;
  --surface-2: #eceff5;
  --page: #f4f6fb;
  --accent: #2f6fe4;
  --accent-soft: #e8f0fe;
  --success-bg: #e8f8f0;
  --success-fg: #0d7a58;
  --danger-bg: #fff0ea;
  --danger-fg: #b3431e;
  --shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
  --shadow-md: 0 1px 2px rgba(16, 24, 40, 0.05), 0 6px 18px rgba(16, 24, 40, 0.06);

  box-sizing: border-box;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 14px 12px 18px;
  border-radius: 20px;
  /* background: var(--page); */
  font-family: "Segoe UI", system-ui, -apple-system, "Inter", sans-serif;
  color: var(--text);
  -webkit-text-size-adjust: 100%;
}
.dash *,
.dash *::before,
.dash *::after {
  box-sizing: border-box;
}
.dash button {
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
}
.dash button:focus-visible,
.dash a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Header */
.dash__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.dash__head-text {
  min-width: 0;
}
.dash__title {
  margin: 0 0 3px;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--text) !important;
}
.dash__sub {
  margin: 0;
  font-size: 0.8rem;
  color: var(--muted);
}

/* Segment (yil) va Tablar: oq "pill" bilan */
.seg,
.tabs {
  padding: 3px;
  border-radius: 12px;
  background: var(--surface-2);
}
.seg {
  display: inline-flex;
  flex-shrink: 0;
}
.tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 3px;
  margin-bottom: 12px;
}
.seg__btn,
.tab {
  min-height: 36px;
  padding: 0 12px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
}
.tab {
  min-height: 40px;
  padding: 0 6px;
}
.seg__btn--active,
.tab--active {
  background: var(--surface);
  color: var(--accent);
  box-shadow: var(--shadow-sm);
}

/* Oylar: gorizontal scroll */
.months {
  display: flex;
  gap: 6px;
  margin: 0 -12px 14px;
  padding: 4px 12px;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent 0,
    #000 12px,
    #000 calc(100% - 16px),
    transparent 100%
  );
  mask-image: linear-gradient(
    90deg,
    transparent 0,
    #000 12px,
    #000 calc(100% - 16px),
    transparent 100%
  );
}
.months::-webkit-scrollbar {
  display: none;
}
.chip {
  flex: 0 0 auto;
  min-height: 36px;
  padding: 0 15px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  scroll-snap-align: center;
  transition: background 0.18s, color 0.18s, border-color 0.18s, box-shadow 0.18s;
}
.chip--empty {
  opacity: 0.5;
}
.chip--active {
  background: var(--accent);
  border-color: var(--accent);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(47, 111, 228, 0.35);
  opacity: 1;
}

/* Metrikalar */
.metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}
.metric {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  padding: 13px 14px;
  border-radius: 16px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}
.metric--wide {
  grid-column: 1 / -1;
}
.metric__label {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--muted);
}
.metric__value {
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  color: var(--text);
}
.metric__value small {
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--faint);
}
.metric__note {
  font-size: 0.72rem;
  color: var(--muted);
}

/* Asosiy karta: ko'k gradient */
.metric--sales {
  background: linear-gradient(135deg, #2f6fe4 0%, #4a90e8 100%);
  box-shadow: 0 8px 22px rgba(47, 111, 228, 0.28);
}
.metric--sales .metric__label {
  color: rgba(255, 255, 255, 0.82);
}
.metric--sales .metric__value {
  font-size: 1.75rem;
  color: #ffffff;
}
.metric--sales .metric__value small {
  color: rgba(255, 255, 255, 0.75);
}
.metric--success {
  background: var(--success-bg);
  box-shadow: none;
}
.metric--success .metric__value,
.metric--success .metric__note {
  color: var(--success-fg);
}
.metric--danger {
  background: var(--danger-bg);
  box-shadow: none;
}
.metric--danger .metric__value,
.metric--danger .metric__note {
  color: var(--danger-fg);
}

/* Kartalar */
.card {
  margin-bottom: 14px;
  padding: 14px 14px 12px;
  border-radius: 18px;
  background: var(--surface);
  box-shadow: var(--shadow-md);
}
.card__label {
  margin: 0 0 10px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}
.chart-wrapper {
  position: relative;
  width: 100%;
}
.empty {
  padding: 40px 8px;
  text-align: center;
  font-size: 0.88rem;
  color: var(--muted);
}

/* Legend */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 8px;
  margin-top: 12px;
}
.legend__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--surface-2);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--muted);
}
.legend__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.hint {
  margin: 10px 0 0;
  font-size: 0.72rem;
  line-height: 1.4;
  color: var(--faint);
}

/* Reyting */
.card--list {
  margin-bottom: 0;
  padding-bottom: 4px;
}
.list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.agent {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid var(--border);
}
.agent:last-child {
  border-bottom: 0;
}
.agent__rank {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--surface-2);
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 700;
}
.agent__rank--gold {
  background: #fff1c2;
  color: #a86f00;
}
.agent__rank--silver {
  background: #e9ecf1;
  color: #5b6472;
}
.agent__rank--bronze {
  background: #fde3d1;
  color: #9a4a1f;
}
.agent__info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}
.agent__name {
  overflow: hidden;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.agent__region {
  overflow: hidden;
  font-size: 0.72rem;
  color: var(--faint);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.agent__stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
  min-width: 84px;
}
.agent__sales {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text);
}
.bar {
  width: 84px;
  height: 5px;
  border-radius: 3px;
  background: var(--surface-2);
  overflow: hidden;
}
.bar__fill {
  display: block;
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}
.agent__pct {
  font-size: 0.7rem;
  font-weight: 700;
}
.agent__call {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent);
  text-decoration: none;
  transition: transform 0.12s, background 0.18s;
}
.agent__call:active {
  transform: scale(0.92);
}
.agent__call--off {
  background: transparent;
}

/* Hover faqat sichqonchali qurilmalarda */
@media (hover: hover) {
  .chip:hover:not(.chip--active) {
    border-color: var(--accent);
    color: var(--accent);
  }
  .seg__btn:hover:not(.seg__btn--active),
  .tab:hover:not(.tab--active) {
    color: var(--text);
  }
  .agent__call:hover {
    background: #d6e4fd;
  }
}

/* Planshet / desktop */
@media (min-width: 480px) {
  .metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .metric--wide {
    grid-column: auto;
  }
  .metric--sales .metric__value {
    font-size: 1.5rem;
  }
}
@media (min-width: 768px) {
  .dash {
    padding: 22px;
  }
  .dash__title {
    font-size: 1.4rem;
  }
  .months {
    margin: 0 0 14px;
    padding: 4px 0;
    flex-wrap: wrap;
    overflow-x: visible;
    -webkit-mask-image: none;
    mask-image: none;
  }
}

/* Juda tor ekranlar */
@media (max-width: 360px) {
  .dash {
    padding: 12px 10px 16px;
    border-radius: 16px;
  }
  .months {
    margin: 0 -10px 14px;
    padding: 4px 10px;
  }
  .metric__value {
    font-size: 1.1rem;
  }
  .metric--sales .metric__value {
    font-size: 1.5rem;
  }
  .agent__stats {
    min-width: 72px;
  }
  .bar {
    width: 72px;
  }
  .tab {
    font-size: 0.74rem;
  }
}

/* Harakatni kamaytirishni so'ragan foydalanuvchilar uchun */
@media (prefers-reduced-motion: reduce) {
  .dash * {
    transition: none !important;
  }
}
</style>
