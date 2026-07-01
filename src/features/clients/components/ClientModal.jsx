import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveClient } from "../hooks/useSaveClient";
import { useClientStore } from "../store/useClientStore";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";

export const ClientModal = ({ isOpen, onClose, client }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const { saveClient } = useSaveClient();
    const loading = useClientStore((state) => state.loading);

    useEffect(() => {
        if (isOpen) {
            if (client) {
                // Formatear fecha (YYYY-MM-DD) para el input type="date"
                const dateObj = new Date(client.birthdate);
                const formattedDate = dateObj.toISOString().split("T")[0];

                // Tomamos la primera dirección o valores vacíos por defecto
                const defaultAddress = client.addresses?.[0] || {};

                reset({
                    name: client.name || "",
                    email: client.email || "",
                    phone: client.phone || "",
                    birthdate: formattedDate,
                    gender: client.gender || "Masculino",
                    addressAlias: defaultAddress.alias || "Casa",
                    addressLine: defaultAddress.addressLine || "",
                    houseNumber: defaultAddress.houseNumber || "",
                    securityInfo: defaultAddress.securityInfo || "",
                    reference: defaultAddress.reference || "",
                });
            } else {
                reset({
                    name: "",
                    email: "",
                    phone: "",
                    birthdate: "",
                    gender: "Masculino",
                    addressAlias: "Casa",
                    addressLine: "",
                    houseNumber: "",
                    securityInfo: "",
                    reference: "",
                });
            }
        }
    }, [isOpen, client, reset]);

    const onSubmit = async (data) => {
        try {
            await saveClient(data, client?._id);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
            <div className="bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--border-color)] transition-colors duration-300">
                {/* HEADER */}
                <div className="p-4 sm:p-5 bg-[linear-gradient(90deg,var(--color-brand-dark)_0%,var(--color-brand-red-dark)_100%)] text-white sticky top-0 z-10 transition-colors duration-300">
                    <h2 className="text-xl sm:text-2xl font-bold">
                        {client ? "Editar Cliente" : "Nuevo Cliente"}
                    </h2>
                    <p className="text-xs sm:text-sm opacity-80">
                        Completa el perfil y dirección del cliente
                    </p>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-4 sm:p-6 space-y-5 overflow-y-auto"
                >
                    <h3 className="text-md font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1">Datos Personales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Nombre Completo</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. Juan Pérez"
                                {...register("name", { required: "El nombre es obligatorio" })}
                            />
                            {errors.name && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Correo */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="ejemplo@correo.com"
                                {...register("email", { 
                                    required: "El correo es obligatorio",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Dirección de correo inválida"
                                    }
                                })}
                            />
                            {errors.email && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Teléfono */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Teléfono</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. 45321234"
                                {...register("phone", { 
                                    required: "El teléfono es obligatorio",
                                    pattern: { value: /^[0-9]{8,15}$/, message: "Número inválido (8 a 15 dígitos)" }
                                })}
                            />
                            {errors.phone && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.phone.message}</p>}
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("birthdate", { required: "La fecha de nacimiento es obligatoria" })}
                            />
                            {errors.birthdate && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.birthdate.message}</p>}
                        </div>

                        {/* Género */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Género</label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("gender", { required: "El género es obligatorio" })}
                            >
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                    </div>

                    <h3 className="text-md font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1 pt-2">Dirección Principal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Alias Dirección */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Tipo de Dirección</label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("addressAlias")}
                            >
                                <option value="Casa">Casa</option>
                                <option value="Trabajo">Trabajo</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        {/* Número de casa */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Número de Casa / Apto</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. A-12 o Apt 4B"
                                {...register("houseNumber", { required: "El número de casa es obligatorio" })}
                            />
                            {errors.houseNumber && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.houseNumber.message}</p>}
                        </div>

                        {/* Línea de Dirección */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Dirección Exacta</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. Calle Real 14-22, Zona 10"
                                {...register("addressLine", { required: "La dirección es obligatoria" })}
                            />
                            {errors.addressLine && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.addressLine.message}</p>}
                        </div>

                        {/* Info de Seguridad */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Info. de Seguridad</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. Garita, tocar timbre 2 veces"
                                {...register("securityInfo")}
                            />
                        </div>

                        {/* Referencia */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Referencia</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. Frente a la pastelería"
                                {...register("reference")}
                            />
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
                            className="w-full sm:w-auto px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)]  border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent"
                        >
                            {loading ? "Guardando..." : client ? "Guardar Cambios" : "Crear Cliente"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};