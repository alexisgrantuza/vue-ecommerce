import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types/api'
import { useUserAuthStore } from './userAuth'

export const useWishlistStore = defineStore('wishlist', () => {
  // State
  const userWishlists = ref<Record<string, Product[]>>({})
  const items = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const userAuth = useUserAuthStore()

  // Getters
  const wishlistCount = computed(() => items.value.length)
  const isInWishlist = (productId: number) => 
    items.value.some(item => item.id === productId)

  // Initialize from localStorage
  const initializeFromLocalStorage = () => {
    const savedWishlists = localStorage.getItem('userWishlists')
    if (savedWishlists) {
      try {
        userWishlists.value = JSON.parse(savedWishlists)
        if (userAuth.isAuthenticated && userAuth.user?.id) {
          items.value = userWishlists.value[userAuth.user.id] || []
        } else {
          items.value = []
        }
      } catch (err) {
        console.error('Failed to parse wishlists from localStorage', err)
        items.value = []
      }
    }
  }

  // Save to localStorage
  const saveToLocalStorage = () => {
    if (userAuth.isAuthenticated && userAuth.user?.id) {
      userWishlists.value[userAuth.user.id] = items.value
      localStorage.setItem('userWishlists', JSON.stringify(userWishlists.value))
    } else {
      // If user is not authenticated, don't save the wishlist
      items.value = []
    }
  }

  // Actions
  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      items.value.push(product)
      saveToLocalStorage()
    }
  }

  const removeFromWishlist = (productId: number) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  const toggleWishlistItem = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      return false
    } else {
      addToWishlist(product)
      return true
    }
  }

  const clearWishlist = () => {
    items.value = []
    if (userAuth.user?.id) {
      delete userWishlists.value[userAuth.user.id]
      localStorage.setItem('userWishlists', JSON.stringify(userWishlists.value))
    }
  }

  // Watch for user authentication changes
  watch(() => userAuth.isAuthenticated, (isAuthenticated) => {
    if (isAuthenticated) {
      initializeFromLocalStorage()
    } else {
      items.value = []
    }
  }, { immediate: true })

  // Watch for user ID changes
  watch(() => userAuth.user?.id, (newUserId, oldUserId) => {
    if (newUserId !== oldUserId) {
      // Save current user's wishlist before switching
      if (oldUserId) {
        userWishlists.value[oldUserId] = [...items.value]
      }
      // Load new user's wishlist
      if (newUserId) {
        items.value = userWishlists.value[newUserId] || []
      } else {
        items.value = []
      }
    }
  })

  return {
    // State
    items,
    loading,
    error,
    userWishlists, // Expose userWishlists for debugging if needed
    
    // Getters
    wishlistCount,
    isInWishlist,
    
    // Actions
    addToWishlist,
    removeFromWishlist,
    toggleWishlistItem,
    clearWishlist
  }
})

export type WishlistStore = ReturnType<typeof useWishlistStore>
