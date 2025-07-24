<template>
  <el-header class="app-header-links" style="height: 20px">
    <el-row :gutter="50" style="display: flex; justify-content: space-between">
      <el-col :span="2">
        <el-link type="default" @click="handleLogoClick">Home</el-link>
      </el-col>
      <el-col :span="2">
        <el-link type="default" @click="handleLogoClick">About</el-link>
      </el-col>
      <el-col :span="2">
        <el-link type="default" @click="handleLogoClick">Contact</el-link>
      </el-col>
      <template v-if="userStore.isAuthenticated">
        <el-col :span="2">
          <el-dropdown placement="bottom" class="user-dropdown">
            <el-button class="dropdown-trigger">
              {{ userStore.user?.name }}
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogoutClick">Logout</el-dropdown-item>
                <el-dropdown-item @click="handleProfileClick">Profile</el-dropdown-item>
                <el-dropdown-item @click="handleWishlistClick">Wishlist</el-dropdown-item>
                <el-dropdown-item @click="handleCartClick">Cart</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </template>
      <template v-else>
        <el-col :span="2">
          <el-link type="default" @click="handleShowLogin">Login</el-link>
        </el-col>
        <el-col :span="2">
          <el-link type="default" @click="handleShowRegister">Register</el-link>
        </el-col>
      </template>
    </el-row>
  </el-header>

  <!-- Rest of your template remains the same -->
  <el-dialog
    v-model="loginDialogVisible"
    width="400px"
    :show-close="false"
    style="background-color: #000; border-radius: 12px"
  >
    <login-form @show-login="handleShowLogin" @login-success="loginDialogVisible = false"/>
  </el-dialog>

  <el-dialog
    v-model="registerDialogVisible"
    width="500px"
    :show-close="false"
    style="background-color: #000; border-radius: 12px"
  >
    <register-form @show-register="handleShowRegister" @register-success="registerDialogVisible = false"/>
  </el-dialog>
  <el-header class="app-header">
    <el-container class="header-container">
      <el-text class="logo-text" @click="handleLogoClick">Shopiplus</el-text>

      <!-- Search Bar -->
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="Search products..."
          :prefix-icon="Search"
          clearable
          @keyup.enter="handleSearch"
          class="search-input"
        />
      </div>

      <!-- User Actions -->
      <div class="user-actions">
        <!-- Wishlist -->
        <el-tooltip content="Wishlist" placement="bottom">
          <el-badge
            :value="wishlistStore.wishlistCount"
            :hidden="wishlistStore.wishlistCount === 0"
          >
            <el-button
              :icon="Star"
              circle
              @click="router.push('/wishlist')"
              class="action-button"
            ></el-button>
          </el-badge>
        </el-tooltip>

        <!-- Shopping Cart -->
        <el-tooltip content="Shopping Cart" placement="bottom">
          <el-badge :value="cartStore.itemCount" :hidden="cartStore.itemCount === 0" type="danger">
            <el-button
              :icon="ShoppingCart"
              circle
              @click="router.push('/cart')"
              class="action-button"
            />
          </el-badge>
        </el-tooltip>
      </div>

      <!-- Cart Drawer -->
      <!-- Removed Cart Drawer -->
    </el-container>
  </el-header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Star, ShoppingCart } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import loginForm from '../form/loginForm.vue'
import registerForm from '../form/registerForm.vue'
import { useUserAuthStore } from '@/stores/userAuth'

// Router
const router = useRouter()

// Stores
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const userStore = useUserAuthStore()

// Reactive state
const searchQuery = ref<string>('')
const loginDialogVisible = ref<boolean>(false)
const registerDialogVisible = ref<boolean>(false)

// Event handlers
const handleLogoClick = (): void => {
  router.push('/')
}

const handleShowLogin = (): void => {
  registerDialogVisible.value = false
  setTimeout(() => {
    loginDialogVisible.value = true
  }, 100)
  
}

