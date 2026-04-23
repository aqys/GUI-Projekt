<template>
    <div class="panel">
        <slot></slot>
    </div>
</template>

<style scoped>
    .panel {
        background: #161616;
        border-radius: 0.9rem;
        padding: 0.65vw;
        box-shadow: 2px 6px 8px 0 rgba(0, 0, 0, .375);
        border: 1px solid rgba(229, 231, 235, 0.25);
    }
</style>