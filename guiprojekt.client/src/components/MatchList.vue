<template>
  <div class="match-list">
    <h2>{{ props.title }}</h2>

    <MatchFilterBar v-if="props.showFilters" v-model="filters" :spillere="spillerOptions" />

    <div class="kampe">
      <MatchCard
        v-for="kamp in visteKampe"
        :key="kamp.id"
        :kamp="kamp"
        :allow-manage="props.allowManage"
        @rediger="redigerKamp"
        @slet="sletKamp"
      />
    </div>

    <p v-if="visteKampe.length === 0">Ingen kampe matcher filteret.</p>
    <p v-if="lokalFejl" class="fejl">{{ lokalFejl }}</p>

    <Transition name="fade">
      <div v-if="redigerModalAaben" class="modal-overlay" @click="redigerModalAaben = false">
        <div class="modal" @click.stop>
          <h3>Rediger kamp</h3>

          <div class="felt-grid">
            <div class="felt">
              <label for="rediger-score-vinder">Vinder-score</label>
              <input id="rediger-score-vinder" v-model.number="redigerVinderScore" type="number" min="0" />
            </div>
            <div class="felt">
              <label for="rediger-score-taber">Taber-score</label>
              <input id="rediger-score-taber" v-model.number="redigerTaberScore" type="number" min="0" />
            </div>
          </div>

          <div class="felt">
            <label for="rediger-tidspunkt">Tidspunkt</label>
            <input id="rediger-tidspunkt" v-model="redigerTidspunktLocal" type="datetime-local" />
          </div>

          <div class="modal-knapper">
            <button class="sekundaer" type="button" @click="redigerModalAaben = false">Annuller</button>
            <button type="button" @click="gemRedigerKamp">Gem</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="sletModalAaben" class="modal-overlay" @click="sletModalAaben = false">
        <div class="modal" @click.stop>
          <h3>Slet kamp</h3>
          <p>Vil du slette den valgte kamp?</p>
          <div class="modal-knapper">
            <button class="sekundaer" type="button" @click="sletModalAaben = false">Annuller</button>
            <button class="fare" type="button" @click="bekraeftSletKamp">Slet</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useKampStore } from '@/stores/kampStore'
import MatchCard from '@/components/MatchCard.vue'
import MatchFilterBar from '@/components/MatchFilterBar.vue'
import type { Kamp } from '@/types'

const props = withDefaults(
  defineProps<{
    limit?: number
    showFilters?: boolean
    title?: string
    allowManage?: boolean
  }>(),
  {
    showFilters: true,
    title: 'Seneste kampe',
    allowManage: false,
  }
)

type MatchResultFilter = 'all' | 'win' | 'loss'
type MatchFilters = {
  search: string
  spiller: string
  fraDato: string
  tilDato: string
  resultat: MatchResultFilter
}

const store = useKampStore()
const lokalFejl = ref('')
const redigerModalAaben = ref(false)
const aktivKamp = ref<Kamp | null>(null)
const redigerVinderScore = ref(0)
const redigerTaberScore = ref(0)
const redigerTidspunktLocal = ref('')
const sletModalAaben = ref(false)
const sletKampId = ref<number | null>(null)

const filters = ref<MatchFilters>({
  search: '',
  spiller: '',
  fraDato: '',
  tilDato: '',
  resultat: 'all',
})

const spillerOptions = computed(() => {
  const s = new Set<string>()
  for (const kamp of store.kampe) {
    s.add(kamp.vinder)
    s.add(kamp.taber)
  }
  return [...s].sort((a, b) => a.localeCompare(b, 'da'))
})

function parseDaTidspunkt(value: string): Date | null {
  const m = value.match(/^(\d{2})[-.](\d{2})[-.](\d{4})\s+(\d{2}):(\d{2})/)
  if (!m) return null
  const dd = Number(m[1])
  const mm = Number(m[2])
  const yyyy = Number(m[3])
  const hh = Number(m[4])
  const min = Number(m[5])
  return new Date(yyyy, mm - 1, dd, hh, min)
}

const filtreredeKampe = computed(() => {
  const q = filters.value.search.trim().toLowerCase()
  const fra = filters.value.fraDato ? new Date(filters.value.fraDato + 'T00:00:00') : null
  const til = filters.value.tilDato ? new Date(filters.value.tilDato + 'T23:59:59') : null

  return store.kampe.filter((kamp) => {
    if (filters.value.spiller && kamp.vinder !== filters.value.spiller && kamp.taber !== filters.value.spiller) {
      return false
    }

    if (filters.value.resultat !== 'all' && filters.value.spiller) {
      const selectedWon = kamp.vinder === filters.value.spiller
      if (filters.value.resultat === 'win' && !selectedWon) return false
      if (filters.value.resultat === 'loss' && selectedWon) return false
    }

    if (q) {
      const haystack = (kamp.vinder + ' ' + kamp.taber + ' ' + kamp.tidspunkt).toLowerCase()
      if (!haystack.includes(q)) return false
    }

    const kampDato = parseDaTidspunkt(kamp.tidspunkt)
    if (fra && (!kampDato || kampDato < fra)) return false
    if (til && (!kampDato || kampDato > til)) return false

    return true
  })
})

