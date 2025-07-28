<template>
  <el-dialog
    v-model="loginDialogVisible"
    title="Login"
    width="400px"
    :before-close="hideLogin"
    destroy-on-close
  >
    <LoginForm @success="handleLoginSuccess" @register-clicked="showRegister" />
  </el-dialog>

  <!-- Register Dialog -->
  <el-dialog
    v-model="registerDialogVisible"
    title="Register"
    width="500px"
    :before-close="hideRegister"
    destroy-on-close
  >
    <RegisterForm @success="handleRegisterSuccess" @login-clicked="showLogin" />
  </el-dialog>
</template>

<script setup lang="ts">
import { useAuthDialog } from '@/composables/useForm'
import LoginForm from '@/components/form/loginForm.vue'
import RegisterForm from '@/components/form/registerForm.vue'

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