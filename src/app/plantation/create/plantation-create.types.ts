export interface PlantationCreateFormState {
  name: string;
  sizeArea: string;
  soilType: string;
  sunlightIncidence: string;
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
