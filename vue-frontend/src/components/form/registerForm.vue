<template>
  <!-- Header -->
  <div class="register-header">
    <div class="header-content">
      <el-text class="register-title">Join Shopiplus</el-text>
      <el-text class="register-subtitle">Create your account and start shopping</el-text>
    </div>
  </div>

  <!-- Registration Form -->
  <div class="register-form-container">
    <el-form
      :model="form"
      :rules="rules"
      ref="registerForm"
      class="register-form"
      @submit.prevent="handleSubmit"
    >
      <!-- Name Field -->
      <el-form-item prop="name">
        <el-input
          v-model="form.name"
          placeholder="Full Name"
          :prefix-icon="User"
          size="large"
          class="form-input"
        />
      </el-form-item>

      <!-- Email Field -->
      <el-form-item prop="email">
        <el-input
          v-model="form.email"
          type="email"
          placeholder="Email Address"
          :prefix-icon="Message"
          size="large"
          class="form-input"
        />
      </el-form-item>

      <!-- Phone Field -->
      <el-form-item prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="Phone Number"
          :prefix-icon="Phone"
          size="large"
          class="form-input"
        />
      </el-form-item>

      <!-- Password Field -->
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="Password"
          :prefix-icon="Lock"
          size="large"
          class="form-input"
          show-password
        />
      </el-form-item>

      <!-- Confirm Password Field -->
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="Confirm Password"
          :prefix-icon="Lock"
          size="large"
          class="form-input"
          show-password
        />
      </el-form-item>

      <!-- Terms Agreement -->
      <el-form-item prop="agreeTerms" class="terms-agreement">
        <el-checkbox v-model="form.agreeTerms" class="terms-checkbox">
          <span class="terms-text">
            I agree to the
            <el-link href="#" class="terms-link" underline="never">Terms of Service</el-link>
            and
            <el-link href="#" class="terms-link" underline="never">Privacy Policy</el-link>
          </span>
        </el-checkbox>
      </el-form-item>

      <!-- Submit Button -->
      <el-button
        type="primary"
        size="large"
        class="register-button"
        :loading="userStore.loading"
        native-type="submit"
      >
        {{ userStore.loading ? 'Creating Account...' : 'Create Account' }}
      </el-button>
    </el-form>

    <!-- Social Registration -->
    <div class="social-section">
      <el-divider>
        <el-text class="divider-text">Or continue with</el-text>
      </el-divider>

      <div class="social-buttons">
        <el-button class="social-btn google-btn" @click="handleGoogleSignup">
          <svg class="social-icon" viewBox="0 0 24 24">
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
          Google
        </el-button>

        <el-button class="social-btn facebook-btn" @click="handleFacebookSignup">
          <svg class="social-icon" viewBox="0 0 24 24">
            <path
              fill="#1877f2"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          Facebook
        </el-button>
      </div>
    </div>

    <!-- Login Link -->
    <div class="login-link">
      <div class="signin-prompt">
        Already have an account?
        <el-link type="primary" @click="handleShowLogin" class="login-link-btn">Sign in</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { User, Message, Phone, Lock } from '@element-plus/icons-vue'
import type { RegisterRequest, Address } from '@/types/api'
import { useRouter } from 'vue-router'
import { useUserAuthStore } from '@/stores/userAuth'
import { registerSchema } from '@/libs/z'
import z from 'zod'
import { formRules } from '@/utils/validators'

const router = useRouter()
const userStore = useUserAuthStore()

// Emits
const emit = defineEmits(['show-register', 'register-success'])

const handleShowLogin = () => {
  emit('show-register')
}

// Form reference
const registerForm = ref<FormInstance>()

// Form data with proper typing
interface FormData extends RegisterRequest {
  addressString?: string
}

const form = reactive<FormData>({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})

// Enhanced validation rules
const rules = reactive({
  ...formRules,
})

// Event handlers
const handleSubmit = async () => {
  if (!registerForm.value) return

  try {
    // First validate using Element Plus form validation
    const valid = await registerForm.value.validate()
    if (!valid) return

    // Prepare form data for Zod validation
    const formData = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
    }

    // Validate using Zod schema
    const validatedData = registerSchema.parse(formData)

    // Clear any previous errors
    userStore.setError(null)

    // Prepare registration request
    const registerRequest: RegisterRequest = {
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      phone: validatedData.phone,
    }

    // Call the store register action
    const result = await userStore.register(registerRequest)

    if (result.success) {
      ElMessage.success('Account created successfully! Welcome to Shopiplus!')
      registerForm.value.resetFields()

      // Reset form data
      Object.assign(form, {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
      })

      // Redirect to home page
      emit('register-success')
      router.push('/')
    } else {
      ElMessage.error(result.error || 'Registration failed')
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      const firstError = error.issues[0]
      ElMessage.error(firstError.message)
    } else {
      console.error('Registration error:', error)
      ElMessage.error('Registration failed. Please try again.')
    }
  }
}

