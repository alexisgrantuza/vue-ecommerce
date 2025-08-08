import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, RegisterRequest, LoginRequest } from '@/types/api'

export const useUserAuthStore = defineStore('userAuth', () => {
  const isAuthenticated = ref(false)
  const user = ref<User | null>(null)
  const token = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Initialize store from localStorage or sessionStorage
  function initializeAuth() {
    let storedUser = localStorage.getItem('user')
    let storedToken = localStorage.getItem('token')

    if (!storedUser || !storedToken) {
      storedUser = sessionStorage.getItem('user')
      storedToken = sessionStorage.getItem('token')
    }

    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
        isAuthenticated.value = true
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        logout()
      }
    }
  }

  async function register(userData: RegisterRequest) {
    try {
      loading.value = true
      error.value = null

      await new Promise((resolve) => setTimeout(resolve, 800))

      const users = JSON.parse(localStorage.getItem('users') || '[]')

      const userExists = users.some((u: User) => u.email === userData.email)
      if (userExists) {
        throw new Error('Email already registered')
      }

      const newUser: User = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        address: userData.address ? [userData.address] : [],
        created_at: new Date(),
        updated_at: new Date(),
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))

      const tokenValue = `user-token-${Date.now()}`
      user.value = newUser
      token.value = tokenValue

      return { success: true, user: newUser }
    } catch (err) {
      console.error('Registration error:', err)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  async function login(credentials: LoginRequest, rememberMe: boolean = false) {
    try {
      loading.value = true
      error.value = null

      await new Promise((resolve) => setTimeout(resolve, 600))
      
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const foundUser = users.find((u: User) => u.email === credentials.email)

      if (!foundUser) {
        throw new Error('User not found. Please check your email or register.')
      }

      if (foundUser.password !== credentials.password) {
        throw new Error('Invalid password. Please try again.')
      }

      const tokenValue = `user-token-${Date.now()}`
      user.value = foundUser
      token.value = tokenValue
      isAuthenticated.value = true

      // Store in localStorage if remember me is true
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(foundUser))
        localStorage.setItem('token', tokenValue)
      } else {
        // Store in sessionStorage for current session only
        sessionStorage.setItem('user', JSON.stringify(foundUser))
        sessionStorage.setItem('token', tokenValue)
        // Remove any existing localStorage data
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }

      return { success: true, user: foundUser }
    } catch (err) {
      console.error('Login error:', err)
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
    token.value = ''
    error.value = null

    // Clear all stored data
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  // Getters
  const isLoggedIn = () => isAuthenticated.value
  const getCurrentUser = () => user.value
  const getToken = () => token.value

  return {
    // State
    isAuthenticated,
    user,
    token,
    loading,
    error,

    // Actions
    register,
    login,
    logout,
    setError,
    initializeAuth,

    // Getters
    isLoggedIn,
    getCurrentUser,
    getToken,
  }
})