import { useEffect, useState } from "react";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { EmployeeModal } from "./EmployeeModal.jsx";

export const Employees = () => {

    const { employees, loading, getEmployees, deleteEmployee } = useEmployeeStore();
    const { openConfirm } = useUIStore();

    const [openModal, setOpenModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        getEmployees();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="p-4">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-main-blue">
                        Gestión de Empleados
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Administra los empleados del restaurante
                    </p>
                </div>

                <button
                    onClick={() => {
                        setOpenModal(true);
                        setSelectedEmployee(null);
                    }}
                    className="bg-main-blue text-white px-4 py-2 rounded"
                >
                    + Agregar Empleado
                </button>
            </div>

            {/* LISTA */}
            <div className="grid gap-4">

                {employees.map(emp => (
                    <div className="bg-white p-4 rounded shadow flex flex-col gap-2">

                        <h2 className="font-bold text-lg">{emp.name}</h2>

                        <p className="text-sm text-gray-500">
                            Rol: {emp.role}
                        </p>

                        <p className="text-sm text-gray-500">
                            Restaurante: {emp.restaurant}
                        </p>

                        <div className="flex gap-2 mt-2">
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                onClick={() => {
                                    setSelectedEmployee(emp);
                                    setOpenModal(true);
                                }}
                            >
                                Editar
                            </button>

                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded"
                                onClick={() =>
                                    openConfirm({
                                        title: "Eliminar empleado",
                                        message: `¿Eliminar ${emp.name}?`,
                                        onConfirm: () => deleteEmployee(emp._id)
                                    })
                                }
                            >
                                Eliminar
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            <EmployeeModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                employee={selectedEmployee}
            />
        </div>
    );
};