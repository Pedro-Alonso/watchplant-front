"use client";
import { useAddPlant } from "./add-plant.hook";
import { AddPlantLayout } from "./add-plant.layout";

export default function AddPlantPage() {
  const props = useAddPlant();
  return <AddPlantLayout {...props} />;
}
