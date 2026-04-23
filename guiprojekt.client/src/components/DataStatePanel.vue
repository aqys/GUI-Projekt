<template>
    <section class="data-state" aria-live="polite">
        <p v-if="loading">Indlæser data...</p>
        <p v-else-if="error" class="error">
            {{ error }}
            <button type="button" class="retry" @click="$emit('retry')">Prøv igen</button>
        </p>
        <p v-else-if="empty">{{ emptyText }}</p>
    </section>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        loading: boolean
        error: string | null
        empty: boolean
        emptyText?: string
    }>(),
    {
        emptyText: 'Ingen data endnu'
    }
)

defineEmits<{
    (e: 'retry'): void
}>()
</script>

<style scoped>
.data-state {
    margin-bottom: .75rem;
}

.error {
    color: var(--color-error);
    display: flex;
    align-items: center;
    gap: .5rem;
}

.retry {
    padding: .3rem .5rem;
    font-size: .8rem;
}
</style>