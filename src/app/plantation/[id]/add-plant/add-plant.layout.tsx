"use client";
import { useRouter, useParams } from "next/navigation";
import { IAddPlant, PlantSearchResultDto } from "./add-plant.types";
const WATERING_OPTIONS = [
  { value: "DAILY", label: "Diariamente" },
  { value: "EVERY_OTHER_DAY", label: "A cada dois dias" },
  { value: "TWICE_A_WEEK", label: "Duas vezes por semana" },
  { value: "WEEKLY", label: "Semanalmente" },
];

const SUNLIGHT_OPTIONS = [
  { value: "FULL_SUN", label: "Sol pleno" },
  { value: "PARTIAL_SHADE", label: "Sombra parcial" },
  { value: "SHADE", label: "Sombra total" },
];

const SOIL_TYPES = [
  { value: "SANDY", label: "Arenoso" },
  { value: "CLAY", label: "Argiloso" },
  { value: "LOAMY", label: "Franco" },
  { value: "PEATY", label: "Turfoso" },
];

export const AddPlantLayout = ({
  form,
  loading,
  error,
  success,
  handleChange,
  handleSubmit,
  searchQuery,
  setSearchQuery,
  handleSearch,
  searchResults,
  searching,
}: IAddPlant) => {
  const router = useRouter();
  const params = useParams();
  const plantationId = params?.id as string;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-10 rounded-xl shadow-lg min-w-[350px] flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-green-800 text-2xl font-bold mb-2 text-center">
          Adicionar Planta à Plantação
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nome da planta"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
          <button
            type="button"
            className="bg-green-700 text-white px-4 py-2 rounded font-semibold hover:bg-green-800"
            onClick={handleSearch}
            disabled={searching || !searchQuery}
          >
            {searching ? "Buscando..." : "Buscar"}
          </button>
        </div>
        {searchResults.length > 0 && (
          <ul className="border rounded p-2 max-h-40 overflow-y-auto bg-gray-50">
            {searchResults.map((plant: PlantSearchResultDto) => (
              <li
                key={plant.id}
                className={`cursor-pointer py-1 px-2 hover:bg-green-100 rounded ${
                  form.plantId == plant.id ? "bg-green-200" : ""
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: "plantId", value: plant.id },
                  })
                }
              >
                <span className="font-semibold">{plant.commonName}</span>
                <span className="ml-2 text-gray-500 italic">
                  {plant.scientificNames?.[0] || ""}
                </span>
              </li>
            ))}
          </ul>
        )}
        <input
          type="hidden"
          name="plantId"
          value={form.plantId}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantidade"
          min={1}
          value={form.quantity}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        />
        <select
          name="wateringFrequency"
          value={form.wateringFrequency}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        >
          <option value="">Frequência de rega</option>
          {WATERING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          name="sunlightIncidence"
          value={form.sunlightIncidence}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        >
          <option value="">Incidência Solar</option>
          {SUNLIGHT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          name="soilType"
          value={form.soilType}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        >
          <option value="">Tipo de Solo</option>
          {SOIL_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        {success && (
          <div className="text-green-700 text-sm text-center">
            Planta adicionada com sucesso!
          </div>
        )}
        <button
          type="submit"
          className="bg-green-800 text-white py-2 rounded font-semibold hover:bg-green-900"
          disabled={loading}
        >
          {loading ? "Adicionando..." : "Adicionar"}
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-800 py-2 rounded font-semibold hover:bg-gray-400"
          onClick={() => router.push(`/plantation/${plantationId}`)}
        >
          Voltar
        </button>
      </form>
    </div>
  );
};
