<script setup lang="ts">
import Panel from '../components/Panel.vue'
import RegisterKampForm from '../components/RegisterKampForm.vue'
import MatchList from '../components/MatchList.vue'
</script>

<template>
  <main class="kampe-layout">
    <Panel>
      <RegisterKampForm />
    </Panel>

    <Panel>
      <MatchList title="Alle kampe" />
    </Panel>
  </main>
</template>

<style scoped>
.kampe-layout {
  display: grid;
  gap: 1rem;
}
</style>
