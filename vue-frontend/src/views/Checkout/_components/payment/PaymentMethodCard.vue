<template>
  <div class="payment-method" :class="{ 'is-selected': isSelected }">
    <el-radio :value="paymentMethod.id" class="payment-radio">
      <div class="payment-content">
        <el-avatar :size="40" class="payment-icon" :icon="paymentMethod.icon" />
        <div class="payment-info">
          <h4>{{ paymentMethod.name }}</h4>
          <p class="payment-desc">{{ paymentMethod.description }}</p>
        </div>
      </div>
    </el-radio>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  paymentMethod: PaymentMethod
  isSelected: boolean
}>()

export interface PaymentMethod {
  id: string
  name: string
  icon: string
  description: string
}
</script>

<style scoped>
.payment-method {
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  background-color: var(--el-fill-color-lighter);
}

.payment-method:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.payment-method.is-selected {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.payment-radio {
  width: 100%;
  height: 100%;
  display: block;
}

.payment-radio :deep(.el-radio__input) {
  display: none;
}

.payment-radio :deep(.el-radio__label) {
  padding-left: 0;
  width: 100%;
}

.payment-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-icon {
  flex-shrink: 0;
  background-color: #fff;
  padding: 4px;
  border-radius: 4px;
}

.payment-info {
  flex-grow: 1;
}

h4 {
  margin: 0 0 4px 0;
  font-size: 0.95rem;
  color: var(--el-text-color-primary);
}

.payment-desc {
  margin: 0;
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
}
</style>
