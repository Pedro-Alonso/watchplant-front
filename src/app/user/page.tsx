"use client";

import { useEffect, useState } from "react";
import { UserDto } from "./user.types";
import { apiService } from "@/services/api";
import { useRouter } from "next/navigation";

const MOCK_USER: UserDto = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  address: {
    id: "1",
    zipCode: "12345-678",
    street: "Rua Exemplo",
    number: "123",
    neighborhood: "Bairro Exemplo",
  },
};

export default function UserProfilePage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      // router.push("/login");
      setUser(MOCK_USER);
      return;
    }
    apiService
      .get<UserDto>(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        // router.push("/login");
        setUser(MOCK_USER);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center gap-6">
          <span className="text-green-700 text-xl font-bold">
            Carregando perfil...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center gap-6">
          <span className="text-red-700 text-xl font-bold">
            Usuário não encontrado.
          </span>
          <button
            className="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            onClick={() => router.push("/homepage")}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center gap-6">
        <h1 className="text-green-700 text-3xl font-extrabold mb-2">
          Meu Perfil
        </h1>
        <div className="w-full flex flex-col gap-2">
          <div>
            <span className="font-semibold">Nome:</span> {user.name}
          </div>
          <div>
            <span className="font-semibold">E-mail:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold">Telefone:</span> {user.phone}
          </div>
          <div className="mt-4 font-bold text-green-800">Endereço</div>
          <div>
            <span className="font-semibold">CEP:</span> {user.address.zipCode}
          </div>
          <div>
            <span className="font-semibold">Rua:</span> {user.address.street}
          </div>
          <div>
            <span className="font-semibold">Número:</span> {user.address.number}
          </div>
          <div>
            <span className="font-semibold">Bairro:</span>{" "}
            {user.address.neighborhood}
          </div>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          onClick={() => router.push("/homepage")}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
