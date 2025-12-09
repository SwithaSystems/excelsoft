import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserAPI } from "@/services/userService";

interface RoleContextType {
  isValidUser: boolean;     
  isUser: boolean;          
  isAdmin: boolean;         
  isSuperAdmin: boolean;    
  username: string | null;
  loading: boolean;
  refreshRole: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType>({
  isValidUser: false,
  isUser: false,
  isAdmin: false,
  isSuperAdmin: false,
  username: null,
  loading: true,
  refreshRole: async () => {},
});

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: any) => state.user.user);

  const [isValidUser, setIsValidUser] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async () => {
    // No user in Redux? means no login
    if (!user) {
      setIsValidUser(false);
      setIsUser(false);
      setIsAdmin(false);
      setIsSuperAdmin(false);
      setUsername(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const id = user._id || user.id;

      const response = await UserAPI.getUserById(id);
      const data = response?.data;

      if (data) {
        const superadmin = data.isSuperAdmin === true;
        const admin = data.isAdmin === true;

        console.log('🔍 Role Data:', {
          isAdmin: data.isAdmin,
          isSuperAdmin: data.isSuperAdmin,
          final_isAdmin: admin || superadmin,
          final_isUser: !admin && !superadmin
        });


        // Login is valid
        setIsValidUser(true);

        // Actual roles
        setIsSuperAdmin(superadmin);
        setIsAdmin(admin || superadmin);     // Inheritance: superadmin → admin
        setIsUser(!admin && !superadmin);    // Normal customer

        setUsername(data.firstName || "User");
      }

    } catch (err) {
        // On error, default to regular user (NOT admin)
        setIsUser(true);
        setIsAdmin(false);
        setIsSuperAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  return (
    <RoleContext.Provider
      value={{
        isValidUser,
        isUser,
        isAdmin,
        isSuperAdmin,
        username,
        loading,
        refreshRole: fetchUserRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = () => useContext(RoleContext);
