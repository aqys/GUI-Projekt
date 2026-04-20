<template>
    <table>
        <thead>
            <tr>
                <th>Navn</th>
                <th>Points</th>
                <th>Win%</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="deltager in deltagere" :key="deltager.navn">
                <td>{{ deltager.navn }}</td>
                <td>{{ deltager.points }}</td>
                <td>{{ deltager.win }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
    const deltagere = [
        {navn: 'Thomas', points: 30, win: 40},
        {navn: 'Emil', points: 10, win: 10},
        {navn: 'Benjamin', points: 80, win: 70}
    ]
</script>

<style scoped>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 10px 16px;
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