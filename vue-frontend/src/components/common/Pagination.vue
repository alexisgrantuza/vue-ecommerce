<template>
  <nav class="flex items-center space-x-1">
    <button
      @click="handlePageChange(currentPage - 1)"
      :disabled="currentPage === 1"
      class="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{
        'text-gray-500 hover:bg-gray-100': currentPage > 1,
        'text-gray-300': currentPage === 1,
      }"
    >
      <span class="sr-only">Previous</span>
      &laquo;
    </button>

    <template v-for="page in visiblePages" :key="page">
      <button
        v-if="typeof page === 'number'"
        @click="handlePageChange(page)"
        class="w-10 h-10 flex items-center justify-center rounded-md focus:outline-none"
        :class="{
          'bg-blue-600 text-white': page === currentPage,
          'text-gray-700 hover:bg-gray-100': page !== currentPage,
        }"
      >
        {{ page }}
      </button>
      <span v-else class="px-2 text-gray-500">
        {{ page }}
      </span>
    </template>

    <button
      @click="handlePageChange(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{
        'text-gray-500 hover:bg-gray-100': currentPage < totalPages,
        'text-gray-300': currentPage === totalPages,
      }"
    >
      <span class="sr-only">Next</span>
      &raquo;
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  maxVisible?: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const maxVisible = props.maxVisible || 5

const visiblePages = computed(() => {
  const range: (number | string)[] = []
  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, props.currentPage - half)
  let end = Math.min(props.totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  if (start > 1) {
    range.push(1)
    if (start > 2) {
      range.push('...')
    }
  }

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  if (end < props.totalPages) {
    if (end < props.totalPages - 1) {
      range.push('...')
    }
    range.push(props.totalPages)
  }

  return range
})

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>
