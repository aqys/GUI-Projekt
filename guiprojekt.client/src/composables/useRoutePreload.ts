import { useDeltagerStore } from "../stores/deltagerStore"
import { useKampStore } from "../stores/kampStore"
import type { PreloadKey, RoutePreloadResult } from "../types"

type PreloadOptions = {
    timeoutMs?: number
    force?: boolean
    maxAgeMs?: number
}

const inFlightMap = new Map<PreloadKey, Promise<void>>()

function nowMs(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now()
}

function withTimeout(
    runner: (signal: AbortSignal) => Promise<void>,
    timeoutMs: number
): Promise<void> {
    const controller = new AbortController()

    return new Promise<void>((resolve, reject) => {
        const timer = window.setTimeout(() => {
            controller.abort()
            reject(new Error('Preload timeout efter ' + timeoutMs + 'ms'))
        }, timeoutMs)

        runner(controller.signal)
            .then(() => resolve())
            .catch((e) => reject(e))
            .finally(() => window.clearTimeout(timer))
    })
}

async function preloadOne(key: PreloadKey, options: PreloadOptions): Promise<void> {
    if (inFlightMap.has(key)) {
        return inFlightMap.get(key) as Promise<void>
    }

    const timeoutMs = options.timeoutMs ?? 4500
    const maxAgeMs = options.maxAgeMs ?? 60_000
    const force = options.force ?? false

    const job = (async () => {
        if (key === 'deltagere') {
            const deltagerStore = useDeltagerStore()
            await withTimeout((signal) => deltagerStore.ensureLoaded({ signal, maxAgeMs, force}), timeoutMs)
            return
        }

        if (key === 'kampe') {
            const kampStore = useKampStore()
            await withTimeout((signal) => kampStore.ensureLoaded({ signal, maxAgeMs, force}), timeoutMs)
        }
    })()

    inFlightMap.set(key, job)

    try {
        await job
    } finally {
        inFlightMap.delete(key)
    }
}

export async function preloadRouteData(
    keys: PreloadKey[] | undefined,
    options: PreloadOptions = {}
): Promise<RoutePreloadResult[]> {
    if (!keys || keys.length === 0) {
        return []
    }

    const uniqueKeys = Array.from(new Set(keys))
    const results: RoutePreloadResult[] = []

    for (const key of uniqueKeys) {
        const start = nowMs()

        try {
            await preloadOne(key, options)
            results.push({
                key,
                ok: true,
                tookMs: Math.round(nowMs() - start),
                message: null,
            })
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Ukendt preload fejl'
            results.push({
                key,
                ok: false,
                tookMs: Math.round(nowMs() - start),
                message: msg,
            })
        }
    }

    return results
}