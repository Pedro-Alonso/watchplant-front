"use client";

import { IHomepage } from "./homepage.types";
import { MainLayout } from "@/components/layouts/main-layout";

export default function HomepageLayout({
  plantations,
  loading,
  handleSelectPlantation,
  handleCreatePlantation,
}: IHomepage) {
  if (loading) {
    return (
      <MainLayout currentPage="homepage">
        <div className="flex items-center justify-center h-64">
          <span className="text-green-700 text-xl font-bold">
            Carregando...
          </span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout currentPage="homepage">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-green-50 border-b border-green-100">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-green-800">
                Minhas Plantações
              </h1>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                onClick={handleCreatePlantation}
              >
                Nova Plantação
              </button>
            </div>
          </div>

          <div className="p-6">
            {plantations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Você ainda não possui nenhuma plantação.
                </p>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  onClick={handleCreatePlantation}
                >
                  Criar minha primeira plantação
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {plantations.map((plantation) => (
                  <li
                    key={plantation.name}
                    className="py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectPlantation(plantation.name)}
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {plantation.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Área: {plantation.sizeArea} m²
                      </p>
                    </div>
                    <div>
                      <button
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlantation(plantation.name);
                        }}
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
