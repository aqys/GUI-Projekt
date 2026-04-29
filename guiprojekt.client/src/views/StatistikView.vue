<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue'
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
    foreColor: '#f8f8f8',
    fontFamily: 'Segoe UI, Open Sans, sans-serif',
  },
  labels: ['Sejre', 'Nederlag'],
  colors: ['#38c73f', '#ef5252'],
  legend: {
    position: 'bottom',
    labels: {
      colors: '#f8f8f8',
    },
  },
  dataLabels: {
    enabled: true,
  },
  stroke: {
    width: 2,
    colors: ['#111111'],
  },
  plotOptions: {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          name: {
            color: '#f8f8f8',
          },
          value: {
            color: '#f8f8f8',
            formatter: (value) => `${value}`,
          },
          total: {
            show: true,
            label: 'Kampe',
            color: '#cbd5e1',
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
    theme: 'dark',
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
    foreColor: '#f8f8f8',
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
  colors: ['#38c73f', '#ef5252'],
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  xaxis: {
    categories: topAktiveSpillere.value.map((spiller) => spiller.navn),
    labels: {
      style: {
        colors: '#cbd5e1',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#cbd5e1',
      },
    },
  },
  legend: {
    position: 'top',
    labels: {
      colors: '#f8f8f8',
    },
  },
  tooltip: {
    theme: 'dark',
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
        <div class="chart-card">
          <h2>Mest aktive spillere</h2>
          <VueApexCharts
            v-if="topAktiveSpillere.length > 0"
            class="stats-chart"
            type="bar"
            height="360"
            :options="chartOptions"
            :series="chartSeries"
          />
          <p v-else>Ingen deltagere fundet.</p>
        </div>

        <div class="chart-card">
          <h2>Sejre mod nederlag</h2>
          <VueApexCharts
            v-if="antalKampe > 0"
            class="stats-chart donut-chart"
            type="donut"
            height="360"
            :options="donutOptions"
            :series="donutSeries"
          />
          <p v-else>Ingen kampe fundet.</p>
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 1rem 0 1.25rem;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.chart-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-card {
  background: var(--color-card);
  border: 1px solid rgba(255, 255, 255, 0.12);
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
}

.donut-chart {
  display: flex;
  align-items: center;
  justify-content: center;
}


</style>
