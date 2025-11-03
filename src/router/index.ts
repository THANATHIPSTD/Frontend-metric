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

const requireAdmin = (to: any, from: any, next: any) => {
  const authStore = useAuthStore()
  if (authStore.isLoggedIn && authStore.isAdmin) {
    next()
  } else if (authStore.isLoggedIn) {
    next({ name: 'home' })
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
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Webstore/ProfileView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/history',
      name: 'history',
      component: () => import('../views/Webstore/HistoryView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/blackoffice',
      name: 'blackoffice-layout',
      component: () => import('../views/Blackoffice/BlackofficeLayout.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/backoffice',
      name: 'backoffice-layout',
      component: () => import('../views/Blackoffice/BlackofficeLayout.vue'),
      beforeEnter: requireAdmin,
      children: [
        {
          path: '',
          name: 'backoffice-default',
          redirect: { name: 'backoffice-categories' },
        },
        {
          path: 'categories',
          name: 'backoffice-categories',
          component: () => import('../views/Blackoffice/CategoryManagementView.vue'),
        },
        {
          path: 'products',
          name: 'backoffice-products',
          component: () => import('../views/Blackoffice/ProductManagementView.vue'),
        },
        {
          path: 'homepage-manage',
          name: 'backoffice-homepage',
          component: () => import('../views/Blackoffice/HomepageManagementView.vue'),
        },
        {
          path: 'newrelease-manage',
          name: 'backoffice-newrelease',
          component: () => import('../views/Blackoffice/NewReleaseManagementView.vue'),
        },
        {
          path: 'users',
          name: 'backoffice-users',
          component: () => import('../views/Blackoffice/UserManagementView.vue'),
        },
        {
          path: 'orders',
          name: 'backoffice-orders',
          component: () => import('../views/Blackoffice/OrderHistoryAdminView.vue'),
        },
      ],
    },
  ],
})

export default router
