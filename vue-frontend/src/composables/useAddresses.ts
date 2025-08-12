import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Address } from '@/types/api';

export function useAddresses(user: any) {
  const showAddressDialog = ref(false);
  const editingAddressIndex = ref<number | null>(null);
  const addressForm = ref<Partial<Address>>({
    id: 0,
    country: 'Philippines',
    isDefault: false
  });

  const resetAddressForm = () => {
    addressForm.value = {
      id: 0,
      country: 'Philippines',
      isDefault: false
    };
    editingAddressIndex.value = null;
  };

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

  const handleAddAddress = () => {
    resetAddressForm();
    showAddressDialog.value = true;
  };

  const handleEditAddress = (address: Address, index: number) => {
    addressForm.value = { ...address };
    editingAddressIndex.value = index;
    showAddressDialog.value = true;
  };

  const saveAddress = async () => {
    if (!user.value) return false;
    
    const { houseNumber, street, city, state, zipCode, country } = addressForm.value;
    
    if (!houseNumber || !street || !city || !state || !zipCode || !country) {
      ElMessage.error('Please fill in all required fields');
      return false;
    }

    try {
      const updatedUser = { ...user.value };
      
      if (!updatedUser.address) {
        updatedUser.address = [];
      }

      const newAddress: Address = {
        id: addressForm.value.id || Date.now(),
        houseNumber,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: addressForm.value.isDefault || false
      };

      if (editingAddressIndex.value !== null) {
        updatedUser.address[editingAddressIndex.value] = newAddress;
      } else {
        if (newAddress.isDefault) {
          updatedUser.address = updatedUser.address.map((addr: Address) => ({
            ...addr,
            isDefault: false
          }));
        }
        updatedUser.address.push(newAddress);
      }

      user.value = updatedUser;
      
      showAddressDialog.value = false;
      resetAddressForm();
      
      ElMessage.success(`Address ${editingAddressIndex.value !== null ? 'updated' : 'added'} successfully`);
      return true;
    } catch (error) {
      console.error('Error saving address:', error);
      ElMessage.error('Failed to save address');
      return false;
    }
  };

  const handleDeleteAddress = (address: Address, index: number) => {
    if (!user.value) return;
    
    if (address.isDefault) {
      ElMessage.warning('Cannot delete default address');
      return;
    }
    
    ElMessageBox.confirm(
      'Are you sure you want to delete this address?',
      'Delete Address',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    ).then(() => {
      try {
        const updatedUser = { ...user.value };
        
        if (updatedUser.address) {
          updatedUser.address = updatedUser.address.filter((_: Address, i: number) => i !== index);
          user.value = updatedUser;
          ElMessage.success('Address deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        ElMessage.error('Failed to delete address');
      }
    })
  };

  const setAsDefault = (address: Address) => {
    if (!user.value?.address) return;
    
    try {
      const updatedUser = { ...user.value };
      
      updatedUser.address = updatedUser.address?.map((addr: Address) => ({
        ...addr,
        isDefault: addr.id === address.id
      }));
      
      user.value = updatedUser;
      ElMessage.success('Default address updated');
    } catch (error) {
      console.error('Error setting default address:', error);
      ElMessage.error('Failed to update default address');
    }
  };

  return {
    showAddressDialog,
    editingAddressIndex,
    addressForm,
    formatAddress,
    handleAddAddress,
    handleEditAddress,
    handleDeleteAddress,
    saveAddress,
    setAsDefault,
    resetAddressForm
  };
}
