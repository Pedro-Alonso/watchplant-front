import React, { useState, useEffect } from "react";
import { AddressDto, UserDto } from "@/app/user/user.types";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name?: string;
    phone?: string;
    address?: AddressDto;
  }) => Promise<boolean>;
  user: UserDto | null;
  isEditing: boolean;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  isEditing,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    address: {
      zipCode: string;
      street: string;
      number: string;
      neighborhood: string;
    };
  }>({
    name: "",
    phone: "",
    address: {
      zipCode: "",
      street: "",
      number: "",
      neighborhood: "",
    },
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: {
          zipCode: user.address?.zipCode || "",
          street: user.address?.street || "",
          number: user.address?.number || "",
          neighborhood: user.address?.neighborhood || "",
        },
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const phoneRegex = /^([0-9]{6,7})[^0-9]*([0-9]{4})$/;
      if (value && !phoneRegex.test(value)) {
        setErrors({ ...errors, phone: "Formato de telefone inválido" });
      } else {
        const newErrors = { ...errors };
        delete newErrors.phone;
        setErrors(newErrors);
      }
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) return;

    const dataToSend: { name?: string; phone?: string; address?: AddressDto } =
      {};
    if (formData.name !== user.name) {
      dataToSend.name = formData.name;
    }
    if (formData.phone !== user.phone) {
      dataToSend.phone = formData.phone;
    }

    const addressChanged =
      formData.address.zipCode !== (user.address?.zipCode || "") ||
      formData.address.street !== (user.address?.street || "") ||
      formData.address.number !== (user.address?.number || "") ||
      formData.address.neighborhood !== (user.address?.neighborhood || "");

    if (addressChanged) {
      dataToSend.address = {
        id: user.address?.id || "",
        zipCode: formData.address.zipCode,
        street: formData.address.street,
        number: formData.address.number,
        neighborhood: formData.address.neighborhood,
      };
    }

    if (Object.keys(dataToSend).length === 0) {
      onClose();
      return;
    }

    const success = await onSave(dataToSend);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Telefone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="999999-9999"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <h3 className="text-lg font-semibold mb-2 mt-6">Endereço</h3>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">CEP</label>
            <input
              type="text"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="00000-000"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rua</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Número</label>
            <input
              type="text"
              name="address.number"
              value={formData.address.number}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Bairro</label>
            <input
              type="text"
              name="address.neighborhood"
              value={formData.address.neighborhood}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
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

export default EditUserModal;
