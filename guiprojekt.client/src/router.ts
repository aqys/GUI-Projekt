import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from './views/DashboardView.vue'
import KampeView from './views/KampeView.vue'
import RanklisteView from './views/RanklisteView.vue'
import DeltagereView from './views/DeltagereView.vue'
import StatistikView from './views/StatistikView.vue'
import NotFoundView from './views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard-root',
      component: DashboardView,
      alias: ['/dashboard'],
    },
    {
      path: '/kampe',
      name: 'kampe',
      component: KampeView,
    },
    {
      path: '/rankliste',
      name: 'rankliste',
      component: RanklisteView,
    },
    {
      path: '/deltagere',
      name: 'deltagere',
      component: DeltagereView,
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatistikView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

export default router
