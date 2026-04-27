import { computed } from 'vue'
import { useDeltagerStore } from '@/stores/deltagerStore'
import { useKampStore } from '@/stores/kampStore'
import type { Deltager } from '@/types'

export type DeltagerMedStats = Deltager & {
  wins: number
  losses: number
  kampeSpillet: number
}

export function useRanklisteStats() {
  const deltagerStore = useDeltagerStore()
  const kampStore = useKampStore()

  const rankliste = computed<DeltagerMedStats[]>(() => {
    const statsByName = new Map<string, { wins: number; losses: number }>()

    for (const deltager of deltagerStore.deltagere) {
      statsByName.set(deltager.navn, { wins: 0, losses: 0 })
    }

    for (const kamp of kampStore.kampe) {
      const vinderStats = statsByName.get(kamp.vinder) ?? { wins: 0, losses: 0 }
      vinderStats.wins += 1
      statsByName.set(kamp.vinder, vinderStats)

      const taberStats = statsByName.get(kamp.taber) ?? { wins: 0, losses: 0 }
      taberStats.losses += 1
      statsByName.set(kamp.taber, taberStats)
    }

    return deltagerStore.deltagere
      .map((deltager) => {
        const stats = statsByName.get(deltager.navn) ?? { wins: 0, losses: 0 }
        const kampeSpillet = stats.wins + stats.losses
        const winProcent = kampeSpillet > 0 ? (stats.wins / kampeSpillet) * 100 : 0

        return {
          ...deltager,
          points: stats.wins,
          win: winProcent,
          wins: stats.wins,
          losses: stats.losses,
          kampeSpillet,
        }
      })
      .sort((left, right) => {
        if (right.points !== left.points) {
          return right.points - left.points
        }

        if (right.win !== left.win) {
          return right.win - left.win
        }

        return left.navn.localeCompare(right.navn, 'da')
      })
  })

  return { rankliste }
}