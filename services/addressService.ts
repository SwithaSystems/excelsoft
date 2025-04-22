import axiosInstance from "./axiosConfig";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Address {
  _id: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export const addressService = {
  addShippingAddress: async (
    shippingAddressData: any
  ): Promise<{ data: Address; status: number }> => {
    console.log("AddressData ADDED", shippingAddressData);
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/shippingAddress`,
        shippingAddressData
      );
      console.log("shippingAddress", response);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  },

  updateShippingAddress: async (
    shippingAddressData: Address
  ): Promise<{ data: Address; status: number }> => {
    try {
      const response = await axiosInstance.put(
        `${API_BASE_URL}/shippingAddress/${shippingAddressData._id}`,
        shippingAddressData
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  },

  deleteShippingAddress: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await axiosInstance.delete(
        `${API_BASE_URL}/shippingAddress/${id}`
      );
      return { success: response.status === 200 };
    } catch (error) {
      console.error("Delete address error:", error);
      return { success: false };
    }
  },
  addBillingAddress: async (billingAddressData: Address): Promise<Address> => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/billingAddress`,
        billingAddressData
      );
      console.log("shippingAddress", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllShppingAddress_userId: async (): Promise<Address[]> => {
    try {
      const response = await axiosInstance.get<Address[]>(
        `${API_BASE_URL}/shippingAddress`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching shippingAddress:", error);
      throw error;
    }
  },
  getAllBillingAddress_userId: async (): Promise<Address[]> => {
    try {
      const response = await axiosInstance.get<Address[]>(
        `${API_BASE_URL}/billingAddress`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching billingAddress:", error);
      throw error;
    }
  },
  deleteBillingAddress: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await axiosInstance.delete(
        `${API_BASE_URL}/billingAddress/${id}`
      );
      return { success: response.status === 200 };
    } catch (error) {
      console.error("Delete address error:", error);
      return { success: false };
    }
  },
};
