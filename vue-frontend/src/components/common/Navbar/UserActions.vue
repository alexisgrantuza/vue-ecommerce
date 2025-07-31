<template>
  <div class="user-actions">
    <el-tooltip content="Wishlist" placement="bottom">
      <el-badge :value="wishlistCount" :hidden="wishlistCount === 0">
        <el-button
          :icon="Star"
          circle
          @click="$emit('wishlist')"
          class="action-button"
          aria-label="Wishlist"
        />
      </el-badge>
    </el-tooltip>

    <el-tooltip content="Shopping Cart" placement="bottom">
      <el-badge :value="cartCount" :hidden="cartCount === 0" type="danger">
        <el-button
          :icon="ShoppingCart"
          circle
          @click="$emit('cart')"
          class="action-button"
          aria-label="Shopping Cart"
        />
      </el-badge>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { Star, ShoppingCart } from '@element-plus/icons-vue'

defineProps<{
  wishlistCount: number
  cartCount: number
}>()

defineEmits<{
  (e: 'wishlist'): void
  (e: 'cart'): void
}>()
</script>

<style scoped>
.user-actions {
  --action-button-size: 50px;
  --badge-size: 20px;
  --badge-offset: calc(var(--action-button-size) - var(--badge-size) / 2);
  
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  margin-left: auto;
}

.action-button {
  --el-button-size: var(--action-button-size);
  
  position: relative;
  width: var(--action-button-size);
  height: var(--action-button-size);
  transition: all 0.2s ease;
  font-size: 20px;
  color: var(--text-primary, #303133);
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
}

.action-button:hover {
  color: var(--primary-color, #ff6600);
  border-color: var(--primary-color, #ff6600);
  background-color: var(--el-bg-color);
}

:deep(.el-badge__content) {
  width: var(--badge-size);
  height: var(--badge-size);
  line-height: var(--badge-size);
  border-radius: 50%;
  padding: 0;
  right: 0;
  top: 0;
  transform: translateY(-30%) translateX(30%);
}

:deep(.el-badge__content.is-fixed) {
  position: absolute;
  transform: translateY(-30%) translateX(30%);
}

@media (max-width: 768px) {
  .user-actions {
    --action-button-size: 44px;
    --badge-size: 18px;
    gap: 12px;
  }
  
  .action-button {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .user-actions {
    --action-button-size: 40px;
    --badge-size: 16px;
    gap: 8px;
  }
  
  .action-button {
    font-size: 16px;
  }
}
</style>
