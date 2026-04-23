<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Panel from '../components/Panel.vue'
import { useKampStore } from '../stores/kampStore'
import { useDeltagerStore } from '../stores/deltagerStore'
import { useRanklisteStats } from '../composables/useRanklisteStats'

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

onMounted(async () => {
  const jobs: Promise<void>[] = []

  if (deltagerStore.deltagere.length === 0) {
    jobs.push(deltagerStore.fetchDeltagere())
  }

  if (kampStore.kampe.length === 0) {
    jobs.push(kampStore.fetchKampe())
  }

  if (jobs.length > 0) {
    await Promise.all(jobs)
  }
})
</script>

<template>
  <main class="stats-layout">
    <Panel>
      <h2>Mest aktive spillere</h2>
      <ul class="simple-list" v-if="mestAktive.length > 0">
        <li v-for="spiller in mestAktive" :key="spiller.navn">
          <strong>{{ spiller.navn }}</strong>
          <span class="meta">{{ spiller.kampe }} kampe · {{ spiller.wins }} sejre · {{ spiller.winrate.toFixed(1) }}%</span>
        </li>
      </ul>
      <p v-else>Ingen deltagere fundet.</p>
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

@media (max-width: 1100px) {
  .stats-layout {
    grid-template-columns: 1fr;
  }
}
</style>
