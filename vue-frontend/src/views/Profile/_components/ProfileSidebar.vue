<template>
  <el-aside width="250px" class="profile-sidebar">
    <div class="user-info">
      <el-avatar 
        :size="80" 
        :src="'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" 
        class="user-avatar" 
      />
      <h3 class="user-name">{{ user.name }}</h3>
      <p class="user-email">{{ user.email }}</p>
      <p class="member-since">{{ formatDate(user.created_at) }}</p>
    </div>

    <el-menu
      :default-active="activeTab"
      class="profile-menu"
      @select="handleTabChange"
    >
      <el-menu-item index="profile">
        <el-icon><User /></el-icon>
        <span>Profile</span>
      </el-menu-item>
      <el-menu-item index="addresses">
        <el-icon><Location /></el-icon>
        <span>Addresses</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { User, Location } from '@element-plus/icons-vue';
import type { PropType } from 'vue';
import type { User as UserType } from '@/types/api';

const props = defineProps({
  user: {
    type: Object as PropType<UserType>,
    required: true
  },
  activeTab: {
    type: String,
    default: 'profile'
  }
});

const emit = defineEmits(['tabChange']);

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

const handleTabChange = (key: string) => {
  emit('tabChange', key);
};
</script>

<style scoped>
.profile-sidebar {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
}

.user-info {
  padding: 2rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid #e6e6e6;
}

.user-avatar {
  margin: 0 auto 1rem;
  border: 3px solid #f2f6fc;
}

.user-name {
  margin: 0.5rem 0 0.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #303133;
}

.user-email {
  margin: 0 0 0.5rem;
  color: #606266;
  font-size: 0.875rem;
}

.member-since {
  margin: 0;
  color: #909399;
  font-size: 0.75rem;
}

.profile-menu {
  border-right: none;
}

.profile-menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  margin: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.profile-menu :deep(.el-menu-item:hover) {
  background-color: #fff8f0;
  color: #ff6600;
}

.profile-menu :deep(.el-menu-item.is-active) {
  background-color: #fff8f0;
  color: #ff6600;
  font-weight: 500;
}

.profile-menu :deep(.el-icon) {
  margin-right: 8px;
  font-size: 18px;
}

@media (max-width: 768px) {
  .profile-sidebar {
    width: 100% !important;
    height: auto;
    position: relative;
    border-right: none;
    border-bottom: 1px solid #e6e6e6;
  }
}
</style>
