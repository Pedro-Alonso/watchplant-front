import { IHomepage } from "./homepage.types";

export default function HomepageLayout({
  plantations,
  loading,
  handleSelectPlantation,
  handleCreatePlantation,
  handleLogout,
}: IHomepage) {
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center gap-6">
          <span className="text-green-700 text-xl font-bold">
            Carregando...
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg flex flex-col items-center gap-6">
        <h1 className="text-green-700 text-3xl font-extrabold mb-2">
          Minhas Plantações
        </h1>
        <ul className="w-full">
          {plantations.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between border-b py-2"
            >
              <span className="font-semibold">{p.name}</span>
              <span className="text-gray-500">{p.sizeArea} m²</span>
              <button
                className="ml-4 px-3 py-1 bg-green-700 text-white rounded hover:bg-green-800"
                onClick={() => handleSelectPlantation(p.id)}
              >
                Ver detalhes
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            onClick={handleCreatePlantation}
          >
            Nova Plantação
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={handleLogout}
          >
            Sair
          </button>
          <a
            href="/user"
            className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 font-semibold"
          >
            Meu Perfil
          </a>
        </div>
      </div>
    </div>
  );
}
