import { useState, useEffect } from "react";
import { globalSettingsAPI } from "../services/globalSettingsService";

export function usePickupTime() {
  const [pickupTime, setPickupTime] = useState(2);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPickupTime = async () => {
      try {
        const response = await globalSettingsAPI.getSettings();
        const timeWindowMinutes = Number(response.data?.timeWindow);
        if (Number.isFinite(timeWindowMinutes) && timeWindowMinutes > 0) {
          setPickupTime(timeWindowMinutes / 60);
        } else {
          // Default to 120 minutes (2 hours) when no value is set
          setPickupTime(2);
        }
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
