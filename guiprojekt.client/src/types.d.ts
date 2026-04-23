export interface Deltager {
    id: number;
    navn: string;
    points: number;
    win: number;
}

export interface Kamp {
    id: number;
    tidspunkt: string;
    vinder: string;
    vinderScore: number;
    taber: string;
    taberScore: number;
}

export interface StoreLoadState {
    isLoading: boolean;
    error: string | null
    lastLoadedAt: number | null
}

export type PreloadKey = 'deltagere' | 'kampe'

export interface RoutePreloadResult {
    key: PreloadKey
    ok: boolean
    tookMs: number
    message: string | null
}

export interface HeadToHeadRow {
    modstander: string
    wins: number
    losses: number
    total: number
    winRate: number
}