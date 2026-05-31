import axios from "axios";
import axiosInstance, { jsonAxios } from "./axiosConfig";
import createAxiosInstance from "./axiosConfig";

export const UserAPI = {
  userSignUp: async (body: any) => {
    const response = await jsonAxios.post(`/users/signUp`, body);
    return response;
  },

  userSignIn: async (body: any): Promise<any> => {
    const response = await jsonAxios.post(`/users/signIn`, body);
    return response;
  },

  userEditProfile: async (id: any, body: any) => {
    // console.log("Sending body to API:", body, id);
    const formDataAxios = createAxiosInstance("formdata");

    try {
      const response = await formDataAxios.put(
        `/users/updateProfile/${id}`,
        body,
        {
          // Profile image uploads can legitimately take longer on mobile/web.
          timeout: 120000,
        }
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.log("API error:", error.response?.data || error.message);
      } else {
        // console.log("Unknown error:", error);
      }
      throw error;
    }
  },
  userEditContact: async (id: any, body: any) => {
    // console.log("Sending body to API:", body);
    const formDataAxios = createAxiosInstance("formdata");

    try {
      const response = await formDataAxios.put(
        `/users/updateContact/${id}`,
        body
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.log("API error:", error.response?.data || error.message);
      } else {
        // console.log("Unknown error:", error);
      }
      throw error;
    }
  },

  verifyContact: async (userId: string, body: { type: "email" | "phone" }) => {
    try {
      const response = await jsonAxios.put(
        `/users/verifyContact/${userId}`,
        body
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Verify contact error:", error.response?.data || error.message);
      }
      throw error;
    }
  },

  getUserByPhonenumber: async (phoneNumber: any) => {
    // console.log("phoneNumber", phoneNumber);
    const response = await jsonAxios.get(
      `/users/getUserByPhoneNumber/${phoneNumber}`
    );
    return response;
  },

  getUserById: async (id: any) => {
    // console.log("id", id);
    const response = await jsonAxios.get(`/users/getUserById/${id}`);
    return response;
  },
  getUserByEmail: async (email: any) => {
    // console.log("email", email);
    const response = await jsonAxios.get(`/users/getUserByEmail/${email}`);
    return response;
  },

  /**
   * Signup-only status checks (includes soft-deleted accounts).
   */
  checkEmailStatus: async (email: string) => {
    const response = await jsonAxios.get(`/users/check-email/${email}`);
    return response;
  },

  checkPhoneStatus: async (phone: string) => {
    const response = await jsonAxios.get(`/users/check-phone/${phone}`);
    return response;
  },
  // changePassword: async (phoneNumber: any, body: any) => {
  //   const response = await axiosInstance.put(
  //     `/users/changePassword/${phoneNumber}`,
  //     body
  //   );
  //   return response;
  // },
  changePassword: async (body: { newPassword: string; currentPassword?: string }) => {
    // console.log("newPassword", body.newPassword);
    const requestBody: any = {
      newPassword: body.newPassword,
    };
    if (body.currentPassword) {
      requestBody.currentPassword = body.currentPassword;
    }
    const response = await jsonAxios.put("/users/changePassword", requestBody);
    return response;
  },

 resetPassword: async (body: { newPassword: string; phoneNumber?: string; email?: string }) => {
  const response = await jsonAxios.post("/users/resetPassword", {
    newPassword: body.newPassword,
    ...(body.phoneNumber ? { phoneNumber: body.phoneNumber } : { email: body.email }),
  });
  return response;
},

  getAllUsers: async () => {
    const response = await jsonAxios.get("/users");
    return response;
  },

  updateUserAccess: async (userId: string, isAdmin: boolean) => {
    const response = await jsonAxios.put(`/users/${userId}/access`, {
      isAdmin,
    });
    return response;
  },

  softDeleteUser : async(id:any)=>{
    const response = await jsonAxios.delete(`/users/${id}`);
    return response;
  }

};
