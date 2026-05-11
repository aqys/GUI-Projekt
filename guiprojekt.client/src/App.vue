<script setup lang="ts">
import { defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
const IconLayoutDashboard = defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconLayoutDashboard.mjs'))
const IconLayoutDashboardFilled = defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconLayoutDashboardFilled.mjs'))
const IconCircle = defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconCircle.mjs'))
const IconCircleFilled = defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconCircleFilled.mjs'))
const IconTrophy = defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconTrophy.mjs'))
const IconTrophyFilled = defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconTrophyFilled.mjs'))
const IconUserFilled = defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconUserFilled.mjs'))
const IconUser = defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconUser.mjs'))
const IconChartPie2 = defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconChartPie2.mjs'))
const IconChartPie2Filled = defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconChartPie2Filled.mjs'))
const IconMoon = defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconMoon.mjs'))
const IconSun = defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconSun.mjs'))

const route = useRoute()
const navLinksRef = ref<HTMLElement | null>(null)
const AUTO_REFRESH_MS = 25_000
let autoRefreshTimer: number | null = null
const indicatorStyle = ref({
  width: '0px',
  transform: 'translateX(0px)',
  opacity: '0',
})

const theme = ref<string>(localStorage.getItem('theme') === 'light' ? 'light' : 'dark')

function applyTheme(t: string): void {
  const root = document.documentElement
  if (t === 'light') {
    root.classList.add('theme-light')
  } else {
    root.classList.remove('theme-light')
  }
  try {
    localStorage.setItem('theme', t)
  } catch (_e) {
  }
}

async function refreshStores(force = false): Promise<void> {
  if (document.hidden) {
    return
  }

  const { useDeltagerStore } = await import('@/stores/deltagerStore')
  const { useKampStore } = await import('@/stores/kampStore')
  const deltagerStore = useDeltagerStore()
  const kampStore = useKampStore()

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
  if (!nav) return

  const activeLink = nav.querySelector('a.router-link-active') as HTMLElement | null
  if (!activeLink) {
    indicatorStyle.value.opacity = '0'
    return
  }

  const navRect = nav.getBoundingClientRect()
  const linkRect = activeLink.getBoundingClientRect()
  
  const newWidth = Math.max(linkRect.width - 20, 0)
  const newTranslate = linkRect.left - navRect.left + 10

  requestAnimationFrame(() => {
    indicatorStyle.value = {
      width: `${newWidth}px`,
      transform: `translateX(${newTranslate}px)`,
      opacity: '1',
    }
  })
}

let navObserver: ResizeObserver | null = null

watch(
  () => route.path,
  async () => {
    await nextTick()
    // Giv browseren et øjeblik til at rendere det nye aktive link
    setTimeout(updateActiveIndicator, 0)
    requestAnimationFrame(updateActiveIndicator)
  },
  { flush: 'post' },
)

onMounted(async () => {
  await nextTick()
  updateActiveIndicator()
  window.addEventListener('resize', updateActiveIndicator)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Brug ResizeObserver til at håndtere asynkrone ikoner der loader ind
  if (navLinksRef.value) {
    navObserver = new ResizeObserver(() => {
      updateActiveIndicator()
    })
    navObserver.observe(navLinksRef.value, { box: 'border-box' })
  }

  void refreshStores()
  autoRefreshTimer = window.setInterval(() => {
    void refreshStores(true)
  }, AUTO_REFRESH_MS)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateActiveIndicator)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  
  if (navObserver) {
    navObserver.disconnect()
    navObserver = null
  }

  if (autoRefreshTimer !== null) {
    window.clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
})

watch(theme, (v) => applyTheme(v), { immediate: true })
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand-row">
        <h1 class="brand"><a href="/" class="back">Turneringsmanager</a></h1>
      </div>
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
        <button
          class="theme-toggle"
          type="button"
          :aria-label="theme === 'light' ? 'Skift til mørkt tema' : 'Skift til lyst tema'"
          :aria-pressed="theme === 'light'"
          @click="theme = theme === 'light' ? 'dark' : 'light'"
        >
          <IconSun v-if="theme === 'light'" class="theme-icon" />
          <IconMoon v-else class="theme-icon" />
        </button>
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
  gap: 1rem;
  padding: 0.9rem 1rem;
  background: var(--color-bar);
  border-bottom: 1px solid var(--color-border);
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.brand {
  font-size: 1.25rem;
  margin: 0;
  padding: 0;
}

.nav-links {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
  margin-left: auto;
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
  background: var(--color-card-hover);
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
  background: var(--color-primary);
  border-radius: 99px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, width;
  min-width: 0; 
  backface-visibility: hidden;
  perspective: 1000px;
}

.nav-icon {
  width: 1.15rem;
  height: 1.15rem;
  flex-shrink: 0;
  margin-top: .1rem;
}

.view-wrapper {
  padding: 0.85rem;
}

.back {
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s ease;
}

.back:hover {
  color: var(--color-primary-hover);
}

.theme-toggle {
  margin-top: 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease;
}

.theme-toggle:hover {
  background: var(--color-card-hover);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--color-primary-hover);
  outline-offset: 2px;
}

.theme-icon {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .topbar {
    position: relative;
    flex-direction: column;
    align-items: flex-start;
  }

  .brand-row {
    width: 100%;
    justify-content: space-between;
  }

  .nav-links {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    justify-content: space-around;

    background: var(--color-bg);
    border-top: 1px solid var(--color-primary-hover);
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