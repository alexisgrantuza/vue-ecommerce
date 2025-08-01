<template>
  <div class="product-gallery">
    <div class="main-image">
      <el-image
        :src="mainImage"
        :alt="title"
        fit="cover"
        class="product-main-img"
      >
        <template #error>
          <div class="image-error">
            <el-icon><Picture /></el-icon>
            <span>Image not found</span>
          </div>
        </template>
      </el-image>
    </div>

    <div v-if="hasMultipleImages" class="thumbnail-gallery">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="thumbnail"
        :class="{ active: selectedImage === image }"
        @click="handleThumbnailClick(image)"
      >
        <el-image
          :src="image"
          :alt="`${title} ${index + 1}`"
          fit="cover"
          class="thumbnail-img"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Picture } from '@element-plus/icons-vue'

const props = defineProps<{
  images: string[]
  title: string
  selectedImage: string
}>()

const emit = defineEmits(['select-image'])

const mainImage = computed(() => props.selectedImage || props.images?.[0] || 'https://via.placeholder.com/600')
const hasMultipleImages = computed(() => props.images?.length > 1)

const handleThumbnailClick = (image: string) => {
  emit('select-image', image)
}
</script>

<style scoped>
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image {
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  background: #fafafa;
}

.product-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 18px;
  gap: 10px;
}

.thumbnail-gallery {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 5px 0;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.thumbnail.active {
  border-color: #ff6600;
}

.thumbnail:hover {
  border-color: #ff6600;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-image {
    height: 450px;
  }
  
  .thumbnail {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 768px) {
  .product-gallery {
    gap: 15px;
  }
  
  .main-image {
    height: 400px;
    border-radius: 8px;
  }
  
  .thumbnail-gallery {
    gap: 8px;
    padding: 3px 0;
  }
  
  .thumbnail {
    width: 60px;
    height: 60px;
    border-radius: 6px;
  }
  
  .image-error {
    font-size: 16px;
  }
}

@media (max-width: 640px) {
  .main-image {
    height: 350px;
  }
  
  .thumbnail {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .product-gallery {
    gap: 12px;
  }
  
  .main-image {
    height: 300px;
    border-radius: 6px;
  }
  
  .thumbnail-gallery {
    gap: 6px;
  }
  
  .thumbnail {
    width: 45px;
    height: 45px;
    border-radius: 4px;
  }
  
  .image-error {
    font-size: 14px;
    gap: 8px;
  }
}

@media (max-width: 360px) {
  .main-image {
    height: 250px;
  }
  
  .thumbnail {
    width: 40px;
    height: 40px;
  }
}
</style>