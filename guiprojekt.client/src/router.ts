import { createRouter, createWebHistory } from 'vue-router'
import { preloadRouteData } from '@/composables/useRoutePreload'
import type { PreloadKey } from '@/types'

declare module 'vue-router' {
  interface RouteMeta {
    preload?: PreloadKey[]
  }
}

const DashboardView = () => import('@/views/DashboardView.vue')
const KampeView = () => import('@/views/KampeView.vue')
const RanklisteView = () => import('@/views/RanklisteView.vue')
const DeltagereView = () => import('@/views/DeltagereView.vue')
const StatistikView = () => import('@/views/StatistikView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard-root',
      component: DashboardView,
      alias: ['/dashboard'],
      meta: { preload: ['deltagere', 'kampe'] },
    },
    {
      path: '/kampe',
      name: 'kampe',
      component: KampeView,
      meta: { preload: ['deltagere', 'kampe'] },
    },
    {
      path: '/rankliste',
      name: 'rankliste',
      component: RanklisteView,
      meta: { preload: ['deltagere', 'kampe'] },
    },
    {
      path: '/deltagere',
      name: 'deltagere',
      component: DeltagereView,
      meta: { preload: ['deltagere', 'kampe'] },
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatistikView,
      meta: { preload: ['deltagere', 'kampe'] },
    },
    {
      path: '/:pathmatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ]
})

router.beforeResolve((to) => {
  if (to.meta.preload) {
    preloadRouteData(to.meta.preload, {
      timeoutMs: 5000,
      maxAgeMs: 45_000,
    }).then((results) => {
      const failed = results.filter((r) => !r.ok)
      if (failed.length > 0) {
        console.warn('Preload delvist fejlet, route fortsætter:', failed)
      }
    }).catch(() => {})
  }

  return true
})

export default router
