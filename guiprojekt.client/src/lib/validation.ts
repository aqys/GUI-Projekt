export const ValidationRules = {
    navn: (value: string): string => {
        const trimmed = value?.trim() ?? ''

        if (!trimmed) {
            return 'Navn er påkrævet'
        }

        if (trimmed.length < 2) {
            return 'Navn skal være mindst 2 tegn'
        }

        if (trimmed.length > 100) {
            return 'Navn må maksimalt være 100 tegn'
        }

        if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
            return 'Navn må kun indeholde bogstaver, mellemrum, apostrof og bindestreg'
        }

        return ''
    },

    score: (value: number | null | undefined): string => {
        if (value === null || value === undefined || isNaN(value)) {
            return 'Score er påkrævet'
        }

        if (value < 0) {
            return 'Score kan ikke være negativ'
        }

        if (value > 999) {
            return 'Score må maksimalt være 999'
        }

        return ''
    },

    differentPlayers: (player1: string, player2: string): string => {
        if (player1 && player2 && player1.toLowerCase() === player2.toLowerCase()) {
            return 'Spillerne må ikke være ens'
        }
        return ''
    },

    differentScores: (score1: number, score2: number): string => {
        if (score1 === score2 && score1 !== 0 && score2 !== 0) {
            return 'Poengene må ikke være lige - der skal være en vinder'
        }
        return ''
    },

    validMatchResult: (score1: number, score2: number): string => {
        if (score1 === score2) {
            return 'Poengene må ikke være lige'
        }
        return ''
    }
}

export function parseServerError(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }

    if (typeof error === 'string') {
        return error
    }

    if (error && typeof error === 'object') {
        const errorObj = error as Record<string, any>

        if (errorObj.errors && typeof errorObj.errors === 'object') {
            const messages = Object.entries(errorObj.errors)
                .flatMap(([, msgs]: [string, any]) => {
                    if (Array.isArray(msgs)) {
                        return msgs
                    }
                    return [msgs]
                })
            return messages.join(', ')
        }

        if (errorObj.error) {
            return String(errorObj.error)
        }

        if (errorObj.detail) {
            return String(errorObj.detail)
        }

        if (errorObj.message) {
            return String(errorObj.message)
        }
    }

    return 'En uventet fejl opstod'
}

export function normalizeInput(value: string | null | undefined): string {
    return (value ?? '').trim()
}

export function isRequired(value: string | null | undefined): boolean {
    return normalizeInput(value).length > 0
}

export function hasMinLength(value: string | null | undefined, min: number): boolean {
    return normalizeInput(value).length >= min
}

export function hasMaxLength(value: string | null | undefined, max: number): boolean {
    return normalizeInput(value).length <= max
}
