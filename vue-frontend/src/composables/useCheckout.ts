import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import type { Address } from '@/types/api'

interface PaymentMethod {
  id: string
  name: string
  icon: string
  description: string
}

export function useCheckout() {
  const router = useRouter()
  const cartStore = useCartStore()

  // Steps
  const steps = ['Delivery', 'Payment', 'Review & Pay']
  const currentStep = ref(1)

  // Address Management
  const addresses = ref<Address[]>([])
  const selectedAddressId = ref<number | null>(null)
  const showAddressForm = ref(false)
  const editingAddress = ref<Address | null>(null)

  // Payment Methods
  const paymentMethods = ref<PaymentMethod[]>([
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: 'el-icon-user',
      description: 'Pay with cash upon delivery'
    },
    {
      id: 'gcash',
      name: 'GCash',
      icon: 'el-icon-user',
      description: 'Pay using GCash'
    },
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      icon: 'el-icon-user',
      description: 'Pay using Visa, Mastercard, etc.'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: 'el-icon-user',
      description: 'Pay via bank transfer'
    }
  ])
  
  const selectedPaymentMethodId = ref('cod')
  const isPlacingOrder = ref(false)

  // Voucher
  const voucherCode = ref('')

  // Computed
  const cartItems = computed(() => cartStore.cartItems)
  const subtotal = computed(() => cartStore.cartTotal)
  const shippingFee = computed(() => (cartItems.value.length > 0 ? 50 : 0))
  const total = computed(() => subtotal.value + shippingFee.value)
  
  const selectedAddress = computed(() => 
    addresses.value.find(addr => addr.id === selectedAddressId.value) || null
  )
  
  const selectedPaymentMethod = computed(() => 
    paymentMethods.value.find(method => method.id === selectedPaymentMethodId.value) || paymentMethods.value[0]
  )

  const canProceed = computed(() => {
    if (currentStep.value === 1) return selectedAddressId.value !== null
    if (currentStep.value === 2) return selectedPaymentMethodId.value !== ''
    return true
  })

  // Methods
  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      currentStep.value = step
    }
  }

  const goToNextStep = () => {
    if (currentStep.value < steps.length) {
      currentStep.value++
    }
  }

  const goToPreviousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  // Address Methods
  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress = {
      ...address,
      id: Date.now()
    }
    
    if (newAddress.isDefault) {
      addresses.value.forEach(addr => { addr.isDefault = false })
    }
    
    addresses.value.push(newAddress)
    
    if (addresses.value.length === 1) {
      selectedAddressId.value = newAddress.id
    }
    
    return newAddress
  }

  const updateAddress = (address: Address) => {
    const index = addresses.value.findIndex(addr => addr.id === address.id)
    if (index > -1) {
      if (address.isDefault) {
        addresses.value.forEach(addr => { addr.isDefault = false })
      }
      addresses.value[index] = { ...address }
      return true
    }
    return false
  }

  const removeAddress = (id: number) => {
    const index = addresses.value.findIndex(addr => addr.id === id)
    if (index > -1) {
      if (selectedAddressId.value === id) {
        selectedAddressId.value = null
      }
      addresses.value.splice(index, 1)
      return true
    }
    return false
  }

  const selectAddress = (id: number | null) => {
    selectedAddressId.value = id
  }

  const editAddress = (address: Address) => {
    editingAddress.value = { ...address }
    showAddressForm.value = true
  }

  // Payment Methods
  const selectPaymentMethod = (methodId: string | null) => {
    selectedPaymentMethodId.value = methodId || ''
  }

  // Order Placement
  const placeOrder = async () => {
    if (!selectedAddress.value || !selectedPaymentMethod.value) {
      ElMessage.error('Please complete all required fields')
      return null
    }

    try {
      isPlacingOrder.value = true
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Prepare shipping info with cart items
      const shippingInfo = {
        address: `${selectedAddress.value.street}, ${selectedAddress.value.city}, ${selectedAddress.value.state} ${selectedAddress.value.zipCode}`,
        paymentMethod: selectedPaymentMethod.value.id,
        items: cartItems.value.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          product: item.product
        }))
      }
      
      // Save order to localStorage via Pinia store
      const orderStore = useOrderStore()
      const order = orderStore.createOrder(total.value, shippingInfo)
      
      console.log('Order created:', order)
      
      // Clear the cart after successful order
      cartStore.clearCart()
      
      ElMessage.success('Your order has been placed successfully! You can track your order in the orders section.')
      
      // Return the actual order ID from the created order
      return order.id
    } catch (error) {
      console.error('Order placement failed:', error)
      ElMessage.error('Failed to place order. Please try again.')
      return null
    } finally {
      isPlacingOrder.value = false
    }
  }

  return {
    // State
    steps,
    currentStep,
    addresses,
    selectedAddressId,
    selectedAddress,
    showAddressForm,
    editingAddress,
    paymentMethods,
    selectedPaymentMethodId,
    selectedPaymentMethod,
    isPlacingOrder,
    voucherCode,
    cartItems,
    subtotal,
    shippingFee,
    total,
    canProceed,
    
    // Methods
    goToStep,
    goToNextStep,
    goToPreviousStep,
    addAddress,
    updateAddress,
    removeAddress,
    selectAddress,
    editAddress,
    selectPaymentMethod,
    placeOrder
  }
}
