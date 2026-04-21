<template>
  <div class="match-list">
    <h2>Seneste Kampe</h2>
    <div class="kampe">
      <MatchCard
        v-for="kamp in kampe"
        :key="kamp.id"
        :kamp="kamp"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useKampStore } from '../stores/kampStore';
  import MatchCard from './MatchCard.vue';

  const store = useKampStore()
  const kampe = store.kampe
</script>

<style scoped>
    .kampe {
        display: flex;
        flex-direction: column;
        gap: 0.75vh;
    }
</style>