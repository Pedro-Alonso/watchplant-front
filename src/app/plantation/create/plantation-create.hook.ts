"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  IPlantationCreate,
  PlantationCreateFormState,
} from "./plantation-create.types";
import { apiService } from "@/services/api";
import { SoilTypeEnum } from "@/common/soil-type-enum";
import { SunlightIncidenceEnum } from "@/common/sunlight-incidente-enum";

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

  // Store router in a ref to avoid dependency issues
  const routerRef = useRef(router);

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
      await apiService.post("/plantation", {
        name: form.name,
        sizeArea: Number(form.sizeArea),
        soilType: SoilTypeEnum[form.soilType],
        sunlightIncidence: SunlightIncidenceEnum[form.sunlightIncidence],
      });
      setSuccess(true);
      setForm(initialForm);
      setTimeout(() => routerRef.current.push("/homepage"), 1200);
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
