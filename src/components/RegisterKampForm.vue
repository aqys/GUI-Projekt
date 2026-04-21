<template>
    <div class="form-wrapper">
        <h2>Register Kamp</h2>

        <div class="form-grid">
            <div class="felt">
                <label>Spiller 1</label>
                <select v-model="spiller1">
                    <option value="">Vælg spiller...</option>
                    <option v-for="d in store.deltagere" :key="d.id" :value="d.navn">{{ d.navn }}</option>
                </select>
            </div>

            <div class="felt">
                <label>Score</label>
                <input v-model.number="score1" type="number" min="0" placeholder="0"/>
            </div>

            <div class="felt">
                <label>Spiller 2</label>
                <select v-model="spiller2">
                    <option value="">Vælg spiller...</option>
                    <option v-for="d in store.deltagere" :key="d.id" :value="d.navn">{{ d.navn }}</option>
                </select>
            </div>

            <div class="felt">
                <label>Score</label>
                <input v-model.number="score2" type="number" min="0" placeholder="0" />
            </div>
        </div>

        <span v-if="fejl" class="fejl global-fejl">{{ fejl }}</span>
        <button class="registrer" @click="registrer">Registrer Kamp</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDeltagerStore } from '../stores/deltagerStore'
import { useKampStore } from '../stores/kampStore'


const store = useDeltagerStore()
const matchStore = useKampStore()

const spiller1 = ref('')
const spiller2 = ref('')
const score1 = ref(0)
const score2 = ref(0)
const fejl = ref('')

function registrer() {
  if (spiller1.value === '' || spiller2.value === '') {
    fejl.value = 'Vælg begge spillere'
    return
  }
  if (spiller1.value === spiller2.value) {
    fejl.value = 'Spillerne må ikke være ens'
    return
  }
  if (score1.value === score2.value) {
    fejl.value = 'Der skal være en vinder'
    return
  }

  const vinder = score1.value > score2.value ? spiller1.value : spiller2.value
  const taber  = score1.value > score2.value ? spiller2.value : spiller1.value
  const vinderScore = Math.max(score1.value, score2.value)
  const taberScore  = Math.min(score1.value, score2.value)

  matchStore.addKamp({
    tidspunkt: new Date().toLocaleString('da-DK'),
    vinder,
    vinderScore,
    taber,
    taberScore
  })

  spiller1.value = ''
  spiller2.value = ''
  score1.value = 0
  score2.value = 0
  fejl.value = ''
}


</script>

<style scoped>
    .form-wrapper {
        background-color: #202120;
        border-radius: var(--border-radius);
        padding: 1vw;
        display: flex;
        flex-direction: column;
        gap: 1vh;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 4vw;
        gap: 3vh;
    }

    .felt {
        display: flex;
        flex-direction: column;
        gap: 1.25vh;
    }

    label {
        font-weight: 600;
        color: var(--color-text);
    }

    select,
    input {
        padding: 1vh 0.4vw;
        border: 0.1vw solid rgba(229, 231, 235, 0.35);
        border-radius: var(--border-radius);
        font-size: var(--font-size-body);
        font-family: var(--font-family);
        background-color: var(--color-card);
        color: var(--color-text);
    }

    select:focus,
    input:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    .fejl {
        color: var(--color-error);
        font-size: 1em;
    }

    .global-fejl {
        margin-top: 1vh;
    }

    .registrer {
        align-self: flex-end;
    }
</style>