const handleShowRegister = (): void => {
  loginDialogVisible.value = false
  setTimeout(() => {
    registerDialogVisible.value = true
  }, 100)
}

const handleSearch = (): void => {
  if (searchQuery.value.trim()) {
    ElMessage.success(`Searching for: ${searchQuery.value}`)
    // Implement search logic here
  } else {
    ElMessage.warning('Please enter a search term')
  }
}

const handleLogoutClick = (): void => {
  userStore.logout()
}

const handleProfileClick = (): void => {
  router.push('/profile')
}

const handleWishlistClick = (): void => {
  router.push('/wishlist')
}

const handleCartClick = (): void => {
  router.push('/cart')
}
</script>

<style scoped>
.user-dropdown :deep(.dropdown-trigger) {
  background: none;
  border: none;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  height: auto;
  transition: color 0.2s ease;
}

.user-dropdown :deep(.dropdown-trigger:hover) {
  color: #ff6600;
  background: none;
  border-color: transparent;
}

.user-dropdown :deep(.dropdown-trigger:focus) {
  color: #ff6600;
  background: none;
  border-color: transparent;
  box-shadow: none;
}

.user-dropdown :deep(.dropdown-trigger:active) {
  background: none;
  border-color: transparent;
}

/* Cart Drawer Styles */
.cart-items {
  padding: 0 16px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.cart-item {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 16px;
  object-fit: cover;
}

.cart-item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-item-details h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-price {
  margin-bottom: 8px;
}

.cart-item-price span:first-child {
  font-weight: 600;
  color: #f56c6c;
  margin-right: 8px;
}

.original-price {
  text-decoration: line-through;
  color: #999 !important;
  font-size: 12px;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-item-quantity .el-button {
  padding: 4px 8px;
  min-width: 28px;
}

.cart-item-quantity span {
  min-width: 24px;
  text-align: center;
}

.remove-item {
  margin-left: auto;
  padding: 0 8px;
  font-size: 12px;
}

.cart-summary {
  padding: 16px;
  border-top: 1px solid #eee;
  margin-top: 16px;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

.total-amount {
  color: #f56c6c;
  font-size: 18px;
}

.checkout-btn {
  width: 100%;
  margin-bottom: 12px;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  padding: 0 20px;
}

.empty-cart .el-button {
  margin-top: 20px;
}

/* Header styles */
.app-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 100px;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.app-header-links {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}

.app-header-links :deep(.el-link) {
  color: #8b8b8b;
}

.app-header-links :deep(.el-link:hover) {
  color: #ff6600;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-text {
  font-size: 50px;
  font-weight: bolder;
  color: #ff6600;
  margin: 0;
  transition: color 0.2s ease;
}

:deep(.el-dialog) {
  margin: 20px 0;
  background-color: #ff6600;
}

.main-menu {
  flex: 1;
  max-width: 500px;
  margin: 0 20px;
  border-bottom: none;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.user-account {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 1px solid #e4e7ed;
  background-color: #f5f7fa;
  height: 36px;
}

.user-account:hover {
  background-color: #ecf5ff;
  border-color: #c6e2ff;
}

.user-account .el-avatar {
  background-color: #ff6600;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.user-account .el-icon {
  margin-left: 4px;
  font-size: 14px;
  color: #606266;
  transition: color 0.2s;
}

.user-account:hover .el-icon {
  color: #ff6600;
}

.search-input {
  width: 600px;
  height: 50px;
  border-radius: 10px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.action-button {
  position: relative;
  transition: all 0.2s ease;
  width: 50px;
  height: 50px;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-container {
    padding: 0 15px;
  }

  .main-menu {
    display: none;
  }

  .search-input {
    width: 200px;
  }

  .logo-text {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .user-actions {
    gap: 8px;
  }

  .search-input {
    width: 150px;
  }

  .logo-text {
    display: none;
  }
}
</style>
