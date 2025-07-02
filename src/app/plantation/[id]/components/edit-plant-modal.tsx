import React, { useState, useEffect } from "react";
import { PlantedPlantDto, UpdatePlantDto } from "../plantation.types";
import { SoilTypeEnum } from "@/common/soil-type-enum";
import { SunlightIncidenceEnum } from "@/common/sunlight-incidente-enum";
import { SoilTypeLabels } from "@/common/soil-type-labels";
import { SunlightIncidenceLabels } from "@/common/sunlight-incidence-labels";
import { WateringFrequencyLabels } from "@/common/watering-frequency-labels";

export enum WateringFrequencyEnum {
  FREQUENT = "FREQUENT",
  AVERAGE = "AVERAGE",
  MINIMUM = "MINIMUM",
  NONE = "NONE",
}

interface EditPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plant: PlantedPlantDto, data: UpdatePlantDto) => Promise<boolean>;
  plant: PlantedPlantDto | null;
  isEditing: boolean;
}

export const EditPlantModal: React.FC<EditPlantModalProps> = ({
  isOpen,
  onClose,
  onSave,
  plant,
  isEditing,
}) => {
  const [formData, setFormData] = useState<UpdatePlantDto>({
    quantity: plant?.quantity,
    soilType: plant?.soilType as SoilTypeEnum | undefined,
    sunlightIncidence: plant?.sunlightIncidence as
      | SunlightIncidenceEnum
      | undefined,
    wateringFrequency: plant?.wateringFrequency as
      | WateringFrequencyEnum
      | undefined,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (plant) {
      setFormData({
        quantity: plant.quantity,
        soilType: plant.soilType as SoilTypeEnum | undefined,
        sunlightIncidence: plant.sunlightIncidence as
          | SunlightIncidenceEnum
          | undefined,
        wateringFrequency: plant.wateringFrequency as
          | WateringFrequencyEnum
          | undefined,
      });
    }
  }, [plant]);

  if (!isOpen || !plant) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      const quantity = parseInt(value);
      if (quantity < 1) {
        setErrors({
          ...errors,
          quantity: "A quantidade deve ser maior ou igual a 1",
        });
      } else {
        const newErrors = { ...errors };
        delete newErrors.quantity;
        setErrors(newErrors);
      }
      setFormData({ ...formData, quantity });
    } else if (name === "soilType") {
      setFormData({ ...formData, soilType: value as SoilTypeEnum });
    } else if (name === "sunlightIncidence") {
      setFormData({
        ...formData,
        sunlightIncidence: value as SunlightIncidenceEnum,
      });
    } else if (name === "wateringFrequency") {
      setFormData({
        ...formData,
        wateringFrequency: value as WateringFrequencyEnum,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) return;

    const dataToSend: UpdatePlantDto = {};
    if (
      formData.quantity !== undefined &&
      formData.quantity !== plant.quantity
    ) {
      dataToSend.quantity = formData.quantity;
    }
    if (
      formData.soilType !== undefined &&
      formData.soilType !== plant.soilType
    ) {
      dataToSend.soilType = formData.soilType;
    }
    if (
      formData.sunlightIncidence !== undefined &&
      formData.sunlightIncidence !== plant.sunlightIncidence
    ) {
      dataToSend.sunlightIncidence = formData.sunlightIncidence;
    }
    if (
      formData.wateringFrequency !== undefined &&
      formData.wateringFrequency !== plant.wateringFrequency
    ) {
      dataToSend.wateringFrequency = formData.wateringFrequency;
    }

    const success = await onSave(plant, dataToSend);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Planta</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Quantidade</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="1"
              step="1"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
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

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Frequência de Rega
            </label>
            <select
              name="wateringFrequency"
              value={formData.wateringFrequency || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione</option>
              {Object.values(WateringFrequencyEnum).map((freq) => (
                <option key={freq} value={freq}>
                  {WateringFrequencyLabels[freq]}
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

export default EditPlantModal;
