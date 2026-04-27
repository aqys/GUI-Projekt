import { defineStore } from "pinia";
import { ref } from 'vue'
import type { Kamp } from "@/types";

type LoadOptions = {
    force?: boolean
    maxAgeMs?: number
    signal?: AbortSignal
}

export const useKampStore = defineStore('kampe', () => {
    const kampe = ref<Kamp[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const lastLoadedAt = ref<number | null>(null)

    let inFlight: Promise<void> | null = null

    function isFresh(maxAgeMs: number): boolean {
        if (lastLoadedAt.value === null) return false
        return Date.now() - lastLoadedAt.value < maxAgeMs
    }

    async function fetchKampe(options: LoadOptions = {}): Promise<void> {
        if (inFlight && !options.force) {
            return inFlight
        }

        const job = (async () => {
            isLoading.value = true
            error.value = null

            try {
                const response = await fetch('/api/v1/kampe', { signal: options.signal })

                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error('Fejl fra server (' + response.status + '): ' + errorText)
                }

                const data =  await response.json()
                kampe.value = data as Kamp[]
                lastLoadedAt.value = Date.now()
            } catch (e) {
                if (e instanceof DOMException && e.name === 'AbortError') {
                    throw e
                }

                const message = e instanceof Error ? e.message : 'Ukendt fejl ved hentning af kampe'
                error.value = message
                console.error('Fejl ved hentning af kampe', e)
            } finally {
                isLoading.value = false
            }
        })()

        inFlight = job

        try {
            await job
        } finally {
            inFlight = null
        }
    }

    async function ensureLoaded(options: LoadOptions = {}): Promise<void> {
        const maxAgeMs = options.maxAgeMs ?? 60_000

        if (!options.force && kampe.value.length > 0 && isFresh(maxAgeMs)) {
            return
        }

        await fetchKampe(options)
    }

    async function addKamp(kamp: Omit<Kamp, 'id'>) {
        await fetch('/api/v1/kampe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(kamp),
        })

        await fetchKampe({ force: true })
    }

    return {
        kampe,
        isLoading,
        error,
        lastLoadedAt,
        fetchKampe,
        ensureLoaded,
        addKamp,
    }
})