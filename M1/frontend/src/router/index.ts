import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Discover Khmer flavors' },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
      meta: { title: 'Join the table' },
    },
    {
      path: '/recipes/new',
      alias: '/recipes/create',
      name: 'recipe-new',
      component: () => import('@/views/RecipeEditorView.vue'),
      meta: { requiresAuth: true, title: 'Share a recipe' },
    },
    {
      path: '/recipes/:id/edit',
      name: 'recipe-edit',
      component: () => import('@/views/RecipeEditorView.vue'),
      meta: { requiresAuth: true, title: 'Edit recipe' },
    },
    {
      path: '/recipes/:id',
      name: 'recipe-detail',
      component: () => import('@/views/RecipeDetailView.vue'),
      meta: { title: 'Recipe details' },
    },
    {
      path: '/my-recipes',
      name: 'my-recipes',
      component: () => import('@/views/MyRecipesView.vue'),
      meta: { requiresAuth: true, title: 'My recipes' },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Page not found' },
    },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 100 }
    if (to.path === from.path) return false
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !useAuthStore().user)
    return { name: 'auth', query: { returnTo: to.fullPath } }
})
router.afterEach((to) => {
  document.title = `${to.meta.title || 'Khmer recipes'} · ShareMhob`
})

export default router
