import { SoilTypeEnum } from "@/common/soil-type-enum";
import { SunlightIncidenceEnum } from "@/common/sunlight-incidente-enum";

export interface PlantationCreateFormState {
  name: string;
  sizeArea: string;
  soilType: SoilTypeEnum | "";
  sunlightIncidence: SunlightIncidenceEnum | "";
}

export interface IPlantationCreate {
  form: PlantationCreateFormState;
  error: string;
  success: boolean;
  loading: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
