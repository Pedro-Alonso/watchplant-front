import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiService } from "../../../../services/api";
import { PlantSearchResultDto, PlantSearchRequest, AddPlantFormState } from "./add-plant.types";
import { IAddPlant } from "./add-plant.types";

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
  const [searchResults, setSearchResults] = useState<PlantSearchResultDto[]>([]);
  const [searching, setSearching] = useState(false);
  const router = useRouter();
  const params = useParams();
  const plantationId = params?.id as string;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string | number } }
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      // Use safe localStorage access for server-side rendering
      const getToken = () => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem("token");
        }
        return null;
      };
      
      await apiService.post(
        "/plant/", 
        {
          plantId: Number(form.plantId),
          plantation: {
            id: plantationId,
            name: "",
          },
          quantity: Number(form.quantity),
          wateringFrequency: form.wateringFrequency,
          sunlightIncidence: Number(form.sunlightIncidence),
          soilType: Number(form.soilType),
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setSuccess(true);
      setForm({ ...initialForm });
      setTimeout(() => router.push(`/plantation/${plantationId}`), 1200);
    } catch (err) {
      console.error("Error adding plant:", err);
      setError("Erro ao adicionar planta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    setError("");
    try {
      // Use safe localStorage access for server-side rendering
      const getToken = () => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem("token");
        }
        return null;
      };
      
      const params: PlantSearchRequest = { q: searchQuery };
      const res = await apiService.get<{ data: unknown[] }>("/plant/search", {
        params,
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      
      setSearchResults(
        (res.data?.data || []).map((p) => {
          const plant = p as {
            id: number;
            common_name: string;
            scientific_names: string[];
          };
          return {
            id: plant.id,
            commonName: plant.common_name,
            scientificNames: plant.scientific_names,
          };
        })
      );
    } catch (err) {
      console.error("Error searching plants:", err);
      setSearchResults([]);
      setError("Erro ao buscar plantas.");
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
  };
};
