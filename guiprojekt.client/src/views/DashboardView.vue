<script setup lang="ts">
import Panel from '../components/Panel.vue'
import TurneringsOverview from '../components/TurneringsOverview.vue'
import RanklistTable from '../components/RanklistTable.vue'
import MatchList from '../components/MatchList.vue'
</script>

<template>
  <main class="dashboard-layout">
    <Panel>
      <TurneringsOverview />
    </Panel>

    <Panel>
      <RanklistTable title="Top 5 spillere" :limit="5" />
    </Panel>

    <Panel>
      <MatchList title="Sidste 5 kampe" :limit="5" :show-filters="false" />
    </Panel>
  </main>
</template>

<style scoped>
.dashboard-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
</style>
