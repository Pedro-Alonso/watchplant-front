export interface PlantationDto {
  name: string;
  sizeArea: number;
}

export interface PlantedPlantDto {
  perenualId: string;
  scientificName: string;
  commonName: string;
  quantity: number;
  plantationName: string;
  plantationDate: string;
}

export interface PlantDetailsDto {
  perenualId: string;
  scientificName: string;
  commonName: string;
  careLevel?: string;
  cycle?: string;
  maxFeetHeight?: string;
  pruningMonth?: string[];
  quantity?: number;
  soilType?: string;
  sunlightIncidence?: string;
  wateringFrequency?: string;
  plantationDate?: string;
}

export interface PlantationDetailsHook {
  plantation: PlantationDto | null;
  plants: PlantedPlantDto[];
  loading: boolean;
  selectedPlant: PlantedPlantDto | null;
  plantDetails: PlantDetailsDto | null;
  handleBack: () => void;
  handleSelectPlant: (plant: PlantedPlantDto) => void;
  fetchPlantDetails: (
    plant: PlantedPlantDto
  ) => Promise<PlantDetailsDto | null>;
}
