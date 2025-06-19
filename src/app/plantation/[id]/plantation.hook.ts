// filepath: d:\Unesp\Engenharia de Software I\watchplant-front\src\app\plantation\[id]\plantation.hook.ts
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  PlantationDto,
  PlantedPlantDto,
  PlantationDetailsHook,
} from "./plantation.types";
import { apiService } from "@/services/api";

const MOCK_PLANTATION: PlantationDto = {
  id: "1",
  name: "Plantação de Teste",
  sizeArea: 100,
  soilType: "ARGILOSO",
  sunlightIncidence: "ALTA",
};

const MOCK_PLANTS: PlantedPlantDto[] = [
  {
    id: "1",
    scientificName: "Plantago major",
    commonName: "Plantago",
    quantity: 10,
    plantationName: "Plantação de Teste",
  },
  {
    id: "2",
    scientificName: "Taraxacum officinale",
    commonName: "Dente-de-leão",
    quantity: 5,
    plantationName: "Plantação de Teste",
  },
];

export const usePlantationDetails = (): PlantationDetailsHook => {
  const router = useRouter();
  const params = useParams();
  const plantationId = params?.id as string;

  const [plantation, setPlantation] = useState<PlantationDto | null>(null);
  const [plants, setPlants] = useState<PlantedPlantDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<PlantedPlantDto | null>(
    null
  );

  useEffect(() => {
    if (!plantationId) return;
    setLoading(true);
    Promise.all([
      apiService.get<PlantationDto>(`/plantation/${plantationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      apiService.get<PlantedPlantDto[]>(
        `/plantation/plants?plantationId=${plantationId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      ),
    ])
      .then(([plantationRes, plantsRes]) => {
        setPlantation(plantationRes.data);
        setPlants(plantsRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false))
      .finally(() => {
        if (!plantation) {
          setPlantation(MOCK_PLANTATION);
          setPlants([]);
          setLoading(false);
        }
        if (plants.length === 0) {
          setPlants(MOCK_PLANTS);
        }
      });
  }, [plantationId, plantation, plants]);

  const handleBack = () => {
    if (selectedPlant) {
      setSelectedPlant(null);
    } else {
      router.push("/homepage");
    }
  };

  const handleSelectPlant = (plant: PlantedPlantDto) => {
    setSelectedPlant(plant);
  };

  return {
    plantation,
    plants,
    loading,
    selectedPlant,
    handleBack,
    handleSelectPlant,
  };
};
