import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/api'
import type { Cart } from '@/types/api'



export const useCartStore = defineStore('cart', () => {
  const items = ref<Cart[]>([])
  
  const itemCount = computed(() => 
    items.value.reduce((total: number, item: Cart) => total + item.quantity, 0)
  )

  function addItem(product: Product) {
    const existingItem = items.value.find((item: Cart) => item.product_id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ id: 0, user_id: user.id, product_id: product.id, quantity: 1, created_at: new Date(), updated_at: new Date() })
    }
  }

  function removeItem(productId: number) {
    const index = items.value.findIndex((item: Cart) => item.product_id === productId)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find((item: Cart) => item.product_id === productId)
    if (item) {
      item.quantity = quantity
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})