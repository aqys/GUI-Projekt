<template>
  <div class="match-list">
    <h2>Seneste Kampe</h2>
    <div class="kampe">
      <MatchCard
        v-for="kamp in matches"
        :key="kamp.id"
        :kamp="kamp"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
    import MatchCard from './MatchCard.vue'

    type Match = {
        id: number
        tidspunkt: string
        vinder: string
        vinderScore: number
        taber: string
        taberScore: number
    }

    defineProps<{
        matches: Match[]
    }>()
</script>

<style scoped>
    .match-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .kampe {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
</style>