// services/promotionService.ts
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export interface Promotion {
  _id?: string;
  imageURL: string;
  title: string;
  isInternalLink: boolean;
  link: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePromotionData {
  title: string;
  isInternalLink: boolean;
  link: string;
  image: File | any; // File for web, asset for mobile
}

class PromotionService {
  private baseUrl = `${API_URL}/promotions`;

  async getAllPromotions(): Promise<Promotion[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching promotions:", error);
      throw error;
    }
  }

  async getPromotionById(id: string): Promise<Promotion> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
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

      const response = await axios.post(this.baseUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

      const response = await axios.patch(`${this.baseUrl}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating promotion:", error);
      throw error;
    }
  }

  async deletePromotion(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error("Error deleting promotion:", error);
      throw error;
    }
  }
}

export const promotionService = new PromotionService();
