import axiosInstance from "./axiosConfig";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const ReturnOrderService = {
  createReturnOrder: async (payload: any): Promise<any> => {
    try {
      const response = axiosInstance.post(
        `${API_BASE_URL}/returnOrders`,
        payload
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error create orders:", error);
      throw error;
    }
  },
};
