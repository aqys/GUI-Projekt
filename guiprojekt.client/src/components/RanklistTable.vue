<template>
  <h2>Rankliste</h2>
  <table>
    <thead>
      <tr>
        <th>Navn</th>
        <th>Points</th>
        <th>Win%</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="deltager in rankliste"
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
import { onMounted, ref } from 'vue'
import { useDeltagerStore } from '../stores/deltagerStore'
import { useKampStore } from '../stores/kampStore'
import { useRanklisteStats } from '../composables/useRanklisteStats'

const emit = defineEmits<{
  (e: 'vaelg-deltager', navn: string | null): void
}>()

const deltagerStore = useDeltagerStore()
const kampStore = useKampStore()
const { rankliste } = useRanklisteStats()
const valgtDeltagerNavn = ref<string | null>(null)

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
        background-color: var(--color-card-alt);
    }
</style>