import { apiService } from "./api";
import type { ApiResponse } from "../types/api";
import type { CreateOrderRequest, Order } from "../types/api";
import { handleApiResponse } from "./api";

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