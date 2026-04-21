<script setup lang="ts">
import RanklistTable from '../components/RanklistTable.vue'
import MatchList from '../components/MatchList.vue'
import AddDeltagerModal from '../components/AddDeltagerModal.vue';
import RegisterKampForm from '../components/RegisterKampForm.vue';

</script>

<template>
  <main class="grid">
    <section class="panel">
      <RanklistTable />
    </section>

    <section class="panel">
      <MatchList />
      <!--<AddDeltagerModal></AddDeltagerModal>-->
    </section>

    <section class="panel">
      <RegisterKampForm></RegisterKampForm>
    </section>
  </main>
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
    box-shadow: 5px 5px 5px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(229, 231, 235, 0.3);
  }
</style>