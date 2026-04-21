<script setup lang="ts">
import RanklistTable from '../components/RanklistTable.vue'
import MatchList from '../components/MatchList.vue'
import AddDeltagerModal from '../components/AddDeltagerModal.vue';
import RegisterKampForm from '../components/RegisterKampForm.vue';
import { ref } from 'vue';

const isOpen = ref(false)
</script>

<template>
  <main class="grid">
    <section class="panel">
      <MatchList />
    </section>
    
    <section class="panel">
      <RanklistTable />
    </section>

    <section class="panel">
      <RegisterKampForm></RegisterKampForm>
    </section>
  </main>
  <button class="test-modal" @click="isOpen = true">Tilføj deltager</button>
  <Transition name="fade">
    <AddDeltagerModal v-if="isOpen" @luk="isOpen = false" />
  </Transition>
</template>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    align-items: start;
    padding: 0.75vw;
  }

  .panel {
    background: #080808;
    border-radius: 0.75rem;
    padding: 0.6vw;
    box-shadow: 2px 6px 8px 0 rgba(0, 0, 0, .375);
    border: 1px solid rgba(229, 231, 235, 0.45);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease-in-out;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>