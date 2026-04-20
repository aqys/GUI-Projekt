<template>
  <div class="match-card">
    <span class="tid">{{ kamp.tidspunkt }}</span>
    <div class="resultat">
      <span class="vinder">{{ kamp.vinder }} ({{ kamp.vinderScore }})</span>
      <span class="vs"> vs </span>
      <span class="taber">{{ kamp.taber }} ({{ kamp.taberScore }})</span>
    </div>
  </div>
</template>

<script setup lang="ts">
    type Match = {
        id: number
        tidspunkt: string
        vinder: string
        vinderScore: number
        taber: string
        taberScore: number
    }

    defineProps<{
        kamp: Match
    }>()
</script>

<style scoped>
    .match-card {
        background-color: var(--color-card);
        border-radius: var(--border-radius);
        padding: 10px 16px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .tid {
        font-size: 12px;
        color: var(--color-text);
    }

    .vinder {
        font-weight: 700;
        color: var(--color-primary);
    }

    .vs {
        color: var(--color-text);
    }

    .taber {
        color: var(--color-error);
    }
</style>