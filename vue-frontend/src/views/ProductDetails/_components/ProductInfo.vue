<template>
  <div class="product-info">
    <div class="product-header">
      <h1 class="product-title">{{ product.title }}</h1>
      <div class="product-meta">
        <el-tag type="info" class="category-tag">
          {{ product.category?.name || 'Brand' }}
        </el-tag>
        <el-tag v-if="hasDiscount" type="danger" class="discount-tag">
          -{{ product.discount }}% OFF
        </el-tag>
      </div>
    </div>

    <div class="price-section">
      <div class="price-display">
        <span class="current-price">
          ₱{{ formattedPrice }}
        </span>
        <span v-if="hasDiscount" class="original-price">
          ₱{{ product.price }}
        </span>
      </div>
      <div v-if="hasDiscount" class="savings">
        You save ₱{{ calculateSavings }}
      </div>
    </div>

    <div class="product-description">
      <h3>Description</h3>
      <p>{{ product.description || 'No description available for this product.' }}</p>
    </div>

    <div class="product-actions">
      <div class="quantity-selector">
        <h2>Quantity:</h2>
        <el-input-number
          v-model="localQuantity"
          :min="1"
          :max="99"
          size="large"
          class="quantity-input"
        />
      </div>

      <div class="action-buttons">
        <el-button 
          type="primary" 
          size="large" 
          class="add-to-cart-btn"
          :loading="isAddingToCart"
          @click="$emit('add-to-cart', localQuantity)"
        >
          <el-icon><ShoppingCart /></el-icon>
          <span class="button-text">Add to Cart</span>
        </el-button>

        <el-button 
          type="default" 
          size="large" 
          class="wishlist-btn"
          :loading="isAddingToWishlist"
          @click="$emit('add-to-wishlist')"
        >
          <el-icon><Star /></el-icon>
          <span class="button-text">Add to Wishlist</span>
        </el-button>
      </div>
    </div>

    <div class="product-specs">
      <h3>Specifications</h3>
      <div class="spec-item">
        <span class="spec-label">Category:</span>
        <span class="spec-value">{{ product.category || 'N/A' }}</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Stock Status:</span>
        <span class="spec-value in-stock">In Stock</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ShoppingCart, Star } from '@element-plus/icons-vue'
import type { Product } from '@/types/api'

const props = defineProps<{
  product: Product
  quantity: number
  isAddingToCart: boolean
  isAddingToWishlist: boolean
}>()

const emit = defineEmits(['update:quantity', 'add-to-cart', 'add-to-wishlist'])

const localQuantity = ref(props.quantity)

const hasDiscount = computed(() => props.product.discount || 0 > 0)
const formattedPrice = computed(() => {
  if (!hasDiscount.value) return props.product.price || 0
  const price = parseFloat(props.product.price?.toString() || '0')
  return ((price * (100 - (props.product.discount || 0))) / 100).toFixed(0)
})

const calculateSavings = computed(() => {
  if (!hasDiscount.value) return '0'
  const price = parseFloat(props.product.price?.toString() || '0')
  return ((price * (props.product.discount || 0)) / 100).toFixed(0)
})

watch(localQuantity, (newVal) => {
  emit('update:quantity', newVal)
})

watch(() => props.quantity, (newVal) => {
  localQuantity.value = newVal
})
</script>

<style scoped>
.product-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
  color: #000;
}

.product-header {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin: 0;
  line-height: 1.2;
}

.product-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.category-tag {
  background: #000;
  color: #fff;
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

.product-description {
  padding: 20px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.product-description h3 {
  margin: 0 0 15px 0;
  font-size: 20px;
  color: #333;
}

.product-description p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity-selector label {
  font-weight: 500;
  color: #fff;
  font-size: 16px;
}

.quantity-input {
  width: 120px;
}

.quantity-input :deep(.el-input-number) {
  background: #1a1a1a;
  border: 1px solid #666;
}

.quantity-input :deep(.el-input-number__decrease):hover,
.quantity-input :deep(.el-input-number__increase):hover {
  background: #ff6600;
  border-color: #ff6600;
  
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.add-to-cart-btn,
.wishlist-btn {
  flex: 1;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-to-cart-btn {
  background: #ff6600;
  border-color: #ff6600;
  color: white;
}

.add-to-cart-btn:hover {
  background: #ff8833;
  border-color: #ff8833;
}

.wishlist-btn {
  background: #404040;
  border-color: #666;
  color: #fff;
}

.wishlist-btn:hover {
  background: #666;
  border-color: #888;
}

.product-specs {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.product-specs h3 {
  margin: 0 0 15px 0;
  font-size: 20px;
  color: #333;
}

.spec-item {
  display: flex;
  margin-bottom: 10px;
}

.spec-label {
  width: 120px;
  color: #666;
}

.spec-value {
  flex: 1;
  color: #333;
  font-weight: 500;
}

.spec-value.in-stock {
  color: #4caf50;
}
</style>
