import axios from "axios";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: any;
  productColors: string[];
  categoryId: number[];
  rating: number;
  noOfreviews: number;
  reviews: {
    id: string;
    name: string;
    review: string;
    rating: number;
    text: string;
  }[];
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3002";

export const ProductsAPI = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  },

  getProductByCategoryID: async (id: number): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products/category/${id}`);
    return response.data;
  },

  getProductBYID: async (id: string): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/products/search?q=${query}`
    );
    return response.data;
  },
};
