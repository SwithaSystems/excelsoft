import { jsonAxios } from "./axiosConfig";

export interface EntityOption {
  name: string;
  value: string;
}

export const EntityAPI = {
  getEntityOptions: async (): Promise<EntityOption[]> => {
    const response = await jsonAxios.get("/entity/entity-options");
    return response.data;
  },
};
