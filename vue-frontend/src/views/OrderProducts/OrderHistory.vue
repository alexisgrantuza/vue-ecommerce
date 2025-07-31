<template>
  <div class="order-history-container">
    <div class="order-header">
      <h1>My Orders</h1>
      <el-tabs v-model="activeStatus" @tab-change="filterOrders">
        <el-tab-pane
          v-for="status in orderStatuses"
          :key="status.value"
          :label="status.label"
          :name="status.value"
        />
      </el-tabs>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <div v-else-if="filteredOrders.length === 0" class="empty-orders">
      <el-empty description="No orders found" />
    </div>

    <div v-else class="orders-list">
      <OrderCard
        v-for="order in filteredOrders"
        :key="order.id"
        :order="order"
        @command="handleCommand"
        @track="handleTrackOrder"
        @cancel="handleCancelOrder"
        @pay="handlePayNow"
        @buy-again="handleBuyAgain"
      />
    </div>

    <OrderDetailsDialog
      v-model="showOrderDetails"
      :order="selectedOrder"
      @order-updated="handleOrderUpdated"
    />

    <OrderTrackingDialog v-model="showTrackingDialog" :order="selectedOrder" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOrderStore } from '@/stores/order'
import type { OrderWithItems } from '@/types/api'
import { orderStatuses } from '@/constants/index'
import OrderCard from '@/views/OrderProducts/_components/OrderCard.vue'
import OrderDetailsDialog from '@/views/OrderProducts/_components/OrderDetailsDialog.vue'
import OrderTrackingDialog from '@/views/OrderProducts/_components/OrderTrackingDialog.vue'

const router = useRouter()
const route = useRoute()
const orderStore = useOrderStore()

// Component state
const loading = ref(true)
const activeStatus = ref('all')
const showOrderDetails = ref(false)
const showTrackingDialog = ref(false)
const selectedOrder = ref<OrderWithItems | null>(null)

// Use computed to get orders from store
const orders = computed(() => orderStore.orders)

// Filter orders based on active status
const filteredOrders = computed(() => {
  console.log('Filtering orders. Active status:', activeStatus.value, 'Orders:', orders.value)
  if (activeStatus.value === 'all') return orders.value
  return orders.value.filter((order) => order.status === activeStatus.value)
})

// Fetch orders from store
const fetchOrders = async () => {
  try {
    loading.value = true
    console.log('Fetching orders...')

    await orderStore.fetchOrderHistory()

    console.log('Orders fetched:', orders.value)

    const orderId = route.query.orderId as string
    if (orderId) {
      console.log('Looking for order with ID:', orderId)

      await nextTick()

      setTimeout(() => {
        const targetOrder = orders.value.find((order) => order.id === orderId)
        if (targetOrder) {
          console.log('Found target order:', targetOrder)
          ElMessage.success(`Order ${orderId} has been placed successfully!`)
        }

        const orderElement = document.getElementById(`order-${orderId}`)
        if (orderElement) {
          orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          console.log('Scrolled to order element')
        } else {
          console.log('Order element not found in DOM')
        }

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

// Handle meatball menu commands from OrderCard
const handleCommand = async (command: string, order: OrderWithItems) => {
  if (command === 'view') {
    selectedOrder.value = { ...order }
    showOrderDetails.value = true

    router.push({
      path: '/order-history',
      query: { orderId: order.id },
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
        },
      )
      await orderStore.deleteOrder(order.id)
      ElMessage.success('Order deleted successfully')
    } catch (error) {
      if (error !== 'cancel') {
        console.error('Error deleting order:', error)
        ElMessage.error('Failed to delete order. Please try again.')
      }
    }
  }
}

// Handle track order from OrderCard
const handleTrackOrder = (order: OrderWithItems) => {
  selectedOrder.value = order
  showTrackingDialog.value = true
}

// Handle cancel order from OrderCard
const handleCancelOrder = async (order: OrderWithItems) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to cancel this order?', 'Cancel Order', {
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No, Keep It',
      type: 'warning',
    })

    await orderStore.updateOrderStatus(order.id, 'cancelled')
    ElMessage.success('Order has been cancelled')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error cancelling order:', error)
      ElMessage.error('Failed to cancel order')
    }
  }
}

// Handle pay now from OrderCard
const handlePayNow = (order: OrderWithItems) => {
  ElMessage.info('Redirecting to payment...')
  console.log('Processing payment for order:', order.id)
}

// Handle buy again from OrderCard
const handleBuyAgain = (order: OrderWithItems) => {
  ElMessage.success('Items added to cart')
  console.log('Adding items to cart:', order.items)
}

// Handle order updated from OrderDetailsDialog
const handleOrderUpdated = () => {
  fetchOrders()
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 0; /* Remove gap since OrderCard has its own margin-bottom */
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
  .order-history-container {
    padding: 10px;
  }

  .order-header h1 {
    font-size: 20px;
  }
}
</style>
