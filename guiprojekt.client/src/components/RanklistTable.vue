<template>
  <h2>{{ props.title }}</h2>
  <table>
    <thead>
      <tr>
        <th>
          <button class="sort-knap" type="button" @click="skiftSortering('navn')">
            Navn
            <span class="sort-ikon">{{ hentSortSymbol('navn') }}</span>
          </button>
        </th>
        <th>
          <button class="sort-knap" type="button" @click="skiftSortering('points')">
            Points
            <span class="sort-ikon">{{ hentSortSymbol('points') }}</span>
          </button>
        </th>
        <th>
          <button class="sort-knap" type="button" @click="skiftSortering('win')">
            Win%
            <span class="sort-ikon">{{ hentSortSymbol('win') }}</span>
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="deltager in visteDeltagere"
        :key="deltager.id"
        :class="{ valgt: valgtDeltagerNavn === deltager.navn }"
        tabindex="0"
        @click="vaelgDeltager(deltager.navn)"
        @keyup.enter="vaelgDeltager(deltager.navn)"
      >
        <td>{{ deltager.navn }}</td>
        <td>{{ deltager.points }}</td>
        <td>{{ deltager.win.toFixed(1) }}%</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDeltagerStore } from '../stores/deltagerStore'
import { useKampStore } from '../stores/kampStore'
import { useRanklisteStats } from '../composables/useRanklisteStats'

const props = withDefaults(
  defineProps<{
    limit?: number
    title?: string
  }>(),
  {
    title: 'Rankliste',
  }
)

type SorteringsKolonne = 'navn' | 'points' | 'win'
type SorteringsRetning = 'asc' | 'desc'

const emit = defineEmits<{
  (e: 'vaelg-deltager', navn: string | null): void
}>()

const deltagerStore = useDeltagerStore()
const kampStore = useKampStore()
const { rankliste } = useRanklisteStats()
const valgtDeltagerNavn = ref<string | null>(null)
const aktivSorteringsKolonne = ref<SorteringsKolonne>('points')
const aktivSorteringsRetning = ref<SorteringsRetning>('desc')

const sorteretRankliste = computed(() => {
  const liste = [...rankliste.value]
  const retning = aktivSorteringsRetning.value === 'asc' ? 1 : -1

  liste.sort((venstre, hoejre) => {
    if (aktivSorteringsKolonne.value === 'navn') {
      return venstre.navn.localeCompare(hoejre.navn, 'da') * retning
    }

    const venstreVaerdi = aktivSorteringsKolonne.value === 'points' ? venstre.points : venstre.win
    const hoejreVaerdi = aktivSorteringsKolonne.value === 'points' ? hoejre.points : hoejre.win

    if (venstreVaerdi === hoejreVaerdi) {
      return venstre.navn.localeCompare(hoejre.navn, 'da')
    }

    return (venstreVaerdi - hoejreVaerdi) * retning
  })

  return liste
})

const visteDeltagere = computed(() => {
  if (props.limit && props.limit > 0) {
    return sorteretRankliste.value.slice(0, props.limit)
  }

  return sorteretRankliste.value
})

function skiftSortering(kolonne: SorteringsKolonne) {
  if (aktivSorteringsKolonne.value === kolonne) {
    aktivSorteringsRetning.value = aktivSorteringsRetning.value === 'asc' ? 'desc' : 'asc'
    return
  }

  aktivSorteringsKolonne.value = kolonne
  aktivSorteringsRetning.value = kolonne === 'navn' ? 'asc' : 'desc'
}

function hentSortSymbol(kolonne: SorteringsKolonne): string {
  if (aktivSorteringsKolonne.value !== kolonne) {
    return ''
  }

  return aktivSorteringsRetning.value === 'asc' ? '▲' : '▼'
}

function vaelgDeltager(navn: string) {
  const nyVaerdi = valgtDeltagerNavn.value === navn ? null : navn
  valgtDeltagerNavn.value = nyVaerdi
  emit('vaelg-deltager', nyVaerdi)
}

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
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 1vh 0.5vw;
        text-align: left;
    }

    tbody tr{
        transition: background-color 0.2s;
    }

    tbody tr:hover {
        cursor: pointer;
        background-color: var(--color-card-hover) !important;
    }

    tbody tr:nth-child(even) {
        background-color: var(--color-card-alt);
    }
    tbody tr:nth-child(odd) {
        background-color: var(--color-card);
    }
    thead {
        background-color: var(--color-card-bar);
    }
    thead th {
        border: 1px solid rgba(229, 231, 235, 0.25);
    }

    .sort-knap {
      background: transparent;
      border: 0;
      color: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font: inherit;
      padding: 0;
    }

    .sort-ikon {
      min-width: 1ch;
      font-size: 0.8rem;
      opacity: 0.8;
    }
</style>