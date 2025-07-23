<template>
  <el-card class="order-item" shadow="hover">
    <el-row :gutter="20" align="middle">
      <el-col :span="6">
        <el-image
          :src="item.product.images?.[0] || 'https://via.placeholder.com/100'"
          :alt="item.product.title"
          fit="cover"
          class="item-image"
        />
      </el-col>
      <el-col :span="18">
        <h4>{{ item.product.title }}</h4>
        <p v-if="item.product.category" class="item-variation">
          {{ item.product.category }}
        </p>
        <p class="item-quantity">Quantity: {{ item.quantity }}</p>
        <p class="item-price">
          ₱{{
            (item.product.price * item.quantity).toLocaleString('en-PH', {
              minimumFractionDigits: 2,
            })
          }}
        </p>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import type { Category } from '@/types/api'
import { defineProps } from 'vue'

defineProps<{
  item: {
    id: number
    product: {
      id: number
      title: string
      price: number
      images?: string[]
      category?: Category
    }
    quantity: number
  }
}>()
</script>

<style scoped>
.order-item {
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.order-item:last-child {
  margin-bottom: 0;
}

.order-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

h4 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: var(--el-text-color-primary);
}

.item-variation {
  margin: 0 0 6px 0;
  font-size: 0.85rem;
  color: var(--el-text-color-secondary);
}

.item-quantity {
  margin: 0 0 6px 0;
  font-size: 0.9rem;
  color: var(--el-text-color-regular);
}

.item-price {
  margin: 8px 0 0 0;
  font-weight: 600;
  color: var(--el-color-primary);
  font-size: 1rem;
}
</style>
