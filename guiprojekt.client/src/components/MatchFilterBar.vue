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
    <div class="felt felt-search" :class="{ 'er-aktiv': modelValue.search.trim().length > 0 }">
      <label for="match-search" class="visually-hidden">Søg i kampe</label>
      <div class="search-shell">
        <span class="search-ikon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              d="M10.5 4a6.5 6.5 0 1 0 4.04 11.59l4.43 4.44a1 1 0 0 0 1.42-1.42l-4.44-4.43A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"
            />
          </svg>
        </span>
        <input
          id="match-search"
          :value="modelValue.search"
          placeholder="Søg i kampe..."
          @input="patch({ search: ($event.target as HTMLInputElement).value })"
        />
      </div>
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
    grid-template-columns: auto 1fr 1fr auto;
    gap: 0.65rem;
    margin-bottom: 1rem;
    padding: 0.6rem;
    border-radius: 0.35rem;
    background: var(--color-card);
    border: 1px solid rgba(229, 231, 235, 0.18);
  }

  .felt {
    min-width: 0;
  }

  .felt-search {
    width: 8rem !important;
    transition: width 0.2s ease;
  }

  .felt-search:focus-within,
  .felt-search.er-aktiv {
    width: 12rem !important;
  }

  .search-shell {
    position: relative;
  }

  .search-ikon {
    position: absolute;
    left: 0.58rem;
    top: 50%;
    width: 1.25rem;
    height: 1.25rem;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .search-ikon svg {
    width: 100%;
    height: 100%;
    fill: #fffafaa1;
  }

  input,
  select {
    width: 100%;
    min-height: 2.5rem;
    background-color: var(--color-card);
    border: 1px solid rgba(229, 231, 235, 0.22);
    border-radius: var(--border-radius);
    color: var(--color-text);
    padding: 0.5rem 0.7rem;
    font-family: var(--font-family);
    font-size: 0.92rem;
    transition: border-color 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease;
  }

  input::placeholder {
    color: rgba(248, 248, 248, 0.58);
  }

  .felt-search input {
    min-height: 2.5rem;
    padding: 0.35rem 0.6rem 0.35rem 2rem;
    font-size: 0.86rem;
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

  @media (max-width: 640px) {
    .filterbar > *:nth-child(2),
    .filterbar > *:nth-child(3) {
      display: none;
    }
    .felt-search {
      width: 100% !important;
    }
    .felt-search:focus-within,
    .felt-search.er-aktiv {
      width: 100% !important;
    }
    .reset-knap {
      padding: 0.5rem;
      width: 5.5rem;
      font-size: 0.86rem;
    }
    .filterbar {
      padding: 0.5rem;
      gap: 1rem;
      width: 100%;

    }
  }
</style>