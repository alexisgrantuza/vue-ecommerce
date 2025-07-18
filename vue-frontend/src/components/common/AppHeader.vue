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
      <template v-if="isAuthenticated">
    <el-col :span="4">
      <el-dropdown>
        <span class="user-account">
          <el-text type="primary">
            {{ userInitial }}
          </el-text>
          <el-text style="margin-left: 8px">{{ userName }}</el-text>
          <el-icon><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>My Profile</el-dropdown-item>
            <el-dropdown-item>Orders</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">Logout</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </template>
      <template v-else>
        <el-col :span="2">
          <el-link type="default" @click="handleLoginClick">Login</el-link>
        </el-col>
        <el-col :span="2">
          <el-link type="default" @click="handleRegisterClick">Register</el-link>
        </el-col>
      </template>
    </el-row>
  </el-header>

  <el-dialog
    v-model="loginDialogVisible"
    :before-close="handleLoginDialogClose"
    width="400px"
    :show-close="false"
    style="background-color: #000; border-radius: 12px"
  >
    <login-form @show-register="handleShowRegister" />
  </el-dialog>

  <el-dialog
    v-model="registerDialogVisible"
    :before-close="handleRegisterDialogClose"
    width="500px"
    :show-close="false"
    style="background-color: #000; border-radius: 12px"
  >
    <register-form @show-login="handleShowLogin" />
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
          <el-badge :value="wishlistCount" :hidden="wishlistCount === 0">
            <el-button :icon="Star" circle @click="handleWishlist" class="action-button"></el-button
          ></el-badge>
        </el-tooltip>

        <!-- Shopping Cart -->
        <el-tooltip content="Shopping Cart" placement="bottom">
          <el-badge :value="cartStore.itemCount" :hidden="cartStore.itemCount === 0" type="danger">
            <el-button :icon="ShoppingCart" circle @click="handleCart" class="action-button" />
          </el-badge>
        </el-tooltip>
      </div>
    </el-container>
  </el-header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Star, ShoppingCart, ArrowDown } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useUserAuthStore } from '@/stores/userAuth'
import loginForm from '../form/loginForm.vue'
import registerForm from '../form/registerForm.vue'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserAuthStore()

// Reactive state
const searchQuery = ref<string>('')
const wishlistCount = ref<number>(0)
const loginDialogVisible = ref<boolean>(false)
const registerDialogVisible = ref<boolean>(false)

console.log(userStore.checkAuth())

// Computed properties
const isAuthenticated = computed(() => userStore.isAuthenticated)
const userName = computed(() => userStore.user?.name || 'My Account')
const userInitial = computed(() => userStore.user?.name?.charAt(0)?.toUpperCase() || 'U')

// Event handlers
const handleLogoClick = (): void => {
  router.push('/')
}

const handleLoginClick = (): void => {
  loginDialogVisible.value = true
}

const handleRegisterClick = (): void => {
  registerDialogVisible.value = true
}

const handleLoginDialogClose = (): void => {
  loginDialogVisible.value = false
}

const handleRegisterDialogClose = (): void => {
  registerDialogVisible.value = false
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

const handleWishlist = (): void => {
  wishlistCount.value++
}

const handleCart = (): void => {
  router.push('/cart')
}

const handleLogout = async (): Promise<void> => {
  try {
    await userStore.logout()
    ElMessage.success('Successfully logged out')
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
    ElMessage.error('Failed to log out. Please try again.')
  }
}
</script>

<style scoped>
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