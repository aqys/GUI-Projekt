<template>
  <section class="overview">
    <h2>Turneringsoverblik</h2>

    <div class="stat-grid">
      <article class="stat-card">
        <span class="label">Spillere</span>
        <strong class="value">{{ antalSpillere }}</strong>
      </article>

      <article class="stat-card">
        <span class="label">Kampe</span>
        <strong class="value">{{ antalKampe }}</strong>
      </article>

      <article class="stat-card stat-wide">
        <span class="label">Bedste spiller</span>
        <strong class="value" v-if="bedsteSpiller">{{ bedsteSpiller.navn }}</strong>
        <strong class="value muted" v-else>Ingen data endnu</strong>
        <span class="meta" v-if="bedsteSpiller">
          {{ bedsteSpiller.wins }} kampe vundet · {{ bedsteSpiller.win.toFixed(1) }}%
        </span>
      </article>

    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDeltagerStore } from '@/stores/deltagerStore'
import { useKampStore } from '@/stores/kampStore'

const deltagerStore = useDeltagerStore()
const kampStore = useKampStore()

const antalSpillere = computed(() => deltagerStore.deltagere.length)
const antalKampe = computed(() => kampStore.kampe.length)

const bedsteSpiller = computed(() => {
  if (deltagerStore.deltagere.length === 0) {
    return null
  }

  const statsByName = new Map<string, { wins: number; losses: number }>()

  for (const deltager of deltagerStore.deltagere) {
    statsByName.set(deltager.navn, { wins: 0, losses: 0 })
  }

  for (const kamp of kampStore.kampe) {
    const vinderStats = statsByName.get(kamp.vinder) ?? { wins: 0, losses: 0 }
    vinderStats.wins += 1
    statsByName.set(kamp.vinder, vinderStats)

    const taberStats = statsByName.get(kamp.taber) ?? { wins: 0, losses: 0 }
    taberStats.losses += 1
    statsByName.set(kamp.taber, taberStats)
  }

  return deltagerStore.deltagere
    .map((deltager) => {
      const stats = statsByName.get(deltager.navn) ?? { wins: 0, losses: 0 }
      const kampeSpillet = stats.wins + stats.losses
      const winProcent = kampeSpillet > 0 ? (stats.wins / kampeSpillet) * 100 : 0

      return {
        navn: deltager.navn,
        wins: stats.wins,
        win: winProcent,
      }
    })
    .sort((left, right) => {
      if (right.wins !== left.wins) {
        return right.wins - left.wins
      }

      if (right.win !== left.win) {
        return right.win - left.win
      }

      return left.navn.localeCompare(right.navn, 'da')
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

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .75rem;
}

.stat-card {
  background: var(--color-card);
  border: 1px solid rgba(229, 231, 235, 0.3);
  border-radius: var(--border-radius);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-wide {
  grid-column: span 2;
}

.label {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.8;
}

.value {
  font-size: 1.25rem;
  line-height: 1.2;
  color: var(--color-text);
}

.meta {
  font-size: 0.8rem;
  opacity: 0.9;
}

.muted {
  opacity: 0.7;
}
</style>