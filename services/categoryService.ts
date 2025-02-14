import axios from 'axios';

export interface Category {
  id: number;
  name: string;
  description?: string;
  images?: string[];
  parentCategory?: number;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3002';

export const categoryService = {
  getAllCategories: async (parentCategory?: number): Promise<Category[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        params: { parentCategory }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getAllSubCategories: async (parentCategory?:number):  Promise<Category[]>=>{
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${parentCategory}/subcategories`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching Subcategories:', error);
      throw error;
    }
  },

  getCategoryById: async (categoryId ? : number) : Promise<Category>=>{
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching Category:', error);
      throw error;
    }
  }
 
};