const visteKampe = computed(() => {
  const sorteret = [...filtreredeKampe.value].sort((a, b) => b.id - a.id)
  if (props.limit && props.limit > 0) {
    return sorteret.slice(0, props.limit)
  }

  return sorteret
})

async function redigerKamp(kamp: Kamp) {
  aktivKamp.value = kamp
  redigerVinderScore.value = kamp.vinderScore
  redigerTaberScore.value = kamp.taberScore
  redigerTidspunktLocal.value = toDateTimeLocal(kamp.tidspunkt)
  redigerModalAaben.value = true
}

async function gemRedigerKamp() {
  if (!aktivKamp.value) {
    return
  }

  const vinderScore = Number(redigerVinderScore.value)
  const taberScore = Number(redigerTaberScore.value)
  if (!Number.isFinite(vinderScore) || !Number.isFinite(taberScore) || vinderScore < 0 || taberScore < 0 || vinderScore === taberScore) {
    lokalFejl.value = 'Ugyldige scores. Der skal være en vinder og scores skal være >= 0.'
    return
  }

  const tidspunktInput = fromDateTimeLocal(redigerTidspunktLocal.value)
  if (!tidspunktInput) {
    lokalFejl.value = 'Ugyldigt tidspunkt'
    return
  }

  try {
    lokalFejl.value = ''
    await store.updateKamp(aktivKamp.value.id, {
      tidspunkt: tidspunktInput,
      vinder: aktivKamp.value.vinder,
      vinderScore,
      taber: aktivKamp.value.taber,
      taberScore,
    })
    redigerModalAaben.value = false
  } catch (e) {
    lokalFejl.value = e instanceof Error ? e.message : 'Kunne ikke opdatere kamp'
  }
}

async function sletKamp(id: number) {
  sletKampId.value = id
  sletModalAaben.value = true
}

async function bekraeftSletKamp() {
  if (sletKampId.value === null) {
    return
  }

  try {
    lokalFejl.value = ''
    await store.deleteKamp(sletKampId.value)
    sletModalAaben.value = false
  } catch (e) {
    lokalFejl.value = e instanceof Error ? e.message : 'Kunne ikke slette kamp'
  }
}

function toDateTimeLocal(value: string): string {
  const parsed = parseDaTidspunkt(value)
  if (!parsed) {
    return ''
  }

  const yyyy = parsed.getFullYear()
  const mm = String(parsed.getMonth() + 1).padStart(2, '0')
  const dd = String(parsed.getDate()).padStart(2, '0')
  const hh = String(parsed.getHours()).padStart(2, '0')
  const min = String(parsed.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

function fromDateTimeLocal(value: string): string | null {
  if (!value) {
    return null
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  const dd = String(parsed.getDate()).padStart(2, '0')
  const mm = String(parsed.getMonth() + 1).padStart(2, '0')
  const yyyy = parsed.getFullYear()
  const hh = String(parsed.getHours()).padStart(2, '0')
  const min = String(parsed.getMinutes()).padStart(2, '0')
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`
}

onMounted(() => {
  store.fetchKampe()
})
</script>

<style scoped>
    .kampe {
        display: flex;
        flex-direction: column;
        gap: 1vh;
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
      max-width: 430px;
      background: var(--color-card-alt);
      border: 1px solid rgba(229, 231, 235, 0.25);
      border-radius: var(--border-radius);
      padding: 1rem;
      display: grid;
      gap: 0.85rem;
      overflow-y: auto;
      max-height: 90vh;
    }

    .modal h3 {
      margin: 0;
      font-size: 1.05rem;
    }

    .felt-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.6rem;
    }

    .felt {
      display: grid;
      gap: 0.35rem;
    }

    .felt input {
      padding: 0.55rem;
      border-radius: var(--border-radius);
      border: 1px solid rgba(229, 231, 235, 0.2);
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
      border: 1px solid rgba(229, 231, 235, 0.35);
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

    @media (max-width: 640px) {
      .kampe {
        gap: 0.75rem;
        margin-top: 1rem;
      }
      .modal {
          max-width: 100%;
          border-radius: 0.75rem;
      }
      .modal {
        border-radius: 1rem 1rem 0 0;
        width: 100%;
        max-height: 85vh;
      }
      .felt-grid {
        grid-template-columns: 1fr;
      }
      .modal-knapper {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
      .modal-knapper button {
        width: 100%;
        height: 2rem;
      }
    }
</style>