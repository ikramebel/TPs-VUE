import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/Auth.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/discussion/:id',
    name: 'Discussion',
    component: () => import('@/views/Discussion.vue')
  },
  {
    path: '/create-discussion',
    name: 'CreateDiscussion',
    component: () => import('@/views/CreateDiscussion.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/category/:categoryId',
    name: 'Category',
    component: () => import('@/views/Category.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/moderator',
    name: 'Moderator',
    component: () => import('@/views/Moderator.vue'),
    meta: { requiresAuth: true, requiresModerator: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const { isAuthenticated, isModerator } = useAuth();

  // Routes nécessitant une authentification
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Auth' });
    return;
  }

  // Routes nécessitant le rôle de modérateur
  if (to.meta.requiresModerator && !isModerator.value) {
    next({ name: 'Home' });
    return;
  }

  // Routes pour invités uniquement (ex: page de connexion)
  if (to.meta.guestOnly && isAuthenticated.value) {
    next({ name: 'Home' });
    return;
  }

  next();
});

export default router;