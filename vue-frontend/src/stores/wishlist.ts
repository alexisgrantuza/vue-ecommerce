import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/api'


export const useWishlistStore = defineStore('wishlist', () => {
  // State
  const items = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const wishlistCount = computed(() => items.value.length)
  const isInWishlist = (productId: number) => 
    items.value.some(item => item.id === productId)

  // Initialize from localStorage
  const initializeFromLocalStorage = () => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      try {
        items.value = JSON.parse(savedWishlist)
      } catch (err) {
        console.error('Failed to parse wishlist from localStorage', err)
        items.value = []
      }
    }
  }

  // Save to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('wishlist', JSON.stringify(items.value))
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
    localStorage.removeItem('wishlist')
  }

  // Initialize
  initializeFromLocalStorage()

  return {
    // State
    items,
    loading,
    error,
    
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
