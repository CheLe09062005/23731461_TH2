import apiClient from './apiClient';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/products?limit=12');
  return response.data;
};
