import { jsonAxios } from "./axiosConfig";

export interface GlobalSettingsDto {
  displayCarousel: boolean;
  timeWindow: boolean;
  deliveryMode: boolean;
  shippingCharge:number;
  minimumCheckoutOrderValue:number;
  minimumDeliveryOrderValue:number;
  updatedAt?: Date;
}

export const globalSettingsAPI = {
  getSettings: async () => {
    const response = await jsonAxios.get(`/global-settings`);
    // console.log("Global Settings Response:", response);
    return response;
  },

 updateSettings: async (key: string, value: boolean | number) => {
    // Key goes in the URL, value goes in the body
    const response = await jsonAxios.patch(`/global-settings/${key}`, {
      value,
    });
    // console.log("Global Settings Response:", response);
    return response;
  },

  updateAllSettings: async (settings: any) => {
    // console.log("All Settings:", settings);
    const response = await jsonAxios.put(`/global-settings`, settings);
    // console.log("Global Settings All Response:", response);
    return response;
  },
};

export default globalSettingsAPI;
