import { SoilTypeEnum } from "@/common/soil-type-enum";
import { IPlantationCreate } from "./plantation-create.types";
import { useRouter } from "next/navigation";
import { SunlightIncidenceEnum } from "@/common/sunlight-incidente-enum";

const SOIL_TYPES = [
  { value: SoilTypeEnum.SAND, label: "Arenoso" },
  { value: SoilTypeEnum.CLAY, label: "Argiloso" },
  { value: SoilTypeEnum.SILT, label: "Siltoso" },
  { value: SoilTypeEnum.PEAT, label: "Turfoso" },
  { value: SoilTypeEnum.HUMUS_ENRICHED, label: "Salino" },
  { value: SoilTypeEnum.CHALK, label: "Calcário" },
  { value: SoilTypeEnum.LOAM, label: "Humoso" },
];

const SUNLIGHTS = [
  { value: SunlightIncidenceEnum.FULL_SUN, label: "Sol pleno" },
  { value: SunlightIncidenceEnum.PART_SHADE, label: "Meia sombra" },
  { value: SunlightIncidenceEnum.FULL_SHADE, label: "Sombra" },
];

export const PlantationCreateLayout = ({
  form,
  error,
  success,
  loading,
  handleChange,
  handleSubmit,
}: IPlantationCreate) => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-10 rounded-xl shadow-lg min-w-[350px] flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-green-800 text-2xl font-bold mb-2 text-center">
          Criar Plantação
        </h2>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          name="sizeArea"
          placeholder="Área (m²)"
          min={1}
          value={form.sizeArea}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        />
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
        <select
          name="sunlightIncidence"
          value={form.sunlightIncidence}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        >
          <option value="">Incidência Solar</option>
          {SUNLIGHTS.map((opt) => (
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
            Plantação criada com sucesso!
          </div>
        )}
        <button
          type="submit"
          className="bg-green-800 text-white py-2 rounded font-semibold hover:bg-green-900"
          disabled={loading}
        >
          {loading ? "Criando..." : "Criar"}
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-800 py-2 rounded font-semibold hover:bg-gray-400"
          onClick={() => router.push("/homepage")}
        >
          Voltar
        </button>
      </form>
    </div>
  );
};
