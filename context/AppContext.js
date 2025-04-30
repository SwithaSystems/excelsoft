import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        selectedBillingAddress,
        setSelectedBillingAddress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
