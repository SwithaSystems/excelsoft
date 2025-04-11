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

  userEditProfile: async (userId: any, body: any) => {
    console.log("body", body);
    const response = await axiosInstance.put(
      `/users/updateProfile/${userId}`,
      body
    );

    return response;
  },
};
