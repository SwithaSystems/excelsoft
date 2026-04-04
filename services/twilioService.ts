import { jsonAxios } from "./axiosConfig";

export const TwilioApi = {
  sendOtp: async (body: { phone: string; intent?: "register" | "recover" }): Promise<any> => {
    try {
      const response = await jsonAxios.post(`/twilio/SendOtp`, body);
      return response;
    } catch (error: any) {
      const status = error?.response?.status;
      const backendMessage = error?.response?.data?.message;
      console.error("OTP Send Error:", error?.response?.data || error?.message || error);
      if (status === 409 && backendMessage?.toLowerCase().includes("otp already sent")) {
        const cooldownSeconds = 30;
        throw new Error(`OTP already sent recently. Please wait ${cooldownSeconds} seconds before requesting another.`);
      }
      throw new Error(backendMessage || "Failed to send OTP. Please try again.");
    }
  },

  verifyOtp: async (body: any): Promise<any> => {
    try {
      // console.log("body", body);
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

  sendOtp_Email: async (body: {
    email: string;
    intent?: "register" | "recover";
  }): Promise<any> => {
    try {
      const response = await jsonAxios.post(`/sendGrid/SendOtpEmail`, body);
      return response;
    } catch (error: any) {
      const status = error?.response?.status;
      const backendMessage = error?.response?.data?.message;
      console.error("OTP Send Error:", error?.response?.data || error?.message || error);
      if (status === 409 && backendMessage?.toLowerCase().includes("otp already sent")) {
        const cooldownSeconds = 30;
        throw new Error(`OTP already sent recently. Please wait ${cooldownSeconds} seconds before requesting another.`);
      }
      throw new Error(backendMessage || "Failed to send OTP. Please try again.");
    }
  },

  verifyOtp_Email: async (body: any): Promise<any> => {
    try {
      // console.log("body in verifyOtp", body);
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
      // console.log("body", body);
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
