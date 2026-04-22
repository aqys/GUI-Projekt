import { defineStore } from "pinia";
import { ref } from 'vue'
import type { Deltager } from "../types";

export const useDeltagerStore = defineStore('deltagere', () => {
    const deltagere = ref<Deltager[]>([])

    async function fetchDeltagere() {
        try {
            const response = await fetch('/api/spillere');
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Fejl fra server (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            
            deltagere.value = data.map((d: any) => ({
                id: d.id,
                navn: d.navn,
                points: 0,
                win: 0
            }));
        } catch (error) {
            console.error('Fejl ved hentning af spillere', error);
        }
    }

    async function addDeltager(navn: string) {
        await fetch('/api/spillere', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: 0, navn: navn })
        });
        
        await fetchDeltagere();
    }

    return { deltagere, fetchDeltagere, addDeltager }
})