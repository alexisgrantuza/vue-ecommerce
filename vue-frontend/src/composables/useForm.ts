// src/composables/useForm.ts
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { useUserAuthStore } from '@/stores/userAuth'
import { useRouter } from 'vue-router'

export const useAuthDialog = () => {
  const loginDialogVisible = ref(false)
  const registerDialogVisible = ref(false)
  const userStore = useUserAuthStore()
  const cartStore = useCartStore()
  const router = useRouter()

  const showLogin = () => {
    registerDialogVisible.value = false
    setTimeout(() => {
      loginDialogVisible.value = true
    }, 100)
  }

  const showRegister = () => {
    loginDialogVisible.value = false
    setTimeout(() => {
      registerDialogVisible.value = true
    }, 100)
  }

  const hideLogin = () => {
    loginDialogVisible.value = false
  }

  const hideRegister = () => {
    registerDialogVisible.value = false
  }

  const requireAuth = (action: string, callback?: () => void) => {
    if (!userStore.isAuthenticated) {
      ElMessage.info(`Please login to ${action}`)
      showLogin()
      return false
    }
    if (callback) callback()
    return true
  }

  const handleLoginSuccess = () => {
    hideLogin()
    ElMessage.success('Login successful!')
  }

  const handleRegisterSuccess = () => {
    hideRegister()
    ElMessage.success('Registration successful!')
  }

  const addToCart = (product: any, quantity: number = 1) => {
    if (!requireAuth('add items to cart')) return false
    
    cartStore.addToCart(product, quantity)
    ElMessage.success(`${product.title} added to cart`)
    return true
  }

  const navigateToCart = () => {
    if (!requireAuth('view your cart')) return
    router.push('/cart')
  }

  const navigateToWishlist = () => {
    if (!requireAuth('view your wishlist')) return
    router.push('/wishlist')
  }

  return {
    // State
    loginDialogVisible,
    registerDialogVisible,
    
    // Actions
    showLogin,
    showRegister,
    hideLogin,
    hideRegister,
    requireAuth,
    handleLoginSuccess,
    handleRegisterSuccess,
    addToCart,
    navigateToCart,
    navigateToWishlist
  }
}