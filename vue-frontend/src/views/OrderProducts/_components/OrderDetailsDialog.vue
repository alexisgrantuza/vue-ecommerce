<template>
  <el-dialog
    v-model="visible"
    :title="`Order #${order?.id}`"
    width="800px"
    :before-close="handleClose"
  >
    <div v-if="order" class="order-details">
      <!-- Order Status -->
      <div class="order-status-section">
        <h3>Order Status</h3>
        <el-select
          v-model="order.status"
          placeholder="Select status"
          @change="updateOrderStatus"
          class="status-selector"
        >
          <el-option
            v-for="status in orderStatuses.filter((s) => s.value !== 'all')"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>

        <el-timeline class="timeline">
          <el-timeline-item
            v-for="(step, index) in orderTimeline"
            :key="index"
            :type="getTimelineItemType(step, index)"
            :timestamp="getTimelineTimestamp(step, order)"
          >
            {{ step.label }}
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- Order Items -->
      <div class="order-items-section">
        <h3>Order Items</h3>
        <div class="order-items-list">
          <div v-for="item in order.items" :key="item.id" class="order-item-detail">
            <el-image
              :src="item.product.images?.[0] || '/placeholder-image.jpg'"
              class="product-image"
              fit="cover"
            />
            <div class="item-details">
              <h4>{{ item.product.title }}</h4>
              <p class="item-sku">SKU: {{ item.product.id || 'N/A' }}</p>
              <div class="item-meta">
                <span class="price">₱{{ item.price.toFixed(2) }}</span>
                <span class="quantity">x{{ item.quantity }}</span>
                <span class="subtotal">₱{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              circle
              @click="removeItem(item)"
              class="remove-item-btn"
            />
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal</span>
          <span>₱{{ calculateSubtotal(order).toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span>₱{{ (order.shipping || 0).toFixed(2) }}</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>₱{{ order.total_amount.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Order Information -->
      <div class="order-info-section">
        <div class="shipping-info">
          <h3>Shipping Information</h3>
          <p>{{ order.shipping_address }}</p>
          <p v-if="order.tracking_number">
            <strong>Tracking Number:</strong> {{ order.tracking_number }}
          </p>
        </div>
        <div class="payment-info">
          <h3>Payment Information</h3>
          <p><strong>Method:</strong> {{ formatPaymentMethod(order.payment_method) }}</p>
          <p><strong>Status:</strong> {{ order.payment_status }}</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import type { OrderWithItems, OrderItem } from '@/types/api'
import { useOrderStore } from '@/stores/order'
import { orderStatuses, orderTimeline } from '@/constants/index'

const orderStore = useOrderStore()

const props = defineProps<{
  modelValue: boolean
  order: OrderWithItems | null
}>()

const emit = defineEmits(['update:modelValue', 'order-updated'])

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const localOrder = ref<OrderWithItems | null>(null)

watch(
  () => props.order,
  (newOrder) => {
    if (newOrder) {
      localOrder.value = JSON.parse(JSON.stringify(newOrder))
    }
  },
  { immediate: true },
)

const calculateSubtotal = (order: OrderWithItems) => {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

const formatDate = (date: Date | string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatPaymentMethod = (method: string) => {
  if (!method) return 'N/A'
  return method
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const getTimelineItemType = (step: { status: string }, index: number) => {
  if (!localOrder.value) return 'primary'
  const currentStepIndex = orderTimeline.findIndex((s) => s.status === localOrder.value?.status)
  if (index < currentStepIndex) return 'success'
  if (index === currentStepIndex) return 'primary'
  return 'info'
}

const getTimelineTimestamp = (step: { status: string }, order: OrderWithItems) => {
  switch (step.status) {
    case 'pending':
      return formatDate(order.created_at)
    case 'shipped':
      return order.shipped_at ? formatDate(order.shipped_at) : ''
    case 'delivered':
      return order.delivered_at ? formatDate(order.delivered_at) : ''
    default:
      return ''
  }
}

const updateOrderStatus = async () => {
  if (!localOrder.value) return

  try {
    orderStore.updateOrderStatus(localOrder.value.id, localOrder.value.status)
    ElMessage.success('Order status updated successfully')
    emit('order-updated')
  } catch (error) {
    console.error('Error updating order status:', error)
    ElMessage.error('Failed to update order status')
  }
}

const removeItem = async (item: OrderItem) => {
  if (!localOrder.value) return

  try {
    await ElMessageBox.confirm(
      'Are you sure you want to remove this item from the order?',
      'Remove Item',
      {
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
      },
    )

    const itemIndex = localOrder.value.items.findIndex((i) => i.id === item.id)
    if (itemIndex !== -1) {
      localOrder.value.items.splice(itemIndex, 1)
      localOrder.value.total_amount =
        calculateSubtotal(localOrder.value) + (localOrder.value.shipping || 0)

      orderStore.updateOrderStatus(localOrder.value.id, localOrder.value.status)

      ElMessage.success('Item removed from order')
      emit('order-updated')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error removing item:', error)
      ElMessage.error('Failed to remove item')
    }
  }
}

const handleClose = (done: () => void) => {
  if (localOrder.value && JSON.stringify(localOrder.value) !== JSON.stringify(props.order)) {
    ElMessageBox.confirm('You have unsaved changes. Are you sure you want to close?', 'Confirm', {
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      type: 'warning',
    })
      .then(() => {
        done()
      })
      .catch(() => {})
  } else {
    done()
  }
}
</script>

<style scoped>
.order-details {
  padding: 0 10px;
}

.order-status-section {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.status-selector {
  margin: 16px 0;
  width: 200px;
}

.timeline {
  margin-top: 20px;
  padding-left: 10px;
}

.order-items-section {
  margin: 24px 0;
}

.order-items-list {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}

.order-item-detail {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  align-items: flex-start;
  position: relative;
}

.order-item-detail:last-child {
  border-bottom: none;
}

.order-item-detail .product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-right: 16px;
  flex-shrink: 0;
}

.order-item-detail .item-details {
  flex-grow: 1;
}

.order-item-detail h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
}

.item-sku {
  color: #909399;
  font-size: 13px;
  margin: 0 0 8px;
}

.item-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 8px;
}

.item-meta .price {
  font-weight: 600;
  color: #f56c6c;
}

.item-meta .subtotal {
  margin-left: auto;
  font-weight: 600;
}

.remove-item-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.remove-item-btn:hover {
  opacity: 1;
}

.order-summary {
  margin: 24px 0;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px dashed #dcdfe6;
}

.summary-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
  padding-top: 8px;
  border-top: 1px solid #dcdfe6;
}

.summary-row.total {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.order-info-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

.shipping-info,
.payment-info {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.shipping-info h3,
.payment-info h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 16px;
  color: #303133;
}

.shipping-info p,
.payment-info p {
  margin: 8px 0;
  color: #606266;
  font-size: 14px;
}

@media (max-width: 768px) {
  .order-info-section {
    grid-template-columns: 1fr;
  }

  .order-item-detail {
    flex-direction: column;
  }

  .product-image {
    width: 100%;
    height: 200px;
    margin-bottom: 10px;
  }
}
</style>
