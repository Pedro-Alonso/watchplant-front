"use client";

import { useRouter } from "next/navigation";
import { NotificationBell } from "@/components/notification-bell/notification-bell";
import { useAuth } from "@/components/auth/AuthContext";

interface HeaderProps {
  currentPage: string;
}

export const Header = ({ currentPage }: HeaderProps) => {
  const router = useRouter();
  const { isAuthenticated, username, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1
              className="text-xl font-bold text-green-600 cursor-pointer"
              onClick={() => router.push("/homepage")}
            >
              WatchPlant
            </h1>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <button
                  onClick={() => router.push("/homepage")}
                  className={`text-sm font-medium ${
                    currentPage === "homepage"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Página Inicial
                </button>
                <button
                  onClick={() => router.push("/user")}
                  className={`text-sm font-medium ${
                    currentPage === "user"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Perfil
                </button>
              </nav>

              <div className="flex items-center space-x-4">
                <NotificationBell />

                <div className="relative">
                  <button
                    className="flex text-sm rounded-full focus:outline-none"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => router.push("/user")}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                      {username ? username.charAt(0).toUpperCase() : "U"}
                    </div>
                  </button>
                </div>

                <button
                  onClick={logout}
                  className="ml-2 px-3 py-1 text-sm text-gray-700 hover:text-gray-900"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/login")}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Entrar
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="ml-8 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Cadastrar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
