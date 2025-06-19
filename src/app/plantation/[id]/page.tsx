"use client";

import { usePlantationDetails } from "./plantation.hook";
import PlantationDetailsLayout from "./plantation.layout";

const PlantationDetailsPage = () => {
  const props = usePlantationDetails();
  return <PlantationDetailsLayout {...props} />;
};

export default PlantationDetailsPage;
