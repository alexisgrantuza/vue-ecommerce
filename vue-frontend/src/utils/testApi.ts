// utils/testApi.ts
import { apiService } from '@/services/api';

export const testApiConnection = async () => {
    console.log('Testing API connection...');
    console.log('Base URL:', import.meta.env.VITE_SERVER_URL || 'http://localhost:3001/api');
    
    try {
        // Test basic connection
        const response = await apiService.get('/products');
        console.log('✅ API connection successful:', response.data);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error('❌ API connection failed:', error);
        
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
            console.error('Server is not running or not accessible');
        } else if (error.response) {
            console.error('Server responded with error:', error.response.status, error.response.data);
        } else {
            console.error('Unknown error:', error.message);
        }
        
        return { success: false, error: error.message };
    }
};

// You can call this in your component or main.ts to test
// testApiConnection();