import axios from 'axios';
import type { 
  LoginRequest, 
  RegisterRequest,
  Category, 
  User,
  ApiResponse, 
  AddToCartRequest,
  Cart,
  UpdateCartRequest,
  CreateOrderRequest,
  Order,
  Product
} from '@/types/api';

// Create axios instance with enhanced configuration
export const apiService = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:3001/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor for debugging
apiService.interceptors.request.use(
    (config) => {
        console.log('Making API request:', {
            method: config.method,
            url: config.url,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
apiService.interceptors.response.use(
    (response) => {
        console.log('API response received:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    (error) => {
        console.error('Response interceptor error:', {
            message: error.message,
            response: error.response ? {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                headers: error.response.headers
            } : null,
            request: error.request ? 'Request made but no response received' : null,
            config: error.config
        });
        return Promise.reject(error);
    }
);

// Helper function to handle API responses
export const handleApiResponse = async <T>(apiCall: () => Promise<any>): Promise<ApiResponse<T>> => {
    try {
        const response = await apiCall();
        return response.data;
    } catch (error: any) {
        console.error('API call failed:', error);
        throw error;
    }
};

// Auth methods
export const login = (credentials: LoginRequest): Promise<ApiResponse<User>> => 
    handleApiResponse(() => apiService.post('/users/login', credentials));

export const register = (userData: RegisterRequest): Promise<ApiResponse<User>> => 
    handleApiResponse(() => apiService.post('/users/register', userData));

export const logout = (): Promise<ApiResponse<User>> => 
    handleApiResponse(() => apiService.post('/users/logout'));

// Category methods
export const getCategories = (): Promise<ApiResponse<Category[]>> => 
    handleApiResponse(() => apiService.get('/categories'));

export const getCategory = (id: number): Promise<ApiResponse<Category>> => 
    handleApiResponse(() => apiService.get(`categories/${id}`));

export const deleteCategory = (id: number): Promise<ApiResponse<Category>> => 
    handleApiResponse(() => apiService.delete(`categories/${id}`));

// User methods
export const getUser = (id: number): Promise<ApiResponse<User>> => 
    handleApiResponse(() => apiService.get(`users/user/${id}`));

export const deleteUser = (id: number): Promise<ApiResponse<User>> => 
    handleApiResponse(() => apiService.delete(`users/user/${id}`));

export default apiService;


// Cart methods
export const addToCart = (data: AddToCartRequest): Promise<ApiResponse<Cart>> => 
    handleApiResponse(() => apiService.post('/cart', data));

export const updateCart = (data: UpdateCartRequest): Promise<ApiResponse<Cart>> => 
    handleApiResponse(() => apiService.put('/cart', data));

export const getCart = (): Promise<ApiResponse<Cart[]>> => 
    handleApiResponse(() => apiService.get('/cart'));

export const removeFromCart = (id: number): Promise<ApiResponse<Cart>> => 
    handleApiResponse(() => apiService.delete(`/cart/${id}`));


// Order methods
export const createOrder = (data: CreateOrderRequest): Promise<ApiResponse<Order>> => 
    handleApiResponse(() => apiService.post('/orders', data));

export const getOrders = (): Promise<ApiResponse<Order[]>> => 
    handleApiResponse(() => apiService.get('/orders'));

export const getOrder = (id: number): Promise<ApiResponse<Order>> => 
    handleApiResponse(() => apiService.get(`/orders/${id}`));

export const updateOrder = (id: number, data: CreateOrderRequest): Promise<ApiResponse<Order>> => 
    handleApiResponse(() => apiService.put(`/orders/${id}`, data));

export const deleteOrder = (id: number): Promise<ApiResponse<Order>> => 
    handleApiResponse(() => apiService.delete(`/orders/${id}`));



// Product methods
export const getProducts = (): Promise<ApiResponse<Product[]>> => 
    handleApiResponse(() => apiService.get('/products'));

export const getProduct = (id: number): Promise<ApiResponse<Product>> => 
    handleApiResponse(() => apiService.get(`/products/${id}`));