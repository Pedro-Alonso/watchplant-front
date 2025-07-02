"use client";

import { useSignup } from "./signup.hook";
import { SignupLayout } from "./signup.layout";

export default function Signup() {
  const signupProps = useSignup();

  return <SignupLayout {...signupProps} />;
}
