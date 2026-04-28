<template>
  <div class="match-card">
    <span class="tid">{{ kamp.tidspunkt }}</span>
    <div class="resultat">
      <span class="vinder">{{ kamp.vinder }} ({{ kamp.vinderScore }})</span>
      <span class="vs"> vs </span>
      <span class="taber">{{ kamp.taber }} ({{ kamp.taberScore }})</span>
    </div>
        <div v-if="allowManage" class="handlinger">
            <button class="lille-knap" type="button" @click="$emit('rediger', kamp)">Rediger</button>
            <button class="lille-knap fare" type="button" @click="$emit('slet', kamp.id)">Slet</button>
        </div>
  </div>
</template>

<script setup lang="ts">
    type Match = {
        id: number
        tidspunkt: string
        vinder: string
        vinderScore: number
        taber: string
        taberScore: number
    }

    defineProps<{
        kamp: Match
        allowManage?: boolean
    }>()

    defineEmits<{
        (e: 'rediger', kamp: Match): void
        (e: 'slet', id: number): void
    }>()
</script>

<style scoped>
    .match-card {
        background-color: var(--color-card);
        border-radius: var(--border-radius);
        padding: 1vh 0.75vw;
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(229, 231, 235, 0.3);
        gap: 0.2vh;
    }

    .tid {
        font-size: 0.8em;
        color: var(--color-text);
    }

    .vinder {
        font-weight: 700;
        color: var(--color-winner);
    }

    .vs {
        color: var(--color-text);
    }

    .taber {
        color: var(--color-loser);
    }

    .handlinger {
        display: flex;
        gap: 0.4rem;
        margin-top: 0.4rem;
    }

    .lille-knap {
        padding: 0.35rem 0.55rem;
        font-size: 0.78rem;
    }

    .fare:hover {
        background-color: var(--color-error-hover) !important;
    }
</style>