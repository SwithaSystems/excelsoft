import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setUserData, clearUserData } from "../store/slices/userSlice"; //

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (phone: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);

      // First try to get cached user data from AsyncStorage
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        dispatch(setUserData(parsedUser)); // Update Redux store
        setIsAuthenticated(true);
      }

      // Then verify with authService and get fresh data
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);

        // Update AsyncStorage with fresh data
        // await AsyncStorage.setItem("user", JSON.stringify(currentUser));

        // Update Redux store
        dispatch(setUserData(currentUser));
      } else if (storedUser) {
        // Clear stale data if server says not authenticated
        // await AsyncStorage.removeItem("user");
        dispatch(clearUserData());
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Optional: Handle specific error cases
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, password: string) => {
    try {
      const response = await authService.login(phone, password);
      setIsAuthenticated(true);
      setUser(response.user);

      // Save to AsyncStorage
      // await AsyncStorage.setItem("user", JSON.stringify(response.user));

      // Update Redux
      dispatch(setUserData(response.user));
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw to handle in the UI
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authService.register(userData);
      setIsAuthenticated(true);
      setUser(response.user);

      // Save to AsyncStorage
      // await AsyncStorage.setItem("user", JSON.stringify(response.user));

      // Update Redux
      dispatch(setUserData(response.user));
    } catch (error) {
      console.error("Registration failed:", error);
      throw error; // Re-throw to handle in the UI
    }
  };

  const logout = async () => {
    try {
      await authService.logout();

      // Clear from AsyncStorage
      await AsyncStorage.removeItem("user");

      // Clear from Redux
      dispatch(clearUserData());

      // Update local state
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if server logout fails, clear local data
      await AsyncStorage.removeItem("user");
      dispatch(clearUserData());
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
