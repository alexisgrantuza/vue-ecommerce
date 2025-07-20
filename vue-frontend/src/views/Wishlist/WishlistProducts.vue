
<template>
  <div class="wishlist-container">
    <el-container class="wishlist-page">
      <el-main>
        <h1>My Wishlist</h1>
        
        <!-- Empty State -->
        <div v-if="wishlistStore.wishlistCount === 0" class="empty-wishlist">
          <el-empty description="Your wishlist is empty" />
          <el-button 
            type="primary" 
            @click="$router.push('/')"
            class="shop-now-btn"
          >
            Continue Shopping
          </el-button>
        </div>
        
        <!-- Wishlist Items -->
        <div v-else class="wishlist-grid">
          <div 
            v-for="product in wishlistStore.items" 
            :key="product.id" 
            class="wishlist-item"
          >
            <div class="product-image">
              <el-image 
                :src="product.images?.[0] || 'https://via.placeholder.com/300'"
                :alt="product.title"
                fit="cover"
                class="product-img"
                @click="$router.push(`/product/${product.id}`)"
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              
              <!-- Remove from wishlist button -->
              <el-button 
                circle 
                class="remove-btn"
                @click="removeFromWishlist(product)"
              >
                <el-icon><Close /></el-icon>
              </el-button>
              
              <!-- Discount tag -->
              <el-tag v-if="product.discount > 0" class="discount-tag" type="danger" size="small">
                -{{ product.discount }}%
              </el-tag>
            </div>
            
            <div class="product-details">
              <h3 class="product-title" @click="$router.push(`/product/${product.id}`)">
                {{ product.title }}
              </h3>
              
              <div class="price-section">
                <span class="current-price">
                  ₱{{ product.discount > 0 ? 
                      (product.price * (100 - product.discount) / 100).toFixed(2) : 
                      product.price.toFixed(2) }}
                </span>
                <span v-if="product.discount > 0" class="original-price">
                  ₱{{ product.price.toFixed(2) }}
                </span>
              </div>
              
              <el-button 
                type="primary" 
                class="add-to-cart-btn"
                @click="addToCart(product)"
              >
                Add to Cart
              </el-button>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { Picture, Close } from '@element-plus/icons-vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import { ElMessage } from 'element-plus'
import type { Product } from '@/types/api'

// Store instances
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

// Methods
const removeFromWishlist = (product: Product) => {
  wishlistStore.removeFromWishlist(product.id)
  ElMessage.success(`${product.title} removed from wishlist`)
}

const addToCart = (product: Product) => {
  cartStore.addToCart(product)
  ElMessage.success(`${product.title} added to cart`)
}
</script>

<style scoped>
.wishlist-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 70vh;
}

.wishlist-page h1 {
  font-size: 28px;
  margin-bottom: 30px;
  color: #333;
  font-weight: 600;
  text-align: center;
}

.empty-wishlist {
  text-align: center;
  padding: 60px 0;
}

.shop-now-btn {
  margin-top: 20px;
  padding: 12px 30px;
  font-size: 16px;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  padding: 10px 0;
}

.wishlist-item {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
}

.product-image {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  cursor: pointer;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.wishlist-item:hover .product-img {
  transform: scale(1.05);
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
}

.remove-btn:hover {
  background: #ff4d4f;
  color: white;
}

.discount-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  font-weight: 600;
  padding: 0 8px;
}

.product-details {
  padding: 20px;
}

.product-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 10px 0;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 44px;
}



.price-section {
  margin: 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #ff4d4f;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: #ff6600;
  border: none;
}

.add-to-cart-btn:hover {
  background: #e55a00;
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .wishlist-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .product-image {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .wishlist-grid {
    grid-template-columns: 1fr;
  }
  
  .wishlist-page h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
}
</style>