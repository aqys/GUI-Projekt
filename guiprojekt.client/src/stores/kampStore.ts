import { defineStore } from "pinia";
import { ref } from 'vue'
import type { Kamp } from "../types";


export const useKampStore = defineStore('kampe', () => {
    const kampe = ref<Kamp[]>([])

    async function fetchKampe() {
        try {
            const response = await fetch('/api/kampe');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Fejl fra server (${response.status}): ${errorText}`);
            }
            const data = await response.json();
            kampe.value = data;
        } catch (error) {
            console.error('Fejl ved hentning af kampe', error);
        }
    }

    async function addKamp(kamp: Omit<Kamp, 'id'>) {
        try {
            await fetch('/api/kampe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(kamp)
            });
            await fetchKampe();
        } catch (error) {
            console.error('Fejl ved oprettelse af kamp', error);
        }
    }

    return { kampe, fetchKampe, addKamp }
})