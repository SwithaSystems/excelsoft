import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { UserAPI } from "@/services/userService";

export const useRole = () => {
  const user = useSelector((state: any) => state.user.user);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isValidUser, setIsValidUser] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if (user) {
          const userId = user?._id ? user._id : user?.id;
          const response = await UserAPI.getUserById(userId);

          if (response?.data) {
            setIsAdmin(response.data.isAdmin);
            setUsername(response.data.firstName || "User");
            setIsValidUser(true);
          } else {
            setIsAdmin(false);
            setUsername(null);
            setIsValidUser(false);
          }
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

    fetchUser();
  }, [user]);

  return {
    isAdmin,
    isValidUser,
    username,
    loading,
    user,
  };
};