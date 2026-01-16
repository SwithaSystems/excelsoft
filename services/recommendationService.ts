import { jsonAxios } from "./axiosConfig";

/**
 * Interface for recommended product response from API
 * Matches the backend RecommendedProductDto
 */
export interface RecommendedProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  category: string;
  netPrice?: number;
  reviews?: number;
}

export interface RecommendationResponse {
  products: RecommendedProduct[];
  type: "recommended" | "hot_selling";
}

export const recommendationService = {
  /**
   * Get recommended products
   * For authenticated users: Returns products from user's last 3 orders (if available), otherwise hot selling products
   * For non-authenticated users: Returns hot selling products
   * @param limit - Maximum number of recommendations (default: 10)
   * @returns Object with products array and type ("recommended" | "hot_selling")
   */
  getRecommendedProducts: async (
    limit: number = 10
  ): Promise<RecommendationResponse> => {
    try {
      console.log(`[RecommendationService] Fetching recommendations with limit: ${limit}`);
      const response = await jsonAxios.get(
        `/recommendations/suggested?limit=${limit}`
      );
      console.log(`[RecommendationService] Response status: ${response.status}`);
      console.log(`[RecommendationService] Response data:`, response.data);
      
      // Handle new response format: { products: [...], type: "recommended" | "hot_selling" }
      let result: RecommendationResponse;
      if (response.data && typeof response.data === 'object' && 'products' in response.data && 'type' in response.data) {
        // New format: { products, type }
        result = {
          products: Array.isArray(response.data.products) ? response.data.products : [],
          type: response.data.type === "hot_selling" ? "hot_selling" : "recommended"
        };
      } else if (Array.isArray(response.data)) {
        // Legacy format: array (assume hot selling for backward compatibility)
        result = {
          products: response.data,
          type: "hot_selling"
        };
      } else {
        console.warn("[RecommendationService] Unexpected response format:", response.data);
        return { products: [], type: "hot_selling" };
      }
      
      // Log product count and source type
      if (result.products.length === 0) {
        console.log(`[RecommendationService] ⚠️ No products fetched - User has no orders or products not found`);
      } else {
        console.log(`[RecommendationService] ✅ Successfully fetched ${result.products.length} products (type: ${result.type})`);
        console.log(`[RecommendationService] 📦 Product IDs:`, result.products.map(p => p.id).join(', '));
        console.log(`[RecommendationService] 📦 Product names:`, result.products.map(p => p.name).join(', '));
      }
      
      return result;
    } catch (error: any) {
      console.error("[RecommendationService] Error fetching recommended products:", error);
      console.error("[RecommendationService] Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      // Re-throw to let the component handle it
      throw error;
    }
  },
};
