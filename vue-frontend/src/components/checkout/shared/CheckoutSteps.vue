<template>
    <el-steps 
      :active="currentStep" 
      finish-status="success" 
      align-center 
      class="checkout-steps"
    >
      <el-step 
        v-for="(step, index) in steps" 
        :key="index"
        :title="step"
        :description="currentStep > index + 1 ? 'Completed' : ''"
      />
    </el-steps>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue'
  
  defineProps<{
    currentStep: number
    steps: string[]
  }>()
  </script>
  
  <style scoped>
  .checkout-steps {
    margin-bottom: 30px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    .checkout-steps {
      display: none;
    }
  }
  </style>
  