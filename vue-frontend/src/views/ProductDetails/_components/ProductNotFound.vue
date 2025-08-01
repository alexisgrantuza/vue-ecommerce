<template>
  <div class="error-section">
    <el-result
      icon="error"
      title="Product Not Found"
      sub-title="The product you're looking for doesn't exist or may have been removed."
    >
      <template #extra>
        <el-button type="primary" @click="$emit('back-to-home')">
          Back to Home
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.error-section {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .error-section {
    padding: 30px 20px;
    border-radius: 8px;
  }
  
  .error-section :deep(.el-result__title) {
    font-size: 18px;
  }
  
  .error-section :deep(.el-result__subtitle) {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .error-section {
    padding: 20px 15px;
    min-height: 40vh;
  }
  
  .error-section :deep(.el-result__title) {
    font-size: 16px;
  }
  
  .error-section :deep(.el-result__subtitle) {
    font-size: 12px;
  }
  
  .error-section :deep(.el-button) {
    font-size: 14px;
    padding: 10px 20px;
  }
}
</style>