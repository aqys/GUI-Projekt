<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Panel from '@/components/Panel.vue'

const RegisterKampForm = defineAsyncComponent(() => import('@/components/RegisterKampForm.vue'))
const MatchList = defineAsyncComponent(() => import('@/components/MatchList.vue'))
</script>

<template>
  <main class="kampe-layout">
    <Panel>
      <RegisterKampForm />
    </Panel>

    <Panel>
      <MatchList title="Alle kampe" :allow-manage="true" />
    </Panel>
  </main>
</template>

<style scoped>
.kampe-layout {
  display: grid;
  gap: 1rem;
}
</style>
