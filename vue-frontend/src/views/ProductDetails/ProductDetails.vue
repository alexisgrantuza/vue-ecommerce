<template>
  <div class="product-view">
    <div class="container">
      <Breadcrumbs :category="product?.category?.name" />

      <ProductSkeleton v-if="loading" />

      <ProductError v-else-if="!product" @back-to-home="handleBackToHome" />

      <div v-else class="product-details">
        <ProductGallery 
          :images="product.images || []"
          :title="product.title || ''"
          :selected-image="selectedImage"
          @select-image="handleImageSelect"
        />

        <ProductInfo 
          :product="product"
          :quantity="quantity"
          :is-adding-to-cart="isAddingToCart"
          :is-adding-to-wishlist="isAddingToWishlist"
          @update:quantity="handleQuantityUpdate"
          @add-to-cart="handleAddToCart"
          @add-to-wishlist="handleAddToWishlist"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProductsStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useUserAuthStore } from '@/stores/userAuth'
import { useAuthDialog } from '@/composables/useForm'
import type { Product } from '@/types/api'
import Breadcrumbs from '@/views/ProductDetails/_components/Breadcrumbs.vue'
import ProductGallery from '@/views/ProductDetails/_components/ProductGallery.vue'
import ProductInfo from '@/views/ProductDetails/_components/ProductInfo.vue'
import ProductSkeleton from '@/views/ProductDetails/_components/ProductSkeleton.vue'
import ProductError from '@/views/ProductDetails/_components/ProductNotFound.vue'

// Router
const route = useRoute()
const router = useRouter()

// Stores
const productsStore = useProductsStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const userAuthStore = useUserAuthStore()
const authDialog = useAuthDialog()

// Reactive state
const loading = ref(true)
const product = ref<Product | null>(null)
const selectedImage = ref<string>('')
const quantity = ref(1)
const isAddingToCart = ref(false)
const isAddingToWishlist = ref(false)

const productId = computed(() => parseInt(route.params.id as string))

onMounted(async () => {
  await fetchProduct()
})

const fetchProduct = async () => {
  loading.value = true
  try {
    const response = await productsStore.fetchProductById(productId.value)

    if (response) {
      product.value = response
      selectedImage.value = response.images?.[0] || ''
    } else {
      product.value = null
      ElMessage.error('Product not found')
    }
  } catch (error) {
    product.value = null
    ElMessage.error('Failed to load product')
  } finally {
    loading.value = false
  }
}

const handleImageSelect = (image: string) => {
  selectedImage.value = image
}

const handleQuantityUpdate = (newQuantity: number) => {
  quantity.value = newQuantity
}

const handleAddToCart = async (cartQuantity: number) => {
  if (!userAuthStore.isAuthenticated) {
    authDialog.showLogin()
    return
  }

  if (!product.value) return

  isAddingToCart.value = true
  try {
    cartStore.addToCart(product.value, cartQuantity)
    ElMessage.success(`${product.value.title} added to cart`)
  } catch (error) {
    ElMessage.error('Failed to add to cart')
  } finally {
    isAddingToCart.value = false
  }
}

const handleAddToWishlist = async () => {
  if (!userAuthStore.isAuthenticated) {
    authDialog.showLogin()
    return
  }

  if (!product.value) return

  isAddingToWishlist.value = true
  try {
    wishlistStore.addToWishlist(product.value)
    ElMessage.success(`${product.value.title} added to wishlist`)
  } catch (error) {
    ElMessage.error('Failed to add to wishlist')
  } finally {
    isAddingToWishlist.value = false
  }
}

const handleBackToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.product-view {
  min-height: 100vh;
  background: #fff;
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.product-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  background: #fafafa;
  padding: 40px;
  border-radius: 12px;
}

@media (max-width: 1024px) {
  .container {
    padding: 0 15px;
  }
  
  .product-details {
    gap: 40px;
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .product-view {
    padding: 15px 0;
  }
  
  .container {
    padding: 0 10px;
  }
  
  .product-details {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 20px;
    border-radius: 8px;
  }
}

@media (max-width: 640px) {
  .product-details {
    gap: 25px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .product-view {
    padding: 10px 0;
  }
  
  .container {
    padding: 0 5px;
  }
  
  .product-details {
    gap: 20px;
    padding: 12px;
    border-radius: 6px;
  }
}
</style>