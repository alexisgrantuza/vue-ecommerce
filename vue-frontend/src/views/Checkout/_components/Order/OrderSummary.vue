<template>
  <div class="order-summary">
    <h3>Order Summary</h3>

    <el-descriptions :column="1" border class="summary-details">
      <el-descriptions-item>
        <template #label>
          Subtotal ({{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }})
        </template>
        ₱{{ subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label> Shipping Fee </template>
        ₱{{ shippingFee.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}
      </el-descriptions-item>

      <el-descriptions-item class="total-row">
        <template #label>
          <strong>Total</strong>
        </template>
        <strong>₱{{ total.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</strong>
      </el-descriptions-item>
    </el-descriptions>

    <div class="voucher-section">
      <el-input v-model="voucherCode" placeholder="Enter Voucher Code" class="voucher-input">
        <template #append>
          <el-button @click="applyVoucher">Apply</el-button>
        </template>
      </el-input>
    </div>

    <slot name="actions"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  subtotal: number
  shippingFee: number
  itemCount: number
}>()

const emit = defineEmits<{
  (e: 'voucher-applied', code: string): void
}>()

const voucherCode = ref('')

const total = computed(() => {
  return props.subtotal + props.shippingFee
})

const applyVoucher = () => {
  if (voucherCode.value.trim()) {
    emit('voucher-applied', voucherCode.value.trim())
    ElMessage.success('Voucher code applied successfully')
  } else {
    ElMessage.warning('Please enter a voucher code')
  }
}
</script>

<style scoped>
.order-summary {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.3rem;
  color: var(--el-text-color-primary);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--el-border-color);
}

.summary-details {
  margin-bottom: 20px;
}

.summary-details :deep(.el-descriptions__label) {
  width: 70%;
  font-weight: normal;
  color: var(--el-text-color-regular);
}

.summary-details :deep(.el-descriptions__content) {
  text-align: right;
  font-weight: 500;
}

.total-row :deep(.el-descriptions__label),
.total-row :deep(.el-descriptions__content) {
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--el-text-color-primary);
}

.voucher-section {
  margin: 20px 0;
}

.voucher-input {
  margin-bottom: 10px;
}

.secure-payment {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--el-border-color);
  color: var(--el-text-color-secondary);
  font-size: 0.85rem;
}

.secure-payment .el-icon {
  color: var(--el-color-success);
}
</style>
