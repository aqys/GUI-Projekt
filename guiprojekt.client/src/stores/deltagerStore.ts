import { defineStore } from "pinia";
import { ref } from 'vue'
import type { Deltager } from "../types";

type LoadOptions = {
    force?: boolean
    maxAgeMs?: number
    signal?: AbortSignal
}

export const useDeltagerStore = defineStore('deltagere', () => {
    const deltagere = ref<Deltager[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const lastLoadedAt = ref<number | null>(null)

    let inFlight: Promise<void> | null = null

    function isFresh(maxAgeMs: number): boolean {
        if (lastLoadedAt.value === null) return false
        return Date.now() - lastLoadedAt.value < maxAgeMs
    }

    async function fetchDeltagere(options: LoadOptions = {}): Promise<void> {
        if (inFlight && !options.force) {
            return inFlight
        }

        const job = (async () => {
            isLoading.value = true
            error.value = null

            try {
                const response = await fetch('/api/spillere', { signal: options.signal })

                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error('Fejl fra server (' + response.status + '): ' + errorText)
                }

                const data = await response.json()

                deltagere.value = (data as Array<{ id: number; navn: string }>).map((d) => ({
                    id: d.id,
                    navn: d.navn,
                    points: 0,
                    win: 0,
                }))

                lastLoadedAt.value = Date.now()
            } catch (e) {
                if (e instanceof DOMException && e.name === 'AbortError') {
                    throw e
                }

                const message = e instanceof Error ? e.message : 'Ukendt fejl ved hentning af deltagere'
                error.value = message
                console.error('Fejl ved hentning af spillere', e)
            } finally {
                isLoading.value =false
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

        if (!options.force && deltagere.value.length > 0 && isFresh(maxAgeMs)) {
            return
        }

        await fetchDeltagere(options)
    }

    async function addDeltager(navn: string) {
        const trimmed = navn.trim()
        if (trimmed.length < 2) {
            error.value = 'Navn skal være mindst 2 tegn'
            return
        }

        await fetch('/api/spillere', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: 0, navn: trimmed }),
        })

        await fetchDeltagere({ force: true })
    }

    return {
        deltagere,
        isLoading,
        error,
        lastLoadedAt,
        fetchDeltagere,
        ensureLoaded,
        addDeltager,
    }
})