<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'
import Panel from '@/components/Panel.vue'
import { useKampStore } from '@/stores/kampStore'
import { useDeltagerStore } from '@/stores/deltagerStore'
import { useRanklisteStats } from '@/composables/useRanklisteStats'

const DataStatePanel = defineAsyncComponent(() => import('@/components/DataStatePanel.vue'))
const RecentActivityFeed = defineAsyncComponent(() => import('@/components/RecentActivityFeed.vue'))

const kampStore = useKampStore()
const deltagerStore = useDeltagerStore()
const { rankliste } = useRanklisteStats()

const barContainer = ref<HTMLElement | null>(null)
const donutContainer = ref<HTMLElement | null>(null)

const chartKey = ref(0)

let observer: ResizeObserver
let timeout: number

const isMobile = ref(window.innerWidth < 768)

function getCssVar(name: string, fallback = ''): string {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name)
    return (v || fallback).trim()
  } catch (_e) {
    return fallback
  }
}

function hexToRgba(input: string, alpha = 1): string {
  const hex = input.trim()
  if (!hex) return `rgba(0,0,0,${alpha})`
  if (hex.startsWith('rgb')) return hex

  const h = hex.replace('#', '')
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16)
    const g = parseInt(h[1] + h[1], 16)
    const b = parseInt(h[2] + h[2], 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  if (h.length === 6) {
    const r = parseInt(h.substring(0, 2), 16)
    const g = parseInt(h.substring(2, 4), 16)
    const b = parseInt(h.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return `rgba(0,0,0,${alpha})`
}

const themeIsLight = ref(document.documentElement.classList.contains('theme-light') || localStorage.getItem('theme') === 'light')
let themeObserver: MutationObserver | undefined

onMounted(() => {
  themeObserver = new MutationObserver(() => {
    themeIsLight.value = document.documentElement.classList.contains('theme-light') || localStorage.getItem('theme') === 'light'
  })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  themeObserver?.disconnect()
})

onMounted(() => {
  observer = new ResizeObserver(() => {
    clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      chartKey.value++
    }, 150)
  })

  if (barContainer.value) observer.observe(barContainer.value)
  if (donutContainer.value) observer.observe(donutContainer.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

const mestAktive = computed(() => {
  return rankliste.value
    .map((item) => ({
      navn: item.navn,
      kampe: item.kampeSpillet,
      wins: item.wins,
      losses: item.losses,
      winrate: item.win,
    }))
    .sort((a, b) => {
      if (b.kampe !== a.kampe) {
        return b.kampe - a.kampe
      }

      return b.wins - a.wins
    })
    .slice(0, 8)
})

const loading = computed(() => kampStore.isLoading || deltagerStore.isLoading)
const error = computed(() => kampStore.error || deltagerStore.error)
const empty = computed(() => kampStore.kampe.length === 0 && deltagerStore.deltagere.length === 0)
const antalDeltagere = computed(() => deltagerStore.deltagere.length)
const antalKampe = computed(() => kampStore.kampe.length)
const topAktiveSpillere = computed(() => mestAktive.value.slice(0, 8))
const totalSejre = computed(() => rankliste.value.reduce((sum, spiller) => sum + spiller.wins, 0))
const totalNederlag = computed(() => rankliste.value.reduce((sum, spiller) => sum + spiller.losses, 0))
const bedsteWinrate = computed(() => {
  if (rankliste.value.length === 0) {
    return null
  }

  return rankliste.value.reduce((bedste, nuvaerende) => {
    if (nuvaerende.win > bedste.win) {
      return nuvaerende
    }

    if (nuvaerende.win === bedste.win && nuvaerende.kampeSpillet > bedste.kampeSpillet) {
      return nuvaerende
    }

    return bedste
  })
})

const chartSeries = computed(() => [
  {
    name: 'Sejre',
    data: topAktiveSpillere.value.map((spiller) => spiller.wins),
  },
  {
    name: 'Nederlag',
    data: topAktiveSpillere.value.map((spiller) => spiller.losses),
  },
])

const donutSeries = computed(() => [totalSejre.value, totalNederlag.value])

const donutOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'donut',
    toolbar: {
      show: false,
    },
    foreColor: getCssVar('--color-text', '#f8f8f8'),
    fontFamily: 'Segoe UI, Open Sans, sans-serif',
  },
  labels: ['Sejre', 'Nederlag'],
  colors: [getCssVar('--color-winner', '#38c73f'), getCssVar('--color-loser', '#ef5252')],
  legend: {
    position: 'bottom',
    labels: {
      colors: getCssVar('--color-text', '#f8f8f8'),
    },
  },
  dataLabels: {
    enabled: true,
  },
  stroke: {
    width: 2,
    colors: [getCssVar('--color-bg', '#111111')],
  },
  plotOptions: {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          name: {
            color: getCssVar('--color-text', '#f8f8f8'),
          },
          value: {
            color: getCssVar('--color-text', '#f8f8f8'),
            formatter: (value) => `${value}`,
          },
          total: {
            show: true,
            label: 'Kampe',
            color: getCssVar('--color-border', '#cbd5e1'),
            formatter: (ctx) => {
              const total = ctx.globals.seriesTotals.reduce((sum: number, value: number) => sum + value, 0)
              return `${total}`
            },
          },
        },
      },
    },
  },
  tooltip: {
    theme: themeIsLight.value ? 'light' : 'dark',
  },
  noData: {
    text: 'Ingen data endnu',
  },
}))

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: {
      show: false,
    },
    foreColor: getCssVar('--color-text', '#f8f8f8'),
    fontFamily: 'Segoe UI, Open Sans, sans-serif',
    animations: {
      enabled: true,
      speed: 450,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 8,
      barHeight: '68%',
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (value) => `${value}`,
  },
  stroke: {
    width: 0,
  },
  colors: [getCssVar('--color-winner', '#38c73f'), getCssVar('--color-loser', '#ef5252')],
  grid: {
    borderColor: hexToRgba(getCssVar('--color-text', '#f8f8f8'), 0.12),
  },
  xaxis: {
    categories: topAktiveSpillere.value.map((spiller) => spiller.navn),
    labels: {
      style: {
        colors: hexToRgba(getCssVar('--color-text', '#f8f8f8'), 0.8),
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: hexToRgba(getCssVar('--color-text', '#f8f8f8'), 0.8),
      },
    },
  },
  legend: {
    position: 'top',
    labels: {
      colors: getCssVar('--color-text', '#f8f8f8'),
    },
  },
  tooltip: {
    theme: themeIsLight.value ? 'light' : 'dark',
  },
  responsive: [
    {
      breakpoint: 900,
      options: {
        plotOptions: {
          bar: {
            barHeight: '78%',
          },
        },
      },
    },
  ],
  noData: {
    text: 'Ingen data endnu',
  },
}))

