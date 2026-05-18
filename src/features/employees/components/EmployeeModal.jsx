import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveEmployee } from "../hooks/useSaveEmployee";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { showError } from "../../../shared/utils/toast.js";

export const EmployeeModal = ({ isOpen, onClose, employeeItem }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            role: "EMPLOYEE_ROLE",
            specialty: "COCINERO"
        }
    });

    const { saveEmployee } = useSaveEmployee();
    const loading = useEmployeeStore((state) => state.loading);
    const { restaurants, getRestaurants } = useRestaurantStore();

    // Observamos el rol elegido en el formulario
    const selectedRole = watch("role");

    useEffect(() => {
        if (isOpen && getRestaurants) getRestaurants();
    }, [isOpen, getRestaurants]);

    useEffect(() => {
        if (isOpen) {
            if (employeeItem) {
                // MODO EDICIÓN: Cargamos los datos actuales de MongoDB
                reset({
                    restaurant: employeeItem.restaurant?._id || employeeItem.restaurant || "",
                    specialty: employeeItem.specialty || "COCINERO",
                });
            } else {
                // MODO CREACIÓN: Reset completo a valores por defecto
                reset({
                    name: "",
                    surname: "",
                    username: "",
                    email: "",
                    password: "",
                    phone: "",
                    role: "EMPLOYEE_ROLE",
                    restaurant: "",
                    specialty: "COCINERO",
                    profilePicture: null
                });
            }
        }
    }, [isOpen, employeeItem, reset]);

    const onSubmit = async (data) => {
        try {
            await saveEmployee(data, employeeItem?._id);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
            showError(error.response?.data?.message || "Error al procesar la solicitud");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
            <div className="bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg md:max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--border-color)] transition-colors duration-300">

                {/* HEADER */}
                <div className="p-4 sm:p-5 bg-[linear-gradient(90deg,var(--main-blue)_0%,#1956a3_100%)] text-white">
                    <h2 className="text-xl sm:text-2xl font-bold">
                        {employeeItem ? "Editar Puesto de Personal" : "Contratación de Personal"}
                    </h2>
                    <p className="text-xs sm:text-sm opacity-80">
                        {employeeItem ? "Modifica la sucursal o promueve el puesto operativo del empleado" : "Registra las credenciales y asigna la sucursal"}
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 overflow-y-auto">

                    {/* SECCIÓN DATOS PERSONALES (Solo visible al Crear) */}
                    {!employeeItem && (
                        <div className="space-y-4 p-3 bg-[var(--bg-surface-alt)] rounded-xl border border-[var(--border-color)]">
                            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">👤 Datos del Nuevo Usuario</h3>

                            <div className="flex flex-col">
                                <label className="text-xs font-semibold mb-1">Tipo de Rol</label>
                                <select
                                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                    {...register("role", { required: true })}
                                >
                                    <option value="EMPLOYEE_ROLE">Employee (Personal Operativo)</option>
                                    <option value="MANAGER_ROLE">Manager (Gerente de Sucursal)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold mb-1">Nombre</label>
                                    <input
                                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                        placeholder="Marlon"
                                        {...register("name", { required: true, minLength: 2, maxLength: 50 })}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold mb-1">Apellido</label>
                                    <input
                                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                        placeholder="Perez"
                                        {...register("surname", { required: true, minLength: 2, maxLength: 50 })}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold mb-1">Username</label>
                                    <input
                                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                        placeholder="mperez"
                                        {...register("username", { required: true, minLength: 3, maxLength: 30 })}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold mb-1">Teléfono</label>
                                    <input
                                        type="text"
                                        maxLength={8}
                                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                        placeholder="55554444"
                                        {...register("phone", { required: true, minLength: 8, maxLength: 8 })}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold mb-1">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                        placeholder="marlon@correo.com"
                                        {...register("email", { required: true })}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold mb-1">Contraseña</label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                        placeholder="••••••••"
                                        {...register("password", { required: true, minLength: 8 })}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col pt-1">
                                <label className="text-xs font-semibold mb-1">Fotografía de Perfil</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="text-xs text-[var(--text-primary)]"
                                    {...register("profilePicture")}
                                />
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN DE ASIGNACIÓN DE SUCURSAL (SIEMPRE VISIBLE) */}
                    <div className="space-y-4 p-3 bg-[var(--bg-surface-alt)] rounded-xl border border-[var(--border-color)]">
                        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                            Datos de Destino y Especialidad
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Asignación de Sucursal */}
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold mb-1">Asignar a Restaurante</label>
                                <select
                                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                    {...register("restaurant", { required: "El restaurante es obligatorio" })}
                                >
                                    <option value="">Selecciona sucursal...</option>
                                    {restaurants?.map((r) => (
                                        <option key={r._id} value={r._id}>{r.name}</option>
                                    ))}
                                </select>
                                {errors.restaurant && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.restaurant.message}</p>}
                            </div>

                            {/* ESPECIALIDAD OPERATIVA DINÁMICA E INTELIGENTE */}
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold mb-1">Especialidad Operativa</label>
                                {employeeItem ? (

                                    <select
                                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                        {...register("specialty", { required: true })}
                                    >
                                        <option value="COCINERO">Cocinero</option>
                                        <option value="BARTENDER">Bartender</option>
                                        <option value="CAMARERO">Camarero / Mesero</option>
                                        <option value="ADMINISTRATIVO">Administrativo / Gerente</option>
                                        <option value="OTRO">Otro Rol</option>
                                    </select>
                                ) : selectedRole === "MANAGER_ROLE" ? (
                                    <select
                                        disabled
                                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] cursor-not-allowed"
                                        value="ADMINISTRATIVO"
                                    >
                                        <option value="ADMINISTRATIVO">Administrativo / Gerente</option>
                                    </select>
                                ) : (
                                    /* 3. MODO CREACIÓN (Si seleccionó Employee): Solo puestos operativos de planta */
                                    <select
                                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                        {...register("specialty", { required: true })}
                                    >
                                        <option value="COCINERO">Cocinero</option>
                                        <option value="BARTENDER">Bartender</option>
                                        <option value="CAMARERO">Camarero / Mesero</option>
                                        <option value="OTRO">Otro Rol</option>
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* BOTONES */}
                    <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm bg-[var(--bg-surface-alt)] text-[var(--text-primary)] hover:opacity-80 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-[var(--color-brand-dark)] hover:bg-[var(--color-brand-red)] transition disabled:opacity-60"
                        >
                            {loading ? "Guardando..." : employeeItem ? "Guardar Cambios" : "Efectuar Contratación"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};