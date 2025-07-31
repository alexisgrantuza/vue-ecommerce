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
</style>
