import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { useUserAuthStore } from '@/stores/userAuth'
import { useRouter } from 'vue-router'

// Create a global state for the auth dialog
const globalAuthState = {
  loginDialogVisible: ref(false),
  registerDialogVisible: ref(false)
}

export const useAuthDialog = () => {
  const userStore = useUserAuthStore()
  const cartStore = useCartStore()
  const router = useRouter()

  const showLogin = () => {
    globalAuthState.registerDialogVisible.value = false
    setTimeout(() => {
      globalAuthState.loginDialogVisible.value = true
    }, 100)
  }

  const showRegister = () => {
    globalAuthState.loginDialogVisible.value = false
    setTimeout(() => {
      globalAuthState.registerDialogVisible.value = true
    }, 100)
  }

  const hideLogin = () => {
    globalAuthState.loginDialogVisible.value = false
  }

  const hideRegister = () => {
    globalAuthState.registerDialogVisible.value = false
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
    loginDialogVisible: globalAuthState.loginDialogVisible,
    registerDialogVisible: globalAuthState.registerDialogVisible,
    
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