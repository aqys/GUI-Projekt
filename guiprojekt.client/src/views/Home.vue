<script setup lang="ts">
import RanklistTable from '../components/RanklistTable.vue'
import MatchList from '../components/MatchList.vue'
import AddDeltagerModal from '../components/AddDeltagerModal.vue';
import RegisterKampForm from '../components/RegisterKampForm.vue';
import TurneringsOverview from '../components/TurneringsOverview.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Panel from '../components/Panel.vue';
import DeltagerInfoPanel from '../components/DeltagerInfoPanel.vue';

const valgtDeltagerNavn = ref<string | null>(null);

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
      <Panel>
        <TurneringsOverview />
      </Panel>
      <Panel>
        <RanklistTable @vaelg-deltager="valgtDeltagerNavn = $event" />
        <button class="test-modal" @click="isOpen = true" style="margin-top: 1.5vh;">Tilføj deltager</button>
      </Panel>
      <Panel>
        <MatchList />
      </Panel>
    </section>

    <section class="right-column">
      <Panel>
        <RegisterKampForm></RegisterKampForm>
      </Panel>
      <Panel>
        <DeltagerInfoPanel :valgtDeltagerNavn="valgtDeltagerNavn" />
      </Panel>
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

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease-in-out;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>