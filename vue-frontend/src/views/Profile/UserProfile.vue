<template>
  <div class="user-profile" v-if="user">
    <el-container>
      <!-- Sidebar Component -->
      <ProfileSidebar 
        :user="user" 
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      />

      <!-- Main Content -->
      <el-main class="profile-content">
        <!-- Profile Information -->
        <ProfileInformation 
          v-if="activeTab === 'profile'"
          :user="user"
          @update="handleProfileUpdate"
        />

        <!-- Address Management -->
        <AddressManagement 
          v-else-if="activeTab === 'addresses'"
          :addresses="user.address || []"
          @add-address="handleAddAddress"
          @edit-address="handleEditAddress"
          @delete-address="handleDeleteAddress"
          @set-default-address="setAsDefault"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserAuthStore } from '@/stores/userAuth';
import { useAddresses } from '@/composables/useAddresses';
import ProfileSidebar from '@/views/Profile/_components/ProfileSidebar.vue';
import ProfileInformation from '@/views/Profile/_components/ProfileInformation.vue';
import AddressManagement from '@/views/Profile/_components/AddressManagement.vue';
import type { User } from '@/types/api';
import { ElMessage } from 'element-plus';

const userStore = useUserAuthStore();
const activeTab = ref('profile');
const isLoading = ref(false);

// Get current user
const user = computed(() => userStore.user as User | null);

// Address related methods
const {
  handleAddAddress,
  handleEditAddress,
  handleDeleteAddress,
  setAsDefault
} = useAddresses(user);

// Handle tab changes
const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};

// Handle profile updates 
const handleProfileUpdate = async (updatedData: Partial<User>) => {
  if (!user.value) return;
    
    try {
    isLoading.value = true;
    
    if (!user.value.id || !user.value.created_at) {
        throw new Error('Invalid user data');
    }

    const updatedUser: Partial<User> = {
        ...user.value,
        ...updatedData,
        updated_at: new Date()
    };
    
    // Update the store
    userStore.user = updatedUser;
    
    // Update the users array in localStorage
    userStore.updateUserInUsersArray(updatedUser);
    
    // Update individual user storage
    const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(updatedUser));
    
    ElMessage.success('Profile updated successfully');
    return true;
    } catch (error) {
    console.error('Error updating profile:', error);
    ElMessage.error('Failed to update profile');
    return false;
    } finally {
    isLoading.value = false;
    }
};

// Initialize component
onMounted(() => {
  if (!user.value) {
  }
});
</script>

<style scoped>
.user-profile {
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
}

.profile-sidebar {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  padding: 20px 0;
  min-height: calc(100vh - 60px);
}

.user-info {
  text-align: center;
  padding: 20px;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 20px;
}

.user-avatar {
  margin-bottom: 15px;
  border: 2px solid #f5f5f5;
}

.user-name {
  margin: 10px 0 5px;
  font-size: 18px;
}

.profile-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .profile-content {
    padding: 1rem;
  }
}
</style>