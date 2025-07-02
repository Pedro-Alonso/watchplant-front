"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = () => {
      const isAuth = isAuthenticated || checkAuth();
      console.log("ProtectedRoute: Authentication check", {
        isAuthenticated,
        checkAuthResult: checkAuth(),
      });

      if (!isAuth) {
        console.log("User not authenticated, redirecting to login");
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated, router, checkAuth]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
};
