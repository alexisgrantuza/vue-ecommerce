import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Order, OrderItem, OrderWithItems, ShippingInfo, UserOrdersStorage } from '@/types/api'
import { useUserAuthStore } from './userAuth'
import { saveToLocalStorage, initializeFromLocalStorage } from '@/utils/helpers'



export const useOrderStore = defineStore('order', () => {
  // State - Store orders for all users in a single object
  const userOrders = ref<UserOrdersStorage>({})
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedOrder = ref<OrderWithItems | null>(null)

  // Get the current user's ID
  const getCurrentUserId = (): number | null => {
    const authStore = useUserAuthStore()
    return authStore.user?.id || null
  }

  // Get current user's orders
  const getCurrentUserOrders = computed((): OrderWithItems[] => {
    const userId = getCurrentUserId()
    return userId ? (userOrders.value[userId] || []) : []
  })

  // Getters - all based on current user's orders
  const orderCount = computed(() => getCurrentUserOrders.value.length)
  const completedOrders = computed(() => 
    getCurrentUserOrders.value.filter(order => order.status === 'delivered')
  )
  const pendingOrders = computed(() =>
    getCurrentUserOrders.value.filter(order => order.status === 'pending' || order.status === 'processing')
  )
  const getOrderById = (orderId: string) =>
    getCurrentUserOrders.value.find(order => order.id === orderId)

  // Initialize user orders array if it doesn't exist
  const ensureUserOrdersExists = (userId: number) => {
    if (!userOrders.value[userId]) {
      userOrders.value[userId] = []
    }
  }

 

  

  // Generate a unique order ID
  const generateOrderId = () => {
    return `ORD${Math.floor(100000 + Math.random() * 900000)}`
  }

  // Delete an order for current user
  const deleteOrder = async (orderId: string) => {
    try {
      const userId = getCurrentUserId()
      if (!userId) {
        throw new Error('No user is logged in')
      }

      await new Promise(resolve => setTimeout(resolve, 300))
      
      ensureUserOrdersExists(userId)
      const orderIndex = userOrders.value[userId].findIndex(order => order.id === orderId)
      
      if (orderIndex !== -1) {
        userOrders.value[userId].splice(orderIndex, 1)
        saveToLocalStorage()
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting order:', error)
      throw error
    }
  }

  // Create order for current user
  const createOrder = (total: number, shippingInfo: ShippingInfo): OrderWithItems | null => {
    const userId = getCurrentUserId()
    if (!userId) {
      console.error('Cannot create order: No user is logged in')
      return null
    }

    ensureUserOrdersExists(userId)
    const orderId = generateOrderId()
    
    const order: OrderWithItems = {
      id: orderId,
      user_id: userId,
      total_amount: total,
      shipping: 0,
      status: 'pending',
      shipping_address: shippingInfo.address,
      payment_method: shippingInfo.paymentMethod,
      payment_status: 'pending',
      tracking_number: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      shipped_at: null,
      delivered_at: null,
      items: (shippingInfo.items?.map((item, index) => ({
        id: index + 1,
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product: item.product
      })) || []) as (OrderItem & { product: any })[]
    }

    // Add order to the beginning of the user's orders array (most recent first)
    userOrders.value[userId].unshift(order)
    saveToLocalStorage()
    
    console.log('Order created and saved for user', userId, ':', order)
    return order
  }

  // Update order status for current user
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const userId = getCurrentUserId()
    if (!userId) return

    ensureUserOrdersExists(userId)
    const order = userOrders.value[userId].find(o => o.id === orderId)
    
    if (order) {
      order.status = status
      order.updated_at = new Date().toISOString()
      
      if (status === 'shipped' && !order.shipped_at) {
        order.shipped_at = new Date().toISOString()
      }
      if (status === 'delivered' && !order.delivered_at) {
        order.delivered_at = new Date().toISOString()
      }
      
      saveToLocalStorage()
    }
  }

  // Cancel order
  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled')
  }

  // Fetch order history for current user
  const fetchOrderHistory = async () => {
    loading.value = true
    error.value = null
    
    try {
      const userId = getCurrentUserId()
      if (!userId) {
        throw new Error('No user is logged in')
      }

      await new Promise(resolve => setTimeout(resolve, 300))
      
      initializeFromLocalStorage()
      
      console.log('Fetched orders for user', userId, ':', getCurrentUserOrders.value)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch order history'
      console.error('Error fetching order history:', err)
    } finally {
      loading.value = false
    }
  }

  // Select order
  const selectOrder = (order: OrderWithItems | null) => {
    selectedOrder.value = order
  }

  

  

  // Initialize on store creation
  initializeFromLocalStorage()
 

  return {
    // State
    orders: getCurrentUserOrders,
    loading,
    error,
    selectedOrder,
    
    // Getters
    orderCount,
    completedOrders,
    pendingOrders,
    getOrderById,
    
    // Actions
    createOrder,
    updateOrderStatus,
    cancelOrder,
    fetchOrderHistory,
    selectOrder,
    deleteOrder,
    
    // Access to all user orders (for admin purposes)
    userOrders: computed(() => userOrders.value)
  }
})
