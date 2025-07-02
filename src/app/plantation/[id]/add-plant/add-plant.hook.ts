import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApiWithLoader } from "../../../../services/api";
import {
  PlantSearchResultDto,
  PlantSearchRequest,
  AddPlantFormState,
  PlantDetailsDto,
  PlantSuggestionResponseDto,
  PerenualPlantSearchResponseDto,
} from "./add-plant.types";
import { IAddPlant } from "./add-plant.types";
import { SoilTypeEnum } from "@/common/soil-type-enum";
import { SunlightIncidenceEnum } from "@/common/sunlight-incidente-enum";

// WateringFrequencyEnum definition matching backend values
enum WateringFrequencyEnum {
  FREQUENT = "FREQUENT",
  AVERAGE = "AVERAGE",
  MINIMUM = "MINIMUM",
  NONE = "NONE",
}

const initialForm: AddPlantFormState = {
  plantId: "",
  quantity: "",
  wateringFrequency: "",
  sunlightIncidence: "",
  soilType: "",
};

export const useAddPlant = (): IAddPlant => {
  const [form, setForm] = useState<AddPlantFormState>({ ...initialForm });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlantSearchResultDto[]>(
    []
  );
  const [searching, setSearching] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantDetailsDto | null>(
    null
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();
  const params = useParams();
  const plantationId = params?.id
    ? decodeURIComponent(params.id as string)
    : "";
  const httpClient = useApiWithLoader();

  // Store API client and router in refs to avoid dependency issues
  const httpClientRef = useRef(httpClient);
  const routerRef = useRef(router);

  // Fill in form with suggested values when a plant is selected
  useEffect(() => {
    if (selectedPlant) {
      // Always set basic form values when a plant is selected
      setForm((prev) => ({
        ...prev,
        plantId: selectedPlant.id.toString(),
        // If idealWateringFrequency exists, use it, otherwise keep current or set default
        wateringFrequency:
          selectedPlant.idealWateringFrequency ||
          prev.wateringFrequency ||
          "WEEKLY",
      }));

      // Handle sunlight incidence
      if (
        selectedPlant.idealSunlightIncidences &&
        selectedPlant.idealSunlightIncidences.length > 0
      ) {
        // Use the string value directly
        const sunlightValue = selectedPlant.idealSunlightIncidences[0];
        if (sunlightValue) {
          setForm((prev) => ({
            ...prev,
            sunlightIncidence: sunlightValue,
          }));
        }
      } else {
        // Set default if no recommendation exists
        setForm((prev) => ({
          ...prev,
          sunlightIncidence: prev.sunlightIncidence || "FULL_SUN",
        }));
      }

      // Handle soil type
      if (
        selectedPlant.idealSoilTypes &&
        selectedPlant.idealSoilTypes.length > 0
      ) {
        // Use the string value directly
        const soilValue = selectedPlant.idealSoilTypes[0];
        if (soilValue) {
          setForm((prev) => ({
            ...prev,
            soilType: soilValue,
          }));
        }
      } else {
        // Set default if no recommendation exists
        setForm((prev) => ({
          ...prev,
          soilType: prev.soilType || "LOAM",
        }));
      }
    }
  }, [selectedPlant]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: string | number } }
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectPlant = async (plant: PlantSearchResultDto) => {
    setForm((prev) => ({
      ...prev,
      plantId: plant.id.toString(),
    }));

    setError("");
    setShowDropdown(false);

    try {
      // Try to get plant suggestions using the /plant/suggestion endpoint
      try {
        const suggestResponse =
          await httpClientRef.current.post<PlantSuggestionResponseDto>(
            "/plant/suggestion",
            {
              plantId: plant.id,
              wateringFrequency: WateringFrequencyEnum.AVERAGE, // Sending the actual enum value
              sunlightIncidence: SunlightIncidenceEnum.FULL_SUN, // Sending the actual enum value
              soilType: SoilTypeEnum.LOAM, // Sending the actual enum value
            }
          );

        console.log("Suggestion response:", suggestResponse.data);

        // If we get suggestions, use them
        setSelectedPlant({
          id: plant.id,
          commonName: plant.commonName || plant.common_name || "",
          scientificName: Array.isArray(plant.scientificNames)
            ? plant.scientificNames[0] || ""
            : Array.isArray(plant.scientific_name)
            ? plant.scientific_name[0] || ""
            : "",
          // Use the values from suggestion response
          idealWateringFrequency:
            suggestResponse.data.wateringFrequencyEvaluation
              ?.idealValues?.[0] || "AVERAGE",
          idealSunlightIncidences: suggestResponse.data
            .sunlightIncidenceEvaluation?.idealValues || ["FULL_SUN"],
          idealSoilTypes: suggestResponse.data.soilTypeEvaluation
            ?.idealValues || ["LOAM"],
        });
      } catch (suggestError) {
        console.warn("Could not get plant suggestions:", suggestError);

        // Use just the basic information with sensible defaults
        setSelectedPlant({
          id: plant.id,
          commonName: plant.commonName || plant.common_name || "",
          scientificName: Array.isArray(plant.scientificNames)
            ? plant.scientificNames[0] || ""
            : Array.isArray(plant.scientific_name)
            ? plant.scientific_name[0] || ""
            : "",
          // Provide default values for recommendation
          idealWateringFrequency: "AVERAGE",
          idealSunlightIncidences: ["FULL_SUN"],
          idealSoilTypes: ["LOAM"],
        });
      }
    } catch (err) {
      console.error("Error in plant selection flow:", err);
      // Still set basic plant info even if all fetching fails
      setSelectedPlant({
        id: plant.id,
        commonName: plant.commonName || plant.common_name || "",
        scientificName: Array.isArray(plant.scientificNames)
          ? plant.scientificNames[0] || ""
          : Array.isArray(plant.scientific_name)
          ? plant.scientific_name[0] || ""
          : "",
        // Default values as fallback
        idealWateringFrequency: "AVERAGE",
        idealSunlightIncidences: ["FULL_SUN"],
        idealSoilTypes: ["LOAM"],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (
      !form.plantId ||
      !form.quantity ||
      !form.wateringFrequency ||
      !form.sunlightIncidence ||
      !form.soilType
    ) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      // Prepare the data with proper format and decode URL-encoded values
      const requestData = {
        plantId: Number(form.plantId),
        plantationName: plantationId,
        quantity: Number(form.quantity),
        wateringFrequency: form.wateringFrequency,
        sunlightIncidence: form.sunlightIncidence,
        soilType: form.soilType,
      };

      console.log("Sending request with data:", requestData);

      await httpClientRef.current.post("/plant", requestData);
      setSuccess(true);
      setForm({ ...initialForm });
      setSelectedPlant(null);
      setTimeout(
        () => routerRef.current.push(`/plantation/${plantationId}`),
        1200
      );
    } catch (err) {
      console.error("Error adding plant:", err);

      // Enhanced error reporting
      const error = err as {
        response?: {
          data?: { message?: string };
          status?: number;
        };
      };

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);

        // If the backend returns a specific error message, display it
        if (error.response.data && error.response.data.message) {
          setError(`Erro: ${error.response.data.message}`);
        } else {
          setError(
            `Erro ${error.response.status}: Falha ao adicionar planta. Verifique os campos e tente novamente.`
          );
        }
      } else {
        setError("Erro ao adicionar planta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError("");
    setShowDropdown(true);

    try {
      // Using the plant/search endpoint from the WatchPlant backend
      const params: PlantSearchRequest = { q: searchQuery };
      const response =
        await httpClientRef.current.get<PerenualPlantSearchResponseDto>(
          "/plant/search",
          {
            params,
          }
        );
      console.log("Search response:", response.data);
      if (response.data && Array.isArray(response.data.data)) {
        // Inspect the first result to debug field names
        if (response.data.data.length > 0) {
          const sample = response.data.data[0];
          console.log("Sample plant fields:", Object.keys(sample));
          console.log("Sample plant data:", sample);
        }

        const mappedResults = response.data.data.map(
          (plant: {
            id: number;
            commonName?: string;
            common_name?: string;
            scientificNames?: string[];
            scientific_name?: string[];
          }) => ({
            id: plant.id,
            commonName:
              plant.commonName || plant.common_name || "Unknown Plant",
            scientificNames:
              plant.scientificNames || plant.scientific_name || [],
          })
        );

        console.log("Mapped results:", mappedResults);

        if (mappedResults.length === 0) {
          console.warn("No plants found in search results");
          setError("Nenhuma planta encontrada com esse nome.");
        }

        setSearchResults(mappedResults);
      } else {
        console.warn("Unexpected response format:", response.data);
        setSearchResults([]);
        setError("Formato de resposta inesperado ao buscar plantas.");
      }
    } catch (err) {
      console.error("Error searching plants:", err);
      setSearchResults([]);
      setError(
        "Erro ao buscar plantas. Verifique sua conexão e tente novamente."
      );
    } finally {
      setSearching(false);
    }
  };

  return {
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
  };
};
