import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveEvent } from "../hooks/useSaveEvents.jsx";
import { useEventStore } from "../store/useEventsStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { useTableStore } from "../../tables/store/useTableStore.js";
import { useDishStore } from "../../dishes/store/useDishStore.js";
import { useEmployeeStore } from "../../employees/store/useEmployeeStore.js";
import { showError } from "../../../shared/utils/toast.js";

export const EventModal = ({ isOpen, onClose, eventItem }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    const { saveEvent } = useSaveEvent();
    const loading = useEventStore((state) => state.loading);
    const { restaurants, getRestaurants } = useRestaurantStore();
    const { tables, getTables } = useTableStore();
    const { dishes, getDishes } = useDishStore();
    const { employees, getEmployees } = useEmployeeStore();

    const selectedRestaurant = watch("restaurant");
    const selectedRestaurantData = restaurants?.find(r => r._id === selectedRestaurant);
    const restaurantCapacity = selectedRestaurantData?.capacity || 0;

    useEffect(() => {
        if (isOpen) {
            if (getRestaurants) getRestaurants({ isActive: 'all', limit: 100 });
            if (getTables) getTables({ isActive: true, limit: 100 });
            if (getDishes) getDishes({ isActive: 'all', limit: 100 });
            if (getEmployees) getEmployees({ isActive: 'all', limit: 100 });
        }
    }, [isOpen, getRestaurants, getTables, getDishes, getEmployees]);

    useEffect(() => {
        if (isOpen) {
            if (eventItem) {
                // Formateo de fecha ISO a formato local aceptado por input datetime-local
                const localDate = eventItem.dateTime ? new Date(eventItem.dateTime).toISOString().slice(0, 16) : "";
                reset({
                    name: eventItem.name || "",
                    description: eventItem.description || "",
                    typeEvent: eventItem.typeEvent || "CENA_TEMATICA",
                    capacity: eventItem.capacity || "",
                    price: eventItem.price || "",
                    restaurant: eventItem.restaurant?._id || eventItem.restaurant || "",
                    dateTime: localDate,
                    additionalServices: eventItem.additionalServices || [],
                    assignedTables: eventItem.assignedTables?.map(t => t._id || t) || [],
                    specialDishes: eventItem.specialDishes?.map(d => d._id || d) || [],
                    assignedEmployees: eventItem.assignedEmployees?.map(e => e._id || e) || []
                });
            } else {
                reset({
                    name: "",
                    description: "",
                    typeEvent: "CENA_TEMATICA",
                    capacity: "",
                    price: "",
                    restaurant: "",
                    dateTime: "",
                    additionalServices: [],
                    assignedTables: [],
                    specialDishes: [],
                    assignedEmployees: []
                });
            }
        }
    }, [isOpen, eventItem, reset]);

    const filteredTables = tables.filter(t => t.restaurant?._id === selectedRestaurant || t.restaurant === selectedRestaurant);
    const filteredDishes = dishes.filter(d => d.restaurant?._id === selectedRestaurant || d.restaurant === selectedRestaurant);
    const filteredEmployees = employees.filter(e => e.restaurant?._id === selectedRestaurant || e.restaurant === selectedRestaurant);

    const onSubmit = async (data) => {
        try {
            await saveEvent(data, eventItem?._id);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
            showError(error.response?.data?.message || "Error al procesar el evento.");
        }
    };

    if (!isOpen) return null;

    // Obtención de la fecha y hora mínima (momento actual) para prevenir errores de validación de Mongoose
    const minDateTime = new Date().toISOString().slice(0, 16);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
            <div className="bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg md:max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--border-color)] transition-colors duration-300">
                
                {/* HEADER */}
                <div className="p-4 sm:p-5 bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border-b border-[var(--border-color)]">
                    <h2 className="text-xl sm:text-2xl font-bold">
                        {eventItem ? "Editar Configuración de Evento" : "Planificar Nuevo Evento"}
                    </h2>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
                    
                    {/* Nombre */}
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Nombre del Evento</label>
                        <input
                            className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                            placeholder="Ej. Festival del Taco 2026"
                            {...register("name", { required: "El nombre es requerido", maxLength: 100 })}
                        />
                        {errors.name && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Descripción / Itinerario</label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none resize-none"
                            placeholder="Detalla de qué trata el evento gastronómico..."
                            {...register("description", { 
                                required: "La descripción es requerida", 
                                maxLength: { value: 500, message: "Máximo 500 caracteres" } 
                            })}
                        />
                        {errors.description && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Tipo de Evento */}
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold mb-1">Categoría de Evento</label>
                            <select
                                className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                {...register("typeEvent", { required: "El tipo de evento es obligatorio" })}
                            >
                                <option value="CENA_TEMATICA">Cena Temática</option>
                                <option value="DEGUSTACION">Degustación</option>
                                <option value="FESTIVAL">Festival Gastronómico</option>
                                <option value="OTRO">Otro</option>
                            </select>
                            {errors.typeEvent && <p className="text-[var(--color-brand-red)] text-[10px] mt-0.5">{errors.typeEvent.message}</p>}
                        </div>

                        {/* Sucursal Destino */}
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold mb-1">Sucursal / Sede Anfitriona</label>
                            <select
                                className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                {...register("restaurant", { required: "Sede obligatoria" })}
                            >
                                <option value="">Selecciona restaurante...</option>
                                {restaurants?.map((r) => (
                                    <option key={r._id} value={r._id}>{r.name}</option>
                                ))}
                            </select>
                            {errors.restaurant && <p className="text-[var(--color-brand-red)] text-[10px] mt-0.5">{errors.restaurant.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Capacidad */}
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold mb-1">Capacidad (Cupos)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                placeholder="50"
                                {...register("capacity", { 
                                    required: "Requerido", 
                                    min: { value: 1, message: "Mínimo 1" },
                                    validate: value => {
                                        if (restaurantCapacity > 0 && value > restaurantCapacity) {
                                            return `La capacidad no puede exceder la del restaurante (${restaurantCapacity})`;
                                        }
                                    }
                                })}
                            />
                            {errors.capacity && <p className="text-[var(--color-brand-red)] text-[10px] mt-0.5">{errors.capacity.message}</p>}
                            {restaurantCapacity > 0 && (
                                <p className="text-[10px] text-[var(--text-muted)] mt-1">Capacidad máxima del restaurante: {restaurantCapacity}</p>
                            )}
                        </div>

                        {/* Precio por Entrada */}
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold mb-1">Precio Cobro (Q)</label>
                            <input
                                type="number"
                                step="any"
                                className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                placeholder="0.00"
                                {...register("price", { 
                                    required: "Requerido", 
                                    min: { value: 0, message: "No negativo" } 
                                })}
                            />
                            {errors.price && <p className="text-[var(--color-brand-red)] text-[10px] mt-0.5">{errors.price.message}</p>}
                        </div>

                        {/* Fecha y Hora */}
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold mb-1">Fecha y Hora</label>
                            <input
                                type="datetime-local"
                                min={minDateTime} // Blindaje frontend contra fechas pasadas
                                className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                {...register("dateTime", { required: "Requerido" })}
                            />
                            {errors.dateTime && <p className="text-[var(--color-brand-red)] text-[10px] mt-0.5">{errors.dateTime.message}</p>}
                        </div>
                    </div>

                    {/* Servicios Adicionales Checklist */}
                    <div className="bg-[var(--bg-surface-alt)] p-3 rounded-xl border border-[var(--border-color)]">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
                            Servicios Complementarios Incluidos
                        </label>
                        <div className="grid grid-cols-2 gap-2 text-sm text-[var(--text-primary)]">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" value="MUSICA_EN_VIVO" {...register("additionalServices")} className="rounded border-[var(--border-color)]" />
                                Música en Vivo
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" value="DECORACION_ESPECIAL" {...register("additionalServices")} className="rounded border-[var(--border-color)]" />
                                Decoración Especial
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" value="FOTOGRAFIA" {...register("additionalServices")} className="rounded border-[var(--border-color)]" />
                                Fotografía Profesional
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" value="OTRO" {...register("additionalServices")} className="rounded border-[var(--border-color)]" />
                                Otro Servicio
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Mesas Asignadas */}
                        <div className="bg-[var(--bg-surface-alt)] p-3 rounded-xl border border-[var(--border-color)]">
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
                                Mesas Reservadas
                            </label>
                            {!selectedRestaurant ? (
                                <p className="text-[10px] italic text-[var(--text-muted)]">Selecciona un restaurante...</p>
                            ) : filteredTables.length === 0 ? (
                                <p className="text-[10px] italic text-[var(--text-muted)]">No hay mesas en esta sede.</p>
                            ) : (
                                <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                                    {filteredTables.map(t => (
                                        <label key={t._id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[var(--bg-base)] p-1 rounded">
                                            <input type="checkbox" value={t._id} {...register("assignedTables")} className="rounded border-[var(--border-color)]" />
                                            Mesa {t.tableNumber} (Cap. {t.capacity})
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Platos Especiales */}
                        <div className="bg-[var(--bg-surface-alt)] p-3 rounded-xl border border-[var(--border-color)]">
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
                                Menú Especial
                            </label>
                            {!selectedRestaurant ? (
                                <p className="text-[10px] italic text-[var(--text-muted)]">Selecciona un restaurante...</p>
                            ) : filteredDishes.length === 0 ? (
                                <p className="text-[10px] italic text-[var(--text-muted)]">No hay platos en esta sede.</p>
                            ) : (
                                <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                                    {filteredDishes.map(d => (
                                        <label key={d._id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[var(--bg-base)] p-1 rounded">
                                            <input type="checkbox" value={d._id} {...register("specialDishes")} className="rounded border-[var(--border-color)]" />
                                            {d.name} (Q {Number(d.price).toFixed(2)})
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Empleados Asignados */}
                    <div className="bg-[var(--bg-surface-alt)] p-3 rounded-xl border border-[var(--border-color)]">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
                            Personal Asignado (Staff)
                        </label>
                        {!selectedRestaurant ? (
                            <p className="text-[10px] italic text-[var(--text-muted)]">Selecciona un restaurante...</p>
                        ) : filteredEmployees.length === 0 ? (
                            <p className="text-[10px] italic text-[var(--text-muted)]">No hay personal en esta sede.</p>
                        ) : (
                            <div className="max-h-32 overflow-y-auto grid grid-cols-2 gap-1 pr-1">
                                {filteredEmployees.map(e => (
                                    <label key={e._id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[var(--bg-base)] p-1 rounded">
                                        <input type="checkbox" value={e._id} {...register("assignedEmployees")} className="rounded border-[var(--border-color)]" />
                                        {e.fullName} ({e.specialty})
                                    </label>
                                ))}
                            </div>
                        )}
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
                            className="px-5 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent transition disabled:opacity-60"
                        >
                            {loading ? "Guardando..." : eventItem ? "Guardar Cambios" : "Agendar Evento"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};