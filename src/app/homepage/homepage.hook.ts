import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IHomepage, Plantation } from "./homepage.types";
import { ApiError, useApiWithLoader } from "@/services/api";
import { useAuth } from "@/components/auth/AuthContext";

export const useHomepage = (): IHomepage => {
  const [plantations, setPlantations] = useState<Plantation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const httpClient = useApiWithLoader();
  const { logout } = useAuth();

  // Store the API client in a ref to maintain a stable reference
  const httpClientRef = useRef(httpClient);

  // Only run once when component mounts
  useEffect(() => {
    // Flag to prevent state updates after unmount
    let isMounted = true;

    const fetchPlantations = async () => {
      if (!isMounted) return;

      try {
        console.log("Fetching plantations...");
        const response = await httpClientRef.current.get<Plantation[]>(
          "/user/plantations"
        );
        if (isMounted) {
          setPlantations(response.data);
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        console.error("Failed to fetch plantations:", apiError.message);
        if (isMounted) {
          setPlantations([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Execute the fetch
    fetchPlantations();

    // Cleanup function to prevent state updates after component unmount
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array means this only runs once when component mounts

  const handleSelectPlantation = (plantationId: string) => {
    router.push(`/plantation/${plantationId}`);
  };

  const handleCreatePlantation = () => {
    router.push("/plantation/create");
  };

  const handleLogout = () => {
    logout(); // Use the auth context's logout function
  };

  return {
    plantations,
    loading,
    handleSelectPlantation,
    handleCreatePlantation,
    handleLogout,
  };
};
