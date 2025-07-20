
<template>
  <div class="checkout-container">
    <!-- Checkout Header with Steps -->
    <el-steps :active="currentStep" finish-status="success" align-center class="checkout-steps">
      <el-step title="Delivery" :description="currentStep > 1 ? 'Completed' : ''" />
      <el-step title="Payment" :description="currentStep > 2 ? 'Completed' : ''" />
      <el-step title="Review & Pay" :description="currentStep > 3 ? 'Completed' : ''" />
    </el-steps>

    <el-row :gutter="20" class="checkout-main">
      <!-- Left Column: Checkout Form -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card shadow="hover" class="checkout-card">
          <!-- Step 1: Delivery Address -->
          <div v-if="currentStep === 1">
            <h2>Delivery Address</h2>
            <el-row :gutter="20">
              <el-col 
                v-for="address in addresses" 
                :key="address.id" 
                :xs="24" 
                :sm="12" 
                :md="12" 
                class="address-col"
              >
                <el-card 
                  :class="['address-card', { 'active': selectedAddress === address.id }]"
                  shadow="hover"
                  @click="selectAddress(address.id)"
                >
                  <div class="address-header">
                    <h3>{{ address.name }}</h3>
                    <el-tag v-if="address.isDefault" type="success" size="small">Default</el-tag>
                  </div>
                  <p><el-icon><User /></el-icon> {{ address.name }}</p>
                  <p><el-icon><Phone /></el-icon> {{ address.phone }}</p>
                  <p><el-icon><Location /></el-icon> {{ address.street }}</p>
                  <p>{{ address.city }}, {{ address.province }} {{ address.postalCode }}</p>
                  <div class="address-actions">
                    <el-button type="text" @click.stop="editAddress(address)">
                      <el-icon><Edit /></el-icon> Edit
                    </el-button>
                    <el-button type="text" @click.stop="removeAddress(address.id)" v-if="!address.isDefault">
                      <el-icon><Delete /></el-icon> Remove
                    </el-button>
                  </div>
                </el-card>
              </el-col>
              
              <el-col :xs="24" :sm="12" :md="12" class="address-col">
                <el-card class="add-address-card" shadow="hover" @click="showAddAddress = true">
                  <el-icon :size="30"><Plus /></el-icon>
                  <p>Add New Address</p>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <!-- Step 2: Payment Method -->
          <div v-else-if="currentStep === 2">
            <h2>Select Payment Method</h2>
            <el-radio-group v-model="selectedPayment" class="payment-methods">
              <el-row :gutter="20">
                <el-col 
                  v-for="method in paymentMethods" 
                  :key="method.id" 
                  :xs="24" 
                  :sm="12" 
                  :md="12"
                  class="payment-col"
                >
                  <el-radio :label="method.id" class="payment-method">
                    <div class="payment-content">
                      <el-avatar :size="40" :src="method.icon" class="payment-icon" />
                      <div class="payment-info">
                        <h4>{{ method.name }}</h4>
                        <p class="payment-desc">{{ method.description }}</p>
                      </div>
                    </div>
                  </el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </div>

          <!-- Step 3: Review Order -->
          <div v-else-if="currentStep === 3">
            <h2>Review Your Order</h2>
            <div class="order-items">
              <el-card v-for="item in cartItems" :key="item.id" class="order-item" shadow="hover">
                <el-row :gutter="20" align="middle">
                  <el-col :span="6">
                    <el-image 
                      :src="item.product.images?.[0] || 'https://via.placeholder.com/100'" 
                      fit="cover" 
                      class="item-image"
                    />
                  </el-col>
                  <el-col :span="18">
                    <h4>{{ item.product.title }}</h4>
                    <p class="item-variation">Variation: {{ item.product.category || 'Default' }}</p>
                    <p class="item-quantity">Quantity: {{ item.quantity }}</p>
                    <p class="item-price">₱{{ (item.product.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</p>
                  </el-col>
                </el-row>
              </el-card>
            </div>

            <el-divider />
            
            <div class="delivery-address">
              <h3>Delivery Address</h3>
              <el-card shadow="never">
                <p><strong>{{ selectedAddressDetails.name }}</strong></p>
                <p>{{ selectedAddressDetails.phone }}</p>
                <p>{{ selectedAddressDetails.street }}</p>
                <p>{{ selectedAddressDetails.city }}, {{ selectedAddressDetails.province }} {{ selectedAddressDetails.postalCode }}</p>
              </el-card>
            </div>

            <el-divider />
            
            <div class="payment-method-review">
              <h3>Payment Method</h3>
              <el-card shadow="never">
                <div class="selected-payment">
                  <el-avatar :size="40" :src="selectedPaymentMethod.icon" class="payment-icon" />
                  <div class="payment-info">
                    <h4>{{ selectedPaymentMethod.name }}</h4>
                    <p class="payment-desc">{{ selectedPaymentMethod.description }}</p>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Right Column: Order Summary -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card shadow="hover" class="order-summary">
          <h3>Order Summary</h3>
          
          <el-descriptions :column="1" border class="summary-details">
            <el-descriptions-item>
              <template #label>
                Subtotal ({{ cartItems.length }} items)
              </template>
              ₱{{ subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                Shipping Fee
              </template>
              ₱{{ shippingFee.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}
            </el-descriptions-item>
            <el-descriptions-item class="total-row">
              <template #label>
                <strong>Total</strong>
              </template>
              <strong>₱{{ total.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</strong>
            </el-descriptions-item>
          </el-descriptions>

          <div class="voucher-section">
            <el-input 
              v-model="voucherCode" 
              placeholder="Enter Voucher Code"
              class="voucher-input"
            >
              <template #append>
                <el-button>Apply</el-button>
              </template>
            </el-input>
          </div>
          
          <el-button 
            type="primary" 
            class="place-order-btn"
            @click="handlePlaceOrder"
            :loading="isPlacingOrder"
            :disabled="!canProceed"
          >
            {{ currentStep === 3 ? 'Place Order' : 'Continue to ' + steps[currentStep] }}
          </el-button>
          
          <div v-if="currentStep > 1" class="back-button">
            <el-button text @click="goToPreviousStep">
              <el-icon><ArrowLeft /></el-icon> Back to {{ steps[currentStep - 2] }}
            </el-button>
          </div>
          
          <div class="secure-payment">
            <el-icon><Lock /></el-icon>
            <span>Secure Payment</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- Add/Edit Address Dialog -->
    <el-dialog 
      v-model="showAddAddress" 
      :title="editingAddress ? 'Edit Address' : 'Add New Address'"
      width="500px"
    >
      <el-form 
        :model="addressForm" 
        :rules="addressRules" 
        ref="addressFormRef"
        label-position="top"
      >
        <el-form-item label="Full Name" prop="name">
          <el-input v-model="addressForm.name" placeholder="Enter full name" />
        </el-form-item>
        
        <el-form-item label="Phone Number" prop="phone">
          <el-input v-model="addressForm.phone" placeholder="Enter phone number" />
        </el-form-item>
        
        <el-form-item label="Street Address" prop="street">
          <el-input 
            v-model="addressForm.street" 
            type="textarea" 
            :rows="2"
            placeholder="House/Unit/Floor, Building, Street Name"
          />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="City" prop="city">
              <el-input v-model="addressForm.city" placeholder="City" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Province" prop="province">
              <el-input v-model="addressForm.province" placeholder="Province" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="Postal Code" prop="postalCode">
          <el-input v-model="addressForm.postalCode" placeholder="Postal Code" />
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="addressForm.isDefault">Set as default address</el-checkbox>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddAddress = false">Cancel</el-button>
          <el-button type="primary" @click="saveAddress">
            {{ editingAddress ? 'Update' : 'Save' }} Address
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Lock, 
  Plus, 
  Check, 
  Location, 
  Phone, 
  User, 
  Edit, 
  Delete, 
  ArrowLeft 
} from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'

// Router
const router = useRouter()

// Cart Store
const cartStore = useCartStore()

// Steps configuration
const steps = ['Delivery', 'Payment', 'Review & Pay']
const currentStep = ref(1)

// Address Management
const showAddAddress = ref(false)
const editingAddress = ref<number | null>(null)
const selectedAddress = ref<number | null>(null)
const addressFormRef = ref()

const addressForm = ref({
  name: '',
  phone: '',
  street: '',
  city: '',
  province: '',
  postalCode: '',
  isDefault: false
})

const addressRules = {
  name: [
    { required: true, message: 'Please enter full name', trigger: 'blur' },
    { min: 3, message: 'Name must be at least 3 characters', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Please enter phone number', trigger: 'blur' },
    { pattern: /^[0-9+\-\s]+$/, message: 'Please enter a valid phone number', trigger: 'blur' }
  ],
  street: [
    { required: true, message: 'Please enter street address', trigger: 'blur' }
  ],
  city: [
    { required: true, message: 'Please enter city', trigger: 'blur' }
  ],
  province: [
    { required: true, message: 'Please enter province', trigger: 'blur' }
  ],
  postalCode: [
    { required: true, message: 'Please enter postal code', trigger: 'blur' },
    { pattern: /^[0-9]+$/, message: 'Postal code must be numeric', trigger: 'blur' }
  ]
}

const addresses = ref([
  {
    id: 1,
    name: 'John Doe',
    phone: '09123456789',
    street: '123 Main Street, Barangay 123',
    city: 'Manila',
    province: 'Metro Manila',
    postalCode: '1000',
    isDefault: true
  },
  {
    id: 2,
    name: 'John Doe',
    phone: '09123456789',
    street: '456 Secondary Road, Barangay 456',
    city: 'Quezon City',
    province: 'Metro Manila',
    postalCode: '1100',
    isDefault: false
  }
])

// Payment Methods
const paymentMethods = ref([
  {
    id: 'cod',
    name: 'Cash on Delivery',
    icon: 'https://via.placeholder.com/40',
    description: 'Pay with cash upon delivery'
  },
  {
    id: 'gcash',
    name: 'GCash',
    icon: 'https://via.placeholder.com/40',
    description: 'Pay using GCash'
  },
  {
    id: 'credit_card',
    name: 'Credit/Debit Card',
    icon: 'https://via.placeholder.com/40',
    description: 'Pay using Visa, Mastercard, etc.'
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: 'https://via.placeholder.com/40',
    description: 'Pay via bank transfer'
  }
])

const selectedPayment = ref('cod')

// Voucher
const voucherCode = ref('')

// Order Status
const isPlacingOrder = ref(false)

// Computed Properties
const cartItems = computed(() => cartStore.cartItems)

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity)
  }, 0)
})

const shippingFee = computed(() => {
  // Simple shipping fee calculation
  return subtotal.value > 0 ? 50 : 0
})

const total = computed(() => {
  return subtotal.value + shippingFee.value
})

const selectedAddressDetails = computed(() => {
  return addresses.value.find(addr => addr.id === selectedAddress.value) || {}
})

const selectedPaymentMethod = computed(() => {
  return paymentMethods.value.find(method => method.id === selectedPayment.value) || {}
})

const canProceed = computed(() => {
  if (currentStep.value === 1) return selectedAddress.value !== null
  if (currentStep.value === 2) return selectedPayment.value !== ''
  return true
})

// Methods
const selectAddress = (addressId) => {
  selectedAddress.value = addressId
  if (currentStep.value === 1) {
    goToNextStep()
  }
}

const editAddress = (address: any) => {
  editingAddress.value = address.id
  addressForm.value = { ...address }
  showAddAddress.value = true
}

const removeAddress = async (addressId: any) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this address?',
      'Delete Address',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    
    const index = addresses.value.findIndex(addr => addr.id === addressId)
    if (index > -1) {
      // If deleting the selected address, clear the selection
      if (selectedAddress.value === addressId) {
        selectedAddress.value = null
      }
      addresses.value.splice(index, 1)
      ElMessage.success('Address deleted successfully')
    }
  } catch (error) {
    // User cancelled
  }
}

const saveAddress = async () => {
  try {
    await addressFormRef.value.validate()
    
    if (editingAddress.value) {
      // Update existing address
      const index = addresses.value.findIndex(addr => addr.id === editingAddress.value)
      if (index > -1) {
        // If setting as default, unset other defaults
        if (addressForm.value.isDefault) {
          addresses.value.forEach(addr => { addr.isDefault = false })
        }
        addresses.value[index] = { ...addressForm.value, id: editingAddress.value }
      }
      ElMessage.success('Address updated successfully')
    } else {
      // Add new address
      const newAddress = {
        id: Date.now(), // Generate a unique ID
        ...addressForm.value
      }
      
      // If setting as default, unset other defaults
      if (newAddress.isDefault) {
        addresses.value.forEach(addr => { addr.isDefault = false })
      }
      
      addresses.value.push(newAddress)
      
      // If this is the first address, select it
      if (addresses.value.length === 1) {
        selectedAddress.value = newAddress.id
      }
      
      ElMessage.success('Address added successfully')
    }
    
    showAddAddress.value = false
    resetAddressForm()
  } catch (error) {
    // Validation will handle the error message
  }
}

const resetAddressForm = () => {
  addressForm.value = {
    name: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    isDefault: false
  }
  editingAddress.value = null
}

const selectPayment = (paymentId) => {
  selectedPayment.value = paymentId
  if (currentStep.value === 2) {
    goToNextStep()
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

const handlePlaceOrder = async () => {
  if (currentStep.value === 3) {
    // Place order logic
    try {
      isPlacingOrder.value = true
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Navigate to order confirmation page
      const orderId = 'ORD' + Math.floor(100000 + Math.random() * 900000)
      router.push({ 
        name: 'order-confirmation', 
        query: { orderId }
      })
      
      // Clear cart after successful order
      cartStore.clearCart()
      
      ElMessage.success('Your order has been placed successfully!')
    } catch (error) {
      console.error('Order placement failed:', error)
      ElMessage.error('Failed to place order. Please try again.')
    } finally {
      isPlacingOrder.value = false
    }
  } else {
    goToNextStep()
  }
}

// Lifecycle Hooks
onMounted(() => {
  // Set default address if available
  const defaultAddress = addresses.value.find(addr => addr.isDefault)
  if (defaultAddress) {
    selectedAddress.value = defaultAddress.id
  }
})
</script>

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.checkout-steps {
  margin-bottom: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.checkout-main {
  margin-top: 20px;
}

.checkout-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.checkout-card h2 {
  margin-top: 0;
  color: #333;
  font-size: 20px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

/* Address Cards */
.address-col {
  margin-bottom: 20px;
}

.address-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.address-card:hover,
.address-card.active {
  border-color: #409EFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.address-card.active {
  border-color: #409EFF;
  background-color: #f5f9ff;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.address-card h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.address-card p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.address-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.add-address-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #409EFF;
  border: 2px dashed #c0c4cc;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 180px;
}

.add-address-card:hover {
  border-color: #409EFF;
  color: #409EFF;
  transform: translateY(-2px);
}

.add-address-card p {
  margin-top: 10px;
  font-weight: 500;
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-col {
  margin-bottom: 15px;
}

.payment-method {
  width: 100%;
  margin: 0;
  padding: 0;
  height: auto;
  display: block;
}

.payment-method :deep(.el-radio__input) {
  display: none;
}

.payment-method :deep(.el-radio__label) {
  padding: 0;
  width: 100%;
}

.payment-content {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.payment-method :deep(.el-radio.is-checked + .el-radio__label .payment-content) {
  border-color: #409EFF;
  background-color: #f5f9ff;
}

.payment-icon {
  margin-right: 15px;
  background: #f5f7fa;
  padding: 5px;
  border-radius: 4px;
}

.payment-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #333;
}

.payment-desc {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

/* Order Summary */
.order-summary {
  position: sticky;
  top: 20px;
}

.order-summary h3 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.summary-details {
  margin: 20px 0;
}

:deep(.el-descriptions__label) {
  width: 70%;
}

:deep(.el-descriptions__content) {
  text-align: right;
  font-weight: 500;
}

.total-row :deep(.el-descriptions__label),
.total-row :deep(.el-descriptions__content) {
  font-weight: bold;
  color: #333;
  font-size: 16px;
}

.voucher-section {
  margin: 20px 0;
}

.place-order-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  margin: 10px 0;
}

.back-button {
  text-align: center;
  margin: 15px 0;
}

.secure-payment {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  color: #67C23A;
  font-size: 14px;
}

.secure-payment .el-icon {
  font-size: 16px;
}

/* Order Items */
.order-items {
  margin-bottom: 20px;
}

.order-item {
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.order-item:last-child {
  margin-bottom: 0;
}

.item-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.order-item h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.item-variation,
.item-quantity {
  margin: 2px 0;
  font-size: 13px;
  color: #909399;
}

.item-price {
  margin: 8px 0 0 0;
  font-weight: 600;
  color: #F56C6C;
  font-size: 15px;
}

.delivery-address,
.payment-method-review {
  margin: 25px 0;
}

.delivery-address h3,
.payment-method-review h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.selected-payment {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Responsive */
@media (max-width: 768px) {
  .checkout-steps {
    display: none;
  }
  
  .checkout-main {
    margin-top: 10px;
  }
  
  .address-col,
  .payment-col {
    margin-bottom: 15px;
  }
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>