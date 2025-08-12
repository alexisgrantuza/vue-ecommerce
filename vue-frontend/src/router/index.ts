import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import WishlistProducts from '@/views/Wishlist/WishlistProducts.vue'
import { useUserAuthStore } from '@/stores/userAuth'
import ErrorPage from '../views/ErrorPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('../views/Products/ProductsView.vue'),
        },
        {
          path: 'product/:id',
          name: 'product',
          component: () => import('../views/ProductDetails/ProductDetails.vue'),
          props: true,
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('../views/Cart/CartView.vue'),
        },
        {
          path: 'category',
          name: 'category',
          component: () => import('../views/Category/CategoryView.vue'),
          props: true,
        },
        {
          path: 'wishlist',
          name: 'wishlist',
          component: WishlistProducts,
          meta: { requiresAuth: true },
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: () => import('../views/Checkout/CheckoutsView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'order-history',
          name: 'order-history',
          component: () => import('../views/OrderProducts/OrderHistory.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'not-found',
          component: ErrorPage,
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/Profile/UserProfile.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserAuthStore()
  const isAuthenticated = userStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
