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
                <el-dropdown-item @click="authDialog.navigateToWishlist">Wishlist</el-dropdown-item>
                <el-dropdown-item @click="authDialog.navigateToCart">Cart</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </template>
      <template v-else>
        <el-col :span="2">
          <el-link type="default" @click="authDialog.showLogin">Login</el-link>
        </el-col>
        <el-col :span="2">
          <el-link type="default" @click="authDialog.showRegister">Register</el-link>
        </el-col>
      </template>
    </el-row>
  </el-header>

  <!-- Login/Register Dialogs -->
  <el-dialog
    v-model="authDialog.loginDialogVisible.value"
    width="400px"
    :show-close="false"
    style="background-color: #000; border-radius: 12px"
  >
    <login-form 
      @show-login="authDialog.showLogin" 
      @login-success="authDialog.handleLoginSuccess" 
    />
  </el-dialog>

  <el-dialog
    v-model="authDialog.registerDialogVisible.value"
    width="500px"
    :show-close="false"
    style="background-color: #000; border-radius: 12px"
  >
    <register-form
      @show-register="authDialog.showRegister"
      @register-success="authDialog.handleRegisterSuccess"
    />
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
              @click="authDialog.navigateToWishlist"
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
              @click="authDialog.navigateToCart"
              class="action-button"
            />
          </el-badge>
        </el-tooltip>
      </div>
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
import { useAuthDialog } from '@/composables/useForm'

// Router
const router = useRouter()

// Stores
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const userStore = useUserAuthStore()

// Auth Dialog Composable
const authDialog = useAuthDialog()

// Reactive state
const searchQuery = ref<string>('')

// Event handlers
const handleLogoClick = (): void => {
  router.push('/')
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
  cursor: pointer;
}

:deep(.el-dialog) {
  margin: 20px 0;
  background-color: #ff6600;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
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