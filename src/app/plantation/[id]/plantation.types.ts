// Plantation DTO (matches backend CreatePlantationResponseDto, GetPlantationResponseDto, etc.)
export interface PlantationDto {
  id: string;
  name: string;
  sizeArea: number;
  soilType: string;
  sunlightIncidence: string;
}

// PlantedPlant DTO (matches backend CreatePlantResponseDto, GetPlantResponseDto, etc.)
export interface PlantedPlantDto {
  id: string;
  scientificName: string;
  commonName: string;
  quantity: number;
  plantationName?: string;
}

// Hook return type for plantation details page
export interface PlantationDetailsHook {
  plantation: PlantationDto | null;
  plants: PlantedPlantDto[];
  loading: boolean;
  selectedPlant: PlantedPlantDto | null;
  handleBack: () => void;
  handleSelectPlant: (plant: PlantedPlantDto) => void;
}
