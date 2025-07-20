import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Order, OrderItem } from '@/types/api'

export const useOrderStore = defineStore('order', () => {
  // State
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedOrder = ref<Order | null>(null)

  // Getters
  const orderCount = computed(() => orders.value.length)
  const completedOrders = computed(() => 
    orders.value.filter(order => order.status === 'delivered')
  )
  const pendingOrders = computed(() =>
    orders.value.filter(order => order.status === 'pending' || order.status === 'processing')
  )
  const getOrderById = (orderId: string) => 
    orders.value.find(order => order.id === orderId)

  // Initialize from localStorage
  const initializeFromLocalStorage = () => {
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      try {
        orders.value = JSON.parse(savedOrders)
      } catch (err) {
        console.error('Failed to parse orders from localStorage', err)
        orders.value = []
      }
    }
  }

  // Save to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('orders', JSON.stringify(orders.value))
  }

  // Generate a unique order ID
  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  }

  // Actions
  const createOrder = (total: number, shippingInfo: any): Order => {
    const order: Order = {
      id: generateOrderId(),
      total_amount: total,
      shipping: 0, // You can calculate shipping if needed
      status: 'pending',
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      shipping_address: shippingInfo.address,
      payment_method: shippingInfo.paymentMethod,
      payment_status: 'pending',
    }

    orders.value.unshift(order)
    saveToLocalStorage()
    return order
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
      order.updated_at = new Date()
      saveToLocalStorage()
    }
  }

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled')
  }

  const fetchOrderHistory = async () => {
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500))
      initializeFromLocalStorage()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch order history'
      console.error('Error fetching order history:', err)
    } finally {
      loading.value = false
    }
  }

  const selectOrder = (order: Order | null) => {
    selectedOrder.value = order
  }

  // Initialize
  initializeFromLocalStorage()

  return {
    // State
    orders,
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
    selectOrder
  }
})

export type OrderStore = ReturnType<typeof useOrderStore>
