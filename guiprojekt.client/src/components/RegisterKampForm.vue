<template>
    <div class="form-wrapper">
        <h2>Register Kamp</h2>

        <div class="form-grid">
            <div class="felt">
                <label for="spiller1">Spiller 1</label>
                <select 
                    id="spiller1"
                    v-model="spiller1"
                    @blur="validateSpiller1"
                    :class="{ 'input-error': fieldErrors.spiller1 }"
                >
                    <option value="">Vælg spiller...</option>
                    <option v-for="d in store.deltagere" :key="d.id" :value="d.navn">{{ d.navn }}</option>
                </select>
                <span v-if="fieldErrors.spiller1" class="felt-fejl">{{ fieldErrors.spiller1 }}</span>
            </div>

            <div class="felt">
                <label for="score1">Score</label>
                <input 
                    id="score1"
                    v-model.number="score1" 
                    type="number" 
                    min="0" 
                    max="999"
                    placeholder="0"
                    @blur="validateScores"
                    :class="{ 'input-error': fieldErrors.score1 }"
                />
                <span v-if="fieldErrors.score1" class="felt-fejl">{{ fieldErrors.score1 }}</span>
            </div>

            <div class="felt">
                <label for="spiller2">Spiller 2</label>
                <select 
                    id="spiller2"
                    v-model="spiller2"
                    @blur="validateSpiller2"
                    :class="{ 'input-error': fieldErrors.spiller2 }"
                >
                    <option value="">Vælg spiller...</option>
                    <option v-for="d in store.deltagere" :key="d.id" :value="d.navn">{{ d.navn }}</option>
                </select>
                <span v-if="fieldErrors.spiller2" class="felt-fejl">{{ fieldErrors.spiller2 }}</span>
            </div>

            <div class="felt">
                <label for="score2">Score</label>
                <input 
                    id="score2"
                    v-model.number="score2" 
                    type="number" 
                    min="0" 
                    max="999"
                    placeholder="0"
                    @blur="validateScores"
                    :class="{ 'input-error': fieldErrors.score2 }"
                />
                <span v-if="fieldErrors.score2" class="felt-fejl">{{ fieldErrors.score2 }}</span>
            </div>
        </div>

        <span v-if="fejl" class="fejl global-fejl">{{ fejl }}</span>
        <button 
            class="registrer" 
            @click="registrer"
            :disabled="isLoading"
        >
            {{ isLoading ? 'Registrerer...' : 'Registrer Kamp' }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useDeltagerStore } from '@/stores/deltagerStore'
import { useKampStore } from '@/stores/kampStore'


const store = useDeltagerStore()
const matchStore = useKampStore()

const spiller1 = ref('')
const spiller2 = ref('')
const score1 = ref(0)
const score2 = ref(0)
const fejl = ref('')
const isLoading = ref(false)

const fieldErrors = reactive({
    spiller1: '',
    spiller2: '',
    score1: '',
    score2: ''
})

function validateSpiller1() {
    fieldErrors.spiller1 = spiller1.value === '' ? 'Vælg en spiller' : ''
}

function validateSpiller2() {
    fieldErrors.spiller2 = spiller2.value === '' ? 'Vælg en spiller' : ''
    if (spiller2.value === spiller1.value && spiller2.value !== '') {
        fieldErrors.spiller2 = 'Spillerne må ikke være ens'
    }
}

function validateScores() {
    fieldErrors.score1 = ''
    fieldErrors.score2 = ''

    if (isNaN(score1.value) || score1.value < 0) {
        fieldErrors.score1 = 'Score skal være et tal ≥ 0'
    }
    if (score1.value > 999) {
        fieldErrors.score1 = 'Score må maksimalt være 999'
    }

    if (isNaN(score2.value) || score2.value < 0) {
        fieldErrors.score2 = 'Score skal være et tal ≥ 0'
    }
    if (score2.value > 999) {
        fieldErrors.score2 = 'Score må maksimalt være 999'
    }

    if (score1.value === score2.value && score1.value > 0 && score2.value > 0) {
        fejl.value = 'Point må ikke være lige, der skal være en vinder'
    } else {
        fejl.value = ''
    }
}

function validateForm(): boolean {
    validateSpiller1()
    validateSpiller2()
    validateScores()

    if (!spiller1.value || !spiller2.value || score1.value === score2.value) {
        fejl.value = 'Ret fejlene før du registrerer kampen'
        return false
    }

    return true
}

async function registrer() {
    fejl.value = ''

    if (!validateForm()) {
        return
    }

    const vinder = score1.value > score2.value ? spiller1.value : spiller2.value
    const taber  = score1.value > score2.value ? spiller2.value : spiller1.value
    const vinderScore = Math.max(score1.value, score2.value)
    const taberScore  = Math.min(score1.value, score2.value)

    isLoading.value = true
    try {
        await matchStore.addKamp({
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
        fieldErrors.spiller1 = ''
        fieldErrors.spiller2 = ''
        fieldErrors.score1 = ''
        fieldErrors.score2 = ''
        fejl.value = ''
    } catch (e) {
        fejl.value = e instanceof Error ? e.message : 'Kunne ikke registrere kamp'
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
    .form-wrapper {
        background-color: var(--color-card-alt);
        border-radius: var(--border-radius);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: .75rem;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 5vw;
        gap: 3vh;
    }

    .felt {
        display: flex;
        flex-direction: column;
        gap: .35rem;
    }

    label {
        font-weight: 600;
        color: var(--color-text);
    }

    select,
    input {
        padding: 1vh 0.4vw;
        border: 0.1vw solid var(--color-border);
        border-radius: var(--border-radius);
        font-size: var(--font-size-body);
        font-family: var(--font-family);
        background-color: var(--color-card);
        color: var(--color-text);
        transition: border-color 0.2s;
        width: 100%;
        box-sizing: border-box;
    }

    select:focus,
    input:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    select:disabled,
    input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .input-error {
        border-color: var(--color-error);
    }

    .input-error:focus {
        border-color: var(--color-error);
    }

    .fejl {
        color: var(--color-error);
        font-size: 1em;
    }

    .felt-fejl {
        color: var(--color-error);
        font-size: 0.85em;
    }

    .global-fejl {
        margin-top: 1vh;
        padding: 0.5vh 1vw;
        background-color: rgba(239, 68, 68, 0.1);
        border-radius: var(--border-radius);
        border-left: 3px solid var(--color-error);
    }

    .registrer {
        align-self: flex-end;
    }

    .registrer:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @media (max-width: 640px) {
        .form-grid {
            grid-template-columns: 1fr;
        }

        .registrer {
            width: 100%;
            align-self: stretch;
        }
    }
</style>