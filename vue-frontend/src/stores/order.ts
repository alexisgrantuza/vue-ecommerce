import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Order, OrderItem, OrderWithItems } from '@/types/api'

export const useOrderStore = defineStore('order', () => {
  // State - Changed to OrderWithItems[] to match what components expect
  const orders = ref<OrderWithItems[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedOrder = ref<OrderWithItems | null>(null)

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
  const deleteOrder = async (orderId: string) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Remove the order from the store
      const orderIndex = orders.value.findIndex(order => order.id === orderId)
      if (orderIndex !== -1) {
        orders.value.splice(orderIndex, 1)
        saveToLocalStorage()
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting order:', error)
      throw error
    }
  }

  const initializeFromLocalStorage = () => {
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders)
        // Ensure all orders have required fields and proper structure
        orders.value = parsedOrders.map((order: any) => ({
          ...order,
          created_at: order.created_at || new Date().toISOString(),
          updated_at: order.updated_at || new Date().toISOString(),
          items: order.items || [],
          // Ensure dates are properly formatted
          shipped_at: order.shipped_at || null,
          delivered_at: order.delivered_at || null
        }))
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
    return `ORD${Math.floor(100000 + Math.random() * 900000)}`
  }

  // Actions
  interface OrderItemInput {
    product_id: number;
    quantity: number;
    price: number;
    product: any;
  }

  interface ShippingInfo {
    address: string;
    paymentMethod: string;
    items?: OrderItemInput[];
  }

  const createOrder = (total: number, shippingInfo: ShippingInfo): OrderWithItems => {
    const orderId = generateOrderId()
    
    const order: OrderWithItems = {
      id: orderId,
      user_id: 1, // Get from auth in a real app
      total_amount: total,
      shipping: 0, // You can calculate shipping if needed
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
        order_id: orderId, // Set the order ID immediately
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product: item.product
      })) || []) as (OrderItem & { product: any })[]
    }

    // Add order to the beginning of the array (most recent first)
    orders.value.unshift(order)
    saveToLocalStorage()
    
    console.log('Order created and saved:', order)
    return order
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
      order.updated_at = new Date().toISOString()
      
      // Set timestamps based on status
      if (status === 'shipped' && !order.shipped_at) {
        order.shipped_at = new Date().toISOString()
      }
      if (status === 'delivered' && !order.delivered_at) {
        order.delivered_at = new Date().toISOString()
      }
      
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
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Load from localStorage
      initializeFromLocalStorage()
      
      console.log('Fetched orders:', orders.value)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch order history'
      console.error('Error fetching order history:', err)
    } finally {
      loading.value = false
    }
  }

  const selectOrder = (order: OrderWithItems | null) => {
    selectedOrder.value = order
  }

  // Initialize on store creation
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
    selectOrder,
    deleteOrder,
    
    // Utility methods
    saveToLocalStorage,
    initializeFromLocalStorage
  }
})

export type OrderStore = ReturnType<typeof useOrderStore>