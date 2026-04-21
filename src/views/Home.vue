<script setup lang="ts">
  import RanklistTable from '../components/RanklistTable.vue'
  import MatchList from '../components/MatchList.vue'

</script>

<template>
  <main class="grid">
    <section class="panel">
      <h2>Rankliste</h2>
      <RanklistTable />
    </section>

    <section class="panel">
      <MatchList />
    </section>
  </main>
</template>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: start;
    padding: 16px;
  }

  .panel {
    background: var(--color-card);
    border: 0.1vw solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 0.6vw;
  }
</style>