import { PlantationDetailsHook } from "./plantation.types";
import { useRouter } from "next/navigation";
import { useRef, Fragment } from "react";
import { PencilIcon } from "@/components/icons/pencil-icon";
import { TrashIcon } from "@/components/icons/trash-icon";
import ConfirmModal from "@/components/modals/confirm-modal";
import EditPlantationModal from "./components/edit-plantation-modal";
import EditPlantModal from "./components/edit-plant-modal";
import { SoilTypeLabels } from "@/common/soil-type-labels";
import { SunlightIncidenceLabels } from "@/common/sunlight-incidence-labels";
import { WateringFrequencyLabels } from "@/common/watering-frequency-labels";

export default function PlantationDetailsLayout({
  plantation,
  plants,
  loading,
  selectedPlant,
  plantDetails,
  handleBack,
  handleSelectPlant,
  handleDeletePlantation,
  handleEditPlantation,
  handleDeletePlant,
  handleEditPlant,
  isEditing,
  isDeleting,
  showDeleteModal,
  setShowDeleteModal,
  showEditPlantationModal,
  setShowEditPlantationModal,
  showEditPlantModal,
  setShowEditPlantModal,
  plantToEdit,
  setPlantToEdit,
}: PlantationDetailsHook) {
  const router = useRouter();
  const routerRef = useRef(router);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center gap-6">
          <span className="text-green-700 text-xl font-bold">
            Carregando...
          </span>
        </div>
      </div>
    );
  }

  if (!plantation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center gap-6">
          <span className="text-red-700 text-xl font-bold">
            Plantação não encontrada.
          </span>
        </div>
      </div>
    );
  }

  if (selectedPlant) {
    return (
      <Fragment>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center gap-6">
            <button
              className="self-start mb-4 px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={handleBack}
            >
              Voltar
            </button>

            <div className="w-full flex justify-between items-center mb-2">
              <h2 className="text-green-700 text-2xl font-bold">
                Detalhes da Planta
              </h2>
              <div className="flex gap-2">
                <button
                  className="p-2 text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    setPlantToEdit(selectedPlant);
                    setShowEditPlantModal(true);
                  }}
                >
                  <PencilIcon />
                </button>
                <button
                  className="p-2 text-red-600 hover:text-red-800"
                  onClick={() => {
                    setPlantToEdit(selectedPlant);
                    setShowDeleteModal(true);
                  }}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div>
                <span className="font-semibold">Nome comum:</span>{" "}
                {selectedPlant.commonName}
              </div>
              <div>
                <span className="font-semibold">Nome científico:</span>{" "}
                <span className="italic">{selectedPlant.scientificName}</span>
              </div>
              <div>
                <span className="font-semibold">Quantidade:</span>{" "}
                {selectedPlant.quantity}
              </div>
              {selectedPlant.plantationName && (
                <div>
                  <span className="font-semibold">Plantação:</span>{" "}
                  {selectedPlant.plantationName}
                </div>
              )}

              {plantDetails && (
                <>
                  {plantDetails.careLevel && (
                    <div className="mt-4">
                      <span className="font-semibold">Nível de cuidado:</span>{" "}
                      <p className="mt-1">{plantDetails.careLevel}</p>
                    </div>
                  )}
                  {plantDetails.cycle && (
                    <div className="mt-2">
                      <span className="font-semibold">Ciclo:</span>{" "}
                      <p className="mt-1">{plantDetails.cycle}</p>
                    </div>
                  )}
                  {plantDetails.maxFeetHeight && (
                    <div className="mt-2">
                      <span className="font-semibold">Altura máxima:</span>{" "}
                      <p className="mt-1">{plantDetails.maxFeetHeight}</p>
                    </div>
                  )}
                  {plantDetails.pruningMonth &&
                    plantDetails.pruningMonth.length > 0 && (
                      <div className="mt-2">
                        <span className="font-semibold">Meses de poda:</span>{" "}
                        <p className="mt-1">
                          {plantDetails.pruningMonth.join(", ")}
                        </p>
                      </div>
                    )}
                  {plantDetails.soilType && (
                    <div className="mt-2">
                      <span className="font-semibold">Tipo de solo:</span>{" "}
                      <p className="mt-1">
                        {SoilTypeLabels[plantDetails.soilType] ||
                          plantDetails.soilType}
                      </p>
                    </div>
                  )}
                  {plantDetails.sunlightIncidence && (
                    <div className="mt-2">
                      <span className="font-semibold">
                        Incidência de luz solar:
                      </span>{" "}
                      <p className="mt-1">
                        {SunlightIncidenceLabels[
                          plantDetails.sunlightIncidence
                        ] || plantDetails.sunlightIncidence}
                      </p>
                    </div>
                  )}
                  {plantDetails.wateringFrequency && (
                    <div className="mt-2">
                      <span className="font-semibold">Frequência de rega:</span>{" "}
                      <p className="mt-1">
                        {WateringFrequencyLabels[
                          plantDetails.wateringFrequency
                        ] || plantDetails.wateringFrequency}
                      </p>
                    </div>
                  )}
                  {plantDetails.plantationDate && (
                    <div className="mt-2">
                      <span className="font-semibold">Data de plantio:</span>{" "}
                      <p className="mt-1">
                        {new Date(
                          plantDetails.plantationDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <ConfirmModal
          isOpen={showDeleteModal}
          title="Excluir Planta"
          message={`Tem certeza que deseja excluir a planta ${selectedPlant.commonName}?`}
          confirmText="Excluir"
          onConfirm={() => {
            if (plantToEdit) {
              handleDeletePlant(plantToEdit);
            }
          }}
          onCancel={() => {
            setShowDeleteModal(false);
            setPlantToEdit(null);
          }}
          isDeleting={isDeleting}
        />

        <EditPlantModal
          isOpen={showEditPlantModal}
          onClose={() => {
            setShowEditPlantModal(false);
            setPlantToEdit(null);
          }}
          onSave={handleEditPlant}
          plant={plantToEdit}
          isEditing={isEditing}
        />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg flex flex-col items-center gap-6">
          <button
            className="self-start mb-2 px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={handleBack}
          >
            Voltar
          </button>

          <div className="flex justify-between items-center w-full">
            <h1 className="text-green-700 text-3xl font-extrabold">
              {plantation.name}
            </h1>
            <div className="flex gap-2">
              <button
                className="p-2 text-blue-600 hover:text-blue-800"
                onClick={() => setShowEditPlantationModal(true)}
              >
                <PencilIcon />
              </button>
              <button
                className="p-2 text-red-600 hover:text-red-800"
                onClick={() => setShowDeleteModal(true)}
              >
                <TrashIcon />
              </button>
            </div>
          </div>

          <div className="text-gray-700 text-lg mb-4 text-center">
            Área: {plantation.sizeArea} m²
          </div>
          <h2 className="text-xl font-bold mb-2">Plantas nesta plantação</h2>
          <ul className="w-full">
            {plants.length === 0 && (
              <li className="text-gray-500 text-center">
                Nenhuma planta cadastrada.
              </li>
            )}
            {plants.map((plant) => (
              <li
                key={plant.perenualId}
                className="flex items-center justify-between border-b py-2"
              >
                <div
                  className="flex-grow cursor-pointer hover:text-green-700"
                  onClick={() => handleSelectPlant(plant)}
                >
                  <span className="font-semibold">{plant.commonName}</span>
                  <span className="text-gray-500 ml-2 italic">
                    {plant.scientificName}
                  </span>
                  <span className="ml-4 text-gray-700">
                    Qtd: {plant.quantity}
                  </span>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    className="p-1.5 text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlantToEdit(plant);
                      setShowEditPlantModal(true);
                    }}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 text-red-600 hover:text-red-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlantToEdit(plant);
                      setShowDeleteModal(true);
                    }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex gap-4 mt-4">
            {" "}
            <button
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
              onClick={() =>
                routerRef.current.push(
                  `/plantation/${plantation.name}/add-plant`
                )
              }
            >
              Adicionar Planta
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title={plantToEdit ? "Excluir Planta" : "Excluir Plantação"}
        message={
          plantToEdit
            ? `Tem certeza que deseja excluir a planta ${plantToEdit.commonName}?`
            : `Tem certeza que deseja excluir a plantação ${plantation.name}?`
        }
        confirmText="Excluir"
        onConfirm={() => {
          if (plantToEdit) {
            handleDeletePlant(plantToEdit);
          } else {
            handleDeletePlantation();
          }
        }}
        onCancel={() => {
          setShowDeleteModal(false);
          setPlantToEdit(null);
        }}
        isDeleting={isDeleting}
      />

      <EditPlantationModal
        isOpen={showEditPlantationModal}
        onClose={() => setShowEditPlantationModal(false)}
        onSave={handleEditPlantation}
        plantation={plantation}
        isEditing={isEditing}
      />

      <EditPlantModal
        isOpen={showEditPlantModal}
        onClose={() => {
          setShowEditPlantModal(false);
          setPlantToEdit(null);
        }}
        onSave={handleEditPlant}
        plant={plantToEdit}
        isEditing={isEditing}
      />
    </Fragment>
  );
}
