import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const TwilioApi = {
  sendOtp: async (body: { phone: string }): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/twilio/SendOtp`, body);
      console.log("OTP Sent Successfully:", response.data);
      return response;
    } catch (error) {
      console.error("Twilio API Error:");
    }
  },

  verifyOtp: async (body: any): Promise<any> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/twilio/verifyOtp`,
        body,
        {
          timeout: 10000, // 10 seconds timeout
        }
      );
      return response.data; // Return only data to reduce clutter
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
