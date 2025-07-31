<template>
  <el-container class="default-layout">
    <el-main class="layout-main">
      <div class="layout-container">
        <Carousel />
        <TrustFeatures />

        <section class="products-section">
          <div class="section-header">
            <div class="section-title">
              <h2>Flash Sale</h2>
              <el-button class="view-all-btn" type="primary" size="default" link>
                View All
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>

          <el-skeleton v-if="loading" :rows="6" animated />

          <div v-else class="products-grid">
            <el-row :gutter="16">
              <el-col
                v-for="product in displayedSaleProducts"
                :key="product.id"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
                class="product-col"
              >
                <ProductCard
                  :product="product"
                  @product-click="navigateToProduct"
                  @show-login="showLogin"
                />
              </el-col>
            </el-row>
          </div>

          <el-empty
            v-if="!loading && products.length === 0"
            description="No products available"
            class="empty-state"
          />
        </section>

        <section class="product-section">
          <div class="section-header">
            <div class="section-title">
              <h2>For You</h2>
              <el-button class="view-all-btn" type="primary" size="default" link>
                View All
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>

          <el-skeleton v-if="loading" :rows="6" animated />

          <div v-else class="products-grid">
            <el-row :gutter="16">
              <el-col
                v-for="product in displayedProducts"
                :key="product.id"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
                class="product-col"
              >
                <ProductCard
                  :product="product"
                  @product-click="navigateToProduct"
                  @show-login="showLogin"
                />
              </el-col>
            </el-row>
          </div>

          <div v-if="!loading && products.length > 0 && hasMoreProducts" class="load-more-section">
            <el-button
              type="primary"
              class="load-more-btn"
              @click="loadMoreProducts"
              :loading="loadingMore"
              size="large"
            >
              <span v-if="!loadingMore">Load More Products</span>
              <span v-else>Loading...</span>
            </el-button>
          </div>

          <el-empty
            v-if="!loading && products.length === 0"
            description="No products available"
            class="empty-state"
          />
        </section>
      </div>
    </el-main>

    <el-button type="primary" class="floating-about-button" @click="openAboutDialog" round>
      <el-icon><Service /></el-icon>
      <span class="about-text">About Us</span>
    </el-button>

    <AuthDialog />
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ArrowRight, Service } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Carousel from '../Carousel.vue'
import TrustFeatures from '../TrustFeatures.vue'
import ProductCard from '../common/card/ProductCard.vue'
import AuthDialog from '../auth/authDialog.vue' 
import { useProductsStore } from '@/stores/product'
import { useRouter } from 'vue-router'
import type { Product } from '@/types/api'
import { useAuthDialog } from '@/composables/useForm'

const loading = ref<boolean>(true)
const loadingMore = ref<boolean>(false)
const aboutDialogVisible = ref<boolean>(false)
const displayedCount = ref<number>(20)
const displaySaleCount = ref<number>(8)
const productsStore = useProductsStore()
const router = useRouter()

const { showLogin } = useAuthDialog()

// Fetch products on component mount
onMounted(async () => {
  try {
    await productsStore.fetchProducts()
  } catch (error) {
    ElMessage.error('Failed to load products. Please try again later.')
  } finally {
    loading.value = false
  }
})

// Get products from the store
const products = computed(() => productsStore.products)

// Get displayed products based on current count
const displayedProducts = computed(() => {
  return products.value.slice(0, displayedCount.value)
})

// Get displayed sale products based on current count
const displayedSaleProducts = computed(() => {
  const saleProducts = products.value.filter((product) => product.onSale)
  return saleProducts.slice(0, displaySaleCount.value)
})

// Check if there are more products to load
const hasMoreProducts = computed(() => {
  return displayedCount.value < products.value.length
})

const loadMoreProducts = async (): Promise<void> => {
  loadingMore.value = true
  await new Promise((resolve) => setTimeout(resolve, 500))
  displayedCount.value += 8
  loadingMore.value = false
  ElMessage.success(
    `Loaded ${Math.min(8, products.value.length - (displayedCount.value - 8))} more products`,
  )
}

const openAboutDialog = (): void => {
  aboutDialogVisible.value = true
}

const navigateToProduct = (product: Product): void => {
  router.push(`/product/${product.id}`)
}
</script>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: var(--el-bg-color);
  overflow-x: hidden; 
}

.layout-main {
  flex: 1;
  padding: 0;
  width: 100%;
  overflow-x: hidden; 
}

.layout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box; 
}

.products-section,
.product-section {
  margin-bottom: 80px;
  width: 100%;
  overflow: hidden; 
}

.section-header {
  margin-bottom: 24px;
  width: 100%;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 2px solid #ff6600;
  width: 100%;
}

.section-title h2 {
  color: #333;
  font-size: 24px;
  font-weight: 900;
  margin: 0;
  position: relative;
  padding-bottom: 8px;
  flex-shrink: 0; 
}

.section-title h2::after {
  content: '';
  position: absolute;
  bottom: -14px;
  left: 0;
  width: 80px;
  height: 4px;
  background: #ff6600;
  border-radius: 2px;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ff6600 !important;
  font-weight: 500;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0; 
}

.view-all-btn:hover {
  background-color: rgba(255, 102, 0, 0.1);
}

.products-grid {
  width: 100%;
  overflow: hidden; 
}

.product-col {
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

:deep(.el-row) {
  width: 100%;
  margin-left: -8px !important;
  margin-right: -8px !important;
}

:deep(.el-col) {
  padding-left: 8px !important;
  padding-right: 8px !important;
  box-sizing: border-box;
}

.load-more-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 20px;
  width: 100%;
}

.load-more-btn {
  background-color: #ff6600;
  border-color: #ff6600;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background-color: #e55a00;
  border-color: #e55a00;
}

.floating-about-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  background-color: #ff6600;
  border-color: #ff6600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-state {
  width: 100%;
}

@media (max-width: 768px) {
  .layout-container {
    padding: 0 16px;
    max-width: 100%;
  }
  
  .products-section,
  .product-section {
    margin-bottom: 60px;
  }
  
  .section-title h2 {
    font-size: 20px;
  }
  
  .section-title h2::after {
    width: 60px;
    height: 3px;
  }
  
  :deep(.el-row) {
    margin-left: -6px !important;
    margin-right: -6px !important;
  }

  :deep(.el-col) {
    padding-left: 6px !important;
    padding-right: 6px !important;
  }
  
  .load-more-btn {
    padding: 10px 24px;
    font-size: 14px;
  }
  
  .floating-about-button {
    bottom: 20px;
    right: 20px;
    padding: 8px 16px;
  }
}

@media (max-width: 360px) {
  .layout-container {
    padding: 0 8px;
    max-width: 100%;
  }
  
  .section-title h2 {
    font-size: 16px;
  }
  
  :deep(.el-row) {
    margin-left: -2px !important;
    margin-right: -2px !important;
  }

  :deep(.el-col) {
    padding-left: 2px !important;
    padding-right: 2px !important;
  }
  
  .floating-about-button {
    bottom: 12px;
    right: 12px;
    padding: 8px 10px;
  }
}
</style>