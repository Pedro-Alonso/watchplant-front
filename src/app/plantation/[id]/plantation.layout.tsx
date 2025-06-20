import { PlantationDetailsHook } from "./plantation.types";
import { useRouter } from "next/navigation";

export default function PlantationDetailsLayout({
  plantation,
  plants,
  loading,
  selectedPlant,
  handleBack,
  handleSelectPlant,
}: PlantationDetailsHook) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center gap-6">
          <span className="text-green-700 text-xl font-bold">
            Carregando...
          </span>
        </div>
      </div>
    );
  }

  if (!plantation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center gap-6">
          <span className="text-red-700 text-xl font-bold">
            Plantação não encontrada.
          </span>
        </div>
      </div>
    );
  }

  if (selectedPlant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center gap-6">
          <h2 className="text-green-700 text-2xl font-bold mb-2">
            Detalhes da Planta
          </h2>
          <div className="w-full flex flex-col gap-2">
            <div>
              <span className="font-semibold">Nome comum:</span>{" "}
              {selectedPlant.commonName}
            </div>
            <div>
              <span className="font-semibold">Nome científico:</span>{" "}
              <span className="italic">{selectedPlant.scientificName}</span>
            </div>
            <div>
              <span className="font-semibold">Quantidade:</span>{" "}
              {selectedPlant.quantity}
            </div>
            {selectedPlant.plantationName && (
              <div>
                <span className="font-semibold">Plantação:</span>{" "}
                {selectedPlant.plantationName}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg flex flex-col items-center gap-6">
        <button
          className="self-start mb-2 px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          onClick={handleBack}
        >
          Voltar
        </button>
        <h1 className="text-green-700 text-3xl font-extrabold mb-2">
          {plantation.name}
        </h1>
        <div className="text-gray-700 text-lg mb-4 text-center">
          Área: {plantation.sizeArea} m²
        </div>
        <h2 className="text-xl font-bold mb-2">Plantas nesta plantação</h2>
        <ul className="w-full">
          {plants.length === 0 && (
            <li className="text-gray-500 text-center">
              Nenhuma planta cadastrada.
            </li>
          )}
          {plants.map((plant) => (
            <li
              key={plant.id}
              className="flex items-center justify-between border-b py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectPlant(plant)}
            >
              <span>
                <span className="font-semibold">{plant.commonName}</span>
                <span className="text-gray-500 ml-2 italic">
                  {plant.scientificName}
                </span>
              </span>
              <span className="ml-4 text-gray-700">Qtd: {plant.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            onClick={() =>
              router.push(`/plantation/${plantation.id}/add-plant`)
            }
          >
            Adicionar Planta
          </button>
        </div>
      </div>
    </div>
  );
}
