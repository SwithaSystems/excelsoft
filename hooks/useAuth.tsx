import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// User type definition
type User = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
};

// Auth context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Default context value
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
};

// Create context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Mock user for development
const MOCK_USER: User = {
  id: "12345",
  firstName: "Katleena",
  lastName: "Dennis",
  email: "katleena@example.com",
};

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // For development, set mock user
    setUser(MOCK_USER);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login implementation
    setUser(MOCK_USER);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default useAuth;
