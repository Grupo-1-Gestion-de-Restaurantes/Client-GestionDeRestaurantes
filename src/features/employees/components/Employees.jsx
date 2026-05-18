import { useState, useEffect } from "react";
import { useEmployeeStore } from "../store/useEmployeeStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { EmployeeModal } from "./EmployeeModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";

export const Employees = () => {
    const { employees, loading, error, getEmployees, deleteEmployee } = useEmployeeStore();
    const { restaurants, getRestaurants } = useRestaurantStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const { openConfirm } = useUIStore();

    useEffect(() => {
        getEmployees();
        if (getRestaurants) getRestaurants();
    }, [getEmployees, getRestaurants]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const activeEmployees = employees.filter((e) => e.isActive === true);

    const getRestaurantName = (restaurantField) => {
        if (!restaurantField) return "Sin asignar";
        if (typeof restaurantField === "object" && restaurantField.name) {
            return restaurantField.name;
        }
        const found = restaurants?.find((r) => r._id === String(restaurantField));
        return found ? found.name : "Cargando sucursal...";
    };

    if (loading && activeEmployees.length === 0) return <Spinner />;

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
                        {activeEmployees.length > 0 ? (
                            activeEmployees.map((emp) => (
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
                                                className=" hover:text-[var(--color-brand-yellow)] font-medium text-sm flex items-center gap-1.5 transition cursor-pointer"
                                                onClick={() => {
                                                    setSelectedEmployee(emp);
                                                    setOpenModal(true);
                                                }}
                                            >
                                                ✏️ <span>Editar</span>
                                            </button>
                                            <button
                                                className="text-[var(--color-brand-red)] hover:text-[var(--color-brand-red-dark)] font-medium text-sm flex items-center gap-1.5 transition cursor-pointer"
                                                onClick={() =>
                                                    openConfirm({
                                                        title: "Dar de Baja Empleado",
                                                        message: `¿Estás seguro de desactivar al empleado "${emp.fullName || 'este usuario'}"? Ya no tendrá acceso operativo a la sucursal.`,
                                                        onConfirm: () => deleteEmployee(emp._id)
                                                    })
                                                }
                                            >
                                                🗑️ <span>Eliminar</span>
                                            </button>
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