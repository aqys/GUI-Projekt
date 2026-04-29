<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDeltagerStore } from '@/stores/deltagerStore'
import { useKampStore } from '@/stores/kampStore'
import { useRanklisteStats } from '@/composables/useRanklisteStats'

const deltagerStore = useDeltagerStore()
const kampStore = useKampStore()
const { rankliste } = useRanklisteStats()

const aktiveSpillere = computed(() => rankliste.value.filter((item) => item.kampeSpillet > 0).length)

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

@media (max-width: 640px) {
  .toolbar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

</style>
