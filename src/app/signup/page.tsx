"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/api";
import Input from "@/components/input/input";

export default function Signup() {
  const router = useRouter();
  const httpClient = apiService;
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    zipCode: "",
    street: "",
    number: "",
    neighborhood: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    const signupData = {
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
    await httpClient.post("/signup", signupData);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-10 rounded-xl shadow-lg min-w-[350px] flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-green-800 text-2xl font-bold mb-2 text-center">
          Criar Conta
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <Input
              type="text"
              placeholder="Nome completo"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              type="tel"
              placeholder="Telefone"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              placeholder="Confirme a senha"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <Input
              type="text"
              placeholder="CEP"
              value={form.zipCode}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              placeholder="Rua"
              value={form.street}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              placeholder="Número"
              value={form.number}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              placeholder="Bairro"
              value={form.neighborhood}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        <button
          type="submit"
          className="bg-green-800 text-white py-2 rounded font-semibold hover:bg-green-900"
        >
          Cadastrar
        </button>
        <div className="text-center mt-2">
          <a
            href="/login"
            className="text-green-800 underline text-sm hover:text-green-900"
          >
            Já tem uma conta? Entrar
          </a>
        </div>
      </form>
    </div>
  );
}
