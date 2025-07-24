import { useOrderStore } from "@/stores/order";
import { useUserAuthStore } from "@/stores/userAuth";


const authStore = useUserAuthStore()
const orderStore = useOrderStore()

 // Save all user orders to localStorage
  export const saveToLocalStorage = () => {
    try {
      localStorage.setItem('order', JSON.stringify(orderStore.userOrders))
    } catch (error) {
      console.error('Failed to save orders to localStorage:', error)
    }
  }



// Clear orders for current user (useful for logout)
export const clearCurrentUserOrders = () => {
    const userId = authStore.user?.id
    if (userId && orderStore.userOrders[userId]) {
      orderStore.userOrders[userId] = []
      saveToLocalStorage()
    }
  }

// Load all user orders from localStorage
 export const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('order')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        Object.keys(parsedData).forEach(userIdStr => {
          const userId = parseInt(userIdStr)
          orderStore.userOrders[userId] = parsedData[userId].map((order: any) => ({
            ...order,
            created_at: order.created_at || new Date().toISOString(),
            updated_at: order.updated_at || new Date().toISOString(),
            items: order.items || [],
            shipped_at: order.shipped_at || null,
            delivered_at: order.delivered_at || null
          }))
        })
      }
    } catch (error) {
      console.error('Failed to load orders from localStorage:', error)
      orderStore.userOrders || {}
    }
  }

  // Initialize from localStorage
  export const initializeFromLocalStorage = () => {
    loadFromLocalStorage()
  }  