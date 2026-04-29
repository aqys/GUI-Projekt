<template>
  <h2>{{ props.title }}</h2>
  <div v-if="!isMobile" class="soeg-wrapper" :class="{ 'er-aktiv': soegeTekst.trim().length > 0 }">
    <label class="soeg-label" for="deltager-soeg">Søg deltagere</label>
    <div class="soeg-felt">
      <span class="soeg-ikon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M10.5 4a6.5 6.5 0 1 0 4.04 11.59l4.43 4.44a1 1 0 0 0 1.42-1.42l-4.44-4.43A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"
          />
        </svg>
      </span>
      <input
        id="deltager-soeg"
        v-model="soegeTekst"
        class="soeg-input"
        type="search"
        placeholder="Søg på navn..."
      />
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>
            <template v-if="!isMobile">
              <button class="sort-knap" type="button" @click="skiftSortering('navn')">
                Navn
                <span class="sort-ikon">{{ hentSortSymbol('navn') }}</span>
              </button>
            </template>
            <template v-else>Navn</template>
          </th>

          <th>
            <template v-if="!isMobile">
              <button class="sort-knap" type="button" @click="skiftSortering('points')">
                Points
                <span class="sort-ikon">{{ hentSortSymbol('points') }}</span>
              </button>
            </template>
            <template v-else>Points</template>
          </th>

          <th>
            <template v-if="!isMobile">
              <button class="sort-knap" type="button" @click="skiftSortering('win')">
                Win%
                <span class="sort-ikon">{{ hentSortSymbol('win') }}</span>
              </button>
            </template>
            <template v-else>Win%</template>
          </th>
        <th v-if="props.allowManage">Handlinger</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="deltager in visteDeltagere"
        :key="deltager.id"
        :class="{ valgt: valgtDeltagerNavn === deltager.navn }"
        tabindex="0"
        @click="vaelgDeltager(deltager.navn)"
        @keyup.enter="vaelgDeltager(deltager.navn)"
      >
        <td>{{ deltager.navn }}</td>
        <td>{{ deltager.points }}</td>
        <td>{{ deltager.win.toFixed(1) }}%</td>
        <td v-if="props.allowManage" class="handlinger">
          <button class="lille-knap" type="button" @click.stop="redigerDeltager(deltager.id, deltager.navn)">
            Rediger
          </button>
          <button class="lille-knap fare" type="button" @click.stop="sletDeltager(deltager.id, deltager.navn)">
            Slet
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <p v-if="lokalFejl" class="fejl">{{ lokalFejl }}</p>

  <Transition name="fade">
    <div v-if="redigerModalAaben" class="modal-overlay" @click="redigerModalAaben = false">
      <div class="modal" @click.stop>
        <h3>Rediger deltager</h3>
        <div class="felt">
          <label for="rediger-navn">Navn</label>
          <input id="rediger-navn" v-model="redigerNavn" type="text" placeholder="Skriv nyt navn" />
        </div>
        <div class="modal-knapper">
          <button class="sekundaer" type="button" @click="redigerModalAaben = false">Annuller</button>
          <button type="button" @click="gemRedigerDeltager">Gem</button>
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="fade">
    <div v-if="sletModalAaben" class="modal-overlay" @click="sletModalAaben = false">
      <div class="modal" @click.stop>
        <h3>Slet deltager</h3>
        <p>Vil du slette <strong>{{ sletNavn }}</strong>?</p>
        <div class="modal-knapper">
          <button class="sekundaer" type="button" @click="sletModalAaben = false">Annuller</button>
          <button class="fare" type="button" @click="bekraeftSletDeltager">Slet</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { useDeltagerStore } from '@/stores/deltagerStore'
import { useKampStore } from '@/stores/kampStore'
import { useRanklisteStats } from '@/composables/useRanklisteStats'

const isMobile = ref(false)

function checkScreen() {
  isMobile.value = window.innerWidth <= 640
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
})

const props = withDefaults(
  defineProps<{
    limit?: number
    title?: string
    allowManage?: boolean
  }>(),
  {
    title: 'Rankliste',
    allowManage: false,
  }
)

