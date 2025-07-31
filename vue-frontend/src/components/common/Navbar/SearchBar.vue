<template>
  <div class="search-section">
    <el-autocomplete
      v-model="searchQuery"
      :fetch-suggestions="querySearchAsync"
      :prefix-icon="Search"
      :loading="loading"
      clearable
      class="search-input"
      placeholder="Search for products"
      @select="handleSelect"
      @keyup.enter="handleSearch"
      @click.native="handleClick"
      :debounce="300"
    >
      <template #default="{ item }">
        <div class="search-suggestion-item">
          <div class="suggestion-image">
            <el-image :src="item.image" fit="cover" :lazy="true" class="suggestion-image" />
          </div>
          <div class="suggestion-content">
            <div class="suggestion-title">{{ item.title }}</div>
            <div class="suggestion-price">
              <span class="current-price">
                ₱{{
                  item.discount ? calculateDiscountedPrice(item.price, item.discount) : item.price
                }}
              </span>
              <span v-if="item.discount" class="original-price"> ₱{{ item.price }} </span>
            </div>
          </div>
          <div class="suggestion-category">
            <el-tag size="small" type="info">{{ item.category }}</el-tag>
          </div>
        </div>
      </template>
      <template #loading>
        <el-icon class="is-loading">
          <svg class="circular" viewBox="0 0 20 20">
            <g class="path2 loading-path" stroke-width="0" style="animation: none; stroke: none">
              <circle r="3.375" class="dot1" rx="0" ry="0" />
              <circle r="3.375" class="dot2" rx="0" ry="0" />
              <circle r="3.375" class="dot4" rx="0" ry="0" />
              <circle r="3.375" class="dot3" rx="0" ry="0" />
            </g>
          </svg>
        </el-icon>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { SearchSuggestion } from '@/types/api'

const props = defineProps<{
  modelValue: string
  suggestions: SearchSuggestion[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
  (e: 'select', item: SearchSuggestion): void
  (e: 'click'): void
}>()

const searchQuery = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const calculateDiscountedPrice = (price: number, discount: number): string => {
  return ((price * (100 - discount)) / 100).toFixed(0)
}

const querySearchAsync = (
  queryString: string,
  callback: (suggestions: SearchSuggestion[]) => void,
) => {
  if (!queryString.trim()) {
    callback([])
    return
  }

  const query = queryString.toLowerCase().trim()
  const filtered = props.suggestions.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.category.toString().toLowerCase().includes(query),
  )

  callback(filtered.slice(0, 10))
}

const handleSelect = (item: Record<string, any>) => {
  const suggestion = item as SearchSuggestion
  emit('select', suggestion)
}

const handleSearch = () => {
  emit('search')
}

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
.search-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: var(--search-width, 500px);
  margin: 0 auto;
}

.search-input {
  width: 100%;
  height: 50px;
  border-radius: var(--border-radius, 10px);
}

.search-suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  width: 100%;
}

.suggestion-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.suggestion-content {
  flex: 1;
  min-width: 0;
}

.suggestion-title {
  font-weight: 500;
  color: var(--text-primary, #303133);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-price {
  display: flex;
  font-size: 12px;
  margin-top: 4px;
  align-items: center;
}

.current-price {
  color: var(--primary-color, #ff6600);
  font-weight: 600;
}

.original-price {
  text-decoration: line-through;
  color: var(--text-secondary, #8b8b8b);
  margin-left: 8px;
  font-size: 0.9em;
}

.suggestion-category {
  flex-shrink: 0;
  margin-left: 8px;
}

:deep(.el-autocomplete-suggestion__wrap) {
  max-height: 400px;
}

:deep(.el-autocomplete-suggestion__list) {
  padding: 8px 0;
}

:deep(.el-autocomplete-suggestion li) {
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
  line-height: normal;
}

:deep(.el-autocomplete-suggestion li:last-child) {
  border-bottom: none;
}

:deep(.el-autocomplete-suggestion li:hover) {
  background-color: #f5f7fa;
}

@media (max-width: 768px) {
  .search-section {
    width: 100%;
    padding: 0 10px;
  }
}
</style>
