<template>
  <div class="address-list">
    <h2>Delivery Address</h2>
    
    <el-row :gutter="20">
      <el-col 
        v-for="address in addresses" 
        :key="address.id" 
        :xs="24" 
        :sm="12" 
        :md="12" 
        class="address-col"
      >
        <AddressCard
          :address="address"
          :is-selected="selectedAddressId === address.id"
          @select="handleSelectAddress"
          @edit="handleEditAddress"
          @remove="handleRemoveAddress"
        />
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="12" class="address-col">
        <el-card class="add-address-card" shadow="hover" @click="handleAddNewAddress">
          <el-icon :size="30"><Plus /></el-icon>
          <p>Add New Address</p>
        </el-card>
      </el-col>
    </el-row>
    <AddressForm
      v-model="showAddressForm"
      :address="editingAddress"
      :loading="isSubmitting"
      @submit="handleFormSubmit"
      @cancel="handleFormCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import AddressCard from './AddressCard.vue'
import AddressForm from './AddressForm.vue'
import type { Address } from '@/types/api'
    
const props = defineProps<{
  addresses: Address[]
  selectedAddressId: number | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedAddressId', id: number | null): void
  (e: 'add', addressData: Omit<Address, 'id'>): void
  (e: 'update', address: Address): void
  (e: 'remove', id: number): void
}>()

// Form state management
const showAddressForm = ref(false)
const editingAddress = ref<Address | null>(null)
const isSubmitting = ref(false)

const handleSelectAddress = (id: number) => {
  emit('update:selectedAddressId', id)
}

const handleAddNewAddress = () => {
  editingAddress.value = null
  showAddressForm.value = true
}

const handleEditAddress = (address: Address) => {
  editingAddress.value = { ...address }
  showAddressForm.value = true
}

const handleRemoveAddress = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this address?',
      'Delete Address',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    
    emit('remove', id)
    
    // If the deleted address was selected, clear the selection
    if (props.selectedAddressId === id) {
      emit('update:selectedAddressId', null)
    }
    
    ElMessage.success('Address deleted successfully')
  } catch (error) {
    // User cancelled - no action needed
  }
}

const handleFormSubmit = async (addressData: Omit<Address, 'id'>) => {
  try {
    isSubmitting.value = true
    
    // Simulate API call delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (editingAddress.value) {
      // Update existing address
      const updatedAddress: Address = {
        ...addressData,
        id: editingAddress.value.id
      }
      emit('update', updatedAddress)
      ElMessage.success('Address updated successfully')
    } else {
      // Add new address
      emit('add', addressData)
      ElMessage.success('Address added successfully')
    }
    
    // Close form and reset state
    showAddressForm.value = false
    editingAddress.value = null
    
  } catch (error) {
    console.error('Error saving address:', error)
    ElMessage.error('Failed to save address. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const handleFormCancel = () => {
  showAddressForm.value = false
  editingAddress.value = null
}
</script>

<style scoped>
.address-list {
  margin-bottom: 24px;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: var(--el-text-color-primary);
}

.add-address-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--el-text-color-secondary);
  border: 2px dashed var(--el-border-color);
  background-color: var(--el-fill-color-lighter);
}

.add-address-card:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  transform: translateY(-2px);
}

.add-address-card p {
  margin-top: 10px;
  font-size: 0.9rem;
  font-weight: 500;
}

.address-col {
  margin-bottom: 20px;
}

/* Ensure consistent height for address cards */
:deep(.address-card) {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>