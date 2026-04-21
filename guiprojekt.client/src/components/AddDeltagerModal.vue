<template>
    <div class="modal-overlay">
        <div class="modal">
            <h2>Tilføj Deltager</h2>

            <div class="felt">
                <label>Navn</label>
                <input v-model="navn" type="text" placeholder="Indtast navn...">
                <span v-if="fejl" class="fejl">Navn må ikke være tomt</span>
            </div>

            <div class="knapper">
                <button class="anuller" @click="$emit('luk')">Anuller</button>
                <button class="add" @click="add">Tilføj</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDeltagerStore } from '../stores/deltagerStore';

const store = useDeltagerStore()
const navn = ref('')
const fejl = ref('')

const emit = defineEmits(['luk'])

function add() {
  if (navn.value.trim() === '') {
    fejl.value = 'Navn må ikke være tomt'
    return
  }

  store.addDeltager(navn.value.trim())
  navn.value = ''
  fejl.value = ''
  emit('luk')
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
        padding: 2vh .25vw;
        border: 0.1vw solid rgba(229, 231, 235, 0.35);
        border-radius: var(--border-radius);
        font-size: var(--font-body)+1;
        font-family: var(--font-family);
        background-color: var(--color-card);
        color: var(--color-text);
    }

    input:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    .fejl {
        color: var(--color-error);
        font-size: 13px;
    }

    .knapper {
        display: flex;
        justify-content: flex-end;
        gap: 0.4vw;
    }

    .add {
        background-color: var(--color-primary);
    }

    .add:hover {
        background-color: var(--color-primary-hover);
    }

    .anuller {
        background-color: var(--color-error-hover);
        color: var(--color-text);
    }

    .anuller:hover {
        background-color: var(--color-error);
    }
</style>