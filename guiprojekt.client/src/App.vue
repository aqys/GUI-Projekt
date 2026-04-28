<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
import { useDeltagerStore } from '@/stores/deltagerStore'
import { useKampStore } from '@/stores/kampStore'

const route = useRoute()
const navLinksRef = ref<HTMLElement | null>(null)
const deltagerStore = useDeltagerStore()
const kampStore = useKampStore()
const AUTO_REFRESH_MS = 25_000
let autoRefreshTimer: number | null = null
const indicatorStyle = ref({
  width: '0px',
  transform: 'translateX(0px)',
  opacity: '0',
})

async function refreshStores(force = false): Promise<void> {
  if (document.hidden) {
    return
  }

  await Promise.allSettled([
    deltagerStore.ensureLoaded({ force, maxAgeMs: AUTO_REFRESH_MS }),
    kampStore.ensureLoaded({ force, maxAgeMs: AUTO_REFRESH_MS }),
  ])
}

function handleVisibilityChange(): void {
  if (!document.hidden) {
    void refreshStores(true)
  }
}

function isRouteActive(path: string): boolean {
  if (path === '/dashboard') {
    return route.path === '/' || route.path === '/dashboard'
  }

  return route.path === path
}

function updateActiveIndicator(): void {
  const nav = navLinksRef.value
  if (!nav) {
    return
  }

  const activeLink = nav.querySelector('a.router-link-active') as HTMLElement | null
  if (!activeLink) {
    indicatorStyle.value = {
      width: '0px',
      transform: 'translateX(0px)',
      opacity: '0',
    }
    return
  }

  const navRect = nav.getBoundingClientRect()
  const linkRect = activeLink.getBoundingClientRect()
  const indicatorWidth = Math.max(linkRect.width - 20, 0)

  indicatorStyle.value = {
    width: `${indicatorWidth}px`,
    transform: `translateX(${linkRect.left - navRect.left + 10}px)`,
    opacity: '1',
  }
}

watch(
  () => route.path,
  async () => {
    await nextTick()
    updateActiveIndicator()
  },
  { flush: 'post' },
)

onMounted(async () => {
  await nextTick()
  updateActiveIndicator()
  window.addEventListener('resize', updateActiveIndicator)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  await refreshStores()
  autoRefreshTimer = window.setInterval(() => {
    void refreshStores(true)
  }, AUTO_REFRESH_MS)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateActiveIndicator)
  document.removeEventListener('visibilitychange', handleVisibilityChange)

  if (autoRefreshTimer !== null) {
    window.clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
})
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <h1 class="brand"><a href="/" class="back">Turneringsmanager</a></h1>
      <nav ref="navLinksRef" class="nav-links">
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

        <span class="nav-active-indicator" :style="indicatorStyle" aria-hidden="true"></span>
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
  position: relative;
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
  position: relative;
  transition: background-color 0.16s ease, border-color 0.16s ease;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.08);
}

.nav-links a.router-link-active {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}

.nav-active-indicator {
  position: absolute;
  bottom: 0.05rem;
  height: 2px;
  width: 0;
  border-radius: 99px;
  background: var(--color-primary-hover);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), width 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease;
  pointer-events: none;
}

.nav-icon {
  width: 1.15rem;
  height: 1.15rem;
  flex-shrink: 0;
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

@media (max-width: 640px) {
  .topbar {
    position: relative;
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-links {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    justify-content: space-around;

    background: #111;
    border-top: 1px solid #60aaffac;
    padding: 0.4rem 0;
    z-index: 1000;

    width: 100%;
  }

  .nav-links a {
    flex-direction: column;
    font-size: 0.7rem;
    gap: 0.2rem;
    padding-bottom: calc(0.4rem + env(safe-area-inset-bottom));
  }

  .view-wrapper {
    padding-top: 0.75rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-bottom: 4.5rem;
  }

  .nav-active-indicator {
    display: none;
  }
}
</style>