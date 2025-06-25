import { jsonAxios } from "./axiosConfig";

export const TwilioApi = {
  sendOtp: async (body: { phone: string }): Promise<any> => {
    try {
      const response = await jsonAxios.post(`/twilio/SendOtp`, body);
      return response;
    } catch (error) {
      console.error("Twilio API Error:", error);
      throw error;
    }
  },

  verifyOtp: async (body: any): Promise<any> => {
    try {
      console.log("body", body);
      const response = await jsonAxios.post(`/twilio/verifyOtp`, body);
      return response.data;
    } catch (error: any) {
      console.error(
        "Verify OTP Error:",
        error?.response?.data || error.message
      );
      throw new Error(
        error?.response?.data?.message || "Failed to verify OTP."
      );
    }
  },

  sendOtp_Email: async (body: { email: string }): Promise<any> => {
    try {
      const response = await jsonAxios.post(`/sendGrid/SendOtpEmail`, body);
      return response;
    } catch (error) {
      console.error("Twilio API Error:", error);
      throw error;
    }
  },

  verifyOtp_Email: async (body: any): Promise<any> => {
    try {
      console.log("body in verifyOtp", body);
      const response = await jsonAxios.post(`/sendGrid/verifyOtpEmail`, body);
      return response.data;
    } catch (error: any) {
      console.error(
        "Verify OTP Error:",
        error?.response?.data || error.message
      );
      throw new Error(
        error?.response?.data?.message || "Failed to verify OTP."
      );
    }
  },
  resentOtp_Email: async (body: any): Promise<any> => {
    try {
      console.log("body", body);
      const response = await jsonAxios.post(`/sendGrid/resentOtpEmail`, body);
      return response.data;
    } catch (error: any) {
      console.error(
        "Verify OTP Error:",
        error?.response?.data || error.message
      );
      throw new Error(
        error?.response?.data?.message || "Failed to verify OTP."
      );
    }
  },
};
