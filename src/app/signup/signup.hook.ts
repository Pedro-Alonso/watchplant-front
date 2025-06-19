import { useState } from "react";
import { FormState, ISignup, SignupBodyDto, STEPS } from "./signup.types";
import { useRouter } from "next/navigation";
import { useApiWithLoader } from "@/services/api";

const initialFormState: FormState = STEPS.reduce(
  (acc, step) => ({ ...acc, [step.name]: "" }),
  {} as FormState
);

export const useSignup = (): ISignup => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialFormState);

  const httpClient = useApiWithLoader();
  const router = useRouter();

  const currentStep = STEPS[step];
  const currentValue = form[currentStep.name];

  const onSignup = async () => {
    try {
      const body: SignupBodyDto = {
        name: form.name,
        phone: form.phone,
        account: {
          email: form.email,
          password: form.password,
        },
        address: {
          zipCode: form.zipCode,
          street: form.street,
          number: form.number,
          neighborhood: form.neighborhood,
        },
      };
      const response = await httpClient.post("/auth/signup", body);
      console.log("Form submitted:", response.data);
      router.push("/login");
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [currentStep.name]: e.target.value });
  };

  const handleNext = async () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else await onSignup();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };
  return {
    step,
    form,
    currentStep,
    currentValue,
    handleChange,
    handleNext,
    handleBack,
    steps: STEPS,
  };
};
