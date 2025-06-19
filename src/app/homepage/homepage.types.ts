export interface Plantation {
  id: string;
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
