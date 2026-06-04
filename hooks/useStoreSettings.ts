import { useEffect, useState } from "react";
import { storeSettingsAPI, StoreSettingsDto } from "@/services/storeSettingsService";

const fallback: StoreSettingsDto = {
  storeName: "",
  contactDetails: "",
  storeAddress: "",
  isStoreOpen: true,
  storeOpeningTime: "07:00",
  storeClosingTime: "17:00",
  storeTimeZone: "Europe/London",
  isConfigured: false,
};

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettingsDto>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const resp = await storeSettingsAPI.getSettings();
        setSettings({ ...fallback, ...(resp.data || {}) });
      } catch (error) {
        console.error("Failed to load store settings", error);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return { settings, loading };
}
