<template>
  <TopNavBar 
    :is-authenticated="userStore.isAuthenticated"
    :user-name="userStore.user?.name"
    @logo-click="handleLogoClick"
    @logout="handleLogoutClick"
    @profile="handleProfileClick"
    @login="authDialog.showLogin"
    @register="authDialog.showRegister"
    @wishlist="authDialog.navigateToWishlist"
    @cart="authDialog.navigateToCart"
  />

  <el-header class="app-header">
    <el-container class="header-container">
      <el-text class="logo-text" @click="handleLogoClick">Shopiplus</el-text>

      <SearchBar 
        v-model="searchQuery"
        :suggestions="searchSuggestions"
        :loading="isSearching"
        @search="handleSearch"
        @select="handleSelect"
      />

      <UserActions 
        :wishlist-count="wishlistStore.wishlistCount"
        :cart-count="cartStore.itemCount"
        @wishlist="authDialog.navigateToWishlist"
        @cart="authDialog.navigateToCart"
      />
    </el-container>
  </el-header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useUserAuthStore } from '@/stores/userAuth'
import { useProductsStore } from '@/stores/product'
import { useAuthDialog } from '@/composables/useForm'
import SearchBar from '@/components/common/Navbar/SearchBar.vue'
import TopNavBar from '@/components/common/Navbar/TopNavBar.vue'
import UserActions from '@/components/common/Navbar/UserActions.vue'
import { type SearchSuggestion } from '@/types/api'


// Router
const router = useRouter()

// Stores
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const userStore = useUserAuthStore()
const productsStore = useProductsStore()

// Composables
const authDialog = useAuthDialog()

// State
const searchQuery = ref<string>('')
const isSearching = ref<boolean>(false)

// Computed
const searchSuggestions = computed<SearchSuggestion[]>(() => {
  return productsStore.allProducts.map((product) => ({
    id: product.id,
    title: product.title || 'Untitled Product',
    price: product.price || 0,
    discount: product.discount || 0,
    image: product.images?.[0] || '/default-product-image.png',
    category: product.category || { id: 0, name: 'Uncategorized' },
    product,
    value: product.title || ''
  }))
})

// Methods
const handleLogoClick = (): void => {
  router.push('/')
}

const handleSearch = (): void => {
  const query = searchQuery.value.trim()
  if (query) {
    router.push({
      name: 'SearchResults',
      query: { q: query }
    })
    ElMessage.success(`Searching for: ${query}`)
  }
}

const handleLogoutClick = (): void => {
  userStore.logout()
}

const handleProfileClick = (): void => {
  router.push('/profile')
}

const handleSelect = (item: SearchSuggestion): void => {
  if (item?.product?.id) {
    router.push({
      name: 'product',
      params: { id: item.product.id }
    })
    searchQuery.value = ''
    ElMessage.success(`Selected: ${item.title}`)
  }
}

// Lifecycle
onMounted(async (): Promise<void> => {
  try {
    isSearching.value = true
    await productsStore.fetchProducts()
  } catch (error) {
    console.error('Failed to load products for search:', error)
    ElMessage.error('Failed to load products for search')
  } finally {
    isSearching.value = false
  }
})
</script>

<style scoped>
.app-header {
  --header-height: 100px;
  --header-bg: #ffffff;
  --header-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --header-border: 1px solid #e4e7ed;
  --primary-color: #ff6600;
  --primary-hover: #e55a00;
  --text-secondary: #8b8b8b;
  --text-primary: #303133;
  --border-radius: 10px;
  
  background-color: var(--header-bg);
  border-bottom: var(--header-border);
  box-shadow: var(--header-shadow);
  position: sticky;
  top: 0;
  z-index: 1000;
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-container {
  --max-width: 1200px;
  --logo-size: 50px;
  --search-width: 500px;
  
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
}

.logo-text {
  font-size: var(--logo-size);
  font-weight: bolder;
  color: var(--primary-color);
  margin: 0;
  transition: color 0.2s ease;
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;
}

@media (max-width: 1024px) {
  .header-container {
    --logo-size: 40px;
    --search-width: 400px;
  }
}

@media (max-width: 768px) {
  .header-container {
    --logo-size: 32px;
    --search-width: 300px;
    padding: 0 15px;
    gap: 12px;
  }
  
  .app-header {
    --header-height: 80px;
  }

  .logo-text {
    display: none;
  }
}

@media (max-width: 576px) {
  .header-container {
    --logo-size: 28px;
    --search-width: 200px;
  }
}

:deep(.el-dialog) {
  margin: 20px 0;
  background-color: var(--primary-color);
}
</style>
