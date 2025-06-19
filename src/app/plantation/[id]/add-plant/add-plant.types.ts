export interface PlantSearchResultDto {
  id: number;
  commonName: string;
  scientificNames: string[];
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

export interface IAddPlant {
  form: {
    plantId: string;
    quantity: string;
    wateringFrequency: string;
    sunlightIncidence: string;
    soilType: string;
  };
  searchQuery: string;
  searchResults: PlantSearchResultDto[];
  loading: boolean;
  searching: boolean;
  error: string;
  success: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleSearch: () => Promise<void>;
}
