<template>
  <div class="category-view">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>
        <router-link to="/">Home</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link to="/category">Category</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="selectedCategory">
        {{ selectedCategory }}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="category-container">
      <div class="sidebar">
        <el-card class="filter-card">
          <template #header>
            <div class="category-header">
              <h3>Categories</h3>
            </div>
          </template>
          <el-tree
            :data="categories"
            :props="defaultProps"
            node-key="id"
            :default-expanded-keys="expandedCategories"
            :expand-on-click-node="false"
            :current-node-key="currentNodeKey || ''"
            @node-click="handleNodeClick"
            highlight-current
          />
        </el-card>
      </div>

      <div class="main-content">
        <div class="sort-filter-bar">
          <div class="results-info">
            <div class="results-count">
              Showing {{ filteredProducts.length }} results
            </div>
            <div v-if="selectedCategory" class="active-filter">
              Category: <el-tag closable @close="clearCategoryFilter">{{ selectedCategory }}</el-tag>
            </div>
          </div>
          <div class="sort-options">
            <span class="sort-label">Sort by:</span>
            <el-radio-group v-model="sortBy" size="small" @change="handleSortChange">
              <el-radio-button value="popularity">Popularity</el-radio-button>
              <el-radio-button value="price_asc">Price: Low to High</el-radio-button>
              <el-radio-button value="price_desc">Price: High to Low</el-radio-button>
              <el-radio-button value="newest">Newest</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div class="product-grid">
          <ProductCard
            v-for="product in paginatedProducts"
            :key="product.id"
            :product="product"
            class="product-card"
            @product-click="handleProductClick"
            @show-login="handleShowLogin"
          />


        </div>

        <div v-if="filteredProducts.length === 0" class="no-results">
          <el-empty description="No products found" />
        </div>

        <div class="pagination-container" v-if="filteredProducts.length > 0">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredProducts.length"
            layout="prev, pager, next"
            background
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ProductCard from '@/components/common/card/ProductCard.vue'
import type { Product } from '@/types/api'
import { mockData } from '@/constants/mock-data'
import { useAuthDialog } from '@/composables/useForm'

// Router
const router = useRouter()
const route = useRoute()
const authDialog = useAuthDialog()

// Reactive data
const products = ref<Product[]>([])
const currentPage = ref(1)
const pageSize = 12
const sortBy = ref('popularity')
const selectedCategory = ref<string>('')
const currentNodeKey = ref<number | null>(null)

// Extract unique categories from mock data
const categories = computed(() => {
  const categoryMap = new Map()
  
  mockData.forEach(product => {
    if (product.category) {
      const categoryName = typeof product.category === 'string' 
        ? product.category 
        : product.category
      
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          id: categoryMap.size + 1,
          label: categoryName,
          children: []
        })
      }
    }
  })
  
  return Array.from(categoryMap.values())
})

// Default props for the tree component
const defaultProps = {
  children: 'children',
  label: 'label'
}

// Initialize with mock data
onMounted(() => {
  products.value = mockData as Product[]
  // Initialize category from route if present
  if (route.params.category) {
    selectedCategory.value = route.params.category as string
    updateCurrentNodeKey()
  }
})

// Watch for route changes (if still needed for other purposes)
watch(() => route.params, () => {
  if (route.params.category) {
    selectedCategory.value = route.params.category as string
    updateCurrentNodeKey()
  }
  currentPage.value = 1
})

// Update current node key for tree highlighting
const updateCurrentNodeKey = () => {
  if (selectedCategory.value) {
    const category = categories.value.find(cat => 
      cat.label.toLowerCase() === selectedCategory.value.toLowerCase()
    )
    currentNodeKey.value = category ? category.id : null
  } else {
    currentNodeKey.value = null
  }
}

// Computed properties
const filteredProducts = computed(() => {
  let result = [...products.value]

  // Apply category filter
  if (selectedCategory.value) {
    result = result.filter(product => {
      const productCategory = typeof product.category === 'string' 
        ? product.category 
        : product.category?.name || ''
      
      return productCategory.toLowerCase() === selectedCategory.value.toLowerCase()
    })
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'price_asc':
      result.sort((a, b) => (a.price || 0) - (b.price || 0))
      break
    case 'price_desc':
      result.sort((a, b) => (b.price || 0) - (a.price || 0))
      break
    case 'newest':
      result.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateB - dateA
      })
      break
    case 'popularity':
    default:
      result.sort((a, b) => {
        const scoreA = (a.rating || 0) * (a.num_reviews || 0)
        const scoreB = (b.rating || 0) * (b.num_reviews || 0)
        return scoreB - scoreA
      })
  }

  return result
})

// Pagination
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredProducts.value.slice(start, end)
})

// Methods
const handleNodeClick = (data: any) => {
  if (data && data.label) {
    selectedCategory.value = data.label
    currentNodeKey.value = data.id
    currentPage.value = 1 
  }
}

const clearCategoryFilter = () => {
  selectedCategory.value = ''
  currentNodeKey.value = null
  currentPage.value = 1
}

const expandedCategories = computed(() => {
  return categories.value.map(category => category.id)
})

const handleSortChange = () => {
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleProductClick = (product: Product) => {
  router.push(`/product/${product.id}`)
}

const handleShowLogin = () => {
  authDialog.showLogin()
}
</script>

<style scoped>
.category-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.breadcrumb :deep(.el-breadcrumb__item) {
  color: #999;
}

.breadcrumb :deep(.el-breadcrumb__item a) {
  color: #ff6600;
  text-decoration: none;
}

.breadcrumb :deep(.el-breadcrumb__item a:hover) {
  text-decoration: underline;
}

.category-container {
  display: flex;
  gap: 20px;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.filter-card {
  margin-bottom: 20px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clear-btn {
  font-size: 12px;
  padding: 0;
}

.main-content {
  flex-grow: 1;
}

.sort-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;
}

.results-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.results-count {
  color: #666;
}

.active-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.sort-label {
  font-size: 14px;
  color: #666;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.no-results {
  text-align: center;
  padding: 40px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}



.apply-btn {
  margin-top: 10px;
  width: 100%;
}

@media (max-width: 768px) {
  .category-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .sort-filter-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>