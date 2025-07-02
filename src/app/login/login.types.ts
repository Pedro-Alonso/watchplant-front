import { InputProps } from "@/components/input/input";

export interface ILogin {
  email: string;
  password: string;
  errorMessage: string | null;
  emailInputProps: InputProps;
  passwordInputProps: InputProps;
  onLogin: () => Promise<void>;
}

export interface LoginResponse {
  jwtToken: string;
}
