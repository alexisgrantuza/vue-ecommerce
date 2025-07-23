import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import WishlistProducts from '@/views/Wishlist/WishlistProducts.vue'

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
          path: 'wishlist',
          name: 'wishlist',
          component: WishlistProducts,
          meta: { requiresAuth: true }
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: () => import('../views/Checkout/CheckoutsView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'order-history',
          name: 'order-history',
          component: () => import('../views/OrderProducts/OrderHistory.vue'),
          meta: { requiresAuth: true }
        },
      ]
    },
  ],
})

export default router