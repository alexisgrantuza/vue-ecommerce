<template>
  <div class="lazada-carousel">
    <el-carousel
      ref="carouselRef"
      height="300px"
      :interval="3000"
      :autoplay="true"
      indicator-position="none"
      :loop="true"
      class="lazada-carousel__container"
      @change="handleCarouselChange"
    >
      <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <div class="carousel-image-container">
          <el-image :src="item" :alt="'Banner ' + (index + 1)" class="carousel-image" />
        </div>
      </el-carousel-item>
    </el-carousel>

    <div class="custom-indicators">
      <div
        v-for="(item, index) in carouselItems"
        :key="'indicator-' + index"
        :class="['indicator', { active: currentSlide === index }]"
        @click="handleIndicatorClick(index)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { carouselItems } from '@/constants/index'

const carouselRef = ref()
const currentSlide = ref(0)

const handleCarouselChange = (index: number) => {
  currentSlide.value = index
}

const handleIndicatorClick = (index: number) => {
  carouselRef.value?.setActiveItem(index)
}
</script>

<style scoped>
.lazada-carousel {
  width: 100%;
  margin: 20px auto;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.lazada-carousel__container {
  border-radius: 8px;
}

.carousel-image-container {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.carousel-image:hover {
  transform: scale(1.02);
}

@media (min-width: 768px) {
  .carousel-image-container {
    height: 300px;
  }
}

@media (max-width: 767px) {
  .carousel-image-container {
    height: 150px;
  }

  .lazada-carousel {
    display: none;
  }
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
