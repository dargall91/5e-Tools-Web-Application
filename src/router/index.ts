import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/LoginForm.vue')
  },
  {
    path: '/ManageCharacters',
    name: 'Character Manager',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ManageCharacters" */ '../components/ManageCharacters.vue')
  },
  {
    path: '/CharacterCreator',
    name: 'Character Creator',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ManageCharacters" */ '../components/CharacterCreator.vue')
  },
  {
    path: '/CampaignTools',
    name: 'Campaign Tools',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ManageCharacters" */ '../components/CampaignTools.vue')
  },
  {
    path: '/InitiativeTracker',
    name: 'Initative Tracker',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ManageCharacters" */ '../components/InitiativeTracker.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router;
