import axiosInstance from "./axiosConfig";

export const TwilioApi = {
  sendOtp: async (body: { phone: string }): Promise<any> => {
    try {
      const response = await axiosInstance.post(`/twilio/SendOtp`, body);
      return response;
    } catch (error) {
      console.error("Twilio API Error:", error);
      throw error;
    }
  },

  verifyOtp: async (body: any): Promise<any> => {
    try {
      console.log("body", body);
      const response = await axiosInstance.post(`/twilio/verifyOtp`, body);
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
