import { jsonAxios } from "./axiosConfig";

export const cartSyncService = {
  getSyncedCart: async () => {
    const response = await jsonAxios.get(`/cart/sync`);
    return response;
  },

  syncCart: async (items: any[]) => {
    const response = await jsonAxios.put(`/cart/sync`, { items });
    return response;
  },
};

export default cartSyncService;
