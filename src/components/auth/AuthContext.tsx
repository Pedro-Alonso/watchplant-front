"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const storedUserId = localStorage.getItem("userId");

    if (token && storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
      setUsername("Usuário");
    }
  }, []);

  const login = (token: string, userId: string) => {
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("userId", userId);
    setIsAuthenticated(true);
    setUserId(userId);
    setUsername("Usuário");
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");

    setIsAuthenticated(false);
    setUserId(null);
    setUsername(null);

    router.push("/login");
  };

  const checkAuth = (): boolean => {
    const token = localStorage.getItem("jwtToken");
    const storedUserId = localStorage.getItem("userId");
    return !!(token && storedUserId);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userId, username, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
