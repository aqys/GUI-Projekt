<template>
  <div class="match-list">
    <h2>{{ props.title }}</h2>

    <MatchFilterBar v-if="props.showFilters" v-model="filters" :spillere="spillerOptions" />

    <div class="kampe">
      <MatchCard v-for="kamp in visteKampe" :key="kamp.id" :kamp="kamp" />
    </div>

    <p v-if="visteKampe.length === 0">Ingen kampe matcher filteret.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useKampStore } from '../stores/kampStore'
import MatchCard from './MatchCard.vue'
import MatchFilterBar from './MatchFilterBar.vue'

const props = withDefaults(
  defineProps<{
    limit?: number
    showFilters?: boolean
    title?: string
  }>(),
  {
    showFilters: true,
    title: 'Seneste kampe',
  }
)

type MatchResultFilter = 'all' | 'win' | 'loss'
type MatchFilters = {
  search: string
  spiller: string
  fraDato: string
  tilDato: string
  resultat: MatchResultFilter
}

const store = useKampStore()

const filters = ref<MatchFilters>({
  search: '',
  spiller: '',
  fraDato: '',
  tilDato: '',
  resultat: 'all',
})

const spillerOptions = computed(() => {
  const s = new Set<string>()
  for (const kamp of store.kampe) {
    s.add(kamp.vinder)
    s.add(kamp.taber)
  }
  return [...s].sort((a, b) => a.localeCompare(b, 'da'))
})

function parseDaTidspunkt(value: string): Date | null {
  const m = value.match(/^(\d{2})[-.](\d{2})[-.](\d{4})\s+(\d{2}):(\d{2})/)
  if (!m) return null
  const dd = Number(m[1])
  const mm = Number(m[2])
  const yyyy = Number(m[3])
  const hh = Number(m[4])
  const min = Number(m[5])
  return new Date(yyyy, mm - 1, dd, hh, min)
}

const filtreredeKampe = computed(() => {
  const q = filters.value.search.trim().toLowerCase()
  const fra = filters.value.fraDato ? new Date(filters.value.fraDato + 'T00:00:00') : null
  const til = filters.value.tilDato ? new Date(filters.value.tilDato + 'T23:59:59') : null

  return store.kampe.filter((kamp) => {
    if (filters.value.spiller && kamp.vinder !== filters.value.spiller && kamp.taber !== filters.value.spiller) {
      return false
    }

    if (filters.value.resultat !== 'all' && filters.value.spiller) {
      const selectedWon = kamp.vinder === filters.value.spiller
      if (filters.value.resultat === 'win' && !selectedWon) return false
      if (filters.value.resultat === 'loss' && selectedWon) return false
    }

    if (q) {
      const haystack = (kamp.vinder + ' ' + kamp.taber + ' ' + kamp.tidspunkt).toLowerCase()
      if (!haystack.includes(q)) return false
    }

    const kampDato = parseDaTidspunkt(kamp.tidspunkt)
    if (fra && (!kampDato || kampDato < fra)) return false
    if (til && (!kampDato || kampDato > til)) return false

    return true
  })
})

const visteKampe = computed(() => {
  const sorteret = [...filtreredeKampe.value].sort((a, b) => b.id - a.id)
  if (props.limit && props.limit > 0) {
    return sorteret.slice(0, props.limit)
  }

  return sorteret
})

onMounted(() => {
  store.fetchKampe()
})
</script>

<style scoped>
    .kampe {
        display: flex;
        flex-direction: column;
        gap: 1vh;
    }
</style>