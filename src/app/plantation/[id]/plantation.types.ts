export interface PlantationDto {
  name: string;
  sizeArea: number;
  soilType?: string;
  sunlightIncidence?: string;
}

export interface PlantedPlantDto {
  perenualId: string;
  scientificName: string;
  commonName: string;
  quantity: number;
  plantationName: string;
  plantationDate: string;
  soilType?: string;
  sunlightIncidence?: string;
  wateringFrequency?: string;
}

// New types for update operations
export interface UpdatePlantationDto {
  sizeArea?: number;
  soilType?: string;
  sunlightIncidence?: string;
}

export interface UpdatePlantDto {
  quantity?: number;
  soilType?: string;
  sunlightIncidence?: string;
  wateringFrequency?: string;
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

  // New functionality
  handleDeletePlantation: () => void;
  handleEditPlantation: (data: UpdatePlantationDto) => Promise<boolean>;
  handleDeletePlant: (plant: PlantedPlantDto) => Promise<boolean>;
  handleEditPlant: (
    plant: PlantedPlantDto,
    data: UpdatePlantDto
  ) => Promise<boolean>;
  isEditing: boolean;
  isDeleting: boolean;
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  showEditPlantationModal: boolean;
  setShowEditPlantationModal: (show: boolean) => void;
  showEditPlantModal: boolean;
  setShowEditPlantModal: (show: boolean) => void;
  plantToEdit: PlantedPlantDto | null;
  setPlantToEdit: (plant: PlantedPlantDto | null) => void;
}
