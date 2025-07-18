<template>
  <!-- Trust Features Section -->
  <section class="trust-section">
    <div class="trust-container">
      <el-row :gutter="20">
        <el-col
          v-for="feature in trustFeatures"
          :key="feature.title"
          :xs="24"
          :sm="12"
          :md="6"
          :lg="6"
        >
          <el-card class="trust-card" shadow="hover">
            <div class="trust-item">
              <el-icon :size="32" class="trust-icon">
                <component :is="feature.icon" />
              </el-icon>
              <div class="trust-content">
                <h4 class="trust-title">{{ feature.title }}</h4>
                <p class="trust-description">{{ feature.description }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script setup lang="ts">
import { trustFeatures } from '@/constants/index'
</script>

<style scoped>
/* Trust Features Section */
.trust-section {
  padding: 40px 0;
}

.trust-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
}

.trust-card {
  height: 100%;
  transition: transform 0.2s ease;
  margin-bottom: 20px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.trust-icon {
  color: #ff6600;
  flex-shrink: 0;
}

.trust-content {
  flex: 1;
}

.trust-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 5px 0;
}

.trust-description {
  font-size: 14px;
  color: #666666;
  margin: 0;
}

@media (max-width: 768px) {
  .trust-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
