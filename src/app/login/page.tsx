"use client";

import { LoginLayout } from "./login.layout";
import { useLogin } from "./login.hook";

const Login = () => {
  const props = useLogin();
  return <LoginLayout {...props} />;
};

export default Login;
