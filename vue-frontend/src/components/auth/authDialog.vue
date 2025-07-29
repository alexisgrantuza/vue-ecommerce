<template>
  <el-dialog
    v-model="loginDialogVisible"
    width="400px"
    :show-close="false"
    :before-close="hideLogin"
    style="background-color: #000; border-radius: 12px"
  >
    <login-form 
      @register-clicked="showRegister"
      @success="handleLoginSuccess"
    />
  </el-dialog>

  <el-dialog
    v-model="registerDialogVisible"
    width="500px"
    :show-close="false"
    :before-close="hideRegister"
    style="background-color: #000; border-radius: 12px"
  >
    <register-form
      @login-clicked="showLogin"
      @success="handleRegisterSuccess"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import LoginForm from '@/components/form/loginForm.vue'
import RegisterForm from '@/components/form/registerForm.vue'
import { useAuthDialog } from '@/composables/useForm'

const {
  loginDialogVisible,
  registerDialogVisible,
  showLogin,
  showRegister,
  hideLogin,
  hideRegister,
  handleLoginSuccess,
  handleRegisterSuccess
} = useAuthDialog()
</script>

