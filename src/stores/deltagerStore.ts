import { defineStore } from "pinia";
import { ref } from 'vue'

export interface Deltager {
    id: number;
    navn: string;
    points: number;
    win: number;
}

export const useDeltagerStore = defineStore('deltagere', () => {
    const deltagere = ref<Deltager[]>([
        { id: 1, navn: 'Thomas', points: 30, win: 40 },
        { id: 2, navn: 'Emil', points: 10, win: 10 },
        { id: 3, navn: 'Benjamin', points: 80, win: 70 }
    ])

    function addDeltager(navn: string) {
        deltagere.value.push({
            id: deltagere.value.length + 1,
            navn: navn,
            points: 0,
            win: 0
        })
    }

    return { deltagere, addDeltager }
})