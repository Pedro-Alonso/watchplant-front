import { InputProps } from "@/components/input/input";

export interface ILogin {
  email: string;
  password: string;
  emailInputProps: InputProps;
  passwordInputProps: InputProps;
  onLogin: () => Promise<void>;
}

export interface LoginResponse {
  jwtToken: string;
}
