<template>
  <div class="profile-section">
    <el-header>Profile Information</el-header>
    <el-form 
      :model="formData" 
      label-width="120px" 
      label-position="top"
      class="profile-form"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="Full Name" required>
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="Email" required>
        <el-input v-model="formData.email" type="email" />
      </el-form-item>
      <el-form-item label="Phone">
        <el-input v-model="formData.phone" placeholder="+63 912 345 6789" />
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          :loading="isLoading"
          native-type="submit"
        >
          Save Changes
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import type { User } from '@/types/api';

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  }
});

const emit = defineEmits(['update']);

const isLoading = ref(false);
const formData = ref({
  name: '',
  email: '',
  phone: ''
});

// Initialize form with user data
const initializeForm = () => {
  formData.value = {
    name: props.user.name || '',
    email: props.user.email || '',
    phone: props.user.phone || ''
  };
};

// Watch for user prop changes
watch(() => props.user, () => {
  initializeForm();
}, { immediate: true, deep: true });

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    await emit('update', formData.value);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.profile-section {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-header) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 1.5rem;
  padding: 0;
}

.profile-form {
  max-width: 600px;
  margin: 0 auto;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  padding-bottom: 0;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-button) {
  background-color: #ff6600;
  border: none;
}
</style>
