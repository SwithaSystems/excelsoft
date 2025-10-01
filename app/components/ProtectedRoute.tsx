import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Redirect } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    redirectToPage(containers.signInScreen);
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;