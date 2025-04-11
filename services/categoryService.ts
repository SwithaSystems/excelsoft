import axiosInstance from "./axiosConfig";

export interface Category {
  id: number;
  name: string;
  description?: string;
  images?: string[];
  parentCategory?: number;
}

export const categoryService = {
  getAllCategories: async (parentCategory?: number): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get(`/categories`, {
        params: { parentCategory },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  getAllSubCategories: async (parentCategory?: number): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get(
        `/categories/${parentCategory}/subcategories`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Subcategories:", error);
      throw error;
    }
  },

  getCategoryById: async (categoryId?: number): Promise<Category> => {
    try {
      const response = await axiosInstance.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Category:", error);
      throw error;
    }
  },
};
