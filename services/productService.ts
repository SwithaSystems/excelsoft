import createAxiosInstance, { jsonAxios } from "./axiosConfig";

export interface ProductImportStatistics {
  totalExtracted?: number;
  totalProducts?: number;
  total?: number;
  duplicatesInFile?: number;
  processed?: number;
  inserted?: number;
  updated?: number;
  skipped?: number;
  failed?: number;
  imagesUploaded?: number;
  imagesSkipped?: number;
}

export interface ProductImportResult {
  success: boolean;
  queued?: boolean;
  jobId?: string;
  message?: string;
  statistics?: ProductImportStatistics;
  succeeded?: unknown[];
  failed?: unknown[];
  durationMs?: number;
  completedAt?: string;
  runId?: string;
  error?: string;
}

export interface ProductImportJobStatus {
  jobId: string;
  status: "queued" | "running" | "completed" | "failed";
  startedAt: string;
  finishedAt?: string;
  fileName: string;
  result?: ProductImportResult;
  error?: string;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  title?: string;
  stock?: number;
  // discount: number;
  netPrice: number;
  grossPrice?: number;
  netPriceWithVAT?: number;
  image: any;
  productColors?: string[];
  categoryId: number[];
  rating: number;
  noOfreviews: number;
  minimumOrderQuantity?: number;
  noOfReviews: number;
  noOfLikesandDislikes?: number;
  isReturnable: boolean;
  isVatApplicable: boolean;
  vatRate: number;
  ageRestricted?: boolean | "true" | "false";
  isAgeRestricted?: boolean | "true" | "false";
  vatAmount: number;
  reviews: {
    id: string;
    name: string;
    review: string;
    rating: number;
    text: string;
  }[];
  onAddToCart?:()=> void;
}

export const ProductsAPI = {
  addProduct: async (data: any): Promise<Product> => {
    // console.log("data in product service", data);
    const formDataAxios = createAxiosInstance("formdata");
    const response = await formDataAxios.post(`/products/create`, data);
    return response.data;
  },
  updateProduct: async (id: number, data: any): Promise<Product> => {
    // console.log("data in product service", data);
    // console.log("id", id);
    const formDataAxios = createAxiosInstance("formdata");
    const response = await formDataAxios.put(
      `/products/updateProduct/${id}`,
      data
    );
    return response.data;
  },

//soft delete
  deleteProduct: async (id: any): Promise<Product> => {
    // console.log("id", id);
    const response = await jsonAxios.delete(`/products/${id}`);
    return response.data;
  },
deleteProduct_Permanently: async (id: any): Promise<Product> => {
    // console.log("id", id);
    const response = await jsonAxios.delete(`/products/hard/${id}`);
    return response.data;
  },

  // For bulk soft delete
bulkSoftDelete: async (ids: string[]): Promise<any> => {
  const response = await jsonAxios.delete(`/products/bulk-delete`, {
    data: { productIds: ids }
  });
  return response.data;
},

// For bulk hard delete
bulkHardDelete: async (ids: string[]): Promise<any> => {
  const response = await jsonAxios.delete(`/products/bulk-hard-delete`, {
    data: { productIds: ids }
  });
  return response.data;
},

  getAllProducts: async (
    page = 1,
    limit = 50
  ): Promise<{ data: Product[]; total: number }> => {
    const response = await jsonAxios.get(
      `/products?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getProductByCategoryID: async (id: number | string): Promise<Product[]> => {
    // console.log(id);
    const response = await jsonAxios.get(`/products/category/${id}`);
    // console.log("AllProducts", response.data);
    return response.data;
  },

  getProductBYID: async (id: number): Promise<Product> => {
    const response = await jsonAxios.get(`/products/${id}`);
    return response.data;
  },
  getProductBy_mongoID: async (id: string): Promise<Product> => {
    const response = await jsonAxios.get(`/products/byId/${id}`);
    return response.data;
  },
  getProductBy_multipleID: async (ids: string[]): Promise<Product[]> => {
    const response = await jsonAxios.post(`/products/byIds`, { ids: ids });
    return response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await jsonAxios.get(`/products/search?q=${query}`);
    return response.data;
  },

  productsBy_Name_Id: async (query: string): Promise<Product[]> => {
    const response = await jsonAxios.get(
      `/products/searchByNameID/Name?q=${query}`
    );
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

  addReview: async (productId: number, review: any): Promise<void> => {
    console.log("productId", productId);
    console.log("review", review);
    const formDataAxios = createAxiosInstance("formdata");
    const response = await formDataAxios.post(`/products/${productId}/reviews`, review);
    return response.data;
  },

  addProduct_Catagory_Upload_File: async (data: any) => {
    // console.log("data in product service", data);
    const formDataAxios = createAxiosInstance("formdata");
    const response = await formDataAxios.post(`/products/upload`, data);
    return response.data;
  },
  uploadProductImportPdf: async (data: FormData): Promise<ProductImportResult> => {
    const formDataAxios = createAxiosInstance("formdata");
    const response = await formDataAxios.post(`/product-import/upload-pdf`, data, {
      timeout: 300000,
    });
    return response.data;
  },
  getProductImportStatus: async (
    jobId: string
  ): Promise<ProductImportJobStatus> => {
    const response = await jsonAxios.get(`/product-import/status/${jobId}`, {
      timeout: 30000,
    });
    return response.data;
  },
  waitForProductImportResult: async (
    jobId: string,
    options: { intervalMs?: number; timeoutMs?: number } = {}
  ): Promise<ProductImportResult> => {
    const intervalMs = options.intervalMs ?? 3000;
    const timeoutMs = options.timeoutMs ?? 10 * 60 * 1000;
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      const status = await ProductsAPI.getProductImportStatus(jobId);

      if (status.status === "completed") {
        if (!status.result) {
          throw new Error("Import completed but no report was returned");
        }
        return status.result;
      }

      if (status.status === "failed") {
        throw new Error(status.error || "Import failed");
      }

      await wait(intervalMs);
    }

    throw new Error("Import is still running. Please check again shortly.");
  },
};
