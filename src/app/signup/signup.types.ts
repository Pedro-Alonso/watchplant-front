export interface ISignup {
  step: number;
  form: FormState;
  currentStep: (typeof STEPS)[number];
  currentValue: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => Promise<void>;
  handleBack: () => void;
  steps: typeof STEPS;
}

export const STEPS = [
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
  },
  {
    label: "Name",
    name: "name",
    type: "text",
    placeholder: "Enter your name",
  },
  {
    label: "Phone",
    name: "phone",
    type: "tel",
    placeholder: "Enter your phone",
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Create a password",
  },
  {
    label: "Zip Code",
    name: "zipCode",
    type: "text",
    placeholder: "Enter your zip code",
  },
  {
    label: "Street",
    name: "street",
    type: "text",
    placeholder: "Enter your street",
  },
  {
    label: "Number",
    name: "number",
    type: "text",
    placeholder: "Enter your house/building number",
  },
  {
    label: "Neighborhood",
    name: "neighborhood",
    type: "text",
    placeholder: "Enter your neighborhood",
  },
];

export type FormState = {
  [K in (typeof STEPS)[number]["name"]]: string;
};

export type SignupBodyDto = {
  name: string;
  phone: string;
  account: {
    email: string;
    password: string;
  };
  address: {
    zipCode: string;
    street: string;
    number: string;
    neighborhood: string;
  };
};
