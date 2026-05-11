<template>
    <div class="panel">
        <slot></slot>
    </div>
</template>

<style scoped>
    .panel {
        background: var(--panel);
        border-radius: var(--border-radius);
        padding: 0.75rem;
        box-shadow: var(--shadow);
        border: 1px solid var(--color-border);
        contain-intrinsic-size: auto 200px;
        contain: layout;
    }
    
    @media (max-width: 640px) {
        .panel {
            width: 100%;
            padding: .5rem;
        }
    }
</style>