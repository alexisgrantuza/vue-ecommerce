import { apiService } from "./api";
import type { ApiResponse } from "../types/api";
import type { Product } from "../types/api";
import { handleApiResponse } from "./api";

// Product methods
export const getProducts = (): Promise<ApiResponse<Product[]>> => 
    handleApiResponse(() => apiService.get('/products'));

export const getProduct = (id: number): Promise<ApiResponse<Product>> => 
    handleApiResponse(() => apiService.get(`/products/${id}`));