<template>
  <el-card :id="`order-${order.id}`" class="order-card">
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
        <el-dropdown trigger="click" @command="(cmd) => $emit('command', cmd, order)">
          <el-button type="primary" class="meatball-menu" @click.stop>
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
              <el-button type="primary" size="small" @click="$emit('track', order)">
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
        <el-button
          v-if="order.status === 'pending'"
          type="danger"
          plain
          @click="$emit('cancel', order)"
        >
          Cancel Order
        </el-button>
        <el-button
          v-if="order.payment_status === 'pending' && order.status === 'pending'"
          type="primary"
          @click="$emit('pay', order)"
        >
          Pay Now
        </el-button>
        <el-button v-if="order.status === 'delivered'" type="success" @click="$emit('buy-again', order)">
          Buy Again
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { MoreFilled, View, Delete, LocationInformation } from '@element-plus/icons-vue';
import type { OrderWithItems } from '@/types/api';

const props = defineProps<{
  order: OrderWithItems;
}>();

const emit = defineEmits(['command', 'track', 'cancel', 'pay', 'buy-again']);

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

const getTrackingStatus = (order: OrderWithItems) => {
  if (order.status === 'shipped' && order.shipped_at) {
    return `Shipped on ${formatDate(order.shipped_at)}`;
  } else if (order.status === 'delivered' && order.delivered_at) {
    return `Delivered on ${formatDate(order.delivered_at)}`;
  }
  return 'Track your order';
};
</script>

<style scoped>
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
  color: #409eff;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.delete-action {
  color: #f56c6c;
}

.delete-action:hover {
  color: #fff;
  background-color: #f56c6c;
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

@media (max-width: 768px) {
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
