import { SoilTypeEnum } from "@/common/soil-type-enum";
import { SunlightIncidenceEnum } from "@/common/sunlight-incidente-enum";

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

export interface AddPlantFormState {
  plantId: string;
  quantity: string;
  wateringFrequency: string;
  sunlightIncidence: SunlightIncidenceEnum | "";
  soilType: SoilTypeEnum | "";
}

export interface IAddPlant {
  form: AddPlantFormState;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: PlantSearchResultDto[];
  loading: boolean;
  searching: boolean;
  error: string;
  success: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string | number } }
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleSearch: () => Promise<void>;
}
