import { useState } from "react";
import { FormState, ISignup, SignupBodyDto, STEPS } from "./signup.types";
import { useRouter } from "next/navigation";
import { ApiError, useApiWithLoader } from "@/services/api";

const initialFormState: FormState = STEPS.reduce(
  (acc, step) => ({ ...acc, [step.name]: "" }),
  {} as FormState
);

// Function to create the signup request body
const createSignupBody = (form: FormState): SignupBodyDto => ({
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
});

// Function to extract field errors from API response
const extractFieldErrors = (
  data: Record<string, string>
): { fieldErrors: Record<string, string>; hasFieldErrors: boolean } => {
  const fieldNames = [
    "name",
    "phone",
    "email",
    "password",
    "zipCode",
    "street",
    "number",
    "neighborhood",
  ];

  const fieldErrors: Record<string, string> = {};
  let hasFieldErrors = false;

  fieldNames.forEach((field) => {
    // Direct field errors
    if (data[field]) {
      fieldErrors[field] = data[field];
      hasFieldErrors = true;
    }

    // Special handling for nested fields
    if (field === "email" && data["account.email"]) {
      fieldErrors["email"] = data["account.email"];
      hasFieldErrors = true;
    }

    if (field === "password" && data["account.password"]) {
      fieldErrors["password"] = data["account.password"];
      hasFieldErrors = true;
    }
  });

  return { fieldErrors, hasFieldErrors };
};

// Main hook
export const useSignup = (): ISignup => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const httpClient = useApiWithLoader();
  const router = useRouter();

  // Validate form fields
  const validateForm = (): boolean => {
    // Reset errors before validation
    setError(null);
    setFieldErrors({});

    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "As senhas não coincidem" });
      return false;
    }

    return true;
  };

  // Handle API errors
  const handleApiError = (error: unknown): void => {
    console.error("Error during signup:", error);
    const apiError = error as ApiError;

    if (apiError.response && apiError.response.data) {
      const data = apiError.response.data as Record<string, string>;
      const { fieldErrors: extractedErrors, hasFieldErrors } =
        extractFieldErrors(data);

      if (hasFieldErrors) {
        setFieldErrors(extractedErrors);
      } else {
        // If there's a general error message
        setError(
          data.message ||
            "Ocorreu um erro durante o cadastro. Por favor, tente novamente."
        );
      }
    } else {
      setError(
        "Ocorreu um erro durante o cadastro. Por favor, tente novamente."
      );
    }
  };

  // Submit form
  const onSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const body = createSignupBody(form);
      const response = await httpClient.post("/auth/signup", body);
      console.log("Form submitted:", response.data);
      router.push("/login");
    } catch (error: unknown) {
      handleApiError(error);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name } = e.target;
    setForm({ ...form, [name]: e.target.value });

    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      const updatedErrors = { ...fieldErrors };
      delete updatedErrors[name];
      setFieldErrors(updatedErrors);
    }
  };

  return {
    form,
    handleChange,
    onSignup,
    error,
    fieldErrors,
  };
};
