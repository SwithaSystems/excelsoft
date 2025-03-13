import axios from 'axios';

export enum PickupMode {
  HOME_DELIVERY = 'homeDelivery',
  STORE_PICKUP = 'storePickup',
  CURBSIDE_PICKUP = 'curbsidePickup',
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
  id: string; // ObjectId as a string
  userId: string;
  timeslot?: string; // Date string if applicable
  products: OrderProduct[];
  shippingCharges: number;
  discounts: number[];
  tax: number;
  totalAmount: number;
  paymentMethod: string;
  pickupMode: PickupMode;
  shippingAddress?: ShippingAddress;
  pickupDetails?: PickupDetails;
  createdAt: string; // Date string
  updatedAt: string; // Date string
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const orderService = {
  getAllOrders: async (): Promise<Order[]> => {
    try {
      const response = await axios.get<Order[]>(`${API_BASE_URL}/orders`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
};
