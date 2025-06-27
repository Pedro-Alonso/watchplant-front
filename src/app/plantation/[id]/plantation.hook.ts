// filepath: d:\Unesp\Engenharia de Software I\watchplant-front\src\app\plantation\[id]\plantation.hook.ts
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  PlantationDto,
  PlantedPlantDto,
  PlantationDetailsHook,
  PlantDetailsDto,
} from "./plantation.types";
import { apiService } from "@/services/api";

export const usePlantationDetails = (): PlantationDetailsHook => {
  const router = useRouter();
  const params = useParams();
  const plantationName = params?.name as string;

  const [plantation, setPlantation] = useState<PlantationDto | null>(null);
  const [plants, setPlants] = useState<PlantedPlantDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<PlantedPlantDto | null>(
    null
  );
  const [plantDetails, setPlantDetails] = useState<PlantDetailsDto | null>(
    null
  );

  useEffect(() => {
    if (!plantationName) return;
    setLoading(true);

    const getToken = () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("jwtToken");
      }
      return null;
    };

    Promise.all([
      apiService.get<PlantationDto>(`/plantation/${plantationName}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }),
      apiService.get<PlantedPlantDto[]>(`/plantation/plants`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }),
    ])
      .then(([plantationRes, plantsRes]) => {
        setPlantation(plantationRes.data);
        setPlants(plantsRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [plantationName, plantation, plants]);

  const fetchPlantDetails = async (plant: PlantedPlantDto) => {
    if (!plant) return null;

    setLoading(true);

    const getToken = () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("jwtToken");
      }
      return null;
    };

    try {
      const response = await apiService.get<PlantDetailsDto>(`/plant`, {
        params: {
          plantationName: plant.plantationName,
          perenualId: plant.perenualId,
          plantationDate: plant.plantationDate,
        },
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setPlantDetails(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error fetching plant details:", error);
      setLoading(false);
      return null;
    }
  };

  const handleBack = () => {
    if (selectedPlant) {
      setSelectedPlant(null);
      setPlantDetails(null);
    } else {
      router.push("/homepage");
    }
  };

  const handleSelectPlant = async (plant: PlantedPlantDto) => {
    setSelectedPlant(plant);
    await fetchPlantDetails(plant);
  };

  return {
    plantation,
    plants,
    loading,
    selectedPlant,
    plantDetails,
    handleBack,
    handleSelectPlant,
    fetchPlantDetails,
  };
};
