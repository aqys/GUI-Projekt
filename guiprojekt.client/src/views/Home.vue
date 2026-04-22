<script setup lang="ts">
import RanklistTable from '../components/RanklistTable.vue'
import MatchList from '../components/MatchList.vue'
import AddDeltagerModal from '../components/AddDeltagerModal.vue';
import RegisterKampForm from '../components/RegisterKampForm.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const isOpen = ref(false)

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isOpen.value = false;
  }
}

const handleClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.classList.contains('modal-overlay')) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClick)
})
</script>

<template>
  <main class="layout">
    <section class="left-column">
      <div class="panel">
        <RanklistTable />
        <button class="test-modal" @click="isOpen = true" style="margin-top: 1.5vh;">Tilføj deltager</button>
      </div>
    </section>

    <section class="right-column">
      <div class="panel">
        <RegisterKampForm />
      </div>
      <div class="panel">
        <MatchList />
      </div>
    </section>
  </main>
  <Transition name="fade">
    <AddDeltagerModal v-if="isOpen" @luk="isOpen = false" />
  </Transition>
</template>

<style scoped>
  .layout {
    display: flex;
    gap: 1rem;
    align-items: start;
    padding: 0.75vw;
  }

  .left-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 0;
  }

  .right-column {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .panel {
    background: #161616;
    border-radius: 0.9rem;
    padding: 0.65vw;
    box-shadow: 2px 6px 8px 0 rgba(0, 0, 0, .375);
    border: 1px solid rgba(229, 231, 235, 0.25);
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