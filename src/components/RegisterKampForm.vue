<template>
    <div class="form-wrapper">
        <h2>Register Kamp</h2>

        <div class="form-grid">
            <div class="felt">
                <label>Spiller 1</label>
                <select>
                <option>Vælg spiller...</option>
                <option>Anders</option>
                <option>Mads</option>
                </select>
                <span class="fejl">Vælg en spiller</span>
            </div>

            <div class="felt">
                <label>Score</label>
                <input type="number" min="0" placeholder="0"/>
            </div>

            <div class="felt">
                <label>Spiller 2</label>
                <select>
                    <option>Vælg spiller...</option>
                    <option>Anders</option>
                    <option>Mads</option>
                </select>
                <span class="fejl">Vælg en spiller</span>
            </div>

            <div class="felt">
                <label>Score</label>
                <input type="number" min="0" placeholder="0" />
            </div>
        </div>

        <span class="fejl global-fejl">Spillerne må ikke være ens</span>
        <button class="registrer">Registrer Kamp</button>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
    .form-wrapper {
        background-color: #202120;
        border-radius: var(--border-radius);
        padding: 1vw;
        display: flex;
        flex-direction: column;
        gap: 1vh;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 4vw;
        gap: 3vh;
    }

    .felt {
        display: flex;
        flex-direction: column;
        gap: 1.25vh;
    }

    label {
        font-weight: 600;
        color: var(--color-text);
    }

    select,
    input {
        padding: 1vh 0.4vw;
        border: 0.1vw solid rgba(229, 231, 235, 0.35);
        border-radius: var(--border-radius);
        font-size: var(--font-size-body);
        font-family: var(--font-family);
        background-color: var(--color-card);
        color: var(--color-text);
    }

    select:focus,
    input:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    .fejl {
        color: var(--color-error);
        font-size: 1em;
    }

    .global-fejl {
        margin-top: 1vh;
    }

    .registrer {
        align-self: flex-end;
    }
</style>