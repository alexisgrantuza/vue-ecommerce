<template>
  <div class="product-card" @click="handleProductClick">
    <div class="product-image">
      <el-image
        :src="product.images?.[0] || 'https://via.placeholder.com/300'"
        :alt="product.title"
        fit="cover"
        class="product-img"
        lazy
      >
        <template #error>
          <div class="image-slot">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
      <el-tag v-if="product.discount" class="discount-tag" type="danger" size="small">
        -{{ product.discount }}%
      </el-tag>
      <el-button
        :class="['wishlist-btn', { 'in-wishlist': isInWishlist }]"
        size="small"
        circle
        @click.stop="toggleWishlist"
        :title="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
      >
        <el-icon :class="{ 'heart-filled': isInWishlist }">
          <StarFilled v-if="isInWishlist" />
          <Star v-else />
        </el-icon>
      </el-button>
    </div>

    <div class="product-content">
      <h3 class="product-title">{{ product.title }}</h3>

      <p class="product-description">
        {{ product.description || 'New range of formal shirt' }}
        <span class="read-more">Read More</span>
      </p>

      <div class="product-category">
        <el-tag type="info" size="small" class="category-tag">
          {{ product.category || 'Clothes' }}
        </el-tag>
      </div>

      <div class="price-section">
        <span class="price-label">Price</span>
        <div class="price-row">
          <span class="current-price">
            ₱{{ product.discount ? calculateDiscountedPrice() : product.price }}
          </span>
          <el-button type="primary" class="add-to-cart-btn" size="default" @click.stop="addToCart">
            Add To Cart
          </el-button>
        </div>
        <span v-if="product.discount" class="original-price"> ₱{{ product.price }} </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Picture, Star, StarFilled } from '@element-plus/icons-vue'
import type { Product } from '@/types/api'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { computed } from 'vue'
import { useUserAuthStore } from '@/stores/userAuth'

// Store Instances
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const userStore = useUserAuthStore()

// Props
const props = defineProps<{
  product: Product
}>()

// Computed
const isInWishlist = computed(() => wishlistStore.isInWishlist(props.product.id))

// Emits
const emit = defineEmits<{
  'product-click': [product: Product]
  'show-login': []
}>()

// Methods
const calculateDiscountedPrice = (): string => {
  const price = parseFloat(props.product.price?.toString() || '0')
  return ((price * (100 - (props.product.discount || 0))) / 100).toFixed(0)
}

const addToCart = (e: Event) => {
  e.stopPropagation()

  if (!userStore.isAuthenticated) {
    ElMessage.info('Please login to add items to cart')
    emit('show-login')
    return
  }

  cartStore.addToCart(props.product)
  ElMessage.success(`${props.product.title} added to cart`)
}

const toggleWishlist = (e: Event) => {
  e.stopPropagation()

  if (!userStore.isAuthenticated) {
    ElMessage.info('Please login to add items to wishlist')
    emit('show-login')
    return
  }

  const wasAdded = wishlistStore.toggleWishlistItem(props.product)
  ElMessage({
    message: wasAdded
      ? `${props.product.title} added to wishlist`
      : `${props.product.title} removed from wishlist`,
    type: wasAdded ? 'success' : 'info',
  })
}

const handleProductClick = () => {
  emit('product-click', props.product)
}
</script>

<style scoped>
.product-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
}

.product-image {
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: #2a2a2a;
  position: relative;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.discount-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  font-weight: 600;
  border-radius: 4px;
  padding: 4px 8px;
  background: #ff4757;
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
}

.image-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #666;
  font-size: 36px;
  background: #2a2a2a;
}

.product-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
  color: #fff;
}

.product-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  color: #ffffff;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 48px;
}

.product-description {
  font-size: 14px;
  color: #999;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more {
  color: #00d4ff;
  font-weight: 500;
  cursor: pointer;
  margin-left: 4px;
}

.read-more:hover {
  text-decoration: underline;
}

.product-category {
  margin: 4px 0;
}

.category-tag {
  background: #2d2d2d;
  color: #999;
  border: 1px solid #404040;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.price-section {
  margin-top: auto;
  padding-top: 8px;
}

.price-label {
  font-size: 13px;
  color: #999;
  display: block;
  margin-bottom: 8px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.current-price {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
}

.original-price {
  font-size: 14px;
  color: #666;
  text-decoration: line-through;
  margin-top: 2px;
  display: block;
}

.add-to-cart-btn {
  background: linear-gradient(135deg, #ff6600 0%, #ff6600 100%);
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 16px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(255, 102, 0, 0.3);
  position: relative;
  z-index: 10;
}

.add-to-cart-btn:hover {
  background: linear-gradient(135deg, #e55a00 0%, #e55a00 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.4);
}

.add-to-cart-btn:active {
  transform: translateY(0);
}

.wishlist-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
}

.wishlist-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.wishlist-btn.in-wishlist {
  background: rgba(255, 102, 0, 0.1);
}

.wishlist-btn.in-wishlist .el-icon {
  color: #ff6600;
}

.heart-filled {
  color: #ff6600;
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .product-card {
    width: calc(33.333% - 14px);
  }
}

@media (max-width: 900px) {
  .product-card {
    width: calc(50% - 10px);
  }
}

@media (max-width: 600px) {
  .product-card {
    width: 100%;
    max-width: 350px;
    margin-left: auto;
    margin-right: auto;
  }

  .product-content {
    padding: 16px;
  }

  .product-title {
    font-size: 16px;
  }

  .current-price {
    font-size: 20px;
  }

  .add-to-cart-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}

/* Dark theme Element Plus overrides */
:deep(.el-tag) {
  background: #2d2d2d;
  color: #999;
  border-color: #404040;
}

:deep(.el-image__error) {
  background: #2a2a2a;
  color: #666;
}
</style>
