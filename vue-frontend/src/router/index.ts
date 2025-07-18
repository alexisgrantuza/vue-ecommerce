import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'

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
          path: 'checkout',
          name: 'checkout',
          component: () => import('../views/Checkout/CheckoutsView.vue'),
        },
      ]
    },
  ],
})

export default router