<template>
  <div class="payment-method-selector">
    <h2>Select Payment Method</h2>

    <el-radio-group v-model="selectedMethod" class="payment-methods">
      <el-row :gutter="20">
        <el-col
          v-for="method in paymentMethods"
          :key="method.id"
          :xs="24"
          :sm="12"
          class="payment-col"
        >
          <PaymentMethodCard
            :payment-method="method"
            :is-selected="selectedMethod === method.id"
            @click="selectMethod(method.id)"
          />
        </el-col>
      </el-row>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import PaymentMethodCard from './PaymentMethodCard.vue'
import type { PaymentMethod } from './PaymentMethodCard.vue'

const props = defineProps<{
  paymentMethods: PaymentMethod[]
  selectedMethodId?: string | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedMethodId', id: string | null): void
}>()

const selectedMethod = ref<string>(props.selectedMethodId || '')

watch(selectedMethod, (newValue) => {
  emit('update:selectedMethodId', newValue || null)
})

watch(
  () => props.selectedMethodId,
  (newValue) => {
    if (newValue !== selectedMethod.value) {
      selectedMethod.value = newValue || ''
    }
  },
)

const selectMethod = (methodId: string) => {
  selectedMethod.value = methodId
}
</script>

<style scoped>
.payment-method-selector {
  margin-bottom: 24px;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: var(--el-text-color-primary);
}

.payment-methods {
  width: 100%;
}

.payment-col {
  margin-bottom: 16px;
}
</style>
