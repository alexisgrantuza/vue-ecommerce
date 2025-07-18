<template>
  <div class="product-view">
    <div class="container">
      <!-- Breadcrumb -->
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>
          <router-link to="/">Home</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link to="/products">Products</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ product?.title || 'Product' }}</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- Loading State -->
      <div v-if="loading" class="loading-section">
        <el-skeleton :rows="8" animated />
      </div>

      <!-- Product Details -->
      <div v-else-if="product" class="product-details">
        <div class="product-gallery">
          <div class="main-image">
            <el-image
              :src="selectedImage || product.images?.[0] || 'https://via.placeholder.com/600'"
              :alt="product.title"
              fit="cover"
              class="product-main-img"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                  <span>Image not found</span>
                </div>
              </template>
            </el-image>
          </div>

          <!-- Thumbnail Gallery -->
          <div v-if="product.images && product.images.length > 1" class="thumbnail-gallery">
            <div
              v-for="(image, index) in product.images"
              :key="index"
              class="thumbnail"
              :class="{ active: selectedImage === image }"
              @click="selectedImage = image"
            >
              <el-image
                :src="image"
                :alt="`${product.title} ${index + 1}`"
                fit="cover"
                class="thumbnail-img"
              />
            </div>
          </div>
        </div>

        <div class="product-info">
          <!-- Product Header -->
          <div class="product-header">
            <h1 class="product-title">{{ product.title }}</h1>
            <div class="product-meta">
              <el-tag type="info" class="category-tag">
                {{ product.category?.name || 'Uncategorized' }}
              </el-tag>
              <el-tag v-if="product.discount > 0" type="danger" class="discount-tag">
                -{{ product.discount }}% OFF
              </el-tag>
            </div>
          </div>

          <!-- Price Section -->
          <div class="price-section">
            <div class="price-display">
              <span class="current-price">
                ₱ {{ product.discount > 0 ? calculateDiscountedPrice() : product.price }}
              </span>
              <span v-if="product.discount > 0" class="original-price">
                ₱ {{ product.price }}
              </span>
            </div>
            <div v-if="product.discount > 0" class="savings">
              You save ₱ {{ calculateSavings() }}
            </div>
          </div>

          <!-- Product Description -->
          <div class="product-description">
            <h3>Description</h3>
            <p>{{ product.description || 'No description available for this product.' }}</p>
          </div>

          <!-- Product Actions -->
          <div class="product-actions">
            <div class="quantity-selector">
              <label>Quantity:</label>
              <el-input-number
                v-model="quantity"
                :min="1"
                :max="99"
                size="large"
                class="quantity-input"
              />
            </div>

            <div class="action-buttons">
              <el-button type="primary" size="large" class="add-to-cart-btn" @click="addToCart">
                <el-icon><ShoppingCart /></el-icon>
                Add to Cart
              </el-button>

              <el-button type="default" size="large" class="wishlist-btn" @click="addToWishlist">
                <el-icon><Star /></el-icon>
                Add to Wishlist
              </el-button>
            </div>
          </div>

          <!-- Product Specifications -->
          <div class="product-specs">
            <h3>Specifications</h3>
            <div class="spec-item">
              <span class="spec-label">Category:</span>
              <span class="spec-value">{{ product.category?.name || 'N/A' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Stock Status:</span>
              <span class="spec-value in-stock">In Stock</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="error-section">
        <el-result
          icon="error"
          title="Product Not Found"
          sub-title="The product you're looking for doesn't exist or may have been removed."
        >
          <template #extra>
            <el-button type="primary" @click="$router.push('/')"> Back to Home </el-button>
          </template>
        </el-result>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Picture, ShoppingCart, Star } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useProductsStore } from '@/stores/product'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

const loading = ref(true)
const product = ref()
const selectedImage = ref<string>('')
const quantity = ref(1)

const productId = computed(() => parseInt(route.params.id as string))

onMounted(async () => {
  await fetchProduct()
})

const fetchProduct = async () => {
  loading.value = true
  try {
    const response = await productsStore.fetchProductById(productId.value)
    console.log('API Response:', response)

    if (response) {
      product.value = response
      selectedImage.value = response.data?.images?.[0] || ''
    } else {
      ElMessage.error('Product not found')
      router.push('/')
    }
  } catch (error) {
    ElMessage.error('Failed to load product')
    router.push('/')
  } finally {
    loading.value = false
  }
}

const calculateDiscountedPrice = (): string => {
  if (!product.value) return '0'
  const price = parseFloat(product.value.price.toString())
  return ((price * (100 - product.value.discount)) / 100).toFixed(0)
}

const calculateSavings = (): string => {
  if (!product.value) return '0'
  const price = parseFloat(product.value.price.toString())
  return ((price * product.value.discount) / 100).toFixed(0)
}

const addToCart = () => {
  if (!product.value) return

  // Add to cart logic here
  ElMessage.success(`${product.value.title} added to cart (Quantity: ${quantity.value})`)
}

const addToWishlist = () => {
  if (!product.value) return

  // Add to wishlist logic here
  ElMessage.success(`${product.value.title} added to wishlist`)
}
</script>

<style scoped>
.product-view {
  min-height: 100vh;
  background: #0a0a0a;
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb {
  margin-bottom: 30px;
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

.loading-section {
  background: #1a1a1a;
  padding: 40px;
  border-radius: 12px;
}

.product-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  background: #1a1a1a;
  padding: 40px;
  border-radius: 12px;
}

.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image {
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  background: #2a2a2a;
}

.product-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 18px;
  gap: 10px;
}

.thumbnail-gallery {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 5px 0;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.thumbnail.active {
  border-color: #ff6600;
}

.thumbnail:hover {
  border-color: #ff6600;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
  color: #fff;
}

.product-header {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-title {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
}

.product-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.category-tag {
  background: #2d2d2d;
  color: #999;
  border: 1px solid #404040;
}

.discount-tag {
  background: #ff4757;
  color: white;
  border: none;
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-display {
  display: flex;
  align-items: center;
  gap: 15px;
}

.current-price {
  font-size: 36px;
  font-weight: 700;
  color: #ff6600;
}

.original-price {
  font-size: 24px;
  color: #666;
  text-decoration: line-through;
}

.savings {
  color: #4caf50;
  font-size: 16px;
  font-weight: 500;
}

.product-description h3 {
  color: #ffffff;
  font-size: 20px;
  margin: 0 0 15px 0;
}

.product-description p {
  color: #ccc;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity-selector label {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

.quantity-input {
  width: 120px;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.add-to-cart-btn {
  background: #ff6600;
  border-color: #ff6600;
  flex: 1;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
}

.add-to-cart-btn:hover {
  background: #e55a00;
  border-color: #e55a00;
}

.wishlist-btn {
  background: #2d2d2d;
  border-color: #404040;
  color: #fff;
  height: 50px;
  font-size: 16px;
  min-width: 180px;
}

.wishlist-btn:hover {
  background: #404040;
  border-color: #555;
}

.product-specs h3 {
  color: #ffffff;
  font-size: 20px;
  margin: 0 0 15px 0;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #2d2d2d;
}

.spec-label {
  color: #999;
  font-weight: 500;
}

.spec-value {
  color: #fff;
}

.spec-value.in-stock {
  color: #4caf50;
}

.error-section {
  background: #1a1a1a;
  padding: 60px;
  border-radius: 12px;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-details {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 20px;
  }

  .product-title {
    font-size: 24px;
  }

  .current-price {
    font-size: 28px;
  }

  .original-price {
    font-size: 20px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .main-image {
    height: 400px;
  }
}
</style>
