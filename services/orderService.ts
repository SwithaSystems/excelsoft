import axiosInstance from "./axiosConfig";

export enum PickupMode {
  HOME_DELIVERY = "Home Delivery",
  STORE_PICKUP = "Store Pickup",
  CURBSIDE_PICKUP = "Curbside Pickup",
}

export interface OrderProduct {
  productId: string; // ObjectId will be received as a string
  name: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  name: string;
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
  _id: string;
  orderNumber?: string;
  userId: string;
  products: OrderProduct[];
  shippingCharges: number;
  discounts: number[];
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

  getOrderById: async (orderId: string): Promise<Order> => {
    try {
      const response = await axiosInstance.get<Order>(
        `${API_BASE_URL}/orders/getById/${orderId}`
      );
      console.log("orderdata by id", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching order by orderId:", error);
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
