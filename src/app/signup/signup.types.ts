export interface ISignup {
  form: FormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignup: (e: React.FormEvent) => Promise<void>;
  error: string | null;
  fieldErrors: Record<string, string>;
}

export const STEPS = [
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Digite seu e-mail",
  },
  {
    label: "Nome",
    name: "name",
    type: "text",
    placeholder: "Digite seu nome completo",
  },
  {
    label: "Telefone",
    name: "phone",
    type: "tel",
    placeholder: "Digite seu telefone",
  },
  {
    label: "Senha",
    name: "password",
    type: "password",
    placeholder: "Crie uma senha",
  },
  {
    label: "Confirmar Senha",
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirme sua senha",
  },
  {
    label: "CEP",
    name: "zipCode",
    type: "text",
    placeholder: "Digite seu CEP",
  },
  {
    label: "Rua",
    name: "street",
    type: "text",
    placeholder: "Digite sua rua",
  },
  {
    label: "Número",
    name: "number",
    type: "text",
    placeholder: "Digite o número da residência",
  },
  {
    label: "Bairro",
    name: "neighborhood",
    type: "text",
    placeholder: "Digite seu bairro",
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
