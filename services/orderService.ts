import axios from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { jsonAxios } from "./axiosConfig";

export enum PickupMode {
  HOME_DELIVERY = "Home Delivery",
  STORE_PICKUP = "Store Pickup",
  CURBSIDE_PICKUP = "Curbside Pickup",
}

export interface OrderProduct {
  productId: string;
  name: string;
  quantity: number;
  netPrice: number;
  ageRestricted?: boolean;
  isVatApplicable: boolean;
  vatRate: number;
  vatAmount: number;
  netPriceIncVat: number;
  grossPrice: number;
  selectedColor?: {
    colorCode: string;
    colorName: string;
  };
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface PickupDetails {
  date: string; // Date received as a string (ISO format)
  time: string;
  vehicleType?: string;
  vehicleNumber?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  additionalDetails?: string;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  userId: string;
  products: OrderProduct[];
  shippingCharges: number;
  // discounts: number[];
  tax: number;
  totalAmount: number;
  paymentMethod: string;
  pickupMode: PickupMode;
  deliveryDate?: string;
  deliveryTime?: string;
  shippingAddress?: ShippingAddress;
  billingAddress?: ShippingAddress;
  pickupDetails?: PickupDetails;
  createdAt: string;
  updatedAt: string;

  status?: string;
  reason?: string;
  lastValidStatus?: string;
}

export interface OrderVerificationScanResponse {
  _id: string;
  orderNumber?: string | number;
  products?: OrderProduct[];
  status?: string;
  pickupMode?: PickupMode | string;
}

export interface OrderVerificationCompleteResponse {
  success: boolean;
  message: string;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const getAuthToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem("token");
    }
    return null;
  }

  return SecureStore.getItemAsync("token");
};

export const orderService = {
  getAllOrders: async (): Promise<Order[]> => {
    try {
      // console.log("API_BASE_URL", `${API_BASE_URL}/orders`);
      const response = await jsonAxios.get<Order[]>(`${API_BASE_URL}/orders`);
      // console.log("AllOrders", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  getOrdersByUserId: async (userId: string): Promise<Order[]> => {
    try {
      const response = await jsonAxios.get<Order[]>(
        `${API_BASE_URL}/orders/user/${userId}`
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by userId:", error);
      throw error;
    }
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    try {
      const response = await jsonAxios.get<Order>(
        `${API_BASE_URL}/orders/getById/${orderId}`
      );
      // console.log("orderdata by id", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching order by orderId:", error);
      throw error;
    }
  },

  getOrderByMongoId: async (orderId: string): Promise<Order> => {
    try {
      const response = await jsonAxios.get<Order>(
        `${API_BASE_URL}/orders/${orderId}`
      );
      // console.log("orderdata by id", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching order by orderId:", error);
      throw error;
    }
  },

  createOrder: async (orderPayload: Partial<Order>): Promise<Order> => {
    try {
      const response = await jsonAxios.post<Order>(
        `${API_BASE_URL}/orders`,
        orderPayload
      );
      return response.data;
    } catch (error) {
      console.error("Error create orders:", error);
      throw error;
    }
  },

  /** Send "order placed" to both mobile (Expo) and web push. Call after createOrder from web or mobile. */
  notifyOrderPlaced: async (order: { _id: string; userId: string; orderNumber?: number | string }) => {
    try {
      await jsonAxios.post(
        `${API_BASE_URL}/notifications/orders/${order.userId}/placed`,
        { orderId: order._id, orderNumber: order.orderNumber }
      );
    } catch (e) {
      console.warn("Order placed notification request failed:", e);
    }
  },

  getOrdersByOrderDate: async (orderDate: string): Promise<Order[]> => {
    // console.log("todayorderDate", orderDate);
    try {
      const response = await jsonAxios.get<Order[]>(
        `${API_BASE_URL}/orders/by_date/${orderDate}`
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by orderDate:", error);
      throw error;
    }
  },

  getAllOrderStatuses: async (): Promise<{ statuses: string[] }> => {
    try {
      const response = await jsonAxios.get(`${API_BASE_URL}/orders/statuses`);
      // console.log("response of order status", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching order statuses", error);
      throw error;
    }
  },

  updateOrderStatus: async (orderPayload: Partial<Order>): Promise<Order> => {
    // console.log("orderPayload", orderPayload);
    try {
      const { _id, ...updateData } = orderPayload;

      const response = await jsonAxios.put<Order>(
        `${API_BASE_URL}/orders/${_id}/status`,
        updateData
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  getOrderByOrderNumber: async (
    orderNumber: string | number
  ): Promise<Order> => {
    try {
      console.log("order number",orderNumber);
      const response = await jsonAxios.get<Order>(
        `${API_BASE_URL}/orders/getByOrderNumber/${orderNumber}`
      );
      console.log("orderdata by orderNumber", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching order by orderNumber:", error);
      throw error;
    }
  },

  scanOrderVerification: async (
    code: string
  ): Promise<OrderVerificationScanResponse> => {
    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post<OrderVerificationScanResponse>(
        `${API_BASE_URL}/admin/order-verification/scan`,
        { code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error scanning order verification:", error);
      throw error;
    }
  },

  completeOrderVerification: async (
    orderId: string,
    success: boolean
  ): Promise<OrderVerificationCompleteResponse> => {
    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post<OrderVerificationCompleteResponse>(
        `${API_BASE_URL}/admin/order-verification/complete`,
        { orderId, success },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error completing order verification:", error);
      throw error;
    }
  },
};
