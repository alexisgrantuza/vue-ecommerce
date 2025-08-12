<template>
  <div class="address-section">
    <div class="section-header">
      <el-header>My Addresses</el-header>
      <el-button type="primary" @click="$emit('add-address')" style="background-color: #ff6600; border: none;">
        <el-icon style="margin-right: 5px;"><Plus /></el-icon> Add New Address
      </el-button>
    </div>

    <div class="address-list">
      <el-card 
        v-for="(address, index) in addresses" 
        :key="address.id || index" 
        class="address-card"
        :class="{ 'default-address': address.isDefault }"
      >
        <div class="address-content">
          <div class="address-details">
            <h4>{{ address.houseNumber }} {{ address.street }}</h4>
            <p>{{ formatAddress(address) }}</p>
            <el-tag v-if="address.isDefault" type="success" size="small" class="default-tag">
              Default
            </el-tag>
          </div>
          <div class="address-actions">
            <el-button 
              type="primary" 
              link 
              @click="$emit('edit-address', address, index)"
            >
              Edit
            </el-button>
            <el-button 
              type="danger" 
              link 
              @click="$emit('delete-address', address, index)"
              :disabled="address.isDefault"
            >
              Delete
            </el-button>
            <el-button 
              v-if="!address.isDefault"
              type="text" 
              @click="$emit('set-default-address', address)"
              class="set-default-btn"
            >
              Set as Default
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import type { PropType } from 'vue';
import type { Address } from '@/types/api';

defineProps({
  addresses: {
    type: Array as PropType<Address[]>,
    default: () => []
  }
});

const formatAddress = (address: Address) => {
  const parts = [
    `${address.houseNumber} ${address.street}`,
    address.city,
    address.state,
    address.zipCode,
    address.country
  ].filter(Boolean);
  return parts.join(', ');
};
</script>

<style scoped>
.address-section {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

:deep(.el-header) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #303133;
  padding: 0;
  margin: 0;
}

.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.address-card {
  margin-bottom: 0;
  transition: all 0.3s ease;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  overflow: hidden;
}

.address-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
}

.default-address {
  border: 1px solid #c27c3a;
  background-color: #f9f4eb;
}

.address-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
}

.address-details {
  flex: 1;
  margin-bottom: 1rem;
}

.address-details h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: #303133;
  font-weight: 500;
}

.address-details p {
  margin: 0 0 0.75rem;
  color: #606266;
  font-size: 0.875rem;
  line-height: 1.5;
}

.default-tag {
  margin-top: 0.5rem;
  color: #c27c3a;
  background-color: #fff;
}

.address-actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
}

.set-default-btn {
  margin-left: auto;
  color: #409EFF;
}



@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .address-list {
    grid-template-columns: 1fr;
  }
  
  :deep(.el-header) {
    font-size: 1.25rem;
  }
}
</style>
