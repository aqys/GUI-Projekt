<script setup lang="ts">
  type MatchResultFilter = 'all' | 'win' | 'loss'
  type MatchFilters = {
    search: string
    spiller: string
    resultat: MatchResultFilter
  }

  const props = defineProps<{
    modelValue: MatchFilters
    spillere: string[]
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: MatchFilters): void
  }>()

  function patch(next: Partial<MatchFilters>) {
    emit('update:modelValue', { ...props.modelValue, ...next })
  }

  function reset() {
    emit('update:modelValue', {
      search: '',
      spiller: '',
      resultat: 'all',
    })
  }
</script>

<template>
  <div class="filterbar">
    <div class="felt felt-search">
      <label for="match-search" class="visually-hidden">Søg i kampe</label>
      <input
        id="match-search"
        :value="modelValue.search"
        placeholder="Søg i kampe..."
        @input="patch({ search: ($event.target as HTMLInputElement).value })"
      />
    </div>

    <div class="felt">
      <label for="match-spiller" class="visually-hidden">Filtrer spiller</label>
      <select
        id="match-spiller"
        :value="modelValue.spiller"
        @change="patch({ spiller: ($event.target as HTMLSelectElement).value })"
      >
        <option value="">Alle spillere</option>
        <option v-for="navn in spillere" :key="navn" :value="navn">{{ navn }}</option>
      </select>
    </div>

    <div class="felt">
      <label for="match-resultat" class="visually-hidden">Filtrer resultat</label>
      <select
        id="match-resultat"
        :value="modelValue.resultat"
        @change="patch({ resultat: ($event.target as HTMLSelectElement).value as MatchResultFilter })"
      >
        <option value="all">Alle resultater</option>
        <option value="win">Valgt spiller vandt</option>
        <option value="loss">Valgt spiller tabte</option>
      </select>
    </div>

    <button class="reset-knap" type="button" @click="reset">Nulstil</button>
  </div>
</template>

<style scoped>
  .filterbar {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr auto;
    gap: 0.65rem;
    margin-bottom: 1rem;
    padding: 0.6rem;
    border-radius: 0.65rem;
    background:
      linear-gradient(160deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01)),
      var(--color-card-alt);
    border: 1px solid rgba(229, 231, 235, 0.18);
  }

  .felt {
    min-width: 0;
  }

  input,
  select {
    width: 100%;
    min-height: 2.5rem;
    background-color: var(--color-card);
    border: 1px solid rgba(229, 231, 235, 0.22);
    border-radius: 0.5rem;
    color: var(--color-text);
    padding: 0.5rem 0.7rem;
    font-family: var(--font-family);
    font-size: 0.92rem;
    transition: border-color 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease;
  }

  input::placeholder {
    color: rgba(248, 248, 248, 0.58);
  }

  select {
    appearance: none;
    background-image:
      linear-gradient(45deg, transparent 50%, rgba(248, 248, 248, 0.75) 50%),
      linear-gradient(135deg, rgba(248, 248, 248, 0.75) 50%, transparent 50%);
    background-position:
      calc(100% - 1.05rem) calc(1rem + 1px),
      calc(100% - 0.75rem) calc(1rem + 1px);
    background-size: 0.35rem 0.35rem, 0.35rem 0.35rem;
    background-repeat: no-repeat;
    padding-right: 2rem;
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(22, 128, 249, 0.22);
    background-color: #1f232b;
  }

  .reset-knap {
    min-height: 2.5rem;
    align-self: stretch;
    white-space: nowrap;
    padding-inline: 1rem;
    border-radius: 0.5rem;
    font-size: 0.88rem;
    letter-spacing: 0.01em;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>