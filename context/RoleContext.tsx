import React, {createContext, useContext, useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { UserAPI } from "@/services/userService";

interface RoleContextType {
  isAdmin: boolean;
  isValidUser: boolean;
  username: string | null;
  loading: boolean;
  refreshRole: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType>({
    isAdmin: false,
    isValidUser: false,
    username: null,
    loading: true,
    refreshRole: async () => {},
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = useSelector((state: any) => state.user.user);
    
    const [isAdmin, setIsAdmin] = useState(false);
    const [isValidUser, setIsValidUser] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserRole = async () => {
      if (!user) {
        // Don't make API call if no user
        setIsAdmin(false);
        setUsername(null);
        setIsValidUser(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userId = user?._id || user?.id;
        console.log("id", userId);
        
        const response = await UserAPI.getUserById(userId);

        if (response?.data) {
          setIsAdmin(response.data.isAdmin || false);
          setUsername(response.data.firstName || "User");
          setIsValidUser(true);
        } else {
          setIsAdmin(false);
          setUsername(null);
          setIsValidUser(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsAdmin(false);
        setUsername(null);
        setIsValidUser(false);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchUserRole();
    }, [user]); 

    return (
      <RoleContext.Provider value={{ isAdmin, isValidUser, username, loading, refreshRole: fetchUserRole }}>
        {children}
      </RoleContext.Provider>
    );
};

export const useRoleContext = () => useContext(RoleContext);