import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types/api'

interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  // State
  const cartItems = ref<CartItem[]>([])
  const isInitialized = ref(false)

  // Initialize from localStorage
  const initializeCart = () => {
    if (isInitialized.value) return
    
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        cartItems.value = JSON.parse(savedCart)
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e)
        cartItems.value = []
      }
    }
    isInitialized.value = true
  }

  // Save to localStorage when cart changes
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
  }

  // Watch for changes and save to localStorage
  watch(cartItems, () => {
    saveCart()
  }, { deep: true })

  // Getters
  const itemCount = computed(() => 
    cartItems.value.reduce((total, item) => total + item.quantity, 0)
  )

  const cartTotal = computed(() => 
    cartItems.value.reduce((total, item) => {
      const price = item.product.discount > 0
        ? (item.product.price * (100 - item.product.discount) / 100)
        : item.product.price
      return total + (price * item.quantity)
    }, 0)
  )

  // Actions
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cartItems.value.find(item => item.product.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({
        product,
        quantity
      })
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const item = cartItems.value.find(item => item.product.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const removeFromCart = (productId: number) => {
    const index = cartItems.value.findIndex(item => item.product.id === productId)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
    }
  }

  const clearCart = () => {
    cartItems.value = []
  }

  // Initialize on store creation
  initializeCart()

  return {
    // State
    cartItems,
    
    // Getters
    itemCount,
    cartTotal,
    
    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    
    // For debugging
    saveCart
  }
})