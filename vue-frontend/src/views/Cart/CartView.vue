<template>
  <div class="cart-page">
    <el-container class="cart-container">
      <el-main>
        <h2>Your Shopping Cart</h2>

        <div v-if="cartStore.cartItems.length === 0" class="empty-cart">
          <el-empty description="Your cart is empty" />
          <el-button type="primary" @click="$router.push('/')"> Continue Shopping </el-button>
        </div>

        <div v-else class="cart-items">
          <div v-for="item in cartStore.cartItems" :key="item.product.id" class="cart-item">
            <el-image
              :src="item.product.images?.[0] || 'https://via.placeholder.com/100'"
              :alt="item.product.title"
              fit="cover"
              class="cart-item-image"
            />
            <div class="cart-item-details">
              <h3>{{ item.product.title }}</h3>
              <div class="cart-item-price">
                <span class="current-price">
                  ₱{{
                    item.product.discount
                      ? ((item.product.price || 0 * (100 - item.product.discount)) / 100).toFixed(2)
                      : item.product.price?.toFixed(2)
                  }}
                </span>
                <span v-if="item.product.discount" class="original-price">
                  ₱{{ item.product.price?.toFixed(2) }}
                </span>
              </div>
              <div class="cart-item-actions">
                <el-button-group>
                  <el-button
                    size="small"
                    :disabled="item.quantity <= 1"
                    @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                  >
                    -
                  </el-button>
                  <el-button size="small" disabled>
                    {{ item.quantity }}
                  </el-button>
                  <el-button
                    size="small"
                    @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                  >
                    +
                  </el-button>
                </el-button-group>
                <el-button
                  type="danger"
                  text
                  @click="cartStore.removeFromCart(item.product.id)"
                  class="remove-btn"
                >
                  Remove
                </el-button>
              </div>
            </div>
          </div>

          <div class="cart-summary">
            <div class="summary-row">
              <span>Subtotal ({{ cartStore.itemCount }} items)</span>
              <span>₱{{ cartStore.cartTotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span class="total-amount">₱{{ cartStore.cartTotal.toFixed(2) }}</span>
            </div>
            <div class="checkout-actions">
              <el-button type="primary" class="checkout-btn" @click="$router.push('/checkout')">
                Proceed to Checkout
              </el-button>
              <el-button @click="$router.push('/')"> Continue Shopping </el-button>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  margin-bottom: 24px;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.cart-item-image {
  width: 120px;
  height: 120px;
  border-radius: 6px;
  object-fit: cover;
  margin-right: 20px;
}

.cart-item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-item-details h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.cart-item-price {
  margin-bottom: 12px;
}

.current-price {
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c;
  margin-right: 8px;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 14px;
}

.cart-item-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
}

.remove-btn {
  margin-left: auto;
}

.cart-summary {
  margin-top: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
  color: #606266;
}

.summary-row.total {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.total-amount {
  color: #f56c6c;
  font-size: 20px;
}

.checkout-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.checkout-btn {
  padding: 10px 24px;
  font-size: 16px;
}

.empty-cart {
  text-align: center;
  padding: 40px 0;
}

.empty-cart .el-button {
  margin-top: 20px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    padding: 15px;
  }

  .cart-item-image {
    width: 100%;
    height: 200px;
    margin-right: 0;
    margin-bottom: 15px;
  }

  .cart-item-actions {
    margin-top: 15px;
  }

  .checkout-actions {
    flex-direction: column;
  }

  .checkout-actions .el-button {
    width: 100%;
  }
}
</style>
