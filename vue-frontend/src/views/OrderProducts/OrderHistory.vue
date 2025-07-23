<template>
  <div class="order-history-container">
    <div class="order-header">
      <h1>My Orders</h1>
      <el-tabs v-model="activeStatus" @tab-change="filterOrders">
        <el-tab-pane v-for="status in orderStatuses" :key="status.value" :label="status.label" :name="status.value" />
      </el-tabs>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <div v-else-if="filteredOrders.length === 0" class="empty-orders">
      <el-empty description="No orders found" />
    </div>

    <div v-else class="orders-list">
      <el-card 
        v-for="order in filteredOrders" 
        :key="order.id" 
        :id="`order-${order.id}`"
        class="order-card"
      >
        <div class="order-card-header">
          <div class="order-info">
            <div class="order-number">Order #{{ order.id }}</div>
            <div class="order-date">Placed on {{ formatDate(order.created_at) }}</div>
          </div>
          <div class="order-header-actions">
            <div class="order-status">
              <el-tag :type="getStatusType(order.status)" effect="plain">
                {{ formatStatus(order.status) }}
              </el-tag>
            </div>
            <el-dropdown trigger="click" @command="handleCommand($event, order)">
              <el-button type="text" class="meatball-menu" @click.stop>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="view">
                    <el-icon><View /></el-icon> View Details
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided class="delete-action">
                    <el-icon><Delete /></el-icon> Delete Order
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <el-divider />

        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <el-image 
              :src="item.product.images?.[0] || '/placeholder-image.jpg'" 
              fit="cover" 
              class="product-image" 
            />
            <div class="item-details">
              <h4>{{ item.product.title }}</h4>
              <div class="item-meta">
                <span class="price">₱{{ item.price.toFixed(2) }}</span>
                <span class="quantity">x{{ item.quantity }}</span>
              </div>
              <div v-if="order.status === 'shipped'" class="tracking-info">
                <el-tooltip :content="getTrackingStatus(order)" placement="top">
                  <el-button type="text" size="small" @click="showTrackingDetails(order)">
                    <el-icon><LocationInformation /></el-icon>
                    Track Order
                  </el-button>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <div class="order-total">
            Total: <span>₱{{ order.total_amount.toFixed(2) }}</span>
          </div>
          <div class="order-actions">
            <el-button v-if="order.status === 'pending'" type="danger" plain @click="cancelOrder(order)">
              Cancel Order
            </el-button>
            <el-button v-if="order.payment_status === 'pending' && order.status === 'pending'" type="primary" @click="payNow(order)">
              Pay Now
            </el-button>
            <el-button v-if="order.status === 'delivered'" type="success" @click="buyAgain(order)">
              Buy Again
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Tracking Dialog -->
    <el-dialog v-model="showTrackingDialog" title="Order Tracking" width="600px">
      <div v-if="selectedOrder" class="tracking-container">
        <el-steps :active="getTrackingStep(selectedOrder.status)" finish-status="success" process-status="process">
          <el-step title="Order Placed" :description="formatDate(selectedOrder.created_at)" />
          <el-step title="Processing" description="Preparing your order" />
          <el-step title="Shipped" :description="selectedOrder.shipped_at ? formatDate(selectedOrder.shipped_at) : 'In transit'" />
          <el-step title="Delivered" :description="selectedOrder.delivered_at ? formatDate(selectedOrder.delivered_at) : 'On the way'" />
        </el-steps>

        <div class="tracking-details">
          <h4>Shipping Details</h4>
          <p><strong>Tracking Number:</strong> {{ selectedOrder.tracking_number || 'Not available' }}</p>
          <p><strong>Shipping Address:</strong> {{ selectedOrder.shipping_address }}</p>
          <p><strong>Estimated Delivery:</strong> {{ getEstimatedDelivery(selectedOrder) }}</p>
        </div>
      </div>
    </el-dialog>

    <!-- Order Details Dialog -->
    <el-dialog 
      v-model="showOrderDetails" 
      :title="`Order #${selectedOrder?.id}`" 
      width="800px"
      :before-close="closeOrderDetails"
    >
      <div v-if="selectedOrder" class="order-details">
        <!-- Order Status -->
        <div class="order-status-section">
          <h3>Order Status</h3>
          <el-select 
            v-model="selectedOrder.status" 
            placeholder="Select status"
            @change="updateOrderStatus(selectedOrder)"
            class="status-selector"
          >
            <el-option
              v-for="status in orderStatuses.filter(s => s.value !== 'all')"
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
              :timestamp="getTimelineTimestamp(step, selectedOrder)"
            >
              {{ step.label }}
            </el-timeline-item>
          </el-timeline>
        </div>

        <!-- Order Items -->
        <div class="order-items-section">
          <h3>Order Items</h3>
          <div class="order-items-list">
            <div v-for="item in selectedOrder.items" :key="item.id" class="order-item-detail">
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
                @click="removeOrderItem(selectedOrder, item)"
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
            <span>₱{{ calculateSubtotal(selectedOrder).toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>₱{{ (selectedOrder.shipping || 0).toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>₱{{ selectedOrder.total_amount.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Order Information -->
        <div class="order-info-section">
          <div class="shipping-info">
            <h3>Shipping Information</h3>
            <p>{{ selectedOrder.shipping_address }}</p>
            <p v-if="selectedOrder.tracking_number">
              <strong>Tracking Number:</strong> {{ selectedOrder.tracking_number }}
            </p>
          </div>
          <div class="payment-info">
            <h3>Payment Information</h3>
            <p><strong>Method:</strong> {{ formatPaymentMethod(selectedOrder.payment_method) }}</p>
            <p><strong>Status:</strong> {{ selectedOrder.payment_status }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { LocationInformation, MoreFilled, View, Delete } from '@element-plus/icons-vue'
import { useOrderStore } from '@/stores/order'
import type { Order, OrderItem, OrderWithItems } from '@/types/api'

const router = useRouter()
const route = useRoute()
const orderStore = useOrderStore()

// Component state
const loading = ref(true)
const activeOrderId = ref<string | null>(null)

// Handle meatball menu commands
const handleCommand = async (command: string, order: OrderWithItems) => {
  if (command === 'view') {
    // Set the selected order and show the details dialog
    selectedOrder.value = { ...order }
    showOrderDetails.value = true
    
    // Update URL with orderId
    router.push({ 
      path: '/order-history', 
      query: { orderId: order.id } 
    })
  } else if (command === 'delete') {
    try {
      await ElMessageBox.confirm(
        'Are you sure you want to delete this order? This action cannot be undone.',
        'Delete Order',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning',
          confirmButtonClass: 'el-button--danger',
        }
      )
      // Call the store action to delete the order
      await orderStore.deleteOrder(order.id)
      ElMessage.success('Order deleted successfully')
    } catch (error) {
      // User cancelled or error occurred
      if (error !== 'cancel') {
        console.error('Error deleting order:', error)
        ElMessage.error('Failed to delete order. Please try again.')
      }
    }
  }
}
const activeStatus = ref('all')
const showTrackingDialog = ref(false)
const showOrderDetails = ref(false)
const selectedOrder = ref<OrderWithItems | null>(null)

// Order timeline for the status tracker
const orderTimeline = [
  { status: 'pending', label: 'Order Placed' },
  { status: 'processing', label: 'Processing' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' }
]

// Use computed to get orders from store
const orders = computed(() => orderStore.orders)

// Order statuses for filtering
const orderStatuses = [
  { label: 'All Orders', value: 'all' },
  { label: 'To Pay', value: 'pending' },
  { label: 'To Ship', value: 'processing' },
  { label: 'To Receive', value: 'shipped' },
  { label: 'Completed', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

// Fetch orders from store
const fetchOrders = async () => {
  try {
    loading.value = true
    console.log('Fetching orders...')
    
    // Fetch orders from the store
    await orderStore.fetchOrderHistory()
    
    console.log('Orders fetched:', orders.value)
    
    // If we came from checkout with a new order ID, scroll to it
    const orderId = route.query.orderId as string
    if (orderId) {
      console.log('Looking for order with ID:', orderId)
      
      // Wait for DOM to update
      await nextTick()
      
      // Small delay to ensure the DOM is fully rendered
      setTimeout(() => {
        // Try to find the order in our data first
        const targetOrder = orders.value.find(order => order.id === orderId)
        if (targetOrder) {
          console.log('Found target order:', targetOrder)
          ElMessage.success(`Order ${orderId} has been placed successfully!`)
        }
        
        // Try to scroll to the order element
        const orderElement = document.getElementById(`order-${orderId}`)
        if (orderElement) {
          orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          console.log('Scrolled to order element')
        } else {
          console.log('Order element not found in DOM')
        }
        
        // Remove the orderId from URL after processing
        router.replace({ query: {} })
      }, 1000)
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    ElMessage.error('Failed to load orders. Please try again.')
  } finally {
    loading.value = false
  }
}

// Filter orders based on active status
const filteredOrders = computed(() => {
  console.log('Filtering orders. Active status:', activeStatus.value, 'Orders:', orders.value)
  if (activeStatus.value === 'all') return orders.value
  return orders.value.filter(order => order.status === activeStatus.value)
})

// Format date for display
const formatDate = (date: Date | string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Close order details dialog
const closeOrderDetails = () => {
  showOrderDetails.value = false
  // Remove orderId from URL when closing the dialog
  router.replace({ query: {} })
}

// Update order status
const updateOrderStatus = async (order: OrderWithItems) => {
  try {
    await orderStore.updateOrderStatus(order.id, order.status)
    ElMessage.success('Order status updated successfully')
  } catch (error) {
    console.error('Error updating order status:', error)
    ElMessage.error('Failed to update order status')
  }
}

// Remove item from order
const removeOrderItem = async (order: OrderWithItems, item: OrderItem) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to remove this item from the order?',
      'Remove Item',
      {
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
      }
    )
    
    // In a real app, this would be an API call
    const itemIndex = order.items.findIndex(i => i.id === item.id)
    if (itemIndex !== -1) {
      order.items.splice(itemIndex, 1)
      
      // Update order total
      order.total_amount = calculateSubtotal(order) + (order.shipping || 0)
      
      // Save changes to the store
      orderStore.saveToLocalStorage()
      
      ElMessage.success('Item removed from order')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error removing item:', error)
      ElMessage.error('Failed to remove item')
    }
  }
}

// Calculate subtotal for order items
const calculateSubtotal = (order: OrderWithItems) => {
  return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}

// Format payment method for display
const formatPaymentMethod = (method: string) => {
  if (!method) return 'N/A'
  return method
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Get timeline item type based on order status
const getTimelineItemType = (step: { status: string }, index: number) => {
  if (!selectedOrder.value) return 'primary' as const
  
  const currentStepIndex = orderTimeline.findIndex(s => s.status === selectedOrder.value?.status)
  
  if (index < currentStepIndex) return 'success' as const
  if (index === currentStepIndex) return 'primary' as const
  return 'info' as const
}

// Get timeline timestamp
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

// Format status for display
const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'To Pay',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  }
  return statusMap[status] || status
}

// Get status type for tag color
const getStatusType = (status: string) => {
  const typeMap = {
    pending: 'warning',
    processing: 'primary',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger'
  } as const
  return typeMap[status as keyof typeof typeMap] || ''
}

// Get tracking step based on status
const getTrackingStep = (status: string) => {
  const stepMap: Record<string, number> = {
    pending: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
    cancelled: 0
  }
  return stepMap[status] || 0
}

// Get tracking status message
const getTrackingStatus = (order: Order) => {
  if (order.status === 'shipped' && order.shipped_at) {
    return `Shipped on ${formatDate(order.shipped_at)}`
  } else if (order.status === 'delivered' && order.delivered_at) {
    return `Delivered on ${formatDate(order.delivered_at)}`
  }
  return 'Track your order'
}

// Get estimated delivery date
const getEstimatedDelivery = (order: Order) => {
  if (!order.shipped_at) return 'Not available'
  const shippedDate = new Date(order.shipped_at)
  const estimatedDate = new Date(shippedDate)
  estimatedDate.setDate(shippedDate.getDate() + 3) // Assuming 3 days delivery time
  return estimatedDate.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

// Show tracking details
const showTrackingDetails = (order: OrderWithItems) => {
  selectedOrder.value = order
  showTrackingDialog.value = true
}

// Cancel order
const cancelOrder = async (order: OrderWithItems) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to cancel this order?',
      'Cancel Order',
      {
        confirmButtonText: 'Yes, Cancel',
        cancelButtonText: 'No, Keep It',
        type: 'warning'
      }
    )
    
    // Update order status using the store method
    orderStore.updateOrderStatus(order.id, 'cancelled')
    
    ElMessage.success('Order has been cancelled')
  } catch (error) {
    // User cancelled the action
  }
}

// Pay for order
const payNow = (order: OrderWithItems) => {
  // TODO: Implement payment flow
  ElMessage.info('Redirecting to payment...')
  console.log('Processing payment for order:', order.id)
}

// Buy again
const buyAgain = (order: OrderWithItems) => {
  // TODO: Add items to cart
  ElMessage.success('Items added to cart')
  console.log('Adding items to cart:', order.items)
}

// Filter orders when status changes
const filterOrders = () => {
  console.log('Filtering orders by status:', activeStatus.value)
}

// Fetch orders on component mount
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.order-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meatball-menu {
  padding: 4px;
  margin-left: 4px;
  color: #606266;
  transition: all 0.3s;
}

.meatball-menu:hover {
  color: #409EFF;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.delete-action {
  color: #F56C6C;
}

.delete-action:hover {
  color: #fff;
  background-color: #F56C6C;
}

/* Order Details Dialog Styles */
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

.order-history-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.order-header {
  margin-bottom: 30px;
}

.order-header h1 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.order-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: var(--el-bg-color-page);
}

.order-info .order-number {
  font-weight: 600;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.order-info .order-date {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.order-items {
  padding: 0 20px;
}

.order-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid var(--el-border-color-light);
}

.order-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-right: 15px;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.item-meta {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.price {
  font-weight: 600;
  color: var(--el-color-primary);
  margin-right: 15px;
}

.quantity {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.tracking-info {
  margin-top: 8px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: var(--el-bg-color-page);
  border-top: 1px solid var(--el-border-color-light);
}

.order-total {
  font-size: 16px;
  font-weight: 600;
}

.order-total span {
  color: var(--el-color-primary);
  margin-left: 5px;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.tracking-container {
  padding: 0 10px;
}

.tracking-details {
  margin-top: 30px;
  padding: 20px;
  background-color: var(--el-bg-color-page);
  border-radius: 4px;
}

.tracking-details h4 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
}

.tracking-details p {
  margin: 8px 0;
  color: var(--el-text-color-regular);
}

.empty-orders {
  text-align: center;
  padding: 40px 0;
}

.loading-container {
  padding: 30px 0;
}

/* Responsive styles */
@media (max-width: 768px) {
  .order-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .order-footer {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .order-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .order-item {
    flex-direction: column;
  }
  
  .product-image {
    width: 100%;
    height: 200px;
    margin-bottom: 10px;
  }
}
</style>