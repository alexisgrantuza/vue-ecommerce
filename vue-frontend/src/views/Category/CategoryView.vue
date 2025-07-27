<template>
  <div class="category-view">
    <!-- Breadcrumb -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Electronics</el-breadcrumb-item>
      <el-breadcrumb-item>Smartphones</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="category-container">
      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Categories -->
        <el-card class="filter-card">
          <template #header>
            <div class="filter-header">
              <h3>Categories</h3>
            </div>
          </template>
          <el-tree
            :data="categories"
            :props="defaultProps"
            node-key="id"
            :default-expanded-keys="[1]"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          />
        </el-card>

        <!-- Price Filter -->
        <el-card class="filter-card">
          <template #header>
            <div class="filter-header">
              <h3>Price Range</h3>
            </div>
          </template>
          <div class="price-range">
            <div class="price-inputs">
              <el-input v-model="minPrice" placeholder="Min" class="price-input" type="number" />
              <span class="price-separator">-</span>
              <el-input v-model="maxPrice" placeholder="Max" class="price-input" type="number" />
            </div>
            <el-button type="primary" size="small" class="apply-btn" @click="applyPriceFilter">
              Apply
            </el-button>
          </div>
        </el-card>

        <!-- Brand Filter -->
        <el-card class="filter-card">
          <template #header>
            <div class="filter-header">
              <h3>Brands</h3>
            </div>
          </template>
          <el-checkbox-group v-model="selectedBrands" class="brand-filters">
            <el-checkbox v-for="brand in brands" :key="brand" :label="brand" class="brand-checkbox">
              {{ brand }}
            </el-checkbox>
          </el-checkbox-group>
        </el-card>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Sort and Filter Bar -->
        <div class="sort-filter-bar">
          <div class="results-count">
            Showing {{ filteredProducts.length }} results
          </div>
          <div class="sort-options">
            <span class="sort-label">Sort by:</span>
            <el-radio-group v-model="sortBy" size="small" @change="handleSortChange">
              <el-radio-button label="popularity">Popularity</el-radio-button>
              <el-radio-button label="price_asc">Price: Low to High</el-radio-button>
              <el-radio-button label="price_desc">Price: High to Low</el-radio-button>
              <el-radio-button label="newest">Newest</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <!-- Product Grid -->
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

        <!-- Pagination -->
        <div class="pagination-container">
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ProductCard from '@/components/common/card/ProductCard.vue'
import type { Product } from '@/types/api'

// Router
const router = useRouter()

// Sample data - replace with actual API calls
const categories = [
  {
    id: 1,
    label: 'Electronics',
    children: [
      { id: 2, label: 'Smartphones' },
      { id: 3, label: 'Laptops' },
      { id: 4, label: 'Tablets' },
      { id: 5, label: 'Accessories' },
    ],
  },
  {
    id: 6,
    label: 'Fashion',
    children: [
      { id: 7, label: "Men's Clothing" },
      { id: 8, label: "Women's Clothing" },
      { id: 9, label: 'Shoes' },
      { id: 10, label: 'Bags & Accessories' },
    ],
  },
]

const defaultProps = {
  children: 'children',
  label: 'label',
}

const brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'OnePlus']
const selectedBrands = ref<string[]>([])
const minPrice = ref('')
const maxPrice = ref('')
const sortBy = ref('popularity')
const currentPage = ref(1)
const pageSize = 12

// Sample products - replace with actual API call
const products = ref<Product[]>([])

