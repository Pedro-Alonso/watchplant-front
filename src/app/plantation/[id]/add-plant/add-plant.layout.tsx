"use client";
import { useRouter, useParams } from "next/navigation";
import { IAddPlant, PlantSearchResultDto } from "./add-plant.types";
import { useRef, useEffect } from "react";

const WATERING_OPTIONS = [
  { value: "FREQUENT", label: "Frequente" },
  { value: "AVERAGE", label: "Média" },
  { value: "MINIMUM", label: "Mínima" },
  { value: "NONE", label: "Nenhuma" },
];

const SUNLIGHT_OPTIONS = [
  { value: "FULL_SUN", label: "Sol pleno" },
  { value: "PART_SHADE", label: "Meia sombra" },
  { value: "FULL_SHADE", label: "Sombra" },
  { value: "SUN_PART_SHADE", label: "Sol parcial" },
  { value: "PART_SUN_PART_SHADE", label: "Sol/sombra parcial" },
];

const SOIL_TYPES = [
  { value: "SAND", label: "Arenoso" },
  { value: "CLAY", label: "Argiloso" },
  { value: "LOAM", label: "Franco" },
  { value: "PEAT", label: "Turfoso" },
  { value: "HUMUS_ENRICHED", label: "Húmus enriquecido" },
  { value: "SILT", label: "Siltoso" },
  { value: "CHALK", label: "Calcário" },
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
  selectedPlant,
  handleSelectPlant,
  showDropdown,
  setShowDropdown,
}: IAddPlant) => {
  const router = useRouter();
  const params = useParams();
  const plantationId = params?.id as string;

  // Reference to the search results dropdown
  const dropdownRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowDropdown]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-10 rounded-xl shadow-lg min-w-[350px] max-w-[500px] flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-green-800 text-2xl font-bold mb-2 text-center">
          Adicionar Planta à Plantação
        </h2>

        <div className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nome da planta"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
              ref={searchInputRef}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
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

          {showDropdown && (
            <ul
              ref={dropdownRef}
              className="absolute left-0 right-0 mt-1 border rounded p-2 max-h-60 overflow-y-auto bg-white shadow-lg z-10"
            >
              {searchResults.length > 0 ? (
                searchResults.map((plant: PlantSearchResultDto) => (
                  <li
                    key={plant.id}
                    className="cursor-pointer py-2 px-3 hover:bg-green-100 rounded transition-colors"
                    onClick={() => handleSelectPlant(plant)}
                  >
                    <div className="font-semibold">
                      {plant.commonName || "Unknown Plant"}
                    </div>
                    {plant.scientificNames &&
                      plant.scientificNames.length > 0 && (
                        <div className="text-gray-500 italic text-sm">
                          {Array.isArray(plant.scientificNames)
                            ? plant.scientificNames[0]
                            : ""}
                        </div>
                      )}
                  </li>
                ))
              ) : (
                <li className="py-2 px-3 text-gray-500">
                  Nenhuma planta encontrada. Tente outro termo de busca.
                </li>
              )}
            </ul>
          )}
        </div>

        {selectedPlant && (
          <div className="bg-green-50 p-4 rounded border border-green-200 mt-2">
            <h3 className="font-bold text-green-800 mb-2">
              Planta Selecionada
            </h3>
            <p>
              <span className="font-semibold">Nome comum:</span>{" "}
              {selectedPlant.commonName}
            </p>
            {selectedPlant.scientificName && (
              <p>
                <span className="font-semibold">Nome científico:</span>{" "}
                <span className="italic">{selectedPlant.scientificName}</span>
              </p>
            )}
            {selectedPlant.careLevel && (
              <p>
                <span className="font-semibold">Nível de cuidado:</span>{" "}
                {selectedPlant.careLevel}
              </p>
            )}
            {selectedPlant.cycle && (
              <p>
                <span className="font-semibold">Ciclo:</span>{" "}
                {selectedPlant.cycle}
              </p>
            )}

            {/* Recommended values section */}
            <div className="mt-3 pt-3 border-t border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">
                Valores Recomendados:
              </h4>

              {selectedPlant.idealWateringFrequency && (
                <p>
                  <span className="font-semibold">Frequência de rega:</span>{" "}
                  {selectedPlant.idealWateringFrequency === "FREQUENT" &&
                    "Frequente"}
                  {selectedPlant.idealWateringFrequency === "AVERAGE" &&
                    "Média"}
                  {selectedPlant.idealWateringFrequency === "MINIMUM" &&
                    "Mínima"}
                  {selectedPlant.idealWateringFrequency === "NONE" && "Nenhuma"}
                  {selectedPlant.idealWateringFrequency !== "FREQUENT" &&
                    selectedPlant.idealWateringFrequency !== "AVERAGE" &&
                    selectedPlant.idealWateringFrequency !== "MINIMUM" &&
                    selectedPlant.idealWateringFrequency !== "NONE" &&
                    selectedPlant.idealWateringFrequency}
                </p>
              )}

              {selectedPlant.idealSunlightIncidences &&
                selectedPlant.idealSunlightIncidences.length > 0 && (
                  <p>
                    <span className="font-semibold">Incidência solar:</span>{" "}
                    {selectedPlant.idealSunlightIncidences.map((sun, index) => (
                      <span key={index}>
                        {sun === "FULL_SUN" && "Sol pleno"}
                        {sun === "PART_SHADE" && "Meia sombra"}
                        {sun === "FULL_SHADE" && "Sombra"}
                        {sun === "SUN_PART_SHADE" && "Sol parcial"}
                        {sun === "PART_SUN_PART_SHADE" && "Sol/sombra parcial"}
                        {sun !== "FULL_SUN" &&
                          sun !== "PART_SHADE" &&
                          sun !== "FULL_SHADE" &&
                          sun !== "SUN_PART_SHADE" &&
                          sun !== "PART_SUN_PART_SHADE" &&
                          sun}
                        {index <
                        (selectedPlant.idealSunlightIncidences?.length || 0) - 1
                          ? ", "
                          : ""}
                      </span>
                    ))}
                  </p>
                )}

              {selectedPlant.idealSoilTypes &&
                selectedPlant.idealSoilTypes.length > 0 && (
                  <p>
                    <span className="font-semibold">Tipo de solo:</span>{" "}
                    {selectedPlant.idealSoilTypes.map((soil, index) => (
                      <span key={index}>
                        {soil === "SAND" && "Arenoso"}
                        {soil === "CLAY" && "Argiloso"}
                        {soil === "LOAM" && "Franco"}
                        {soil === "PEAT" && "Turfoso"}
                        {soil === "HUMUS_ENRICHED" && "Húmus enriquecido"}
                        {soil === "SILT" && "Siltoso"}
                        {soil === "CHALK" && "Calcário"}
                        {soil !== "SAND" &&
                          soil !== "CLAY" &&
                          soil !== "LOAM" &&
                          soil !== "PEAT" &&
                          soil !== "HUMUS_ENRICHED" &&
                          soil !== "SILT" &&
                          soil !== "CHALK" &&
                          soil}
                        {index < (selectedPlant.idealSoilTypes?.length || 0) - 1
                          ? ", "
                          : ""}
                      </span>
                    ))}
                  </p>
                )}
            </div>
          </div>
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
          className="bg-green-800 text-white py-2 rounded font-semibold hover:bg-green-900 disabled:bg-gray-400"
          disabled={loading || !form.plantId}
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
