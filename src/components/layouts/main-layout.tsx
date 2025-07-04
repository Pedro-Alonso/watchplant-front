"use client";

import { Header } from "@/components/header/header";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  currentPage: string;
}

export const MainLayout = ({ children, currentPage }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} WatchPlant - Todos os direitos
            reservados
          </p>
        </div>
      </footer>
    </div>
  );
};
