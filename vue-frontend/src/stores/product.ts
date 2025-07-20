// stores/products.ts
import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import type { Product } from '@/types/api'
import { mockData } from '@/constants/mock-data'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const allProducts = computed(() => products.value)

  // Initialize localStorage with mock data if empty
  const initializeLocalStorage = () => {
    if (!localStorage.getItem('products')) {
      localStorage.setItem('products', JSON.stringify(mockData))
      console.log('Seeded localStorage with mock products')
    }
  }

  // Load products from localStorage
  const loadProducts = () => {
    const storedProducts = localStorage.getItem('products')
    if (storedProducts) {
      products.value = JSON.parse(storedProducts)
      console.log(`Loaded ${products.value.length} products from localStorage`)
    } else {
      console.warn('No products found in localStorage')
    }
  }

  // Actions
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Initialize localStorage on first load
      initializeLocalStorage()
      
      // Load products from localStorage
      loadProducts()
      
      console.log(`Successfully loaded ${products.value.length} products from localStorage`)
      return null
    } catch (err: any) {
      console.error('Error loading products:', err)
      error.value = err.message
      return err.message
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      // Make sure we have the latest data
      if (products.value.length === 0) {
        loadProducts()
      }
      
      const product = products.value.find(p => p.id === id)
      
      if (product) {
        console.log('Product loaded:', product)
        return product
      } else {
        const errorMessage = `Product with ID ${id} not found`
        error.value = errorMessage
        console.error('Product not found:', errorMessage)
        return null
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch product'
      error.value = errorMessage
      console.error('Error fetching product:', err)
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