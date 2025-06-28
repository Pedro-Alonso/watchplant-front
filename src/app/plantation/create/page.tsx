"use client";
import { usePlantationCreate } from "./plantation-create.hook";
import { PlantationCreateLayout } from "./plantation-create.layout";

export default function PlantationCreatePage() {
  const props = usePlantationCreate();
  return <PlantationCreateLayout {...props} />;
}