// Fetch products (replace with actual API call)
onMounted(() => {
  // This is sample data - replace with actual API call
  products.value = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    title: `Smartphone Model ${i + 1}`,
    description: `High-performance smartphone with amazing features ${i + 1}`,
    price: Math.floor(Math.random() * 1000) + 200, // Convert to number
    discount: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : 0,
    rating: Math.random() * 2 + 3, // Convert to number
    num_reviews: Math.floor(Math.random() * 1000), // Changed from reviewCount to num_reviews
    category: {  // Changed from string to object
      id: i + 1,
      name: 'Smartphones'
    },
    images: [
      `https://picsum.photos/seed/product-${i + 1}/400/300`
    ],
    is_active: true,  // Added missing required field
    popular: Math.random() > 0.7,  // Added missing required field
    onSale: Math.random() > 0.5,   // Added missing required field
    created_at: new Date().toISOString(),  // Added missing required field
    updated_at: new Date().toISOString()   // Added missing required field
  }))
})

// Computed properties
const filteredProducts = computed(() => {
  let result = [...products.value]

  // Apply brand filter
  if (selectedBrands.value.length > 0) {
    result = result.filter((product) =>
      selectedBrands.value.includes(product.category?.name || '')
    )
  }

  // Apply price filter
  if (minPrice.value || maxPrice.value) {
    const min = minPrice.value ? parseFloat(minPrice.value) : 0
    const max = maxPrice.value ? parseFloat(maxPrice.value) : Number.MAX_SAFE_INTEGER
    
    result = result.filter((product) => {
      const price = parseFloat(product.price?.toString() || '0')
      return price >= min && price <= max
    })
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'price_asc':
      result.sort((a, b) => parseFloat(a.price?.toString() || '0') - parseFloat(b.price?.toString() || '0'))
      break
    case 'price_desc':
      result.sort((a, b) => parseFloat(b.price?.toString() || '0') - parseFloat(a.price?.toString() || '0'))
      break
    case 'newest':
      // Assuming newer products have higher IDs (replace with actual date field)
      result.sort((a, b) => b.id - a.id)
      break
    // popularity is the default sort
    default:
      // Sort by popularity (in this example, we'll use review count as a proxy for popularity)
      result.sort((a, b) => (b.num_reviews || 0) - (a.num_reviews || 0))
      break
  }

  return result
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredProducts.value.slice(start, end)
})

// Methods
const handleNodeClick = (data: any) => {
  console.log('Category selected:', data.label)
  // Here you would typically filter products by the selected category
  // For now, we'll just log it
}

const applyPriceFilter = () => {
  // Reset to first page when filters change
  currentPage.value = 1
  
  // In a real app, you would validate the price range here
  if (minPrice.value && maxPrice.value && parseFloat(minPrice.value) > parseFloat(maxPrice.value)) {
    ElMessage.warning('Minimum price cannot be greater than maximum price')
    return
  }
  
  console.log('Price filter applied:', { min: minPrice.value, max: maxPrice.value })
}

const handleSortChange = () => {
  // Reset to first page when sort changes
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  // Scroll to top when page changes
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleProductClick = (product: Product) => {
  // Navigate to product detail page
  router.push({ name: 'ProductDetail', params: { id: product.id } })
}

const handleShowLogin = () => {
  // Show login modal or redirect to login page
  ElMessage.info('Please login to continue')
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.category-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb {
  padding: 16px 0;
  font-size: 14px;
}

.category-container {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

/* Sidebar */
.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.filter-card {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-header {
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* Price Range */
.price-range {
  padding: 12px 16px;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.price-input {
  flex: 1;
}

.price-separator {
  color: #999;
  padding: 0 4px;
}

.apply-btn {
  width: 100%;
}

/* Brand Filters */
.brand-filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px 16px;
}

.brand-checkbox {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 4px 0;
}

/* Main Content */
.main-content {
  flex: 1;
}

/* Sort and Filter Bar */
.sort-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #f8f8f8;
  border-radius: 8px;
}

.results-count {
  font-size: 14px;
  color: #666;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-label {
  font-size: 14px;
  color: #666;
}

/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.product-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

/* Responsive */
@media (max-width: 992px) {
  .category-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    margin-bottom: 24px;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 576px) {
  .sort-filter-bar {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .sort-options {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .el-radio-group {
    display: flex;
    gap: 8px;
  }
}
</style>