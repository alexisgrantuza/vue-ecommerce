<template>
  <!-- About Dialog -->
  <el-dialog v-model="aboutDialogVisible" title="About Lazada" width="500px" center>
    <div class="about-content">
      <p>We are Southeast Asia's leading e-commerce platform, part of Alibaba Group.</p>
      <p>
        Our mission is to make shopping effortless by providing a seamless online experience with a
        wide selection of products, fast delivery, and excellent customer service.
      </p>

      <div class="about-features">
        <div class="about-feature">
          <el-icon class="feature-icon"><Service /></el-icon>
          <span>24/7 Customer Support</span>
        </div>
        <div class="about-feature">
          <el-icon class="feature-icon"><Shield /></el-icon>
          <span>Secure Shopping</span>
        </div>
        <div class="about-feature">
          <el-icon class="feature-icon"><Truck /></el-icon>
          <span>Fast Delivery</span>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeAboutDialog">Close</el-button>
        <el-button type="primary" @click="closeAboutDialog">Learn More</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Reactive state
const aboutDialogVisible = ref<boolean>(false)
const currentYear = new Date().getFullYear()

// Event handlers
const openAboutDialog = (): void => {
  aboutDialogVisible.value = true
}

const closeAboutDialog = (): void => {
  aboutDialogVisible.value = false
}
</script>

<style scoped>
/* About Dialog Styles */
.about-content {
  line-height: 1.6;
}

.about-content p {
  margin-bottom: 15px;
  color: #666666;
}

.about-features {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.about-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.feature-icon {
  color: hsl(24, 100%, 50%);
  font-size: 18px;
}

.dialog-footer {
  display: flex;
  gap: 10px;
}
</style>
