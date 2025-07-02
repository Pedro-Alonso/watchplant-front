"use client";

import { useEffect, useState, useRef } from "react";
import { UserDto } from "./user.types";
import { ApiError, useApiWithLoader } from "@/services/api";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layouts/main-layout";
import { PencilIcon } from "@/components/icons/pencil-icon";
import { TrashIcon } from "@/components/icons/trash-icon";
import ConfirmModal from "@/components/modals/confirm-modal";
import EditUserModal from "./components/edit-user-modal";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/auth/AuthContext";

export default function UserProfilePage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const router = useRouter();
  const httpClient = useApiWithLoader();
  const { logout } = useAuth();

  const httpClientRef = useRef(httpClient);
  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  const handleEditUser = async (data: {
    name?: string;
    phone?: string;
    address?: {
      id: string;
      zipCode: string;
      street: string;
      number: string;
      neighborhood: string;
    };
  }): Promise<boolean> => {
    if (!user) return false;
    setIsEditing(true);

    try {
      const response = await httpClientRef.current.put<UserDto>("/user", data);
      setUser({
        ...user,
        ...(response.data as UserDto),
      });
      setIsEditing(false);
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      setIsEditing(false);
      return false;
    }
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);

    try {
      await httpClientRef.current.delete("/user");
      setIsDeleting(false);
      setShowDeleteModal(false);

      logout();
    } catch (error) {
      console.error("Error deleting user:", error);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      try {
        console.log("Fetching user profile...");
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          console.error("No JWT token found in localStorage");
          if (isMounted) {
            routerRef.current.push("/login");
          }
          return;
        }

        const response = await httpClientRef.current.get<UserDto>("/user/me");

        if (isMounted) {
          console.log("User profile fetched successfully:", response.data);
          setUser(response.data);
        }
      } catch (error) {
        const apiError = error as ApiError;
        console.error(
          "Failed to fetch user profile:",
          apiError.message,
          apiError.response
        );

        if (isMounted) {
          // If there's an authentication error, clear local storage and redirect
          if (apiError.statusCode === 401) {
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("userId");
          }
          routerRef.current.push("/login");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      routerRef.current.push("/login");
      return;
    }

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout currentPage="user">
          <div className="flex items-center justify-center h-64">
            <span className="text-green-700 text-xl font-bold">
              Carregando perfil...
            </span>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <MainLayout currentPage="user">
          <div className="flex items-center justify-center h-64">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
              <span className="text-red-700 text-xl font-bold block text-center">
                Usuário não encontrado.
              </span>
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
                onClick={() => router.push("/homepage")}
              >
                Voltar
              </button>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout currentPage="user">
        <div className="mx-auto max-w-3xl">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-green-50 border-b border-green-100 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-green-800">Meu Perfil</h1>
              <div className="flex gap-2">
                <button
                  className="p-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setShowEditModal(true)}
                >
                  <PencilIcon />
                </button>
                <button
                  className="p-2 text-red-600 hover:text-red-800"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Informações Pessoais
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="mb-2">
                      <span className="font-semibold text-gray-600">Nome:</span>
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-600">
                        E-mail:
                      </span>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">
                        Telefone:
                      </span>
                      <p className="text-gray-900">{user.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Endereço
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {user.address ? (
                      <>
                        <div className="mb-2">
                          <span className="font-semibold text-gray-600">
                            CEP:
                          </span>
                          <p className="text-gray-900">
                            {user.address.zipCode}
                          </p>
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold text-gray-600">
                            Rua:
                          </span>
                          <p className="text-gray-900">{user.address.street}</p>
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold text-gray-600">
                            Número:
                          </span>
                          <p className="text-gray-900">{user.address.number}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">
                            Bairro:
                          </span>
                          <p className="text-gray-900">
                            {user.address.neighborhood}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500">Endereço não disponível</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  onClick={() => router.push("/homepage")}
                >
                  Voltar para Página Inicial
                </button>
              </div>
            </div>
          </div>
        </div>

        <EditUserModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditUser}
          user={user}
          isEditing={isEditing}
        />

        <ConfirmModal
          isOpen={showDeleteModal}
          title="Excluir Conta"
          message="Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          onConfirm={handleDeleteUser}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
