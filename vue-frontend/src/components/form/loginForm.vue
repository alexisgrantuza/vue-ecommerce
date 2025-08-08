<template>
  <div class="login-header">
    <el-text class="login-title">Welcome Back!</el-text>
    <el-text class="login-subtitle">Sign in to continue shopping</el-text>
  </div>

  <div class="login-form-container">
    <el-form
      :model="form"
      :rules="rules"
      ref="loginForm"
      @submit.prevent="handleSubmit"
      class="login-form"
      hide-required-asterisk
    >
      <el-form-item prop="email">
        <el-input
          v-model="form.email"
          type="email"
          placeholder="Email Address"
          :prefix-icon="Message"
          size="large"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="Password"
          :prefix-icon="Lock"
          size="large"
          class="custom-input"
          show-password
        />
      </el-form-item>

      <div class="form-options">
        <el-checkbox v-model="rememberMe" class="remember-me"> Remember me </el-checkbox>
        <el-link href="#" class="forgot-password" underline="never"> Forgot Password? </el-link>
      </div>

      <el-button
        type="primary"
        size="large"
        class="login-button"
        :loading="userStore.loading"
        native-type="submit"
      >
        <span v-if="!userStore.loading">LOGIN</span>
        <span v-else>Signing in...</span>
      </el-button>
    </el-form>

    <div class="social-login">
      <el-divider class="custom-divider">
        <el-text class="divider-text">Or continue with</el-text>
      </el-divider>

      <div class="social-buttons">
        <el-button class="social-btn google-btn" @click="handleGoogleLogin">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285f4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34a853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#fbbc05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#ea4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Google</span>
        </el-button>

        <el-button class="social-btn facebook-btn" @click="handleFacebookLogin">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#1877f2"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          <span>Facebook</span>
        </el-button>
      </div>
    </div>

    <div class="signup-link">
      <el-text>Don't have an account? </el-text>
      <el-link class="signup-text" underline="never" @click="handleShowRegister"> Sign up </el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Message, Lock } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import type { LoginRequest } from '@/types/api'
import { useUserAuthStore } from '@/stores/userAuth'
import { loginSchema } from '@/libs/z'
import z from 'zod'
import { useRouter } from 'vue-router'
import { formRules } from '@/utils/validators'

const router = useRouter()
const userStore = useUserAuthStore()

//state
const rememberMe = ref(false)

//props
const props = defineProps({
  loginDialogVisible: {
    type: Boolean,
  },
})

// Emits
const emit = defineEmits(['register-clicked', 'success'])

const handleShowRegister = () => {
  emit('register-clicked')
}

const form = reactive<LoginRequest>({
  email: '',
  password: '',
})

const loginForm = ref<FormInstance>()

const rules = reactive({
  ...formRules,
})

const handleSubmit = async () => {
  if (!loginForm.value) return

  try {
    const valid = await loginForm.value.validate()
    if (!valid) return

    const formData = {
      email: form.email,
      password: form.password,
    }

    const validatedData = loginSchema.parse(formData)

    userStore.setError(null)

    const result = await userStore.login(validatedData, rememberMe.value)

    if (result.success) {
      ElMessage.success('Welcome back! Login successful!')

      loginForm.value.resetFields()
      Object.assign(form, { email: '', password: '' })
      rememberMe.value = false

      emit('success')
      router.push('/')
    } else {
      ElMessage.error(result.error || 'Login failed. Please try again.')
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      ElMessage.error(firstError.message)
    } else {
      console.error('Login error:', error)
      ElMessage.error('Login failed. Please try again.')
    }
  }
}

const handleGoogleLogin = () => {
  ElMessage.info('Google login feature coming soon!')
}

const handleFacebookLogin = () => {
  ElMessage.info('Facebook login feature coming soon!')
}

userStore.initializeAuth()
</script>

<style scoped>
.close-button-container {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

:deep(.close-button) {
  color: white;
  font-size: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  transition: all 0.3s ease;
}

:deep(.close-button:hover) {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.login-header {
  position: relative;
  background: linear-gradient(135deg, #ff6900 0%, #ff8533 100%);
  color: white;
  padding: 40px 30px 30px;
  text-align: center;
}

:deep(.login-title) {
  display: block;
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

:deep(.login-subtitle) {
  color: white;
  font-size: 16px;
  opacity: 0.9;
  font-weight: 400;
}

.login-form-container {
  padding: 40px 30px;
}

.login-form {
  width: 100%;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.custom-input .el-input__wrapper) {
  border-radius: 12px;
  border: 2px solid #f0f0f0;
  padding: 12px 16px;
  box-shadow: none;
  transition: all 0.3s ease;
  background: #fafbfc;
}

:deep(.custom-input .el-input__wrapper:hover) {
  border-color: #ff6900;
  background: #fff;
}

:deep(.custom-input.is-focus .el-input__wrapper) {
  border-color: #ff6900;
  box-shadow: 0 0 0 3px rgba(255, 105, 0, 0.1);
  background: #fff;
}

:deep(.custom-input .el-input__inner) {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

:deep(.custom-input .el-input__inner::placeholder) {
  color: #999;
  font-weight: 400;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

:deep(.remember-me .el-checkbox__label) {
  color: #666;
  font-weight: 500;
  font-size: 14px;
}

:deep(.forgot-password) {
  color: #ff6900;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.3s ease;
}

:deep(.forgot-password:hover) {
  color: #e55a00;
}

:deep(.login-button) {
  width: 100%;
  height: 52px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #ff6900 0%, #ff8533 100%);
  border: none;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 105, 0, 0.3);
}

:deep(.login-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 105, 0, 0.4);
}

:deep(.login-button:active) {
  transform: translateY(0);
}

.social-login {
  margin-bottom: 30px;
}

:deep(.custom-divider) {
  margin: 30px 0;
}

:deep(.custom-divider .el-divider__text) {
  background: black;
  color: #999;
  font-size: 14px;
  font-weight: 500;
  padding: 0 20px;
  border: none;
}

:deep(.divider-text) {
  color: #999;
  font-size: 14px;
  font-weight: 500;
}

.social-buttons {
  display: flex;
  gap: 12px;
}

:deep(.social-btn) {
  flex: 1;
  height: 48px;
  border-radius: 12px;
  border: 2px solid #f0f0f0;
  background: #fafbfc;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

:deep(.social-btn:hover) {
  border-color: #ddd;
  background: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.google-btn:hover) {
  border-color: #4285f4;
}

:deep(.facebook-btn:hover) {
  border-color: #1877f2;
}

.signup-link {
  text-align: center;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

:deep(.signup-link .el-text) {
  color: #666;
  font-size: 14px;
}

:deep(.signup-text) {
  color: #ff6900;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.3s ease;
}

:deep(.signup-text:hover) {
  color: #e55a00;
}

@media (max-width: 480px) {
  .login-page {
    padding: 10px;
  }

  .login-container {
    border-radius: 12px;
  }

  .login-header {
    padding: 30px 20px 20px;
  }

  :deep(.login-title) {
    font-size: 24px;
  }

  :deep(.login-subtitle) {
    font-size: 14px;
  }

  .login-form-container {
    padding: 30px 20px;
  }

  .social-buttons {
    flex-direction: column;
  }

  :deep(.social-btn) {
    width: 100%;
  }
}
</style>
