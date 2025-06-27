import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IHomepage, Plantation } from "./homepage.types";
import { apiService } from "@/services/api";

export const useHomepage = (): IHomepage => {
  const [plantations, setPlantations] = useState<Plantation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    apiService
      .get<Plantation[]>("/user/plantations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then((res) => {
        setPlantations(res.data);
        setLoading(false);
      })
      .catch(() => {
        console.error("Failed to fetch plantations");
        setLoading(false);
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
