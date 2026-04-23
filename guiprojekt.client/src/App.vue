<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <h1 class="brand">Turneringsmanager</h1>
      <nav class="nav-links">
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <RouterLink to="/kampe">Kampe</RouterLink>
        <RouterLink to="/rankliste">Rankliste</RouterLink>
        <RouterLink to="/deltagere">Deltagere</RouterLink>
        <RouterLink to="/statistik">Statistik</RouterLink>
      </nav>
    </header>

    <section class="view-wrapper">
      <RouterView />
    </section>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1rem;
  background: linear-gradient(180deg, #1a1a1a, #111111);
  border-bottom: 1px solid rgba(229, 231, 235, 0.2);
}

.brand {
  font-size: 1.25rem;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.nav-links a {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 600;
  border-radius: 0.45rem;
  padding: 0.45rem 0.7rem;
  border: 1px solid transparent;
  transition: background-color 0.16s ease, border-color 0.16s ease;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.08);
}

.nav-links a.router-link-active {
  background: var(--color-primary);
  border-color: var(--color-primary-hover);
}

.view-wrapper {
  padding: 0.85rem;
}
</style>