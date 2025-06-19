"use client";

import { useState } from "react";
import { ILogin } from "./login.types";
// import { useApiWithLoader } from "@/services/api";
import { useRouter } from "next/navigation";
import { InputProps } from "@/components/input/input";

export const useLogin = (): ILogin => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const httpClient = useApiWithLoader();
  const router = useRouter();
  const onLogin = async () => {
    try {
      // const response = await httpClient.post("/auth/login", {
      //   email,
      //   password,
      // });
      // console.log("Login successful:", response.data);
      router.push("/homepage");
    } catch (error) {
      console.error("Login failed:", error);
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
    emailInputProps,
    passwordInputProps,
    onLogin,
  };
};
