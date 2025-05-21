import axiosInstance from "./axiosConfig";
import createAxiosInstance, { jsonAxios } from "./axiosConfig";

export interface Product {
  id: string;
  name: string;
  description: string;
  title: string;
  stock: number;
  price: number;
  originalPrice: number;
  image: any;
  productColors: string[];
  categoryId: number[];
  rating: number;
  noOfreviews: number;
  minimumOrderQuantity: number;
  noOfReviews: number;
  noOfLikesandDislikes: number;
  isReturnable: boolean;
  reviews: {
    id: string;
    name: string;
    review: string;
    rating: number;
    text: string;
  }[];
}

export const ProductsAPI = {
  addProduct: async (data: any): Promise<Product> => {
    console.log("data in product service", data);
    const formDataAxios = createAxiosInstance("formdata");
    const response = await formDataAxios.post(`/products/create`, data);
    return response.data;
  },
  updateProduct: async (id: number, data: any): Promise<Product> => {
    console.log("data in product service", data);
    console.log("id", id);
    const formDataAxios = createAxiosInstance("formdata");
    const response = await formDataAxios.put(
      `/products/updateProduct/${id}`,
      data
    );
    return response.data;
  },

  getAllProducts: async (): Promise<Product[]> => {
    const response = await jsonAxios.get(`/products`);
    return response.data;
  },

  getProductByCategoryID: async (id: number): Promise<Product[]> => {
    console.log(id);
    const response = await jsonAxios.get(`/products/category/${id}`);
    console.log("AllProducts", response.data);
    return response.data;
  },

  getProductBYID: async (id: number): Promise<Product> => {
    const response = await jsonAxios.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await jsonAxios.get(`/products/search?q=${query}`);
    return response.data;
  },

  getAllSubCategoriesProducts: async (
    categoryIds: number[]
  ): Promise<Product[]> => {
    const response = await jsonAxios.post(`/products/subCategories`, {
      categoryIds: categoryIds,
    });
    return response.data;
  },

  addReview: async (productId: Number, review: any): Promise<void> => {
    console.log("productId", productId);
    console.log("review", review);
    await jsonAxios.post(`/products/${productId}/reviews`, review);
  },
};
