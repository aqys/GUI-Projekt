import { defineStore } from "pinia";
import { ref } from 'vue'
import type { Kamp } from "../types";


export const useKampStore = defineStore('kampe', () => {
    const kampe = ref<Kamp[]>([
        { id: 1, tidspunkt: '20-04-2026 14:32', vinder: 'Anders', vinderScore: 3, taber: 'Mads', taberScore: 1 },
        { id: 2, tidspunkt: '20-04-2026 13:10', vinder: 'Sofie', vinderScore: 3, taber: 'Anders', taberScore: 2 },
        { id: 3, tidspunkt: '19-04-2026 18:45', vinder: 'Mads', vinderScore: 3, taber: 'Sofie', taberScore: 0 }
    ])

    function addKamp(kamp: Omit<Kamp, 'id'>) {
        kampe.value.unshift({
            id: kampe.value.length + 1,
            ...kamp
        })
    }

    return { kampe, addKamp }
})