async function retry() {
  await Promise.all([
    deltagerStore.fetchDeltagere({ force: true }),
    kampStore.fetchKampe({ force: true }),
  ])
}

onMounted(async () => {
  await Promise.all([
    deltagerStore.ensureLoaded(),
    kampStore.ensureLoaded(),
  ])
})
</script>

<template>
  <main class="stats-layout">
    <Panel>
      <DataStatePanel
        :loading="loading"
        :error="error"
        :empty="empty"
        empty-text="Ingen data endnu"
        @retry="retry"
      />

      <div class="stats-summary">
        <article class="summary-card">
          <span class="summary-label">Deltagere</span>
          <strong>{{ antalDeltagere }}</strong>
        </article>
        <article class="summary-card">
          <span class="summary-label">Kampe</span>
          <strong>{{ antalKampe }}</strong>
        </article>
        <article class="summary-card">
          <span class="summary-label">Bedste winrate</span>
          <strong v-if="bedsteWinrate">{{ bedsteWinrate.navn }}</strong>
          <strong v-else>-</strong>
          <span v-if="bedsteWinrate" class="summary-meta">{{ bedsteWinrate.win.toFixed(1) }}%</span>
        </article>
      </div>

      <section class="chart-grid">
        <div class="chart-card" ref="barContainer">
          <h2>Mest aktive spillere</h2>
          <VueApexCharts
            :key="chartKey"
            class="stats-chart"
            type="bar"
            :options="chartOptions"
            :series="chartSeries"
            :height="isMobile ? 260 : 360"
          />
          <p v-if="topAktiveSpillere.length === 0">Ingen deltagere fundet</p>
        </div>

        <div class="chart-card" ref="donutContainer">
          <h2>Wins mod tab</h2>
          <VueApexCharts
            :key="chartKey + '-donut'"
            class="stats-chart donut-chart"
            type="donut"
            :options="donutOptions"
            :series="donutSeries"
            :height="isMobile ? 260 : 360"
          />
          <p v-if="antalKampe === 0">Ingen kampe fundet</p>
        </div>
      </section>
    </Panel>

    <Panel>
      <RecentActivityFeed :kampe="kampStore.kampe" :limit="10" />
    </Panel>
  </main>
</template>

<style scoped>
.stats-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.stats-summary {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.chart-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 2rem;
}

.chart-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 0.85rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-height: 5rem;
}

.summary-label {
  opacity: 0.75;
  font-size: 0.82rem;
}

.summary-card strong {
  font-size: 1.15rem;
}

.summary-meta {
  opacity: 0.82;
}

.stats-chart {
  margin-top: 0.5rem;
  height: 260px;
}

.donut-chart {
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-wrapper {
  width: 100%;
  min-height: 260px;
}

.stats-chart {
  display: block;
  width: 100% !important;
}

@media (min-width: 640px) {
  .stats-layout {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .chart-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .chart-card {
    gap: 1rem;
    min-width: 0;
  }
  .stats-chart {
    height: 360px;
  }
}
</style>
