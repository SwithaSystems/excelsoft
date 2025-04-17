import axios from "axios";
import axiosInstance from "./axiosConfig";

export enum PickupMode {
  HOME_DELIVERY = "homeDelivery",
  STORE_PICKUP = "storePickup",
  CURBSIDE_PICKUP = "curbsidePickup",
}

export interface OrderProduct {
  productId: string; // ObjectId will be received as a string
  name: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
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
  _id: string; // MongoDB default
  userId: string;
  products: OrderProduct[];
  shippingCharges: number;
  discounts: number[];
  tax: number;
  totalAmount: number;
  paymentMethod: string;
  pickupModeId: PickupMode;
  timeslot?: Date;
  shippingAddress?: ShippingAddress;
  pickupDetails?: PickupDetails;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const orderService = {
  getAllOrders: async (): Promise<Order[]> => {
    try {
      const response = await axiosInstance.get<Order[]>(
        `${API_BASE_URL}/orders`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  createOrder: async (orderPayload: Partial<Order>): Promise<Order> => {
    console.log("orderPayload", orderPayload);
    try {
      const response = await axiosInstance.post<Order>(
        `${API_BASE_URL}/orders`,
        orderPayload
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error create orders:", error);
      throw error;
    }
  },
};
