<script setup lang="ts">
import { useUserAuthStore } from '@/stores/userAuth'
import { onMounted } from 'vue'
import AuthDialog from '@/components/auth/authDialog.vue'

const userStore = useUserAuthStore()
onMounted(() => {
  userStore.initializeAuth()
})
</script>

<template>
  <AuthDialog />
  <router-view></router-view>
</template>
