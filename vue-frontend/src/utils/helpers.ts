import type { UserOrdersStorage } from '@/types/api'

// Save all user orders to localStorage
export const saveToLocalStorage = (userOrders: UserOrdersStorage): void => {
  try {
    localStorage.setItem('order', JSON.stringify(userOrders))
  } catch (error) {
    console.error('Failed to save orders to localStorage:', error)
  }
}

// Clear orders for current user 
export const clearCurrentUserOrders = (userOrders: UserOrdersStorage, userId: number | null): void => {
  if (userId && userOrders[userId]) {
    const updatedOrders = { ...userOrders }
    updatedOrders[userId] = []
    saveToLocalStorage(updatedOrders)
  }
}

// Load all user orders from localStorage
export const loadFromLocalStorage = (): UserOrdersStorage | null => {
  try {
    const storedData = localStorage.getItem('order')
    return storedData ? JSON.parse(storedData) : {}
  } catch (error) {
    console.error('Failed to load orders from localStorage:', error)
    return {}
  }
}

// Initialize from localStorage
export const initializeFromLocalStorage = (): void => {
  loadFromLocalStorage()
}
