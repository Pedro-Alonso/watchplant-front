export interface Plantation {
  name: string;
  sizeArea: number;
}

export interface IHomepage {
  plantations: Plantation[];
  loading: boolean;
  handleSelectPlantation: (plantationId: string) => void;
  handleCreatePlantation: () => void;
  handleLogout: () => void;
}
