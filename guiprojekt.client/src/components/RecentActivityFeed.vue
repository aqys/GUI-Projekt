<template>
    <section class="feed">
        <h2>Seneste aktivitet</h2>
        <ul v-if="recent.length > 0">
            <li v-for="kamp in recent" :key="kamp.id">
                <span class="tid">{{ kamp.tidspunkt }}</span>
                <span>{{ kamp.vinder }} {{ kamp.vinderScore }} - {{ kamp.taberScore }} {{ kamp.taber }}</span>
            </li>
        </ul>
        <p v-else>Ingen aktivitet endnu</p>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Kamp } from '../types';

const props = withDefaults(
    defineProps<{
        kampe: Kamp[]
        limit?: number
    }>(),
    {
        limit: 8,
    }
)

const recent = computed(() =>
    [...props.kampe]
        .sort((a, b) => b.id - a.id)
        .slice(0, props.limit)
)
</script>

<style scoped>
.feed ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feed li {
  background: var(--color-card);
  border: 1px solid rgba(229, 231, 235, 0.2);
  border-radius: var(--border-radius);
  padding: 0.55rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.tid {
  opacity: 0.75;
  font-size: 0.82rem;
}
</style>