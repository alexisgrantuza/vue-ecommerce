<template>
  <el-header class="app-header-links">
    <!-- Desktop Navigation -->
    <el-row class="nav-links desktop-nav">
      <el-col :span="2">
        <el-link type="default" @click="$emit('logo-click')">Home</el-link>
      </el-col>
      <el-col :span="2">
        <el-link type="default" @click="$emit('logo-click')">About</el-link>
      </el-col>
      <el-col :span="2">
        <el-link type="default" @click="$emit('logo-click')">Contact</el-link>
      </el-col>
      <template v-if="isAuthenticated">
        <el-col :span="2">
          <el-dropdown placement="bottom" class="user-dropdown">
            <el-button class="dropdown-trigger">
              {{ userName }}
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$emit('logout')">Logout</el-dropdown-item>
                <el-dropdown-item @click="$emit('profile')">Profile</el-dropdown-item>
                <el-dropdown-item @click="$emit('wishlist')">Wishlist</el-dropdown-item>
                <el-dropdown-item @click="$emit('cart')">Cart</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </template>
      <template v-else>
        <el-col :span="2">
          <el-link type="default" @click="showLogin">Login</el-link>
        </el-col>
        <el-col :span="2">
          <el-link type="default" @click="showRegister">Register</el-link>
        </el-col>
      </template>
    </el-row>

    <!-- Mobile Navigation -->
    <div class="mobile-nav">
      <el-dropdown class="mobile-menu-dropdown" placement="bottom-start">
        <el-button class="mobile-menu-trigger" :icon="Menu" circle />
        <template #dropdown>
          <el-dropdown-menu class="mobile-menu">
            <el-dropdown-item @click="$emit('logo-click')">
              <el-icon><House /></el-icon>
              Home
            </el-dropdown-item>
            <el-dropdown-item @click="$emit('logo-click')">
              <el-icon><InfoFilled /></el-icon>
              About
            </el-dropdown-item>
            <el-dropdown-item @click="$emit('logo-click')">
              <el-icon><Phone /></el-icon>
              Contact
            </el-dropdown-item>
            <el-dropdown-item divided v-if="!isAuthenticated" @click="showLogin">
              <el-icon><User /></el-icon>
              Login
            </el-dropdown-item>
            <el-dropdown-item v-if="!isAuthenticated" @click="showRegister">
              <el-icon><UserFilled /></el-icon>
              Register
            </el-dropdown-item>
            <template v-if="isAuthenticated">
              <el-dropdown-item divided>
                <el-icon><User /></el-icon>
                {{ userName }}
              </el-dropdown-item>
              <el-dropdown-item @click="$emit('profile')">
                <el-icon><Setting /></el-icon>
                Profile
              </el-dropdown-item>
              <el-dropdown-item @click="$emit('wishlist')">
                <el-icon><Star /></el-icon>
                Wishlist
              </el-dropdown-item>
              <el-dropdown-item @click="$emit('cart')">
                <el-icon><ShoppingCart /></el-icon>
                Cart
              </el-dropdown-item>
              <el-dropdown-item @click="$emit('logout')">
                <el-icon><SwitchButton /></el-icon>
                Logout
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { 
  ElHeader, 
  ElRow, 
  ElCol, 
  ElLink, 
  ElDropdown, 
  ElButton, 
  ElDropdownMenu, 
  ElDropdownItem,
  ElIcon
} from 'element-plus'
import { 
  Menu, 
  House, 
  InfoFilled, 
  Phone, 
  User, 
  UserFilled, 
  Setting, 
  Star, 
  ShoppingCart, 
  SwitchButton 
} from '@element-plus/icons-vue'
import { useAuthDialog } from '@/composables/useForm';

const { showLogin, showRegister } = useAuthDialog()

defineProps<{
  isAuthenticated: boolean
  userName?: string
}>()



defineEmits(['logo-click', 'logout', 'profile', 'login', 'register', 'wishlist', 'cart'])
</script>

<style scoped>
.app-header-links {
  --header-links-height: 20px;
  --link-color: #8b8b8b;
  --link-hover-color: #ff6600;
  --mobile-breakpoint: 768px;
  
  height: var(--header-links-height);
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 10px 20px;
  box-sizing: border-box;
}

.desktop-nav {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px;
}

.nav-links {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px;
}

.mobile-nav {
  display: none;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
}

.mobile-menu-trigger {
  background: none;
  border: 1px solid #ffffff;
  color: var(--link-color);
  transition: all 0.2s ease;
}

.mobile-menu-trigger:hover {
  color: var(--link-hover-color);
}




:deep(.el-link) {
  color: var(--link-color);
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
  text-decoration: none;
}

:deep(.el-link:hover) {
  color: var(--link-hover-color);
}

.user-dropdown :deep(.dropdown-trigger) {
  background: none;
  border: none;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  height: auto;
  transition: color 0.2s ease;
  padding: 4px 8px;
}

.user-dropdown :deep(.dropdown-trigger:hover),
.user-dropdown :deep(.dropdown-trigger:focus) {
  color: var(--link-hover-color);
  background: none;
  border-color: transparent;
  box-shadow: none;
}

.user-dropdown :deep(.dropdown-trigger:active) {
  background: none;
  border-color: transparent;
}

:deep(.mobile-menu) {
  min-width: 200px;
}

:deep(.mobile-menu .el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.2s ease;
}

:deep(.mobile-menu .el-dropdown-menu__item:hover) {
  background-color: #f5f7fa;
  color: var(--link-hover-color);
}

:deep(.mobile-menu .el-dropdown-menu__item .el-icon) {
  font-size: 16px;
}

@media (max-width: 992px) {
  .nav-links {
    gap: 15px;
  }
  
  :deep(.el-link) {
    font-size: 13px;
  }
  
  .user-dropdown :deep(.dropdown-trigger) {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .app-header-links {
    padding: 8px 15px;
  }
  
  .desktop-nav {
    display: none;
  }
  
  .mobile-nav {
    display: flex;
  }
}

@media (max-width: 480px) {
  .app-header-links {
    padding: 6px 10px;
    --header-links-height: 16px;
  }
  
  .mobile-menu-trigger {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  
  :deep(.mobile-menu .el-dropdown-menu__item) {
    padding: 10px 12px;
    font-size: 13px;
  }
}

@media (max-width: 320px) {
  .app-header-links {
    padding: 4px 8px;
  }
  
}



@media (max-width: 1024px) and (orientation: landscape) {
  .nav-links {
    gap: 12px;
  }
  
  :deep(.el-link) {
    font-size: 12px;
  }
}

@media print {
  .app-header-links {
    display: none;
  }
}
</style>