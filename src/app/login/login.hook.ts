"use client";

import { useState, useEffect } from "react";
import { ILogin, LoginResponse } from "./login.types";
import jwt from "jsonwebtoken";
import { ApiError, useApiWithLoader } from "@/services/api";
import { useRouter } from "next/navigation";
import { InputProps } from "@/components/input/input";
import { useAuth } from "@/components/auth/AuthContext";

export const useLogin = (): ILogin => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const httpClient = useApiWithLoader();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    // Check for auth error message from the interceptor
    const authError = localStorage.getItem("authError");
    if (authError) {
      setErrorMessage(authError);
      // Clear the error after displaying it
      localStorage.removeItem("authError");
    }
  }, []);

  const onLogin = async () => {
    try {
      setErrorMessage(null);
      const response = await httpClient.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      const token = response.data.jwtToken;
      const decodedToken = jwt.decode(token);
      const userId = decodedToken ? (decodedToken.sub as string) : "";

      // Use the auth context's login function
      login(token, userId);

      router.push("/homepage");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Login failed:", apiError.message);
      setErrorMessage("Login falhou. Verifique seu email e senha.");
    }
  };
  const emailInputProps: InputProps = {
    type: "email",
    placeholder: "Enter your email",
    value: email,
    onChange: (text) => setEmail(text.target.value),
    onBlur: (e) => console.log("Input blurred", e.target.value),
    onFocus: (e) => console.log("Input focused", e.target.value),
    disabled: false,
  };
  const passwordInputProps: InputProps = {
    type: "password",
    placeholder: "Enter your password",
    value: password,
    onChange: (text) => setPassword(text.target.value),
    onBlur: (e) => console.log("Input blurred", e.target.value),
    onFocus: (e) => console.log("Input focused", e.target.value),
    disabled: false,
  };
  return {
    email,
    password,
    errorMessage,
    emailInputProps,
    passwordInputProps,
    onLogin,
  };
};
