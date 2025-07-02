export interface PlantSearchResultDto {
  id: number;
  commonName: string;
  common_name?: string; // Support for snake_case from API
  scientificNames: string[] | null;
  scientific_name?: string[] | null; // Support for snake_case from API
}

export interface PerenualPlantSearchResponseDto {
  data: PerenualPlantDetailsDto[];
  to?: number;
  per_page?: number;
  current_page?: number;
  from?: number;
  last_page?: number;
  total?: number;
}

export interface PerenualPlantDetailsDto {
  id: number;
  commonName: string;
  scientificNames: string[];
  otherNames?: string[];
  cycle?: string;
  careLevel?: string;
  idealWateringFrequency?: string;
  idealSunlightIncidences?: string[];
  idealSoilTypes?: string[];
}

export interface PlantDetailsDto {
  id: number;
  commonName: string;
  scientificName: string;
  careLevel?: string;
  cycle?: string;
  idealWateringFrequency?: string;
  idealSunlightIncidences?: string[];
  idealSoilTypes?: string[];
}

export interface PlantSuggestionResponseDto {
  wateringFrequencyEvaluation: {
    isIdeal: boolean;
    idealValues: string[];
  };
  sunlightIncidenceEvaluation: {
    isIdeal: boolean;
    idealValues: string[];
  };
  soilTypeEvaluation: {
    isIdeal: boolean;
    idealValues: string[];
  };
}

export interface PlantSearchRequest {
  q: string;
  page?: number;
  order?: string;
  edible?: boolean;
  poisonous?: boolean;
  cycle?: string;
  watering?: string;
  sunlight?: string;
  indoor?: boolean;
  hardiness?: string;
}

export interface AddPlantFormState {
  plantId: string;
  quantity: string;
  wateringFrequency: string; // Using string enum values like "FREQUENT", "AVERAGE", "MINIMUM", "NONE"
  sunlightIncidence: string; // Using string enum values like "FULL_SUN"
  soilType: string; // Using string enum values like "LOAM"
}

export interface IAddPlant {
  form: AddPlantFormState;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: PlantSearchResultDto[];
  selectedPlant: PlantDetailsDto | null;
  loading: boolean;
  searching: boolean;
  error: string;
  success: boolean;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: string | number } }
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleSearch: () => Promise<void>;
  handleSelectPlant: (plant: PlantSearchResultDto) => Promise<void>;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
}
