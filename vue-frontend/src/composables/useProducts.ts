// composables/useProducts.ts
import { useProductsStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import type { Product } from '@/types/api'

export const useProducts = () => {
  const productsStore = useProductsStore()
  const { 
    products,
    loading,
  } = storeToRefs(productsStore)

  // // Computed properties for filtered products
  // const saleProducts = computed(() => 
  //   products.value.filter(product => product.onSale)
  // )

  // const popularProducts = computed(() => 
  //   products.value.filter(product => product.popular)
  // )

  // const activeProducts = computed(() => 
  //   products.value.filter(product => product.is_active)
  // )

  // const productsByCategory = computed(() => {
  //   return products.value.reduce((acc, product) => {
  //     if (!acc[product.category]) {
  //       acc[product.category] = []
  //     }
  //     acc[product.category].push(product)
  //     return acc
  //   }, {} as Record<string, Product[]>)
  // })

  // Methods
  const fetchProducts = async () => {
    try {
      console.log('Fetching products...')
      await productsStore.fetchProducts()
      console.log('Products loaded:', products.value.length)
      return products.value 
    } catch (error) {
      console.error('Error in useProducts:', error)
      throw error
    }
  }

  const getProductById = (id: number) => {
    return productsStore.fetchProductById(id)
  }

  // const fetchProduct = async (id: number) => {
  //   try {
  //     return await productsStore.fetchProduct(id)
  //   } catch (error) {
  //     console.error('Error fetching product:', error)
  //     throw error
  //   }
  // }

  // const searchProducts = (query: string) => {
  //   if (!query.trim()) return products.value
    
  //   const searchTerm = query.toLowerCase()
  //   return products.value.filter(product => 
  //     product.title.toLowerCase().includes(searchTerm) ||
  //     product.description.toLowerCase().includes(searchTerm) ||
  //     product.category.toLowerCase().includes(searchTerm)
  //   )
  // }

  // const sortProducts = (sortBy: 'price' | 'rating' | 'newest' | 'discount' | 'popular', order: 'asc' | 'desc' = 'desc') => {
  //   return [...products.value].sort((a, b) => {
  //     let comparison = 0
      
  //     switch (sortBy) {
  //       case 'price':
  //         comparison = a.price - b.price
  //         break
  //       case 'rating':
  //         comparison = a.rating - b.rating
  //         break
  //       case 'newest':
  //         comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  //         break
  //       case 'discount':
  //         comparison = (a.discount || 0) - (b.discount || 0)
  //         break
  //       case 'popular':
  //         comparison = Number(a.popular) - Number(b.popular)
  //         break
  //     }
      
  //     return order === 'asc' ? comparison : -comparison
  //   })
  // }

  // const filterProducts = (filters: {
  //   category?: string
  //   minPrice?: number
  //   maxPrice?: number
  //   minRating?: number
  //   onSale?: boolean
  //   popular?: boolean
  // }) => {
  //   return products.value.filter(product => {
  //     if (filters.category && product.category !== filters.category) return false
  //     if (filters.minPrice && product.price < filters.minPrice) return false
  //     if (filters.maxPrice && product.price > filters.maxPrice) return false
  //     if (filters.minRating && product.rating < filters.minRating) return false
  //     if (filters.onSale !== undefined && product.onSale !== filters.onSale) return false
  //     if (filters.popular !== undefined && product.popular !== filters.popular) return false
      
  //     return true
  //   })
  // }

  return {
    // State
    products,
    loading,
    
    // Computed
    // saleProducts,
    // popularProducts,
    // activeProducts,
    // productsByCategory,
    
    // Methods
    fetchProducts,
    getProductById,
    // fetchProduct,
    // searchProducts,
    // sortProducts,
    // filterProducts,
  }
}