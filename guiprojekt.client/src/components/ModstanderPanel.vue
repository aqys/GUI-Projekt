<template>
    <section>
        <h2>Modstander overblik</h2>

        <p v-if="!spillerNavn">Vælge en spiller for at se modstander stats</p>

        <ul v-else-if="rows.length > 0" class="duel-list">
            <li v-for="row in rows" :key="row.modstander">
                <strong>{{ row.modstander }}</strong>
            <span>{{ row.total }} kampe - {{ row.wins }}W / {{ row.losses }}L</span>
            </li>
        </ul>

        <p v-else>Ingen kampe fundet for {{ spillerNavn }}</p>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Kamp } from '@/types';

type ModstanderRow = {
  modstander: string
  wins: number
  losses: number
  total: number
}

const props = defineProps<{
    spillerNavn: string | null
    kampe: Kamp[]
}>()

const rows = computed<ModstanderRow[]>(() => {
  if (!props.spillerNavn) return []

  const map = new Map<string, { wins: number; losses: number }>()

  for (const kamp of props.kampe) {
    if (kamp.vinder !== props.spillerNavn && kamp.taber !== props.spillerNavn) continue

    const modstander = kamp.vinder === props.spillerNavn ? kamp.taber : kamp.vinder
    const bucket = map.get(modstander) ?? { wins: 0, losses: 0 }

    if (kamp.vinder === props.spillerNavn) {
      bucket.wins += 1
    } else {
      bucket.losses += 1
    }

    map.set(modstander, bucket)
  }

  return Array.from(map.entries())
    .map(([modstander, stat]) => {
      const total = stat.wins + stat.losses

      return {
        modstander,
        wins: stat.wins,
        losses: stat.losses,
        total,
      }
    })
    .sort((a, b) => b.total - a.total)
})
</script>

<style scoped>
.duel-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.duel-list li {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 0.55rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}
</style>