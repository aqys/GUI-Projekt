<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Panel from '@/components/Panel.vue'

const RanklistToolbar = defineAsyncComponent(() => import('@/components/RanklistToolbar.vue'))
const RanklistTable = defineAsyncComponent(() => import('@/components/RanklistTable.vue'))
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
