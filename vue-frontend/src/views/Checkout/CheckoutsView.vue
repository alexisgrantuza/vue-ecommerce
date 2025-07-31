<template>
  <div class="checkout-container">
    <CheckoutSteps :current-step="currentStep" :steps="steps" />

    <el-row :gutter="20" class="checkout-main">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card shadow="hover" class="checkout-card">
          <div v-if="currentStep === 1">
            <AddressList
              :addresses="addresses"
              :selected-address-id="selectedAddressId"
              @update:selected-address-id="selectAddress"
              @add="handleAddAddress"
              @update="handleUpdateAddress"
              @remove="handleRemoveAddress"
            />
          </div>

          <div v-else-if="currentStep === 2">
            <PaymentMethodSelector
              :payment-methods="paymentMethods"
              :selected-method-id="selectedPaymentMethodId"
              @update:selected-method-id="selectPaymentMethod"
            />
          </div>

          <div v-else-if="currentStep === 3">
            <h2>Review Your Order</h2>
            <div class="order-items">
              <OrderItem
                v-for="item in cartItems"
                :key="item.product.id"
                :item="{
                  id: item.product.id,
                  product: {
                    id: item.product.id,
                    title: item.product.title || '',
                    price: item.product.price || 0,
                    images: item.product.images || [],
                    category: item.product.category || { id: 0, name: 'Uncategorized' },
                  },
                  quantity: item.quantity,
                }"
              />
            </div>

            <el-divider />

            <div class="delivery-address">
              <h3>Delivery Address</h3>
              <el-card shadow="never" v-if="selectedAddress">
                <p>
                  <strong>{{ selectedAddress.street }}</strong>
                </p>
                <p>
                  {{ selectedAddress.city }}, {{ selectedAddress.state }}
                  {{ selectedAddress.zipCode }}
                </p>
              </el-card>
            </div>

            <el-divider />

            <div class="voucher-code">
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

      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <OrderSummary
          :subtotal="subtotal"
          :shipping-fee="shippingFee"
          :item-count="cartItems.length"
          @voucher-applied="handleVoucherApplied"
        >
          <template #actions>
            <el-button
              v-if="currentStep < steps.length"
              type="primary"
              class="action-button"
              :disabled="!canProceed"
              @click="goToNextStep"
              :loading="isPlacingOrder"
            >
              Continue to {{ steps[currentStep] }}
            </el-button>

            <el-button
              v-else
              type="primary"
              class="action-button"
              :loading="isPlacingOrder"
              :disabled="!canProceed"
              @click="handlePlaceOrder"
            >
              Place Order
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
          </template>
        </OrderSummary>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Lock, ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useCheckout } from '@/composables/useCheckout'
import CheckoutSteps from '@/views/Checkout/_components/shared/CheckoutSteps.vue'
import AddressList from '@/views/Checkout/_components/address/AddressList.vue'
import PaymentMethodSelector from '@/views/Checkout/_components/payment/PaymentMethodSelector.vue'
import OrderItem from '@/views/Checkout/_components/Order/OrderItem.vue'
import OrderSummary from '@/views/Checkout/_components/Order/OrderSummary.vue'
import type { Address } from '@/types/api'

const router = useRouter()

const {
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
  cartItems,
  subtotal,
  shippingFee,
  canProceed,

  // Methods
  goToNextStep,
  goToPreviousStep,
  addAddress,
  updateAddress,
  removeAddress,
  selectAddress,
  selectPaymentMethod,
  placeOrder,
} = useCheckout()

// Handle address form submission
const handleAddressSubmit = async (addressData: Omit<Address, 'id'>) => {
  if (editingAddress.value) {
    updateAddress({
      ...addressData,
      id: editingAddress.value.id,
    })
    ElMessage.success('Address updated successfully')
  } else {
    const newAddress = addAddress(addressData)
    selectAddress(newAddress.id)
    ElMessage.success('Address added successfully')
  }

  showAddressForm.value = false
}

const handleAddAddress = (addressData: Omit<Address, 'id'>) => {
  const newAddress = addAddress(addressData)
  selectAddress(newAddress.id)
}

const handleUpdateAddress = (address: Address) => {
  updateAddress(address)
}

const handleRemoveAddress = (id: number) => {
  removeAddress(id)
}

const handleVoucherApplied = (code: string) => {
  console.log('Voucher applied:', code)
  ElMessage.success(`Voucher code "${code}" applied successfully`)
}

const handlePlaceOrder = async () => {
  const orderId = await placeOrder()
  if (orderId) {
    router.push({
      name: 'order-history',
      query: { orderId },
    })
  }
}

// Lifecycle hooks
onMounted(() => {
  if (addresses.value.length > 0 && !selectedAddressId.value) {
    selectAddress(addresses.value[0].id)
  }
})
</script>

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.checkout-main {
  margin-top: 20px;
}

.checkout-card {
  margin-bottom: 20px;
}

.order-items {
  margin-bottom: 24px;
}

.delivery-address,
.payment-method-review {
  margin-bottom: 24px;
}

.delivery-address h3,
.payment-method-review h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.2rem;
  color: var(--el-text-color-primary);
}

.selected-payment {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-icon {
  flex-shrink: 0;
  background-color: #fff;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid var(--el-border-color);
}

.payment-info h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
}

.payment-desc {
  margin: 0;
  font-size: 0.85rem;
  color: var(--el-text-color-secondary);
}

.action-button {
  width: 100%;
  margin-bottom: 15px;
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
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--el-border-color);
  color: var(--el-text-color-secondary);
  font-size: 0.85rem;
}

.secure-payment .el-icon {
  color: var(--el-color-success);
}

@media (max-width: 768px) {
  .checkout-container {
    padding: 10px;
  }

  .checkout-main {
    margin-top: 10px;
  }

  .checkout-card {
    margin-bottom: 15px;
  }
}
</style>
