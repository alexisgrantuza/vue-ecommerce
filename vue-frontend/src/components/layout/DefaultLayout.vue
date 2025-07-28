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

          <el-row v-else :gutter="20" class="products-grid">
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
                @add-to-cart="handleAddToCart"
                @product-click="navigateToProduct"
              />
            </el-col>
          </el-row>

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

          <el-row v-else :gutter="20" class="products-grid">
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
                @add-to-cart="handleAddToCart"
                @product-click="navigateToProduct"
              />
            </el-col>
          </el-row>

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
      About Us
    </el-button>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ArrowRight, Service } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Carousel from '../Carousel.vue'
import TrustFeatures from '../TrustFeatures.vue'
import ProductCard from '../common/card/ProductCard.vue'
import { useProductsStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import type { Product } from '@/types/api'
import { useAuthDialog } from '@/composables/useForm'

const loading = ref<boolean>(true)
const loadingMore = ref<boolean>(false)
const aboutDialogVisible = ref<boolean>(false)
const displayedCount = ref<number>(20)
const displaySaleCount = ref<number>(8)
const productsStore = useProductsStore()
const cartStore = useCartStore()
const router = useRouter()

// Auth Dialog Composable
const authDialog = useAuthDialog()

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

const handleAddToCart = (product: Product): void => {
  const success = authDialog.requireAuth('add items to cart', () => {
    // This callback will only run if user is authenticated
    cartStore.addToCart(product)
    ElMessage.success(`${product.title} added to cart`)
  })
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
  z-index: 1000;
  width: 100%;
  background-color: var(--el-bg-color);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.layout-main {
  flex: 1;
  padding: 20px 0;
  background-color: var(--el-bg-color-page);
}

.layout-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 15px;
  width: 100%;
}

.products-section {
  margin-bottom: 80px;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 2px solid #ff6600;
}

.section-title h2 {
  color: #333;
  font-size: 24px;
  font-weight: 900;
  margin: 0;
  position: relative;
  padding-bottom: 8px;
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
}

.view-all-btn:hover {
  background-color: rgba(255, 102, 0, 0.1);
}

.view-all-btn .el-icon {
  font-size: 14px;
  margin-left: 2px;
}

.product-col {
  margin-bottom: 20px;
}

.load-more-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 20px;
}

.load-more-btn {
  background-color: #ff6600;
  border-color: #ff6600;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.2);
}

.load-more-btn:hover {
  background-color: #e55a00;
  border-color: #e55a00;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 102, 0, 0.3);
}

.load-more-btn:active {
  transform: translateY(0);
}

.layout-footer {
  background-color: var(--el-bg-color);
  color: var(--el-text-color-regular);
  padding: 40px 0 0;
  margin-top: auto;
}

.floating-about-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  background-color: #ff6600;
  border-color: #ff6600;
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
  transition: all 0.2s ease;
}

.floating-about-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 102, 0, 0.4);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .load-more-btn {
    padding: 10px 24px;
    font-size: 14px;
  }
}
</style>