const handleGoogleSignup = () => {
  ElMessage.info('Google signup feature coming soon!')
}

const handleFacebookSignup = () => {
  ElMessage.info('Facebook signup feature coming soon!')
}

// Initialize auth store on component mount
userStore.initializeAuth()
</script>

<style scoped>
.register-header {
  background: linear-gradient(135deg, #ff6600 0%, #ff8533 100%);
  color: white;
  padding: 48px 32px 32px;
  text-align: center;
  position: relative;
}

.register-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.header-content {
  position: relative;
  z-index: 1;
}

.register-title {
  color: white;
  display: block;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}

.register-subtitle {
  color: white;
  display: block;
  font-size: 16px;
  opacity: 0.95;
  margin: 0;
  font-weight: 400;
}

.register-form-container {
  padding: 32px;
}

.register-form {
  width: 100%;
}

/* Form styling */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.form-input .el-input__wrapper) {
  border-radius: 12px;
  border: 2px solid #f1f3f4;
  padding: 16px 20px;
  box-shadow: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafbfc;
}

:deep(.form-input .el-input__wrapper:hover) {
  border-color: #ff6600;
  background: #fff;
}

:deep(.form-input.is-focus .el-input__wrapper) {
  border-color: #ff6600;
  box-shadow: 0 0 0 4px rgba(255, 102, 0, 0.1);
  background: #fff;
}

:deep(.form-input .el-input__inner) {
  font-size: 16px;
  color: #1f2937;
  font-weight: 500;
}

:deep(.form-input .el-input__inner::placeholder) {
  color: #9ca3af;
  font-weight: 400;
}

:deep(.form-textarea .el-textarea__inner) {
  border-radius: 12px;
  border: 2px solid #f1f3f4;
  padding: 16px 20px;
  background: #fafbfc;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 16px;
  color: #1f2937;
  font-weight: 500;
  resize: vertical;
}

:deep(.form-textarea .el-textarea__inner:hover) {
  border-color: #ff6600;
  background: #fff;
}

:deep(.form-textarea .el-textarea__inner:focus) {
  border-color: #ff6600;
  box-shadow: 0 0 0 4px rgba(255, 102, 0, 0.1);
  background: #fff;
}

.terms-agreement {
  margin: 24px 0;
}

:deep(.terms-checkbox .el-checkbox__label) {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
}

.terms-text {
  display: inline;
}

:deep(.terms-link) {
  color: #ff6600;
  font-weight: 600;
  transition: color 0.3s ease;
}

:deep(.terms-link:hover) {
  color: #e55a00;
}

.register-button {
  width: 100%;
  height: 56px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #ff6600 0%, #ff8533 100%);
  border: none;
  margin-bottom: 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 102, 0, 0.4);
}

.register-button:active {
  transform: translateY(0);
}

.social-section {
  margin-bottom: 32px;
}

:deep(.el-divider) {
  margin: 24px 0;
}

:deep(.el-divider__text) {
  background: white;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.divider-text {
  background: white;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.social-buttons {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  height: 52px;
  border-radius: 12px;
  border: 2px solid #f1f3f4;
  background: #fafbfc;
  color: #374151;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-btn:hover {
  border-color: #d1d5db;
  background: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-icon {
  width: 20px;
  height: 20px;
}

.google-btn:hover {
  border-color: #4285f4;
}

.facebook-btn:hover {
  border-color: #1877f2;
}

.login-link {
  text-align: center;
  font-size: 15px;
  color: #6b7280;
  font-weight: 500;
}

:deep(.login-link-btn) {
  color: #ff6600;
  font-weight: 700;
  font-size: 15px;
  transition: color 0.3s ease;
}

:deep(.login-link-btn:hover) {
  color: #e55a00;
}

/* Responsive design */
@media (max-width: 480px) {
  .register-header {
    padding: 40px 24px 24px;
  }

  .register-title {
    font-size: 28px;
  }

  .register-subtitle {
    font-size: 14px;
  }

  .register-form-container {
    padding: 24px;
  }

  .social-buttons {
    flex-direction: column;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :deep(.form-input .el-input__wrapper) {
    background: #2a2a2a;
    border-color: #4b5563;
  }

  :deep(.form-input .el-input__wrapper:hover) {
    background: #333333;
  }

  :deep(.form-input.is-focus .el-input__wrapper) {
    background: #333333;
  }

  :deep(.form-input .el-input__inner) {
    color: #f9fafb;
  }

  :deep(.form-textarea .el-textarea__inner) {
    background: #2a2a2a;
    border-color: #4b5563;
    color: #f9fafb;
  }

  :deep(.terms-checkbox .el-checkbox__label) {
    color: #d1d5db;
  }

  .social-btn {
    background: #2a2a2a;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .social-btn:hover {
    background: #333333;
  }

  .divider-text {
    background: #1f2937;
    color: #9ca3af;
  }

  :deep(.el-divider__text) {
    background: #1f2937;
    color: #9ca3af;
  }

  .login-link {
    color: #d1d5db;
  }
}
</style>