type SorteringsKolonne = 'navn' | 'points' | 'win'
type SorteringsRetning = 'asc' | 'desc'

const emit = defineEmits<{
  (e: 'vaelg-deltager', navn: string | null): void
}>()

const deltagerStore = useDeltagerStore()
const kampStore = useKampStore()
const { rankliste } = useRanklisteStats()
const valgtDeltagerNavn = ref<string | null>(null)
const aktivSorteringsKolonne = ref<SorteringsKolonne>('points')
const aktivSorteringsRetning = ref<SorteringsRetning>('desc')
const lokalFejl = ref('')
const soegeTekst = ref('')
const redigerModalAaben = ref(false)
const redigerId = ref<number | null>(null)
const redigerNavn = ref('')
const redigerOriginaltNavn = ref('')
const sletModalAaben = ref(false)
const sletId = ref<number | null>(null)
const sletNavn = ref('')

const filtreretRankliste = computed(() => {
  const query = soegeTekst.value.trim().toLowerCase()
  if (!query) {
    return rankliste.value
  }

  return rankliste.value.filter((deltager) => deltager.navn.toLowerCase().includes(query))
})

const sorteretRankliste = computed(() => {
  const liste = [...filtreretRankliste.value]

  const kolonne = isMobile.value ? 'points' : aktivSorteringsKolonne.value
  const retning = isMobile.value
    ? -1
    : aktivSorteringsRetning.value === 'asc'
    ? 1
    : -1

  liste.sort((a, b) => {
    if (kolonne === 'navn') {
      return a.navn.localeCompare(b.navn, 'da') * retning
    }

    const v = kolonne === 'points' ? a.points : a.win
    const h = kolonne === 'points' ? b.points : b.win

    if (v === h) {
      return a.navn.localeCompare(b.navn, 'da')
    }

    return (v - h) * retning
  })

  return liste
})

const visteDeltagere = computed(() => {
  if (props.limit && props.limit > 0) {
    return sorteretRankliste.value.slice(0, props.limit)
  }

  return sorteretRankliste.value
})

function skiftSortering(kolonne: SorteringsKolonne) {
  if (aktivSorteringsKolonne.value === kolonne) {
    aktivSorteringsRetning.value = aktivSorteringsRetning.value === 'asc' ? 'desc' : 'asc'
    return
  }

  aktivSorteringsKolonne.value = kolonne
  aktivSorteringsRetning.value = kolonne === 'navn' ? 'asc' : 'desc'
}

function hentSortSymbol(kolonne: SorteringsKolonne): string {
  if (aktivSorteringsKolonne.value !== kolonne) {
    return ''
  }

  return aktivSorteringsRetning.value === 'asc' ? '▲' : '▼'
}

function vaelgDeltager(navn: string) {
  const nyVaerdi = valgtDeltagerNavn.value === navn ? null : navn
  valgtDeltagerNavn.value = nyVaerdi
  emit('vaelg-deltager', nyVaerdi)
}

function redigerDeltager(id: number, nuvaerendeNavn: string) {
  redigerId.value = id
  redigerNavn.value = nuvaerendeNavn
  redigerOriginaltNavn.value = nuvaerendeNavn
  redigerModalAaben.value = true
}

async function gemRedigerDeltager() {
  if (redigerId.value === null) {
    return
  }

  const trimmed = redigerNavn.value.trim()
  if (trimmed === '' || trimmed === redigerOriginaltNavn.value) {
    redigerModalAaben.value = false
    return
  }

  try {
    lokalFejl.value = ''
    await deltagerStore.updateDeltager(redigerId.value, trimmed)
    redigerModalAaben.value = false
  } catch (e) {
    lokalFejl.value = e instanceof Error ? e.message : 'Kunne ikke opdatere deltager'
  }
}

function sletDeltager(id: number, navn: string) {
  sletId.value = id
  sletNavn.value = navn
  sletModalAaben.value = true
}

async function bekraeftSletDeltager() {
  if (sletId.value === null) {
    return
  }

  try {
    lokalFejl.value = ''
    await deltagerStore.deleteDeltager(sletId.value)
    sletModalAaben.value = false
  } catch (e) {
    lokalFejl.value = e instanceof Error ? e.message : 'Kunne ikke slette deltager'
  }
}

