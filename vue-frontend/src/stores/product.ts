// stores/products.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/api'
import { getProducts, getProduct } from '@/services/productService'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const allProducts = computed(() => products.value)

  // Actions
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Starting to fetch products...')
      const response = await getProducts()
      console.log('Raw API Response:', response)

      if (response && Array.isArray(response)) {
        products.value = response
        console.log(`Successfully loaded ${products.value.length} products`)
        return null
      } else {
        const errorMessage = 'Failed to fetch products: Invalid response format'
        error.value = errorMessage
        console.error('API Error:', errorMessage, { response })
        return errorMessage
      }
    } catch (err: any) {
      console.error('Error fetching products:', err)
      error.value = err.message
    }
  }

  const fetchProductById = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await getProduct(id)
      console.log('Product API Response:', response)
      
      if (response) {
        console.log('Product loaded:', response)
        return response 
      } else {
        const errorMessage = 'Product not found or invalid format'
        error.value = errorMessage
        console.error('Product not found or invalid response:', errorMessage, { response })
        return null
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch product'
      error.value = errorMessage
      return null
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    products.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    products,
    loading,
    error,
    // Getters
    allProducts,
    // Actions
    fetchProducts,
    fetchProductById,
    clearError,
    reset,
  }
})