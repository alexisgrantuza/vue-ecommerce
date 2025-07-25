<script setup lang="ts">
import { useUserAuthStore } from '@/stores/userAuth'
import { onMounted } from 'vue'

const userStore = useUserAuthStore()
onMounted(() => {
  userStore.initializeAuth()
})
</script>

<template>
  <router-view></router-view>
</template>
