// services/promotionService.ts
import { jsonAxios, formDataAxios } from "./axiosConfig";

export interface Promotion {
  _id?: string;
  imageURL: string;
  title: string;
  isInternalLink: boolean;
  link: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  isLive?: boolean;
  products?: any[];
  category?: any; // Category ID or populated category object
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePromotionData {
  title: string;
  isInternalLink: boolean;
  link: string;
  image: File | any; // File for web, asset for mobile
  startDate?: string;
  endDate?: string;
  products?: any[];
  isLive?: boolean;
  category?: string; // Category ID
}

class PromotionService {
  private baseUrl = "/promotions";

  async getAllPromotions(): Promise<Promotion[]> {
    try {
      const response = await jsonAxios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching promotions:", error);
      throw error;
    }
  }

  async getPromotionById(id: string): Promise<Promotion> {
    try {
      const response = await jsonAxios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching promotion:", error);
      throw error;
    }
  }

  async createPromotion(data: CreatePromotionData): Promise<Promotion> {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("isInternalLink", data.isInternalLink.toString());
      formData.append("link", data.link);
      formData.append("image", data.image);
      
      if (data.startDate) {
        formData.append("startDate", data.startDate);
      }
      if (data.endDate) {
        formData.append("endDate", data.endDate);
      }
      // Always send products array (even if empty) to ensure backend receives it
      formData.append("products", JSON.stringify(data.products || []));
      // Send isLive flag if provided
      if (data.isLive !== undefined) {
        formData.append("isLive", data.isLive.toString());
      }
      // Send category if provided
      if (data.category) {
        formData.append("category", data.category);
      }

      const response = await formDataAxios.post(this.baseUrl, formData);
      return response.data;
    } catch (error) {
      console.error("Error creating promotion:", error);
      throw error;
    }
  }

  async updatePromotion(
    id: string,
    data: Partial<CreatePromotionData>
  ): Promise<Promotion> {
    try {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.isInternalLink !== undefined)
        formData.append("isInternalLink", data.isInternalLink.toString());
      if (data.link) formData.append("link", data.link);
      if (data.image) formData.append("image", data.image);
      if (data.startDate) {
        formData.append("startDate", data.startDate);
      }
      if (data.endDate) {
        formData.append("endDate", data.endDate);
      }
      // Always send products array (even if empty) to ensure backend receives it
      formData.append("products", JSON.stringify(data.products || []));
      // ALWAYS send isLive flag (even if false) to ensure backend receives it
      formData.append("isLive", (data.isLive !== undefined ? data.isLive : false).toString());
      // Send category if provided
      if (data.category) {
        formData.append("category", data.category);
      }
      
      console.log("promotionService.updatePromotion - Sending data:", {
        id,
        title: data.title,
        link: data.link,
        isInternalLink: data.isInternalLink,
        startDate: data.startDate,
        endDate: data.endDate,
        products: data.products?.length || 0,
        isLive: data.isLive,
        category: data.category,
      });

      const response = await formDataAxios.patch(`${this.baseUrl}/${id}`, formData);
      console.log("promotionService.updatePromotion - Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating promotion:", error);
      throw error;
    }
  }

  async deletePromotion(id: string): Promise<void> {
    try {
      await jsonAxios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error("Error deleting promotion:", error);
      throw error;
    }
  }
}

export const promotionService = new PromotionService();
