import axios from "axios";
import axiosInstance from "./axiosConfig";

export const UserAPI = {
  userSignUp: async (body: any) => {
    const response = await axiosInstance.post(`/users/signUp`, body);
    return response;
  },

  userSignIn: async (body: any): Promise<any> => {
    const response = await axiosInstance.post(`/users/signIn`, body);
    return response;
  },

  userEditProfile: async (phoneNumber: any, body: any) => {
    console.log("body", body);
    try {
      const response = await axiosInstance.put(
        `/users/updateProfile/${phoneNumber}`,
        body
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Axios error:", error.response?.data || error.message);
      } else {
        console.log("Unknown error:", error);
      }
    }
  },

  getUserByPhonenumber: async (phoneNumber: any) => {
    const response = await axiosInstance.get(
      `/users/getUserByPhoneNumber/${phoneNumber}`
    );
    return response;
  },

  changePassword: async (phoneNumber: any, body: any) => {
    const response = await axiosInstance.put(
      `/users/changePassword/${phoneNumber}`,
      body
    );
    return response;
  },
};
