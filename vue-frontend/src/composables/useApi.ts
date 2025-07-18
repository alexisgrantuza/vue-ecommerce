// composables/useApi.ts - Fixed version
import { ref, computed } from 'vue';
import type { ApiResponse } from '@/types/api';

export function useApi<T = any>() {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isLoading = computed(() => loading.value);
  const hasError = computed(() => !!error.value);

  const execute = async (
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<T | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiCall();
      
      if (response.success && response.data) {
        data.value = response.data;
        return response.data;
      } else {
        error.value = response.message || response.error || 'An error occurred';
        return null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'An error occurred';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const reset = () => {
    data.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    data,
    loading,
    error,
    isLoading,
    hasError,
    execute,
    clearError,
    reset,
  };
}