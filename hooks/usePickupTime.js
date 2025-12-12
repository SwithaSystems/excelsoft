import { useState, useEffect } from "react";
import { globalSettingsAPI } from "../services/globalSettingsService";

export function usePickupTime() {
  const [pickupTime, setPickupTime] = useState(2);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPickupTime = async () => {
      try {
        const response = await globalSettingsAPI.getSettings();
        const timeWindowEnabled = response.data?.timeWindow;
        // console.log("timeWindowEnabled", timeWindowEnabled);
        setPickupTime(timeWindowEnabled ? 2 : 0);
      } catch (error) {
        console.error("Failed to fetch pickup time settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPickupTime();
  }, []);

  return { pickupTime, loading };
}
