import { apiService } from "./api";
import type { ApiResponse } from "../types/api";
import type { AddToCartRequest, Cart, UpdateCartRequest } from "../types/api";
import { handleApiResponse } from "./api";

// Cart methods
export const addToCart = (data: AddToCartRequest): Promise<ApiResponse<Cart>> => 
    handleApiResponse(() => apiService.post('/cart', data));

export const updateCart = (data: UpdateCartRequest): Promise<ApiResponse<Cart>> => 
    handleApiResponse(() => apiService.put('/cart', data));

export const getCart = (): Promise<ApiResponse<Cart[]>> => 
    handleApiResponse(() => apiService.get('/cart'));

export const removeFromCart = (id: number): Promise<ApiResponse<Cart>> => 
    handleApiResponse(() => apiService.delete(`/cart/${id}`));