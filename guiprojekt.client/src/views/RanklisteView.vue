<script setup lang="ts">
import Panel from '@/components/Panel.vue'
import RanklistToolbar from '@/components/RanklistToolbar.vue'
import RanklistTable from '@/components/RanklistTable.vue'
</script>

<template>
  <main class="rankliste-layout">
    <Panel>
      <RanklistToolbar />
    </Panel>

    <Panel>
      <RanklistTable title="Komplet rankliste" />
    </Panel>
  </main>
</template>

<style scoped>
.rankliste-layout {
  display: grid;
  gap: 1rem;
}
</style>
