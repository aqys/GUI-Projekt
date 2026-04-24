<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Panel from '../components/Panel.vue'
import { useKampStore } from '../stores/kampStore'
import { useDeltagerStore } from '../stores/deltagerStore'
import { useRanklisteStats } from '../composables/useRanklisteStats'
import DataStatePanel from '../components/DataStatePanel.vue'
import RecentActivityFeed from '../components/RecentActivityFeed.vue'
import ModstanderPanel from '../components/ModstanderPanel.vue'

const kampStore = useKampStore()
const deltagerStore = useDeltagerStore()
const { rankliste } = useRanklisteStats()

const mestAktive = computed(() => {
  return rankliste.value
    .map((item) => ({
      navn: item.navn,
      kampe: item.kampeSpillet,
      wins: item.wins,
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

const valgtSpillerTilDuel = computed(() => {
  return mestAktive.value.length > 0 ? mestAktive.value[0].navn : null
})

const loading = computed(() => kampStore.isLoading || deltagerStore.isLoading)
const error = computed(() => kampStore.error || deltagerStore.error)
const empty = computed(() => kampStore.kampe.length === 0 && deltagerStore.deltagere.length === 0)

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

      <h2>Mest aktive spillere</h2>
      <ul class="simple-list" v-if="mestAktive.length > 0">
        <li v-for="spiller in mestAktive" :key="spiller.navn">
          <strong>{{ spiller.navn }}</strong>
          <span class="meta">{{ spiller.kampe }} kampe · {{ spiller.wins }} sejre · {{ spiller.winrate.toFixed(1) }}%</span>
        </li>
      </ul>
      <p v-else>Ingen deltagere fundet.</p>
    </Panel>

    <Panel>
      <RecentActivityFeed :kampe="kampStore.kampe" :limit="10" />
    </Panel>

    <Panel>
      <ModstanderPanel :spiller-navn="valgtSpillerTilDuel" :kampe="kampStore.kampe" />
    </Panel>
  </main>
</template>

<style scoped>
.stats-layout {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.simple-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.simple-list li {
  background: var(--color-card);
  border: 1px solid rgba(229, 231, 235, 0.17);
  border-radius: var(--border-radius);
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.meta {
  opacity: 0.8;
}

</style>
