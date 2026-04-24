<template>
    <section class="headtohead">
        <h2>Modstander overblik</h2>

        <p v-if="!spillerNavn">Vælge en spiller for at se h-t-h stats</p>

        <ul v-else-if="rows.length > 0" class="duel-list">
            <li v-for="row in rows" :key="row.modstander">
                <strong>{{ row.modstander }}</strong>
                <span>{{ row.wins }}W / {{ row.losses }}L - {{ row.winRate.toFixed(1) }}%</span>
            </li>
        </ul>

        <p v-else>Ingen kampe fundet for {{ spillerNavn }}</p>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { HeadToHeadRow, Kamp } from '../types';

const props = defineProps<{
    spillerNavn: string | null
    kampe: Kamp[]
}>()

const rows = computed<HeadToHeadRow[]>(() => {
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
      const winRate = total > 0 ? (stat.wins / total) * 100 : 0

      return {
        modstander,
        wins: stat.wins,
        losses: stat.losses,
        total,
        winRate,
      }
    })
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total
      return b.winRate - a.winRate
    })
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
  border: 1px solid rgba(229, 231, 235, 0.2);
  border-radius: var(--border-radius);
  padding: 0.55rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}
</style>