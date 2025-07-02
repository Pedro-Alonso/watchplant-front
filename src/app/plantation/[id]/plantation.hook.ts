// filepath: d:\Unesp\Engenharia de Software I\watchplant-front\src\app\plantation\[id]\plantation.hook.ts
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  PlantationDto,
  PlantedPlantDto,
  PlantationDetailsHook,
  PlantDetailsDto,
  UpdatePlantationDto,
  UpdatePlantDto,
} from "./plantation.types";
import { useApiWithLoader, apiService } from "@/services/api";

export const usePlantationDetails = (): PlantationDetailsHook => {
  const router = useRouter();
  const params = useParams();
  const plantationName = params?.id as string;

  const [plantation, setPlantation] = useState<PlantationDto | null>(null);
  const [plants, setPlants] = useState<PlantedPlantDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<PlantedPlantDto | null>(
    null
  );
  const [plantDetails, setPlantDetails] = useState<PlantDetailsDto | null>(
    null
  );

  // States for edit and delete functionality
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditPlantationModal, setShowEditPlantationModal] = useState(false);
  const [showEditPlantModal, setShowEditPlantModal] = useState(false);
  const [plantToEdit, setPlantToEdit] = useState<PlantedPlantDto | null>(null);

  // Use a ref for the API client to keep it stable across renders
  const httpClient = useApiWithLoader();
  const httpClientRef = useRef(httpClient);
  const routerRef = useRef(router);

  // Fetch plantation data only once when the component mounts or when plantationName changes
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!plantationName) return;
      setLoading(true);

      try {
        const [plantationRes, plantsRes] = await Promise.all([
          httpClientRef.current.get<PlantationDto>(
            `/plantation/${plantationName}`
          ),
          httpClientRef.current.get<PlantedPlantDto[]>(
            `/plantation/plants/${plantationName}`
          ),
        ]);

        // Only update state if the component is still mounted
        if (isMounted) {
          setPlantation(plantationRes.data);
          setPlants(plantsRes.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching plantation data:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent setting state on unmounted component
    return () => {
      isMounted = false;
    };
  }, [plantationName]); // Remove httpClient from dependencies

  const fetchPlantDetails = async (plant: PlantedPlantDto) => {
    if (!plant) return null;

    setLoading(true);

    try {
      // Using apiService directly since it already handles the token in the interceptor
      const response = await apiService.get<PlantDetailsDto>(`/plant`, {
        params: {
          plantationName: plant.plantationName,
          perenualId: plant.perenualId,
          plantationDate: plant.plantationDate,
        },
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
      routerRef.current.push("/homepage");
    }
  };

  const handleSelectPlant = async (plant: PlantedPlantDto) => {
    setSelectedPlant(plant);
    await fetchPlantDetails(plant);
  };

  const handleDeletePlantation = async () => {
    if (!plantation) return;
    setIsDeleting(true);

    try {
      await httpClientRef.current.delete(`/plantation/${plantation.name}`);
      setIsDeleting(false);
      setShowDeleteModal(false);
      routerRef.current.push("/homepage");
    } catch (error) {
      console.error("Error deleting plantation:", error);
      setIsDeleting(false);
    }
  };

  const handleEditPlantation = async (
    data: UpdatePlantationDto
  ): Promise<boolean> => {
    if (!plantation) return false;
    setIsEditing(true);

    try {
      const response = await httpClientRef.current.put<PlantationDto>(
        `/plantation/${plantation.name}`,
        data
      );

      // Update local state with the updated plantation data
      setPlantation({
        ...plantation,
        ...(response.data as PlantationDto),
      });

      setIsEditing(false);
      setShowEditPlantationModal(false);
      return true;
    } catch (error) {
      console.error("Error updating plantation:", error);
      setIsEditing(false);
      return false;
    }
  };

  const handleDeletePlant = async (
    plant: PlantedPlantDto
  ): Promise<boolean> => {
    setIsDeleting(true);

    try {
      await httpClientRef.current.delete(`/plant`, {
        params: {
          perenualId: plant.perenualId,
          plantationDate: plant.plantationDate,
          email: localStorage.getItem("userId"),
          plantationName: plant.plantationName,
        },
      });

      // Update the plants list by removing the deleted plant
      setPlants(
        plants.filter(
          (p) =>
            !(
              p.perenualId === plant.perenualId &&
              p.plantationDate === plant.plantationDate
            )
        )
      );

      // If we're currently viewing the plant details, go back to plantation view
      if (selectedPlant && selectedPlant.perenualId === plant.perenualId) {
        setSelectedPlant(null);
        setPlantDetails(null);
      }

      setIsDeleting(false);
      return true;
    } catch (error) {
      console.error("Error deleting plant:", error);
      setIsDeleting(false);
      return false;
    }
  };

  const handleEditPlant = async (
    plant: PlantedPlantDto,
    data: UpdatePlantDto
  ): Promise<boolean> => {
    setIsEditing(true);

    try {
      const response = await httpClientRef.current.put<PlantedPlantDto>(
        `/plant`,
        data,
        {
          params: {
            perenualId: plant.perenualId,
            plantationDate: plant.plantationDate,
            email: localStorage.getItem("userId"),
            plantationName: plant.plantationName,
          },
        }
      );

      // Update local state with the updated plant data
      const updatedPlant = {
        ...plant,
        ...(response.data as PlantedPlantDto),
      };

      // Update plants list
      setPlants(
        plants.map((p) =>
          p.perenualId === plant.perenualId &&
          p.plantationDate === plant.plantationDate
            ? updatedPlant
            : p
        )
      );

      // If we're currently viewing this plant, update the selected plant
      if (selectedPlant && selectedPlant.perenualId === plant.perenualId) {
        setSelectedPlant(updatedPlant);
        // Refresh plant details
        await fetchPlantDetails(updatedPlant);
      }

      setIsEditing(false);
      setShowEditPlantModal(false);
      setPlantToEdit(null);
      return true;
    } catch (error) {
      console.error("Error updating plant:", error);
      setIsEditing(false);
      return false;
    }
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
    handleDeletePlantation,
    handleEditPlantation,
    handleDeletePlant,
    handleEditPlant,
    isEditing,
    isDeleting,
    showDeleteModal,
    setShowDeleteModal,
    showEditPlantationModal,
    setShowEditPlantationModal,
    showEditPlantModal,
    setShowEditPlantModal,
    plantToEdit,
    setPlantToEdit,
  };
};
