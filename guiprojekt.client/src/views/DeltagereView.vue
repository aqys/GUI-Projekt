<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import Panel from '@/components/Panel.vue'
import { useKampStore } from '@/stores/kampStore'

const AddDeltagerModal = defineAsyncComponent(() => import('@/components/AddDeltagerModal.vue'))
const DeltagerInfoPanel = defineAsyncComponent(() => import('@/components/DeltagerInfoPanel.vue'))
const RanklistTable = defineAsyncComponent(() => import('@/components/RanklistTable.vue'))
const ModstanderPanel = defineAsyncComponent(() => import('@/components/ModstanderPanel.vue'))

const valgtDeltagerNavn = ref<string | null>(null)
const isOpen = ref(false)
const kampStore = useKampStore()

onMounted(async () => {
  await kampStore.ensureLoaded()
})
</script>

<template>
  <main class="deltagere-layout">
    <section class="left-column">
      <Panel>
        <RanklistTable title="Deltagere" :allow-manage="true" @vaelg-deltager="valgtDeltagerNavn = $event" />
        <button class="tilfoej-knap" @click="isOpen = true">Tilføj deltager</button>
      </Panel>
    </section>

    <section class="right-column">
      <Panel>
        <DeltagerInfoPanel :valgtDeltagerNavn="valgtDeltagerNavn" />
      </Panel>

      <Panel>
        <ModstanderPanel :spiller-navn="valgtDeltagerNavn" :kampe="kampStore.kampe" />
      </Panel>
    </section>
  </main>

  <Transition name="fade">
    <AddDeltagerModal v-if="isOpen" @luk="isOpen = false" />
  </Transition>
</template>

<style scoped>
.deltagere-layout {
  display: flex;
  gap: 1rem;
  align-items: start;
}

.left-column,
.right-column {
  flex: 1;
  min-width: 0;
}

.tilfoej-knap {
  margin-top: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
  