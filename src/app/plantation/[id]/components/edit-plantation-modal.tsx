import React, { useState, useEffect } from "react";
import { PlantationDto, UpdatePlantationDto } from "../plantation.types";
import { SoilTypeEnum } from "@/common/soil-type-enum";
import { SunlightIncidenceEnum } from "@/common/sunlight-incidente-enum";
import { SoilTypeLabels } from "@/common/soil-type-labels";
import { SunlightIncidenceLabels } from "@/common/sunlight-incidence-labels";

interface EditPlantationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdatePlantationDto) => Promise<boolean>;
  plantation: PlantationDto | null;
  isEditing: boolean;
}

export const EditPlantationModal: React.FC<EditPlantationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  plantation,
  isEditing,
}) => {
  const [formData, setFormData] = useState<UpdatePlantationDto>({
    sizeArea: plantation?.sizeArea,
    soilType: plantation?.soilType as SoilTypeEnum | undefined,
    sunlightIncidence: plantation?.sunlightIncidence as
      | SunlightIncidenceEnum
      | undefined,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (plantation) {
      setFormData({
        sizeArea: plantation.sizeArea,
        soilType: plantation.soilType as SoilTypeEnum | undefined,
        sunlightIncidence: plantation.sunlightIncidence as
          | SunlightIncidenceEnum
          | undefined,
      });
    }
  }, [plantation]);

  if (!isOpen || !plantation) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "sizeArea") {
      const sizeArea = parseFloat(value);
      if (sizeArea < 1) {
        setErrors({
          ...errors,
          sizeArea: "A área deve ser maior ou igual a 1m²",
        });
      } else {
        const newErrors = { ...errors };
        delete newErrors.sizeArea;
        setErrors(newErrors);
      }
      setFormData({ ...formData, sizeArea });
    } else if (name === "soilType") {
      setFormData({ ...formData, soilType: value as SoilTypeEnum });
    } else if (name === "sunlightIncidence") {
      setFormData({
        ...formData,
        sunlightIncidence: value as SunlightIncidenceEnum,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) return;

    const dataToSend: UpdatePlantationDto = {};
    if (
      formData.sizeArea !== undefined &&
      formData.sizeArea !== plantation.sizeArea
    ) {
      dataToSend.sizeArea = formData.sizeArea;
    }
    if (
      formData.soilType !== undefined &&
      formData.soilType !== plantation.soilType
    ) {
      dataToSend.soilType = formData.soilType;
    }
    if (
      formData.sunlightIncidence !== undefined &&
      formData.sunlightIncidence !== plantation.sunlightIncidence
    ) {
      dataToSend.sunlightIncidence = formData.sunlightIncidence;
    }

    const success = await onSave(dataToSend);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Plantação</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Área (m²)</label>
            <input
              type="number"
              name="sizeArea"
              value={formData.sizeArea || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="1"
              step="0.1"
            />
            {errors.sizeArea && (
              <p className="text-red-500 text-sm mt-1">{errors.sizeArea}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tipo de Solo</label>
            <select
              name="soilType"
              value={formData.soilType || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione</option>
              {Object.values(SoilTypeEnum).map((type) => (
                <option key={type} value={type}>
                  {SoilTypeLabels[type]}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Incidência de Luz Solar
            </label>
            <select
              name="sunlightIncidence"
              value={formData.sunlightIncidence || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione</option>
              {Object.values(SunlightIncidenceEnum).map((type) => (
                <option key={type} value={type}>
                  {SunlightIncidenceLabels[type]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={onClose}
              disabled={isEditing}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
              disabled={isEditing || Object.keys(errors).length > 0}
            >
              {isEditing ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlantationModal;
