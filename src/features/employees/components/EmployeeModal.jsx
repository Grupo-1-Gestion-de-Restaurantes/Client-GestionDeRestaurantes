import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveEmployee } from "../hooks/useSaveEmployee";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";

export const EmployeeModal = ({ isOpen, onClose, employee }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const { saveEmployee } = useSaveEmployee();
    const loading = useEmployeeStore((state) => state.loading);

    useEffect(() => {
        if (isOpen) {
            if (employee) {
                reset({
                    userId: employee.userId,
                    restaurant: employee.restaurant?._id || employee.restaurant,
                    specialty: employee.specialty,
                    isActive: employee.isActive,
                });
            } else {
                reset({
                    userId: "",
                    restaurant: "",
                    specialty: "OTRO",
                    isActive: true,
                });
            }
        }
    }, [isOpen, employee, reset]);

    const onSubmit = async (data) => {
        try {
            await saveEmployee(data, employee?._id);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
            <div className="bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg md:max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--border-color)] transition-colors duration-300">
                
                {/* HEADER */}
                <div className="p-4 sm:p-5 bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border-b border-[var(--border-color)]">
                    <h2 className="text-xl sm:text-2xl font-bold">
                        {employee ? "Editar Empleado" : "Nuevo Empleado"}
                    </h2>
                    <p className="text-xs sm:text-sm opacity-80">
                        Completa la información del empleado
                    </p>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-4 sm:p-6 space-y-5 overflow-y-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* USER ID */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                ID Usuario
                            </label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. usr_123..."
                                {...register("userId", { required: "El userId es obligatorio" })}
                            />
                            {errors.userId && (
                                <p className="text-[var(--color-brand-red)] text-xs mt-1">
                                    {errors.userId.message}
                                </p>
                            )}
                        </div>

                        {/* RESTAURANT */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                ID Restaurante
                            </label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. 64fa..."
                                {...register("restaurant", { required: "El restaurante es obligatorio" })}
                            />
                            {errors.restaurant && (
                                <p className="text-[var(--color-brand-red)] text-xs mt-1">
                                    {errors.restaurant.message}
                                </p>
                            )}
                        </div>

                        {/* SPECIALTY */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                Especialidad
                            </label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("specialty", { required: true })}
                            >
                                <option value="COCINERO">Cocinero</option>
                                <option value="BARTENDER">Bartender</option>
                                <option value="CAMARERO">Camarero</option>
                                <option value="ADMINISTRATIVO">Administrativo</option>
                                <option value="OTRO">Otro</option>
                            </select>
                        </div>

                        {/* ACTIVE */}
                        <div className="flex items-center gap-3 md:col-span-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4 accent-[var(--color-brand-dark)]"
                                {...register("isActive")}
                            />
                            <label className="text-sm text-[var(--text-secondary)]">
                                Empleado activo
                            </label>
                        </div>

                    </div>

                    {/* BOTONES */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[var(--bg-surface-alt)] text-[var(--text-primary)] hover:opacity-80 transition"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="w-full sm:w-auto px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)]"
                        >
                            {loading ? <Spinner /> : employee ? "Guardar Cambios" : "Crear Empleado"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};