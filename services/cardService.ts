import { jsonAxios } from "./axiosConfig";

export interface Card {
  id: string;
  name: string;
  number: string;
  cvv: string;
  expiry: string;
};