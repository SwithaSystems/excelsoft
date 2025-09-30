import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage } from "../services/storage.service"; // Import platform-aware storage
import { useDispatch } from "react-redux";
import { setUserData, clearUserData } from "../store/slices/userSlice";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (loginId: string, password: string) => Promise<void>;
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

      // First try to get cached user data from AsyncStorage (for offline support)
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        dispatch(setUserData(parsedUser));
        setIsAuthenticated(true);
      }

      // Then verify with authService and get fresh data
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);

        // Update Redux store
        dispatch(setUserData(currentUser));
      } else if (storedUser) {
        // Clear stale data if server says not authenticated
        dispatch(clearUserData());
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginId: string, password: string) => {
    try {
      const response = await authService.login(loginId, password);
      setIsAuthenticated(true);
      setUser(response.user);

      // Update Redux
      dispatch(setUserData(response.user));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authService.register(userData);
      setIsAuthenticated(true);
      setUser(response.user);

      // Update Redux
      dispatch(setUserData(response.user));
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();

      // Clear from AsyncStorage
      await AsyncStorage.removeItem("user");

      // Clear from platform storage (handled in authService.logout)
      await storage.removeItem("user");

      // Clear from Redux
      dispatch(clearUserData());

      // Update local state
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if server logout fails, clear local data
      await AsyncStorage.removeItem("user");
      await storage.removeItem("user");
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
