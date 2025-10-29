import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define context type
interface AppContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  selectedBillingAddress: any;
  setSelectedBillingAddress: (address: any) => void;
  SelectedAddress: any;
  setSelectedAddress: (address: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<any>(null);
  const [SelectedAddress, setSelectedAddress] = useState<any>(null);

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
