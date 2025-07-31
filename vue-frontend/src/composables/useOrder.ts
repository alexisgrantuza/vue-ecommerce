import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import type { OrderWithItems } from '@/types/api';

const orderStatuses = [
  { label: 'All Orders', value: 'all' },
  { label: 'To Pay', value: 'pending' },
  { label: 'To Ship', value: 'processing' },
  { label: 'To Receive', value: 'shipped' },
  { label: 'Completed', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
] as const;

type OrderStatus = typeof orderStatuses[number]['value'];

export function useOrder() {
  const router = useRouter();
  const orderStore = useOrderStore();
  
  const loading = ref(true);
  const activeStatus = ref<OrderStatus>('all');
  const showTrackingDialog = ref(false);
  const showOrderDetails = ref(false);
  const selectedOrder = ref<OrderWithItems | null>(null);

  const orders = computed(() => orderStore.orders);

  const filteredOrders = computed(() => {
    if (activeStatus.value === 'all') return orders.value;
    return orders.value.filter((order) => order.status === activeStatus.value);
  });

  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'To Pay',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return statusMap[status] || status;
  };

  const getStatusType = (status: string) => {
    const typeMap = {
      pending: 'warning',
      processing: 'primary',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'danger',
    } as const;
    return typeMap[status as keyof typeof typeMap] || '';
  };

  const fetchOrders = async () => {
    try {
      loading.value = true;
      await orderStore.fetchOrderHistory();
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      ElMessage.error('Failed to load orders. Please try again.');
    } finally {
      loading.value = false;
    }
  };

  const updateOrderStatus = async (order: OrderWithItems) => {
    try {
      if (!selectedOrder.value) return;
      await orderStore.updateOrderStatus(order.id, order.status);
      ElMessage.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      ElMessage.error('Failed to update order status');
    }
  };

  const cancelOrder = async (order: OrderWithItems) => {
    try {
      await ElMessageBox.confirm(
        'Are you sure you want to cancel this order?', 
        'Cancel Order', 
        {
          confirmButtonText: 'Yes, Cancel',
          cancelButtonText: 'No, Keep It',
          type: 'warning',
        }
      );
      await orderStore.updateOrderStatus(order.id, 'cancelled');
      ElMessage.success('Order has been cancelled');
    } catch (error) {
      if (error !== 'cancel') {
        console.error('Error cancelling order:', error);
        ElMessage.error('Failed to cancel order');
      }
    }
  };

  const showTrackingDetails = (order: OrderWithItems) => {
    selectedOrder.value = order;
    showTrackingDialog.value = true;
  };

  const closeOrderDetails = () => {
    showOrderDetails.value = false;
    router.replace({ query: {} });
  };

  return {
    // State
    loading,
    activeStatus,
    showTrackingDialog,
    showOrderDetails,
    selectedOrder,
    orders,
    filteredOrders,
    orderStatuses,
    
    // Methods
    fetchOrders,
    updateOrderStatus,
    cancelOrder,
    showTrackingDetails,
    closeOrderDetails,
    formatDate,
    formatStatus,
    getStatusType,
  };
}
