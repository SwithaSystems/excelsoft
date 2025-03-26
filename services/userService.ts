import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const UserAPI = {
  userSignUp: async (body: any) => {
    const response = await axios.post(`${API_BASE_URL}/users/signUp`, body);
    return response;
  },
  userSignIn: async (body: any): Promise<any> => {
    console.log("data", body);
    const response = await axios.post(`${API_BASE_URL}/users/signIn`, body);
    return response;
  },
};
