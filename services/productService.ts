import axiosInstance from "./axiosConfig";

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

export const ProductsAPI = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products`);
    return response.data;
  },

  getProductByCategoryID: async (id: number): Promise<Product[]> => {
    console.log(id);
    const response = await axiosInstance.get(`/products/category/${id}`);
    console.log("AllProducts", response.data);
    return response.data;
  },

  getProductBYID: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/search?q=${query}`);
    return response.data;
  },

  getAllSubCategoriesProducts: async (
    categoryIds: number[]
  ): Promise<Product[]> => {
    const response = await axiosInstance.post(`/products/subCategories`, {
      categoryIds: categoryIds,
    });
    return response.data;
  },

  addReview: async (productId: Number, review: any): Promise<void> => {
    await axiosInstance.post(`/products/${productId}/reviews`, review);
  },
};
