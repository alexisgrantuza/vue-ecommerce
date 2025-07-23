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
      <el-card v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-card-header">
          <div class="order-info">
            <div class="order-number">Order #{{ order.id }}</div>
            <div class="order-date">Placed on {{ formatDate(order.created_at) }}</div>
          </div>
          <div class="order-status">
            <el-tag :type="getStatusType(order.status)" effect="plain">
              {{ formatStatus(order.status) }}
            </el-tag>
          </div>
        </div>

        <el-divider />

        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <el-image :src="item.product.images[0]" fit="cover" class="product-image" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { LocationInformation } from '@element-plus/icons-vue'
import type { Order, OrderItem, OrderWithItems } from '@/types/api'

// Mock data - Replace with actual API calls
const loading = ref(true)
const orders = ref<OrderWithItems[]>([])
const activeStatus = ref('all')
const showTrackingDialog = ref(false)
const selectedOrder = ref<OrderWithItems | null>(null)

// Order statuses for filtering
const orderStatuses = [
  { label: 'All Orders', value: 'all' },
  { label: 'To Pay', value: 'pending' },
  { label: 'To Ship', value: 'processing' },
  { label: 'To Receive', value: 'shipped' },
  { label: 'Completed', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

// Fetch orders from API
const fetchOrders = async () => {
  try {
    loading.value = true
    // TODO: Replace with actual API call
    // const response = await api.get('/api/orders')
    // orders.value = response.data
    
    // Mock data - remove this in production
    setTimeout(() => {
      const mockProduct1 = {
        id: 101,
        title: 'Wireless Earbuds Pro',
        description: 'High-quality wireless earbuds with noise cancellation',
        price: 1099.99,
        category: { id: 1, name: 'Electronics' },
        images: ['https://via.placeholder.com/150'],
        is_active: true,
        rating: 4.5,
        num_reviews: 128,
        discount: 0,
        popular: true,
        onSale: false,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }

      const mockProduct2 = {
        id: 102,
        title: 'Phone Case',
        description: 'Durable phone case with shock absorption',
        price: 250.00,
        category: { id: 2, name: 'Accessories' },
        images: ['https://via.placeholder.com/150'],
        is_active: true,
        rating: 4.2,
        num_reviews: 89,
        discount: 0,
        popular: true,
        onSale: false,
        created_at: '2023-01-15T00:00:00Z',
        updated_at: '2023-01-15T00:00:00Z'
      }

      const mockOrder: OrderWithItems = {
        id: 'ORD123456',
        user_id: 1,
        total_amount: 2499.99,
        shipping: 50.00,
        status: 'shipped',
        shipping_address: '123 Main St, City, Country',
        payment_method: 'cod',
        payment_status: 'pending',
        tracking_number: 'TRK123456789',
        created_at: '2023-06-15T10:30:00Z',
        updated_at: '2023-06-16T14:20:00Z',
        shipped_at: '2023-06-16T14:20:00Z',
        delivered_at: null,
        items: [
          {
            id: 1,
            order_id: 'ORD123456',
            product_id: 101,
            quantity: 2,
            price: 1099.99,
            created_at: '2023-06-15T10:30:00Z',
            updated_at: '2023-06-15T10:30:00Z',
            product: mockProduct1
          },
          {
            id: 2,
            order_id: 'ORD123456',
            product_id: 102,
            quantity: 1,
            price: 250.00,
            created_at: '2023-06-15T10:30:00Z',
            updated_at: '2023-06-15T10:30:00Z',
            product: mockProduct2
          }
        ]
      }

      orders.value = [mockOrder]
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    ElMessage.error('Failed to load orders. Please try again.')
    loading.value = false
  }
}

// Filter orders based on active status
const filteredOrders = computed(() => {
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
    
    // TODO: Call API to cancel order
    // await api.put(`/api/orders/${order.id}/cancel`)
    
    // Update local state
    const index = orders.value.findIndex(o => o.id === order.id)
    if (index !== -1) {
      orders.value[index].status = 'cancelled'
    }
    
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