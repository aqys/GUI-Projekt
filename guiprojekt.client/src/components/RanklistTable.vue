<template>
    <h2>Rankliste</h2>
    <table>
        <thead>
            <tr>
                <th>Navn</th>
                <th>Points</th>
                <th>Win%</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="deltager in rankliste" :key="deltager.id">
                <td>{{ deltager.navn }}</td>
                <td>{{ deltager.points }}</td>
                <td>{{ deltager.win.toFixed(1) }}%</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
    import { onMounted, computed } from 'vue';
    import { useDeltagerStore } from '../stores/deltagerStore';
    import { useKampStore } from '../stores/kampStore';
    import type { Deltager } from '../types';

    const deltagerStore = useDeltagerStore();
    const kampStore = useKampStore();

    const rankliste = computed<Deltager[]>(() => {
        const statsByName = new Map<string, { wins: number; losses: number }>();

        for (const deltager of deltagerStore.deltagere) {
            statsByName.set(deltager.navn, { wins: 0, losses: 0 });
        }

        for (const kamp of kampStore.kampe) {
            const vinderStats = statsByName.get(kamp.vinder) ?? { wins: 0, losses: 0 };
            vinderStats.wins += 1;
            statsByName.set(kamp.vinder, vinderStats);

            const taberStats = statsByName.get(kamp.taber) ?? { wins: 0, losses: 0 };
            taberStats.losses += 1;
            statsByName.set(kamp.taber, taberStats);
        }

        return deltagerStore.deltagere
            .map((deltager) => {
                const stats = statsByName.get(deltager.navn) ?? { wins: 0, losses: 0 };
                const kampeSpillet = stats.wins + stats.losses;
                const winProcent = kampeSpillet > 0 ? (stats.wins / kampeSpillet) * 100 : 0;

                return {
                    ...deltager,
                    points: stats.wins,
                    win: winProcent,
                };
            })
            .sort((left, right) => {
                if (right.points !== left.points) {
                    return right.points - left.points;
                }

                if (right.win !== left.win) {
                    return right.win - left.win;
                }

                return left.navn.localeCompare(right.navn, 'da');
            });
    });
    
    onMounted(() => {
        deltagerStore.fetchDeltagere();
    })
</script>

<style scoped>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 1vh 0.5vw;
        text-align: left;
    }

    tbody tr:nth-child(even) {
        background-color: var(--color-card-alt);
    }
    tbody tr:nth-child(odd) {
        background-color: var(--color-card);
    }
    thead {
        background-color: var(--color-card-alt);
    }
</style>