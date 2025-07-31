<template>
  <el-dialog v-model="visible" title="Order Tracking" width="600px">
    <div v-if="order" class="tracking-container">
      <el-steps
        :active="getTrackingStep(order.status)"
        finish-status="success"
        process-status="process"
      >
        <el-step title="Order Placed" :description="formatDate(order.created_at)" />
        <el-step title="Processing" description="Preparing your order" />
        <el-step
          title="Shipped"
          :description="order.shipped_at ? formatDate(order.shipped_at) : 'In transit'"
        />
        <el-step
          title="Delivered"
          :description="order.delivered_at ? formatDate(order.delivered_at) : 'On the way'"
        />
      </el-steps>

      <div class="tracking-details">
        <h4>Shipping Details</h4>
        <p><strong>Tracking Number:</strong> {{ order.tracking_number || 'Not available' }}</p>
        <p><strong>Shipping Address:</strong> {{ order.shipping_address }}</p>
        <p><strong>Estimated Delivery:</strong> {{ getEstimatedDelivery(order) }}</p>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { OrderWithItems } from '@/types/api';

const props = defineProps<{
  modelValue: boolean;
  order: OrderWithItems | null;
}>();

const emit = defineEmits(['update:modelValue']);

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
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

const getTrackingStep = (status: string) => {
  const stepMap: Record<string, number> = {
    pending: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
    cancelled: 0,
  };
  return stepMap[status] || 0;
};

const getEstimatedDelivery = (order: OrderWithItems) => {
  if (!order.shipped_at) return 'Not available';
  const shippedDate = new Date(order.shipped_at);
  const estimatedDate = new Date(shippedDate);
  estimatedDate.setDate(shippedDate.getDate() + 3); // Assuming 3 days delivery time
  return estimatedDate.toLocaleDateString('en-PH', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};
</script>

<style scoped>
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
</style>
