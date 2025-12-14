import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // ✅ Changé ici
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { title: 'Accueil - Forum Communautaire' }
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/Auth.vue'),
      meta: { 
        title: 'Connexion / Inscription',
        requiresGuest: true 
      }
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: () => import('@/views/Profile.vue'),
      meta: { title: 'Profil utilisateur' }
    },
    {
      path: '/category/:category',
      name: 'category',
      component: () => import('@/views/Category.vue'),
      meta: { title: 'Catégorie' }
    },
    {
      path: '/discussion/:id',
      name: 'discussion',
      component: () => import('@/views/Discussion.vue'),
      meta: { title: 'Discussion' }
    },
    {
      path: '/create-discussion',
      name: 'create-discussion',
      component: () => import('@/views/CreateDiscussion.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Créer une discussion' 
      }
    },
    {
      path: '/moderator',
      name: 'moderator',
      component: () => import('@/views/Moderator.vue'),
      meta: { 
        requiresModerator: true,
        title: 'Modération' 
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/Home.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const { user } = useAuth()
  
  document.title = to.meta.title || 'Forum Communautaire'
  
  if (to.meta.requiresAuth && !user.value) {
    next({ name: 'auth', query: { redirect: to.fullPath } })
  } 
  else if (to.meta.requiresGuest && user.value) {
    next({ name: 'home' })
  }
  else if (to.meta.requiresModerator && user.value?.role !== 'moderator') {
    next({ name: 'home' })
  } 
  else {
    next()
  }
})

export default router