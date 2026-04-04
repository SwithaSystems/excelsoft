import { jsonAxios } from "./axiosConfig";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Address {
  _id: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  phone: string;
  addressType: string[];
  isDefault: boolean;
}

export const addressService = {
  getAllAddress: async (): Promise<Address[]> => {
    try {
      const response = await jsonAxios.get<Address[]>(
        `${API_BASE_URL}/address`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching address:", error);
      throw error;
    }
  },

  addAddress: async (
    AddressData: any
  ): Promise<{ data: Address; status: number }> => {
    // console.log("AddressData ADDED", AddressData);
    try {
      const response = await jsonAxios.post(
        `${API_BASE_URL}/address`,
        AddressData
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error("Error fetching address:", error);
      throw error;
    }
  },

  updateAddress: async (
    id: string,
    AddressData: Address
  ): Promise<{
    data: any;
    status: number;
  }> => {
    try {
      const response = await jsonAxios.put(
        `${API_BASE_URL}/address/${id}`,
        AddressData
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  },

  deleteAddress: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await jsonAxios.delete(`${API_BASE_URL}/address/${id}`);
      return { success: response.status === 200 };
    } catch (error) {
      console.error("Delete address error:", error);
      return { success: false };
    }
  },

  getAddressById: async (id: string): Promise<Address> => {
    try {
      // console.log("id of shippingAddress", id);
      const response = await jsonAxios.get<Address>(
        `${API_BASE_URL}/address/${id}`
      );
      // console.log("address - shipping", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching address:", error);
      throw error;
    }
  },
};
