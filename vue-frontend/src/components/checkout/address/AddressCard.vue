<template>
  <el-card
    :class="['address-card', { active: isSelected }]"
    shadow="hover"
    @click="$emit('select', address.id)"
  >
    <div class="address-header">
      <h3>{{ address.houseNumber }}</h3>
      <el-tag v-if="address.isDefault" type="success" size="small"> Default </el-tag>
    </div>
    <p>
      <el-icon><Location /></el-icon> {{ address.street }}
    </p>
    <p>{{ address.city }}, {{ address.state }} {{ address.zipCode }}</p>
    <div class="address-actions">
      <el-button type="primary" @click.stop="$emit('edit', address)">
        <el-icon><Edit /></el-icon> Edit
      </el-button>
      <el-button v-if="!address.isDefault" type="primary" @click.stop="$emit('remove', address.id)">
        <el-icon><Delete /></el-icon> Remove
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Location, Edit, Delete } from '@element-plus/icons-vue'
import type { Address } from '@/types/api'

defineProps({
  address: {
    type: Object as () => Address,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select', 'edit', 'remove'])
</script>

<style scoped>
.address-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
  border: 2px solid transparent;
}

.address-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.address-card.active {
  border-color: var(--el-color-primary);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.address-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

p {
  margin: 5px 0;
  color: var(--el-text-color-regular);
  display: flex;
  align-items: center;
  gap: 5px;
}

h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--el-text-color-primary);
}
</style>
