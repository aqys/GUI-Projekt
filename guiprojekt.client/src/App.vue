<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import IconLayoutDashboard from '@tabler/icons-vue/dist/esm/icons/IconLayoutDashboard.mjs'
import IconLayoutDashboardFilled from '@tabler/icons-vue/dist/esm/icons/IconLayoutDashboardFilled.mjs'
import IconCircle from '@tabler/icons-vue/dist/esm/icons/IconCircle.mjs'
import IconCircleFilled from '@tabler/icons-vue/dist/esm/icons/IconCircleFilled.mjs'
import IconTrophy from '@tabler/icons-vue/dist/esm/icons/IconTrophy.mjs'
import IconTrophyFilled from '@tabler/icons-vue/dist/esm/icons/IconTrophyFilled.mjs'
import IconUserFilled from '@tabler/icons-vue/dist/esm/icons/IconUserFilled.mjs'
import IconUser from '@tabler/icons-vue/dist/esm/icons/IconUser.mjs'
import IconChartPie2 from '@tabler/icons-vue/dist/esm/icons/IconChartPie2.mjs'
import IconChartPie2Filled from '@tabler/icons-vue/dist/esm/icons/IconChartPie2Filled.mjs'

const route = useRoute()

function isRouteActive(path: string): boolean {
  if (path === '/dashboard') {
    return route.path === '/' || route.path === '/dashboard'
  }

  return route.path === path
}
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <h1 class="brand"><a href="/" class="back">Turneringsmanager</a></h1>
      <nav class="nav-links">
        <RouterLink to="/dashboard" class="nav-item">
          <IconLayoutDashboardFilled v-if="isRouteActive('/dashboard')" class="nav-icon" />
          <IconLayoutDashboard v-else class="nav-icon" />
          Dashboard
        </RouterLink>

        <RouterLink to="/kampe" class="nav-item">
          <IconCircleFilled v-if="isRouteActive('/kampe')" class="nav-icon" />
          <IconCircle v-else class="nav-icon" />
          Kampe
        </RouterLink>

        <RouterLink to="/rankliste" class="nav-item">
          <IconTrophyFilled v-if="isRouteActive('/rankliste')" class="nav-icon" />
          <IconTrophy v-else class="nav-icon" />
          Rankliste
        </RouterLink>

        <RouterLink to="/deltagere" class="nav-item">
          <IconUserFilled v-if="isRouteActive('/deltagere')" class="nav-icon" />
          <IconUser v-else class="nav-icon" />
          Deltagere
        </RouterLink>

        <RouterLink to="/stats" class="nav-item">
          <IconChartPie2Filled v-if="isRouteActive('/stats')" class="nav-icon" />
          <IconChartPie2 v-else class="nav-icon" />
          Stats
        </RouterLink>
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
  background: #111111;
  border-bottom: 1px solid #60aaffac;
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
  font-size: medium;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
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
.back {
  color: white;
  text-decoration: none;
  transition: color 0.2s ease;
}
.back:hover {
  color: #60aaff;
}

.nav-links a.router-link-active {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
  position: relative;
}
.nav-links a.router-link-active::after {
  content: "";
  position: absolute;
  left: 0.6rem;
  right: 0.6rem;
  bottom: 0.05rem;
  height: 2px;
  border-radius: 99px;
  background: var(--color-primary-hover);
}

.nav-icon {
  width: 1.15rem;
  height: 1.15rem;
  flex-shrink: 0;
}
</style>