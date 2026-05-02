import { useState, useEffect } from "react";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { EmployeeModal } from "./EmployeeModal.jsx";

export const Employees = () => {
    const { employees, loading, getEmployees, deleteEmployee } = useEmployeeStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        getEmployees();
    }, []);

    if (loading && employees.length === 0) return <Spinner />;

    const getSpecialtyStyle = (spec) => {
        switch (spec) {
            case 'COCINERO': return 'bg-orange-100 text-orange-800';
            case 'BARTENDER': return 'bg-purple-100 text-purple-800';
            case 'CAMARERO': return 'bg-blue-100 text-blue-800';
            case 'ADMINISTRATIVO': return 'bg-gray-200 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-4">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Gestión de Empleados
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Administra los empleados del restaurante
                    </p>
                </div>

                <button
                    onClick={() => {
                        setOpenModal(true);
                        setSelectedEmployee(null);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)]"
                >
                    + Agregar Empleado
                </button>
            </div>

            {/* TABLA */}
            <div className="bg-[var(--bg-surface)] rounded-xl shadow-md border border-[var(--border-color)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] text-sm border-b border-[var(--border-color)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">User ID</th>
                            <th className="px-6 py-4 font-semibold">Restaurante</th>
                            <th className="px-6 py-4 font-semibold">Especialidad</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[var(--border-color)]">
                        {employees.length > 0 ? (
                            employees.map((emp) => (
                                <tr key={emp._id} className="hover:bg-[var(--bg-base)] transition">
                                    <td className="px-6 py-4 text-sm">{emp.userId}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {emp.restaurant?._id || emp.restaurant}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getSpecialtyStyle(emp.specialty)}`}>
                                            {emp.specialty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {emp.isActive ? "Activo" : "Inactivo"}
                                    </td>

                                    <td className="px-6 py-4 flex gap-3 justify-center">
                                        <button
                                            className="text-[var(--color-brand-dark)] hover:text-[var(--color-brand-yellow)]"
                                            onClick={() => {
                                                setSelectedEmployee(emp);
                                                setOpenModal(true);
                                            }}
                                        >
                                            ✏️ Editar
                                        </button>

                                        <button
                                            className="text-[var(--color-brand-red)] hover:text-[var(--color-brand-red-dark)]"
                                            onClick={() => deleteEmployee(emp._id)}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-[var(--text-muted)]">
                                    No hay empleados registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <EmployeeModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedEmployee(null);
                }}
                employee={selectedEmployee}
            />
        </div>
    );
};