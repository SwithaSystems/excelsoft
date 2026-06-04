import { jsonAxios } from "./axiosConfig";

export interface StoreSettingsDto {
  storeName: string;
  contactDetails: string;
  storeAddress: string;
  isStoreOpen: boolean;
  storeOpeningTime: string;
  storeClosingTime: string;
  storeTimeZone: string;
  isConfigured?: boolean;
}

export const storeSettingsAPI = {
  getSettings: async () => {
    const response = await jsonAxios.get(`/store-settings`);
    return response;
  },

  updateSettings: async (payload: Partial<StoreSettingsDto>) => {
    const response = await jsonAxios.put(`/store-settings`, payload);
    return response;
  },
};
