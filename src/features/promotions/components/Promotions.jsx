import { useEffect, useMemo, useState } from "react";
import { Plus, Search, PencilLine, Power, PowerOff } from "lucide-react";
import { usePromotionStore } from "../store/usePromotionStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { useAuthStore } from "../../../features/auth/store/useAuthStore.js";
import { PromotionModal } from "./PromotionModal.jsx";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { showError } from "../../../shared/utils/toast.js";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";
import { Pagination } from "../../../shared/components/ui/Pagination.jsx";
import { Filter, BadgeCheck } from "lucide-react";

export const Promotions = () => {
  const { promotions, loading, error, getPromotions, deactivatePromotion, activatePromotion, pagination } = usePromotionStore();
  const { restaurants, getRestaurants } = useRestaurantStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN_ROLE";
  const { openConfirm } = useUIStore();

  const [openModal, setOpenModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");
  const [restaurantFilter, setRestaurantFilter] = useState("");

  useEffect(() => {
    getRestaurants({ isActive: 'all', limit: 100 });
  }, [getRestaurants]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filters = { page: 1 };

      if (activeFilter !== "all") {
        filters.isActive = activeFilter === "active";
      } else {
        filters.isActive = "all";
      }

      if (isAdmin && restaurantFilter) {
        filters.restaurant = restaurantFilter;
      }

      getPromotions(filters);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [activeFilter, restaurantFilter, getPromotions, isAdmin]);

  const handlePageChange = (page) => {
    const filters = { page };
    if (activeFilter !== "all") {
      filters.isActive = activeFilter === "active";
    } else {
      filters.isActive = "all";
    }

    if (isAdmin && restaurantFilter) {
      filters.restaurant = restaurantFilter;
    }
    getPromotions(filters);
  };

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const getRestaurantName = (restaurant) => {
    if (restaurant && typeof restaurant === "object") {
      return restaurant.name || "N/A";
    }

    const foundRestaurant = restaurants.find((item) => item._id === restaurant);
    return foundRestaurant?.name || "N/A";
  };

  const filteredPromotions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return promotions.filter((promotion) => {
      if (!normalizedSearch) return true;

      const restaurantName = promotion.restaurant?.name || "";
      return [promotion.title, promotion.scope, promotion.status, restaurantName]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [promotions, searchTerm]);

  const emptyMessage = searchTerm.trim() || activeFilter !== "active"
    ? "No hay promociones con esos filtros."
    : "No hay promociones registradas.";

  if (loading && promotions.length === 0) return <Spinner />;

  return (
    <div className="p-4">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Gestión de Promociones</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Administra promociones del panel de administración</p>
        </div>

        <button
          onClick={() => {
            setOpenModal(true);
            setSelectedPromotion(null);
          }}
          className="rounded-lg border border-transparent bg-[var(--color-brand-dark)] px-4 py-2 font-medium text-white shadow transition hover:bg-[var(--color-brand-red)]"
        >
          <span className="inline-flex items-center gap-2">
            <LucideMotionIcon icon={Plus} className="!w-4 !h-4 text-white" />
            Agregar Promoción
          </span>
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Buscar promociones</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
                <LucideMotionIcon icon={Search} className="!w-4 !h-4 text-[var(--text-muted)]" />
              </span>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por título, restaurante, estado o alcance"
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-brand-dark)]"
              />
            </div>
          </div>

          <div className="w-full lg:w-64">
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
              <span className="inline-flex items-center gap-2">
                <LucideMotionIcon icon={Filter} />
                Mostrar
              </span>
            </label>
            <select
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.target.value)}
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none"
            >
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
              <option value="all">Todas</option>
            </select>
          </div>

          {isAdmin && (
            <div className="w-full lg:w-64">
              <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                <span className="inline-flex items-center gap-2">
                  <LucideMotionIcon icon={Filter} />
                  Restaurante
                </span>
              </label>
              <select
                value={restaurantFilter}
                onChange={(event) => setRestaurantFilter(event.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none"
              >
                <option value="">Todos los restaurantes</option>
                {restaurants?.map((r) => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setActiveFilter("active");
              setRestaurantFilter("");
            }}
            className="rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-base)]"
          >
            <span className="inline-flex items-center gap-2">
              <LucideMotionIcon icon={BadgeCheck} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]" />
              Limpiar
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-md">
        <table className="w-full border-collapse text-left">
          <thead className="border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-sm text-[var(--text-secondary)]">
            <tr>
              <th className="px-6 py-4 font-semibold">Promoción</th>
              <th className="px-6 py-4 font-semibold">Restaurante</th>
              <th className="px-6 py-4 font-semibold">Descuento</th>
              <th className="px-6 py-4 font-semibold">Alcance</th>
              <th className="px-6 py-4 font-semibold">Vigencia</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold">Activa</th>
              <th className="px-6 py-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {filteredPromotions.length > 0 ? (
              filteredPromotions.map((promotion) => (
                <tr key={promotion._id} className="transition-colors hover:bg-[var(--bg-base)]">
                  <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{promotion.title}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                    {getRestaurantName(promotion.restaurant)}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{promotion.discountPercentage}%</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{promotion.scope}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                    {promotion.startDate ? new Date(promotion.startDate).toLocaleDateString() : "N/A"} - {promotion.endDate ? new Date(promotion.endDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${promotion.status === "APPROVED" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : promotion.status === "REJECTED" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                      {promotion.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${promotion.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                      {promotion.isActive ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedPromotion(promotion);
                          setOpenModal(true);
                        }}
                        className="inline-flex items-center gap-2 font-medium text-[var(--color-brand-yellow)] transition hover:opacity-75"
                      >
                        <LucideMotionIcon icon={PencilLine} className="!w-4 !h-4 text-[var(--color-brand-yellow)]" />
                        Editar
                      </button>
                      {promotion.isActive ? (
                        <button
                          onClick={() =>
                            openConfirm({
                              title: "Desactivar Promoción",
                              message: `¿Estás seguro de desactivar la promoción ${promotion.title}?`,
                              onConfirm: () => deactivatePromotion(promotion._id),
                            })
                          }
                          className="inline-flex items-center gap-2 font-medium text-[var(--color-brand-red)] transition hover:opacity-75"
                        >
                          <LucideMotionIcon icon={PowerOff} className="!w-4 !h-4 text-[var(--color-brand-red)]" />
                          Desactivar
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            openConfirm({
                              title: "Activar Promoción",
                              message: `¿Estás seguro de activar la promoción ${promotion.title}?`,
                              onConfirm: () => activatePromotion(promotion._id),
                            })
                          }
                          className="inline-flex items-center gap-2 font-medium text-green-700 transition hover:opacity-75"
                        >
                          <LucideMotionIcon icon={Power} className="!w-4 !h-4 text-green-700 dark:text-[var(--color-brand-yellow)]" />
                          Activar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-[var(--text-muted)]">{emptyMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination 
        pagination={pagination} 
        onPageChange={handlePageChange} 
      />

      <PromotionModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedPromotion(null);
        }}
        promotion={selectedPromotion}
      />
    </div>
  );
};
