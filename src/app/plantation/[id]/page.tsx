"use client";

import { usePlantationDetails } from "./plantation.hook";
import PlantationDetailsLayout from "./plantation.layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const PlantationDetailsPage = () => {
  const props = usePlantationDetails();
  return (
    <ProtectedRoute>
      <PlantationDetailsLayout {...props} />
    </ProtectedRoute>
  );
};

export default PlantationDetailsPage;
