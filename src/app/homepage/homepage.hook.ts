import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IHomepage, Plantation } from "./homepage.types";
import { apiService } from "@/services/api";

const MOCK_PLANTATIONS: Plantation[] = [
  { id: "1", name: "Plantações de Maçã", sizeArea: 1500 },
  { id: "2", name: "Plantações de Laranja", sizeArea: 2000 },
  { id: "3", name: "Plantações de Uva", sizeArea: 1200 },
];

export const useHomepage = (): IHomepage => {
  const [plantations, setPlantations] =
    useState<Plantation[]>(MOCK_PLANTATIONS);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    apiService
      .get<Plantation[]>("/user/plantations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPlantations(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        // Optionally redirect to login on error
      });
  }, []);

  const handleSelectPlantation = (plantationId: string) => {
    router.push(`/plantation/${plantationId}`);
  };

  const handleCreatePlantation = () => {
    router.push("/plantation/create");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return {
    plantations,
    loading,
    handleSelectPlantation,
    handleCreatePlantation,
    handleLogout,
  };
};
