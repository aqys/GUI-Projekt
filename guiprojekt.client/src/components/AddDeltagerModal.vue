<template>
    <div class="modal-overlay" @click.self="handleClose">
        <div class="modal">
            <h2>Tilføj Deltager</h2>

            <div class="felt">
                <label for="navn">Navn</label>
                <input 
                    id="navn"
                    v-model="navn" 
                    type="text" 
                    placeholder="Indtast navn..."
                    maxlength="100"
                    @blur="validateNavn"
                    @keyup.enter="add"
                    :class="{ 'input-error': feltFejl }"
                >
                <div class="input-info">
                    <span class="tegn-teller">{{ navn.length }}/100</span>
                    <span v-if="feltFejl" class="felt-fejl">{{ feltFejl }}</span>
                </div>
            </div>

            <span v-if="fejl" class="fejl global-fejl">{{ fejl }}</span>

            <div class="knapper">
                <button 
                    class="anuller" 
                    @click="handleClose"
                    :disabled="isLoading"
                >
                    Annuller
                </button>
                <button 
                    class="add" 
                    @click="add"
                    :disabled="isLoading || !isFormValid"
                >
                    {{ isLoading ? 'Tilføjer...' : 'Tilføj' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDeltagerStore } from '@/stores/deltagerStore';

const store = useDeltagerStore()
const navn = ref('')
const fejl = ref('')
const feltFejl = ref('')
const isLoading = ref(false)

const emit = defineEmits(['luk'])

const isFormValid = computed(() => {
    return navn.value.trim().length >= 2 && !feltFejl.value
})

function validateNavn() {
    feltFejl.value = ''
    
    if (navn.value.trim().length === 0) {
        feltFejl.value = 'Navn er påkrævet'
        return
    }
    
    if (navn.value.trim().length < 2) {
        feltFejl.value = 'Navn skal være mindst 2 tegn'
        return
    }
    
    if (navn.value.trim().length > 100) {
        feltFejl.value = 'Navn må maksimalt være 100 tegn'
        return
    }
}

function handleClose() {
    if (!isLoading.value) {
        reset()
        emit('luk')
    }
}

function reset() {
    navn.value = ''
    fejl.value = ''
    feltFejl.value = ''
}

async function add() {
    validateNavn()

    if (!isFormValid.value) {
        fejl.value = 'Ret fejlene før du tilføjer deltager'
        return
    }

    isLoading.value = true
    fejl.value = ''

    try {
        await store.addDeltager(navn.value.trim())
        reset()
        emit('luk')
    } catch (e) {
        fejl.value = e instanceof Error ? e.message : 'Kunne ikke oprette deltager'
        console.error('Fejl ved oprettelse af deltager:', e)
    } finally {
        isLoading.value = false
    }
}

</script>

<style scoped>
    .modal-overlay {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal {
        background-color: var(--color-card-alt);
        border-radius: var(--border-radius);
        padding: 1vw;
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 2vh;
        border: 1px solid var(--color-border);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    h2 {
        margin: 0;
        color: var(--color-text);
    }

    .felt {
        display: flex;
        flex-direction: column;
        gap: 0.9vh;
    }

    label {
        font-weight: 600;
        color: var(--color-text);
        font-size: medium;
    }

    input {
        padding: 1.25vh .25vw;
        border: 0.1vw solid var(--color-border);
        border-radius: var(--border-radius);
        font-size: var(--font-body);
        font-family: var(--font-family);
        background-color: var(--color-card);
        color: var(--color-text);
        transition: border-color 0.2s;
    }

    input:focus {
        outline: none;
        border-color: var(--color-primary);
    }

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

    .input-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85em;
    }

    .tegn-teller {
        color: var(--color-text-muted);
    }

    .fejl {
        color: var(--color-error);
        font-size: 0.95em;
        padding: 0.75vh 1vw;
        background-color: rgba(239, 68, 68, 0.1);
        border-radius: var(--border-radius);
        border-left: 3px solid var(--color-error);
    }

    .global-fejl {
        margin: 0;
    }

    .felt-fejl {
        color: var(--color-error);
        font-size: 0.85em;
    }

    .knapper {
        display: flex;
        justify-content: flex-end;
        gap: 0.4vw;
    }

    button {
        padding: 0.75vh 1vw;
        border: none;
        border-radius: var(--border-radius);
        font-size: var(--font-size-body);
        font-family: var(--font-family);
        cursor: pointer;
        transition: all 0.2s;
    }

    .add {
        background-color: var(--color-primary);
        color: white;
    }

    .add:hover:not(:disabled) {
        background-color: var(--color-primary-hover);
    }

    .add:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .anuller {
        background-color: var(--color-error);
        color: var(--color-text);
    }

    .anuller:hover:not(:disabled) {
        background-color: var(--color-error-hover);
    }

    .anuller:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>