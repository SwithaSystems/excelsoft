import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/auth.service";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (phone: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await authService.isAuthenticated();
    const currentUser = await authService.getCurrentUser();
    setIsAuthenticated(isAuth);
    setUser(currentUser);
  };

  const login = async (phone: string, password: string) => {
    const response = await authService.login(phone, password);
    setIsAuthenticated(true);
    setUser(response.user);
  };

  const register = async (userData: any) => {
    const response = await authService.register(userData);
    setIsAuthenticated(true);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout }}
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
