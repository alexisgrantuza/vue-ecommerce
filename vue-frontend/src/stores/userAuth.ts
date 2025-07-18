import { defineStore } from 'pinia'
import type { User } from '@/types/api'
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getUser as apiGetUser,
  deleteUser as apiDeleteUser,
} from '@/services/api'
import { ref, computed } from 'vue'

export const useUserAuthStore = defineStore('userAuth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => user.value !== null)
  const userId = computed(() => user.value?.id || null)

  const setUser = (userData: User) => {
    user.value = userData
  }

  const clearUser = () => {
    user.value = null
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const login = async (email: string, password: string) => {
    try {
        setLoading(true);
        setError(null);

        const response = await apiLogin({ email, password });
        console.log('Login response:', response);

        if (response.success && response.data) {
            // Make sure the user object has all required fields
            const userData = {
                ...response.data,
                // Ensure we have at least the required fields
                id: response.data.id,
                email: response.data.email,
                name: response.data.name || 'User'
            };
            setUser(userData);
            return { success: true, data: userData };
        } else {
            const errorMsg = response.message || 'Login failed';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message || 'Login failed';
        setError(errorMsg);
        console.error('Login error:', error);
        return { success: false, error: errorMsg };
    } finally {
        setLoading(false);
    }
};

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    address?: string,
  ) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiRegister({ name, email, password, phone, address })
      console.log(response)

      if (response.success && response.data) {
        setUser(response.data)
        return { success: true, data: response.data }
      } else {
        const errorMsg = response.message || 'Registration failed'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed'
      setError(errorMsg)
      console.error('Register error:', error)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setError(null)

      await apiLogout()
      clearUser()
      return { success: true }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Logout failed'
      setError(errorMsg)
      console.error('Logout error:', error)
      // Clear user even if logout API fails
      clearUser()
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const getUserById = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      console.log(id)
      const response = await apiGetUser(id)
      console.log(response)
      if (response.success && response.data) {
        return { success: true, data: response.data }
      } else {
        const errorMsg = response.message || 'Failed to get user'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to get user'
      setError(errorMsg)
      console.error('Get user by id error:', error)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const deleteUserAccount = async (id: number) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiDeleteUser(id)

      if (response.success) {
        // If deleting current user, clear the store
        if (user.value?.id === id) {
          clearUser()
        }
        return { success: true, data: response.data }
      } else {
        const errorMsg = response.message || 'Failed to delete user'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete user'
      setError(errorMsg)
      console.error('Delete user error:', error)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Helper method to check if user is authenticated on app start
  const checkAuth = async () => {
    try {
      if (!userId.value) {
        console.log('No user id found')
        return false
      }
      const response = await getUserById(userId.value)
      console.error(response)
      if (response.success && response.data) {
        setUser(response.data)
        return true
      }
      return false
    } catch (error) {
      console.error('Auth check failed:', error)
      return false
    }
  }

  return {
    // State
    user,
    isLoading,
    error,

    // Computed
    isAuthenticated,
    userId,

    // Actions
    setUser,
    clearUser,
    setError,
    login,
    register,
    logout,
    getUserById,
    deleteUserAccount,
    checkAuth,
  }
})