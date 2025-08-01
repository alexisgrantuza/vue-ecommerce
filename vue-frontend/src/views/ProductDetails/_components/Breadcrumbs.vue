<template>
  <el-breadcrumb class="breadcrumb" separator="/">
    <el-breadcrumb-item>
      <router-link to="/">Home</router-link>
    </el-breadcrumb-item>
    <el-breadcrumb-item>
      <router-link to="/category">Category</router-link>
    </el-breadcrumb-item>
    <el-breadcrumb-item>{{ category || 'Product' }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
defineProps<{
  category?: string
}>()
</script>

<style scoped>
.breadcrumb {
  margin-bottom: 30px;
  padding: 0 10px;
}

.breadcrumb :deep(.el-breadcrumb__item) {
  color: #999;
  font-size: 14px;
}

.breadcrumb :deep(.el-breadcrumb__item a) {
  color: #ff6600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb :deep(.el-breadcrumb__item a:hover) {
  color: #ff8833;
  text-decoration: underline;
}

.breadcrumb :deep(.el-breadcrumb__separator) {
  color: #666;
}

/* Responsive Design */
@media (max-width: 768px) {
  .breadcrumb {
    margin-bottom: 20px;
    padding: 0 5px;
  }
  
  .breadcrumb :deep(.el-breadcrumb__item) {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .breadcrumb {
    margin-bottom: 15px;
    padding: 0;
  }
  
  .breadcrumb :deep(.el-breadcrumb__item) {
    font-size: 11px;
  }
}
</style>