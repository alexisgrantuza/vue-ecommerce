import { defineStore } from 'pinia'
import { ref, computed, watch, nextTick } from 'vue'
import type { Product } from '@/types/api'
import { useUserAuthStore } from './userAuth'

interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  // State
  const userCarts = ref<Record<string, CartItem[]>>({})
  const cartItems = ref<CartItem[]>([])
  const isInitialized = ref(false)

  // Get userAuth store - but don't create circular dependency
  let userAuth: any = null

  // Initialize from localStorage
  const initializeCart = () => {
    if (isInitialized.value) return

    if (!userAuth) {
      userAuth = useUserAuthStore()
    }

    const savedCarts = localStorage.getItem('userCarts')
    if (savedCarts) {
      try {
        userCarts.value = JSON.parse(savedCarts)
        if (userAuth.isAuthenticated && userAuth.user?.id) {
          cartItems.value = userCarts.value[userAuth.user.id] || []
        } else {
          cartItems.value = []
        }
      } catch (e) {
        console.error('Failed to parse carts from localStorage', e)
        cartItems.value = []
      }
    }
    isInitialized.value = true
  }

  // Save to localStorage
  const saveCart = () => {
    if (!userAuth) {
      userAuth = useUserAuthStore()
    }

    if (userAuth.isAuthenticated && userAuth.user?.id) {
      userCarts.value[userAuth.user.id] = [...cartItems.value]
      localStorage.setItem('userCarts', JSON.stringify(userCarts.value))
    }
  }

  // Watch for changes and save to localStorage
  watch(
    cartItems,
    () => {
      if (isInitialized.value) {
        saveCart()
      }
    },
    { deep: true },
  )

  // Getters
  const itemCount = computed(() =>
    cartItems.value.reduce((total, item) => total + item.quantity, 0),
  )

  const cartTotal = computed(() =>
    cartItems.value.reduce((total, item) => {
      const price =
        item.product.discount > 0
          ? (item.product.price * (100 - item.product.discount)) / 100
          : item.product.price
      return total + price * item.quantity
    }, 0),
  )

  // Actions
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cartItems.value.find((item) => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({
        product,
        quantity,
      })
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const item = cartItems.value.find((item) => item.product.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const removeFromCart = (productId: number) => {
    const index = cartItems.value.findIndex((item) => item.product.id === productId)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
    }
  }

  const clearCart = () => {
    if (!userAuth) {
      userAuth = useUserAuthStore()
    }

    cartItems.value.length = 0

    if (userAuth.user?.id) {
      delete userCarts.value[userAuth.user.id]
      localStorage.setItem('userCarts', JSON.stringify(userCarts.value))
    }
  }

  // Setup watchers after initialization
  const setupWatchers = () => {
    if (!userAuth) {
      userAuth = useUserAuthStore()
    }

    // Watch for user authentication changes
    watch(
      () => userAuth.isAuthenticated,
      async (isAuthenticated) => {
        await nextTick() // Wait for DOM updates

        if (isAuthenticated) {
          // User logged in - load their cart
          const savedCarts = localStorage.getItem('userCarts')
          if (savedCarts) {
            try {
              userCarts.value = JSON.parse(savedCarts)
              cartItems.value.length = 0
              cartItems.value.push(...(userCarts.value[userAuth.user?.id] || []))
            } catch (e) {
              console.error('Failed to load user cart:', e)
              cartItems.value.length = 0
            }
          }
        } else {
          // User logged out - clear cart without reassigning the ref
          cartItems.value.length = 0
        }
      },
      { flush: 'post' },
    ) // Use 'post' to ensure DOM updates happen first

    // Watch for user ID changes (switching users)
    watch(
      () => userAuth.user?.id,
      async (newUserId, oldUserId) => {
        await nextTick()

        if (newUserId !== oldUserId) {
          // Save current user's cart before switching
          if (oldUserId && cartItems.value.length > 0) {
            userCarts.value[oldUserId] = [...cartItems.value]
            localStorage.setItem('userCarts', JSON.stringify(userCarts.value))
          }

          // Load new user's cart
          if (newUserId) {
            const userCart = userCarts.value[newUserId] || []
            cartItems.value.length = 0
            cartItems.value.push(...userCart)
          } else {
            cartItems.value.length = 0
          }
        }
      },
      { flush: 'post' },
    )
  }

  // Initialize on store creation
  initializeCart()
  setupWatchers()

  return {
    // State
    cartItems,
    userCarts,

    // Getters
    itemCount,
    cartTotal,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,

    // For debugging
    saveCart,
    initializeCart,
  }
})
