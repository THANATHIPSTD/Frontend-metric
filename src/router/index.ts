import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Webstore/HomeView.vue'
import { useAuthStore } from '@/stores/authStore'

/* eslint-disable @typescript-eslint/no-explicit-any */
const requireAuth = (to: any, from: any, next: any) => {
  const authStore = useAuthStore()
  if (authStore.isLoggedIn) {
    next()
  } else {
    next({ name: 'login' })
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/collection',
      name: 'collection',
      component: () => import('../views/Webstore/CollectionView.vue'),
    },
    {
      path: '/browse',
      name: 'browse',
      component: () => import('../views/Webstore/BrowseView.vue'),
    },
    {
      path: '/browse/category/:id',
      name: 'browse-category',
      component: () => import('../views/Webstore/BrowseView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Webstore/LoginView.vue'),
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isLoggedIn) {
          next({ name: 'home' })
        } else {
          next()
        }
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Webstore/RegisterView.vue'),
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isLoggedIn) {
          next({ name: 'home' })
        } else {
          next()
        }
      },
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/Webstore/ProductDetailsView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/Webstore/CartView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/thankyou',
      name: 'thankyou',
      component: () => import('../views/Webstore/ThankyouView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/history',
      name: 'History',
      component: () => import('../views/Webstore/HistoryView.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: '/blackoffice',
      name: 'blackoffice-layout',
      component: () => import('../views/Blackoffice/BlackofficeLayout.vue'),
      beforeEnter: requireAuth,
    },
  ],
})

export default router
