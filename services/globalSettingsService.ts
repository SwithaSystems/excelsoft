import { jsonAxios } from "./axiosConfig";

export interface GlobalSettingsDto {
  displayCarousel: boolean;
  timeWindow: number;
  deliveryModes: {
    homeDelivery: boolean;
    storePickup: boolean;
    curbsidePickup: boolean;
  };
  shippingCharge:number;
  minimumCheckoutOrderValue:number;
  minimumDeliveryOrderValue:number;
  updatedAt?: Date;
}

export const globalSettingsAPI = {
  getSettings: async () => {
    const response = await jsonAxios.get(`/global-settings`);
    return response;
  },

 updateSettings: async (key: string, value: boolean | number) => {
    // Key goes in the URL, value goes in the body
    const response = await jsonAxios.patch(`/global-settings/${key}`, {
      value,
    });
    return response;
  },

  updateAllSettings: async (settings: any) => {
    const response = await jsonAxios.put(`/global-settings`, settings);
    return response;
  },
};

export default globalSettingsAPI;
