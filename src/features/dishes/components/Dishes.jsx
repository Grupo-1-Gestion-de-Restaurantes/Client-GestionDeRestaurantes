import { useState, useEffect } from "react";
import { useDishStore } from "../store/useDishStore";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { DishModal } from "./DishModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";

export const Dishes = () => {
  const { dishes, loading, error, getDishes, deleteDish } = useDishStore();
  const [openModal, setOpenModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const { openConfirm } = useUIStore();

  useEffect(() => {
    getDishes();
  }, [getDishes]);

  useToastEffect(() => {
    if (error) showError(error);
  }, [error]);

  if (loading && dishes.length === 0) return <Spinner />;

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Gestión de Platillos
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Administra el menú y los platillos disponibles
          </p>
        </div>

        <button
          onClick={() => {
            setOpenModal(true);
            setSelectedDish(null);
          }}
          className="px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent"
        >
          + Agregar Platillo
        </button>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dishes.length > 0 ? (
          dishes.map((dish) => (
            <div
              key={dish._id}
              className="bg-[var(--bg-surface)] rounded-xl shadow-md border border-[var(--border-color)] hover:shadow-lg transition-all duration-300 overflow-hidden hover:scale-[1.02]"
            >
              <div className="w-full h-52 bg-[var(--bg-base)] flex items-center justify-center border-b border-[var(--border-color)] overflow-hidden p-2">
                {dish.photo ? (
                  <img
                    src={dish.photo}
                    alt={dish.name}
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <span className="text-[var(--text-muted)]">Sin imagen</span>
                )}
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold text-[var(--color-brand-dark)] dark:text-[var(--text-primary)]">
                  {dish.name}
                </h2>

                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="px-3 py-1 text-xs rounded-full bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] font-medium border border-[var(--border-color)]">
                    {dish.dishType?.replace("_", " ") || "Sin Categoría"}
                  </span>

                  <span className="px-3 py-1 text-xs rounded-full bg-[var(--color-brand-yellow-soft)] text-[var(--color-brand-yellow-dark)] font-medium">
                    Q{dish.price}
                  </span>
                </div>

                <p className="text-sm text-[var(--text-muted)] mt-3 line-clamp-2">
                  {dish.description}
                </p>

                <div className="flex gap-3 mt-5 pt-4 border-t border-[var(--border-color)]">
                  <button
                    className="flex-1 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white hover:bg-[var(--color-brand-yellow)] hover:text-[var(--color-brand-dark)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)]"
                    onClick={() => {
                      setSelectedDish(dish);
                      setOpenModal(true);
                    }}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    className="flex-1 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-red)] text-white hover:bg-[var(--color-brand-red-dark)]"
                    onClick={() =>
                      openConfirm({
                        title: "Eliminar Platillo",
                        message: `¿Eliminar ${dish.name}?`,
                        onConfirm: () => deleteDish(dish._id),
                      })
                    }
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-[var(--text-muted)] bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)]">
            No hay platillos registrados en el menú.
          </div>
        )}
      </div>

      <DishModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedDish(null);
        }}
        dish={selectedDish}
      />
    </div>
  );
};
