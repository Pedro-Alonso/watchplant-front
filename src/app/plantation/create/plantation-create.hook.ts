"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IPlantationCreate,
  PlantationCreateFormState,
} from "./plantation-create.types";
// import { apiService } from "@/services/api";

const initialForm: PlantationCreateFormState = {
  name: "",
  sizeArea: "",
  soilType: "",
  sunlightIncidence: "",
};

export const usePlantationCreate = (): IPlantationCreate => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (
      !form.name ||
      !form.sizeArea ||
      !form.soilType ||
      !form.sunlightIncidence
    ) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      //   await apiService.post("/plantation/", {
      //     name: form.name,
      //     sizeArea: Number(form.sizeArea),
      //     soilType: form.soilType,
      //     sunlightIncidence: form.sunlightIncidence,
      //   });
      setSuccess(true);
      setForm(initialForm);
      setTimeout(() => router.push("/homepage"), 1200);
    } catch {
      setError("Erro ao criar plantação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    error,
    success,
    loading,
    handleChange,
    handleSubmit,
  };
};
