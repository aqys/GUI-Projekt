<template>
  <section class="detalje-panel">
    <h1>Deltagerdetaljer</h1>

    <p v-if="!valgtDeltagerNavn" class="placeholder">
      Klik på en deltager i ranklisten for at se info
    </p>

    <template v-else-if="detaljer">
      <h2>Spiller - <span style="font-weight: 500;">{{ detaljer.navn }}</span></h2>

      <div class="stats-grid">
        <article class="stat-card">
          <span class="label">Sejre</span>
          <strong class="value">{{ detaljer.wins }}</strong>
        </article>

        <article class="stat-card">
          <span class="label">Tab</span>
          <strong class="value">{{ detaljer.losses }}</strong>
        </article>

        <article class="stat-card">
          <span class="label">Winrate</span>
          <strong class="value">{{ detaljer.win.toFixed(1) }}%</strong>
        </article>
      </div>

      <h4>Sidste 10 kampe</h4>
      <ul v-if="sidste10Kampe.length > 0" class="kamp-liste">
        <li v-for="kamp in sidste10Kampe" :key="kamp.id" class="kamp-item">
          <span class="badge" :class="kamp.resultat === 'W' ? 'win' : 'loss'">
            {{ kamp.resultat }}
          </span>
          <span class="linje"><span class="tidspunkt">{{ kamp.tidspunkt }}</span> vs {{ kamp.modstander }} - <span class="minScore">{{ kamp.minScore }}</span> - <span class="modstanderScore">{{ kamp.modstanderScore }}</span></span>
        </li>
      </ul>

      <p v-else class="placeholder">Ingen kampe registreret for denne deltager endnu.</p>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDeltagerStore } from '../stores/deltagerStore'
import { useKampStore } from '../stores/kampStore'
import { useRanklisteStats } from '../composables/useRanklisteStats'

const props = defineProps<{
  valgtDeltagerNavn: string | null
}>()

const deltagerStore = useDeltagerStore()
const kampStore = useKampStore()
const { rankliste } = useRanklisteStats()

const detaljer = computed(() => {
  if (!props.valgtDeltagerNavn) {
    return null
  }

  return rankliste.value.find((d) => d.navn === props.valgtDeltagerNavn) ?? null
})

const sidste10Kampe = computed(() => {
  if (!props.valgtDeltagerNavn) {
    return []
  }

  return [...kampStore.kampe]
    .filter((kamp) => kamp.vinder === props.valgtDeltagerNavn || kamp.taber === props.valgtDeltagerNavn)
    .sort((a, b) => b.id - a.id)
    .slice(0, 10)
    .map((kamp) => {
      const erVinder = kamp.vinder === props.valgtDeltagerNavn
      const mineScore = erVinder ? kamp.vinderScore : kamp.taberScore
      const modstanderScore = erVinder ? kamp.taberScore : kamp.vinderScore

      return {
        id: kamp.id,
        tidspunkt: kamp.tidspunkt,
        resultat: erVinder ? 'W' : 'L',
        modstander: erVinder ? kamp.taber : kamp.vinder,
        minScore: `${mineScore}`,
        modstanderScore: `${modstanderScore}`
      }
    })
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
.detalje-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 47.5vh;
}

.placeholder {
  opacity: 0.6;
  width: 100%;
  margin: auto;
  height: max-content;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
}

.stat-card {
  background: var(--color-card);
  border: 1px solid rgba(229, 231, 235, 0.2);
  border-radius: var(--border-radius);
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.label {
  font-size: 0.8rem;
  opacity: 0.8;
}

.value {
  font-size: 1.1rem;
}

.kamp-liste {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.kamp-item {
  background: var(--color-card);
  border: 1px solid rgba(229, 231, 235, 0.15);
  border-radius: var(--border-radius);
  padding: 0.75rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge {
  width: 1.75vw;
  text-align: center;
  border-radius: 0.25vw;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.18rem 0.15rem;
  color: #fff;
}

.badge.win {
  background: var(--color-winner);
}

.badge.loss {
  background: var(--color-loser);
}

.linje {
  font-size: 0.9rem;
}
.tidspunkt {
  opacity: 0.7;
}
.score {
  font-weight: 700;
}
.minScore {
  font-weight: 700;
  color: var(--color-me);
}
.modstanderScore {
  font-weight: 700;
  color: var(--color-loser);
}
</style>