onMounted(async () => {
  const jobs: Promise<void>[] = []

  if (deltagerStore.deltagere.length === 0) {
    jobs.push(deltagerStore.fetchDeltagere())
  }

  if (kampStore.kampe.length === 0) {
    jobs.push(kampStore.fetchKampe())
  }

  if (jobs.length > 0) {
    await Promise.all(jobs)
  }
})
</script>

<style scoped>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 1vh 0.5vw;
        text-align: left;
    }

    tbody tr{
        transition: background-color 0.2s;
    }

    tbody tr:hover {
        cursor: pointer;
        background-color: var(--color-table-hover) !important;
    }

    tbody tr:nth-child(even) {
        background-color: var(--color-table-alt);
    }
    tbody tr:nth-child(odd) {
        background-color: var(--color-table);
    }
    thead {
        background-color: var(--color-table-bar);
    }
    thead th {
        border: 1px solid var(--color-border);
    }

    .sort-knap {
      background: transparent;
      border: 0;
      color: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font: inherit;
      padding: 0;
    }

    .sort-ikon {
      min-width: 1ch;
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .soeg-wrapper {
      display: grid;
      gap: 0.35rem;
      margin-bottom: 0.7rem;
      width: min(100%, 12.5rem);
      transition: width 0.2s ease;
    }

    .soeg-wrapper:focus-within,
    .soeg-wrapper.er-aktiv {
      width: min(100%, 16rem);
    }

    .soeg-label {
      font-weight: 600;
      font-size: 0.82rem;
      opacity: 0.9;
    }

    .soeg-felt {
      position: relative;
    }

    .soeg-ikon {
      position: absolute;
      left: 0.58rem;
      top: 50%;
      width: 1.25rem;
      height: 1.25rem;
      transform: translateY(-50%);
      pointer-events: none;
    }

    .soeg-ikon svg {
      width: 100%;
      height: 100%;
      fill: var(--color-icon);
    }

    .soeg-input {
      width: 70%;
      min-height: 2.05rem;
      padding: 0.35rem 0.6rem 0.35rem 2rem;
      border-radius: var(--border-radius);
      border: 1px solid var(--color-border);
      background: var(--color-card);
      color: var(--color-text);
      font-family: var(--font-family);
      font-size: 0.86rem;
      transition: border-color 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease;
    }

    .soeg-input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(22, 128, 249, 0.22);
      background-color: var(--color-card-hover);
    }

    .handlinger {
      display: flex;
      gap: 0.4rem;
      align-items: center;
    }

    .lille-knap {
      padding: 0.35rem 0.55rem;
      font-size: 0.78rem;
    }

    .fare:hover {
      background-color: var(--color-error-hover) !important;
    }

    .fejl {
      margin-top: 0.75rem;
      color: var(--color-error);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.48);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 40;
      padding: 1rem;
    }

    .modal {
      width: 100%;
      max-width: 360px;
      background: var(--color-card-alt);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: 1rem;
      display: grid;
      gap: 0.85rem;
    }

    .modal h3 {
      margin: 0;
      font-size: 1.05rem;
    }

    .felt {
      display: grid;
      gap: 0.35rem;
    }

    .felt input {
      padding: 0.55rem;
      border-radius: var(--border-radius);
      border: 1px solid var(--color-border);
      background: var(--color-card);
      color: var(--color-text);
      font-family: var(--font-family);
    }

    .modal-knapper {
      display: flex;
      justify-content: flex-end;
      gap: 0.45rem;
    }

    .sekundaer {
      background: transparent;
      border: 1px solid var(--color-border);
      color: var(--color-text);
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.18s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    table {
      min-width: 420px;
    }

    @media (max-width: 640px) {
      th, td {
        padding: 0.6rem 0.4rem;
        font-size: 1rem;
      }

      h2 {
        font-size: 1.1rem;
      }

      .table-wrapper {
        overflow-x: auto;
      }

      table {
        min-width: 0;
        margin-top: 1rem;
      }
  }
</style>