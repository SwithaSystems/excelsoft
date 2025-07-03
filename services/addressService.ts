import { AnimateStyle } from "react-native-reanimated";
import { AnimationType } from "expo-symbols";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { jsonAxios } from "./axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Address {
  _id: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export const addressService = {
  updateShippingAddress: async (
    shippingAddressData: Address
  ): Promise<{ data: Address; status: number }> => {
    try {
      const response = await jsonAxios.put(
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
      const response = await jsonAxios.delete(
        `${API_BASE_URL}/shippingAddress/${id}`
      );
      return { success: response.status === 200 };
    } catch (error) {
      console.error("Delete address error:", error);
      return { success: false };
    }
  },
  addShippingAddress: async (
    shippingAddressData: any
  ): Promise<{ data: Address; status: number }> => {
    console.log("AddressData ADDED", shippingAddressData);
    try {
      const response = await jsonAxios.post(
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
  getShippingAddressById: async (id: string): Promise<Address> => {
    try {
      console.log("id", id);
      const response = await jsonAxios.get<Address>(
        `${API_BASE_URL}/shippingAddress/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching shippingAddress:", error);
      throw error;
    }
  },
  addBillingAddress: async (
    billingAddressData: any
  ): Promise<{ data: Address; status: number }> => {
    try {
      const response = await jsonAxios.post(
        `${API_BASE_URL}/billingAddress`,
        billingAddressData
      );
      console.log("billingAddress", response.data);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  },

  getAllShppingAddress_userId: async (): Promise<Address[]> => {
    try {
      console.log("in homedelivery screen");
      const refresh_token = await AsyncStorage.getItem("refreshtoken");
      console.log("refreshtoken", refresh_token);
      const response = await jsonAxios.get<Address[]>(
        `${API_BASE_URL}/shippingAddress`
      );
      console.log("shippingAddress in service", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching shippingAddress:", error);
      throw error;
    }
  },
  getAllBillingAddress_userId: async (): Promise<Address[]> => {
    try {
      const response = await jsonAxios.get<Address[]>(
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
      const response = await jsonAxios.delete(
        `${API_BASE_URL}/billingAddress/${id}`
      );
      return { success: response.status === 200 };
    } catch (error) {
      console.error("Delete address error:", error);
      return { success: false };
    }
  },
  updateBillingAddress: async (
    billingAddressData: any
  ): Promise<{ data: any; status: number }> => {
    try {
      const response = await jsonAxios.put(
        `${API_BASE_URL}/billingAddress/${billingAddressData._id}`,
        billingAddressData
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  },
};
