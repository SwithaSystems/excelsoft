import createAxiosInstance, { jsonAxios } from "./axiosConfig";

export interface Category {
  id: number;
  name: string;
  description?: string;
  images?: string[];
  parentCategory?: number;
}

export const categoryService = {
  addCategory: async (category: any): Promise<Category> => {
    try {
      const formDataAxios = createAxiosInstance("formdata");
      const response = await formDataAxios.post(`/categories`, category);
      return response.data;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  },
  updateCategory: async (categoryId: any, category: any): Promise<Category> => {
    console.log("updating category", categoryId, category);
    try {
      const formDataAxios = createAxiosInstance("formdata");
      const response = await formDataAxios.put(
        `/categories/updateCategory/${categoryId}`,
        category
      );
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },
  getAllCategories: async (parentCategory?: number): Promise<Category[]> => {
    try {
      const response = await jsonAxios.get(`/categories`, {
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
      const response = await jsonAxios.get(
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
      const response = await jsonAxios.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Category:", error);
      throw error;
    }
  },
};
