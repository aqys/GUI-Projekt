<script setup lang="ts">
  import RanklistTable from '../components/RanklistTable.vue'
  import MatchList from '../components/MatchList.vue'

  type Match = {
    id: number
    tidspunkt: string
    vinder: string
    vinderScore: number
    taber: string
    taberScore: number
  }

  const matches: Match[] = [
    { id: 1, tidspunkt: '20-04-2026 14:32', vinder: 'Anders', vinderScore: 3, taber: 'Mads', taberScore: 1 },
    { id: 2, tidspunkt: '20-04-2026 13:10', vinder: 'Sofie', vinderScore: 3, taber: 'Anders', taberScore: 2 },
    { id: 3, tidspunkt: '19-04-2026 18:45', vinder: 'Mads', vinderScore: 3, taber: 'Sofie', taberScore: 0 }
  ]
</script>

<template>
  <main class="grid">
    <section class="panel">
      <h2>Rangliste</h2>
      <RanklistTable />
    </section>

    <section class="panel">
      <MatchList :matches="matches" />
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
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 16px;
  }
</style>