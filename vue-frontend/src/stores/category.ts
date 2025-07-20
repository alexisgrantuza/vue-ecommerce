import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category } from '@/types/api'

export const useCategoryStore = defineStore('category', () => {
  // State
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedCategory = ref<Category | null>(null)

  // Getters
  const allCategories = computed(() => categories.value)
  const categoryNames = computed(() => categories.value.map(cat => cat.name))
  const getCategoryById = (id: number) => categories.value.find(cat => cat.id === id)

  // Actions
  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would be an API call
      // For now, we'll use a timeout to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Extract unique categories from products in localStorage
      const products = JSON.parse(localStorage.getItem('products') || '[]')
      const categoryMap = new Map()
      
      products.forEach((product: any) => {
        if (product.category && !categoryMap.has(product.category)) {
          categoryMap.set(product.category, {
            id: categoryMap.size + 1,
            name: product.category,
            slug: product.category.toLowerCase().replace(/\s+/g, '-')
          })
        }
      })
      
      categories.value = Array.from(categoryMap.values())
      return categories.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch categories'
      console.error('Error fetching categories:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const selectCategory = (category: Category | null) => {
    selectedCategory.value = category
  }

  return {
    // State
    categories,
    loading,
    error,
    selectedCategory,
    
    // Getters
    allCategories,
    categoryNames,
    getCategoryById,
    
    // Actions
    fetchCategories,
    selectCategory
  }
})

export type CategoryStore = ReturnType<typeof useCategoryStore>
