<template>
  <div class="loading-section">
    <el-skeleton :rows="8" animated />
  </div>
</template>

<style scoped>
.loading-section {
  background: #1a1a1a;
  padding: 40px;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .loading-section {
    padding: 30px 20px;
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  .loading-section {
    padding: 20px 15px;
    border-radius: 6px;
  }
}
</style>