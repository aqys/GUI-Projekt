<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDeltagerStore } from '@/stores/deltagerStore'
import { useKampStore } from '@/stores/kampStore'
import { useRanklisteStats } from '@/composables/useRanklisteStats'

const deltagerStore = useDeltagerStore()
const kampStore = useKampStore()
const { rankliste } = useRanklisteStats()

const aktiveSpillere = computed(() => rankliste.value.filter((item) => item.kampeSpillet > 0).length)

const gennemsnitWinrate = computed(() => {
  const aktive = rankliste.value.filter((item) => item.kampeSpillet > 0)
  if (aktive.length === 0) return 0

  const sum = aktive.reduce((acc, item) => acc + item.win, 0)
  return sum / aktive.length
})

const formSpiller = computed(() => {
  if (rankliste.value.length === 0 || kampStore.kampe.length === 0) {
    return null
  }

  const recentWindow = [...kampStore.kampe]
    .sort((a, b) => b.id - a.id)
    .slice(0, 8)

  const score = new Map<string, number>()

  for (const kamp of recentWindow) {
    score.set(kamp.vinder, (score.get(kamp.vinder) ?? 0) + 3)
    score.set(kamp.taber, (score.get(kamp.taber) ?? 0) - 1)
  }

  return rankliste.value
    .map((item) => ({
      navn: item.navn,
      score: score.get(item.navn) ?? 0,
      wins: item.wins,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }

      if (b.wins !== a.wins) {
        return b.wins - a.wins
      }

      return a.navn.localeCompare(b.navn, 'da')
    })[0] ?? null
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
  <section class="toolbar">
    <article class="chip">
      <span class="label">Spillere</span>
      <strong class="value">{{ aktiveSpillere }}</strong>
    </article>

    <article class="chip">
      <span class="label">Kampe</span>
      <strong class="value">{{ kampStore.kampe.length }}</strong>
    </article>
  </section>
</template>

<style scoped>
.toolbar {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.65rem;
}

.chip {
  background: var(--color-card);
  border: 1px solid rgba(229, 231, 235, 0.16);
  border-radius: var(--border-radius);
  padding: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.chip-wide {
  background: linear-gradient(145deg, rgba(22, 128, 249, 0.22), rgba(22, 128, 249, 0.08));
}

.label {
  opacity: 0.75;
  font-size: 0.82rem;
}

.value {
  font-size: 1.15rem;
}

.meta {
  opacity: 0.8;
}

@media (max-width: 1000px) {
  .toolbar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .toolbar {
    grid-template-columns: 1fr;
  }
}
</style>
