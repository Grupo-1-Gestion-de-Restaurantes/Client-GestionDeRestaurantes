import { useState, useEffect, useMemo } from "react";
import { useEmployeeStore } from "../store/useEmployeeStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { useAuthStore } from "../../auth/store/useAuthStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { EmployeeModal } from "./EmployeeModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { PencilLine, Trash2, Search, Filter, BadgeCheck, RotateCcw } from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";
import { Pagination } from "../../../shared/components/ui/Pagination.jsx";

export const Employees = () => {
    const { employees, loading, error, getEmployees, deleteEmployee, activateEmployee, pagination } = useEmployeeStore();
    const { restaurants, getRestaurants } = useRestaurantStore();
    const { user } = useAuthStore();
    const isAdmin = user?.role === "ADMIN_ROLE";
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [restaurantFilter, setRestaurantFilter] = useState("all");
    const [activeFilter, setActiveFilter] = useState("active");
    const { openConfirm } = useUIStore();

    useEffect(() => {
        const params = { page: 1 };
        if (restaurantFilter !== "all") params.restaurant = restaurantFilter;
        if (activeFilter !== "all") params.isActive = activeFilter === "active";
        else params.isActive = "all";

        getEmployees(params);
        if (getRestaurants) getRestaurants({ isActive: 'all', limit: 100 });
    }, [getEmployees, getRestaurants, restaurantFilter, activeFilter]);

    const handlePageChange = (page) => {
        const params = { page };
        if (restaurantFilter !== "all") params.restaurant = restaurantFilter;
        if (activeFilter !== "all") params.isActive = activeFilter === "active";
        else params.isActive = "all";
        getEmployees(params);
    };

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const filteredEmployees = useMemo(() => {
        return employees.filter((emp) => {
            const matchesSearch = (emp.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 (emp.specialty || "").toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesSearch;
        });
    }, [employees, searchTerm]);

    const getRestaurantName = (restaurantField) => {
        if (!restaurantField) return "Sin asignar";
        if (typeof restaurantField === "object" && restaurantField.name) {
            return restaurantField.name;
        }
        const found = restaurants?.find((r) => r._id === String(restaurantField));
        return found ? found.name : "Cargando sucursal...";
    };

    if (loading && filteredEmployees.length === 0) return <Spinner />;

    return (
        <div className="p-4">
            {/* HEADER DE SECCIÓN */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Gestión de Personal (Empleados)
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Controla las sucursales asignadas, especialidades y accesos del equipo de trabajo
                    </p>
                </div>

                <button
                    onClick={() => {
                        setOpenModal(true);
                        setSelectedEmployee(null);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent"
                >
                    + Registrar Empleado
                </button>
            </div>

            {/* BUSCADOR Y FILTROS */}
            <div className="mb-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                            <span className="inline-flex items-center gap-2">
                                <LucideMotionIcon icon={Search} />
                                Buscar personal
                            </span>
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
                                <LucideMotionIcon icon={Search} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-muted)]" />
                            </span>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nombre o especialidad..."
                                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)] placeholder:text-[var(--text-muted)]"
                            />
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="w-full lg:w-64">
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                <span className="inline-flex items-center gap-2">
                                    <LucideMotionIcon icon={Filter} />
                                    Restaurante
                                </span>
                            </label>
                            <select
                                value={restaurantFilter}
                                onChange={(e) => setRestaurantFilter(e.target.value)}
                                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)]"
                            >
                                <option value="all">Todos los restaurantes</option>
                                {restaurants?.map((r) => (
                                    <option key={r._id} value={r._id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="w-full lg:w-48">
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                            <span className="inline-flex items-center gap-2">
                                <LucideMotionIcon icon={Filter} />
                                Estado
                            </span>
                        </label>
                        <select
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)]"
                        >
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                            <option value="all">Todos</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm("");
                            setRestaurantFilter("all");
                            setActiveFilter("active");
                        }}
                        className="rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-base)]"
                    >
                        <span className="inline-flex items-center gap-2">
                            <LucideMotionIcon icon={BadgeCheck} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-secondary)]" />
                            Limpiar
                        </span>
                    </button>
                </div>
            </div>

            {/* TABLA RESPONSIVE CARD */}
            <div className="bg-[var(--bg-surface)] rounded-xl shadow-md border border-[var(--border-color)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] text-sm border-b border-[var(--border-color)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nombre del Empleado</th>
                            <th className="px-6 py-4 font-semibold">Sucursal / Restaurante</th>
                            <th className="px-6 py-4 font-semibold">Especialidad / Puesto</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp) => (
                                <tr key={emp._id} className="hover:bg-[var(--bg-base)] transition-colors align-middle">

                                    {/* Nombre Completo extraído directo de MongoDB */}
                                    <td className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">
                                        {emp.fullName || "Usuario sin nombre"}
                                    </td>

                                    {/* Sucursal vinculada */}
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-100 dark:border-blue-800/30">
                                            {getRestaurantName(emp.restaurant)}
                                        </span>
                                    </td>

                                    {/* Rol / Puesto Operativo */}
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        <span className="bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300 px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider uppercase">
                                            {emp.specialty}
                                        </span>
                                    </td>

{/* Acciones de Control Perfectamente Centradas */}
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                className="inline-flex items-center gap-2 text-[var(--color-brand-yellow)] hover:opacity-75 font-medium text-sm transition cursor-pointer"
                                                onClick={() => {
                                                    setSelectedEmployee(emp);
                                                    setOpenModal(true);
                                                }}
                                            >
                                                <LucideMotionIcon icon={PencilLine} className="!w-4 !h-4 text-[var(--color-brand-yellow)]" />
                                                <span>Editar</span>
                                            </button>
                                            {emp.isActive ? (
                                                <button
                                                    className="inline-flex items-center gap-2 text-[var(--color-brand-red)] hover:text-[var(--color-brand-red-dark)] font-medium text-sm transition cursor-pointer"
                                                    onClick={() =>
                                                        openConfirm({
                                                            title: "Dar de Baja Empleado",
                                                            message: `¿Estás seguro de desactivar al empleado "${emp.fullName || 'este usuario'}"? Ya no tendrá acceso operativo a la sucursal.`,
                                                            onConfirm: () => deleteEmployee(emp._id)
                                                        })
                                                    }
                                                >
                                                    <LucideMotionIcon icon={Trash2} className="!w-4 !h-4 text-[var(--color-brand-red)]" />
                                                    <span>Eliminar</span>
                                                </button>
                                            ) : (
                                                <button
                                                    className="inline-flex items-center gap-2 text-green-700 hover:text-green-500 font-medium text-sm transition cursor-pointer"
                                                    onClick={() =>
                                                        openConfirm({
                                                            title: "Activar Empleado",
                                                            message: `¿Estás seguro de activar al empleado "${emp.fullName || 'este usuario'}"?`,
                                                            onConfirm: () => activateEmployee(emp._id)
                                                        })
                                                    }
                                                >
                                                    <LucideMotionIcon icon={RotateCcw} className="!w-4 !h-4 text-green-700 dark:text-[var(--color-brand-yellow)]" />
                                                    <span>Activar</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-[var(--text-muted)] italic">
                                    No hay empleados registrados en el sistema.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination 
                pagination={pagination} 
                onPageChange={handlePageChange} 
            />

            {/* MODAL DISTRIBUIDO DE CONTRATACIÓN */}
            <EmployeeModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedEmployee(null);
                }}
                employeeItem={selectedEmployee}
            />
        </div>
    );
};