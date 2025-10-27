import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the settings structure
export interface GlobalSettingsOptions {
  DisplayCarousal: boolean;
  TimeWindow: boolean;
  DeliveryMode: boolean;
}

interface GlobalSettings {
  enabled: boolean;
  options: GlobalSettingsOptions;
}

interface SettingsState {
  globalSettings: GlobalSettings;
}

// Define context type
interface AppContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  selectedBillingAddress: any;
  setSelectedBillingAddress: (address: any) => void;
  SelectedAddress: any;
  setSelectedAddress: (address: any) => void;
  settings: SettingsState;
  updateSetting: (
    option: keyof GlobalSettingsOptions,
    value: boolean
  ) => Promise<void>;
  toggleSetting: (option: keyof GlobalSettingsOptions) => Promise<void>;
  settingsLoading: boolean;
}

// Storage key
const SETTINGS_STORAGE_KEY = "@global_settings";

// Default settings
const defaultSettings: SettingsState = {
  globalSettings: {
    enabled: true,
    options: {
      DisplayCarousal: false,
      TimeWindow: false,
      DeliveryMode: false,
    },
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<any>(null);
  const [SelectedAddress, setSelectedAddress] = useState<any>(null);

  // Global settings state
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState<boolean>(true);

  // Load settings from storage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const updateSetting = async (
    option: keyof GlobalSettingsOptions,
    value: boolean
  ) => {
    try {
      const newSettings: SettingsState = {
        ...settings,
        globalSettings: {
          ...settings.globalSettings,
          options: {
            ...settings.globalSettings.options,
            [option]: value,
          },
        },
      };

      // Update state immediately (optimistic update)
      setSettings(newSettings);

      // Persist to storage
      await AsyncStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(newSettings)
      );

      // Optional: Sync with backend
      // await syncSettingsWithBackend(newSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      // Optionally revert on error
      await loadSettings();
    }
  };

  const toggleSetting = async (option: keyof GlobalSettingsOptions) => {
    const currentValue = settings.globalSettings.options[option];
    await updateSetting(option, !currentValue);
  };

  return (
    <AppContext.Provider
      value={{
        // Existing values
        isLoading,
        setIsLoading,
        selectedBillingAddress,
        setSelectedBillingAddress,
        SelectedAddress,
        setSelectedAddress,

        // Global settings values
        settings,
        updateSetting,
        toggleSetting,
        settingsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
