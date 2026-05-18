import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSaveTable } from "../hooks/useSaveTable.jsx";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";

export const TableModal = ({ isOpen, onClose, table }) => {
	const {
		register,
		handleSubmit,
		reset,
		control,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: {
			availability: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "availability",
	});

	const { saveTable } = useSaveTable();
	const restaurants = useRestaurantStore((state) => state.restaurants);
	const [availabilityError, setAvailabilityError] = useState("");

	useEffect(() => {
		if (!isOpen) return;

		if (table) {
			reset({
				restaurant: table.restaurant?._id || table.restaurant || "",
				tableNumber: table.tableNumber || "",
				capacity: table.capacity || "",
				location: table.location || "Salón Principal",
				tableAvailability: Boolean(table.tableAvailability),
				isActive: Boolean(table.isActive),
				availability: table.availability || [],
			});
		} else {
			reset({
				restaurant: "",
				tableNumber: "",
				capacity: "",
				location: "Salón Principal",
				tableAvailability: true,
				isActive: true,
				availability: [],
			});
		}
		setAvailabilityError("");
	}, [isOpen, table, reset]);

	// Validación de availability (horarios válidos y sin solapamiento)
	const validateAvailability = (availability) => {
		if (!availability || availability.length === 0) {
			setAvailabilityError("Agrega al menos un horario de disponibilidad.");
			return false;
		}
		// Validar formato y solapamiento
		for (let i = 0; i < availability.length; i++) {
			const { day, startTime, endTime } = availability[i];
			if (!day || !startTime || !endTime) {
				setAvailabilityError("Todos los campos de disponibilidad son obligatorios.");
				return false;
			}
			if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(startTime) || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(endTime)) {
				setAvailabilityError("El formato de hora debe ser HH:mm (ej: 18:00)");
				return false;
			}
			if (startTime >= endTime) {
				setAvailabilityError("La hora de inicio debe ser menor que la de fin.");
				return false;
			}
			// Validar solapamiento en el mismo día
			for (let j = 0; j < availability.length; j++) {
				if (i !== j && availability[i].day === availability[j].day) {
					// Si los horarios se solapan
					if (
						(startTime < availability[j].endTime && endTime > availability[j].startTime)
					) {
						setAvailabilityError("No puede haber horarios solapados para el mismo día.");
						return false;
					}
				}
			}
		}
		setAvailabilityError("");
		return true;
	};

	const onSubmit = async (data) => {
		if (!validateAvailability(data.availability)) return;
		await saveTable(data, table?._id);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
			<div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl">
				<div className="bg-[linear-gradient(90deg,var(--main-blue)_0%,#1956a3_100%)] p-5 text-white">
					<h2 className="text-2xl font-bold">{table ? "Editar Mesa" : "Nueva Mesa"}</h2>
					<p className="text-sm opacity-80">Administra las mesas del restaurante</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 p-5 md:grid-cols-2">
					<div className="md:col-span-2">
						<label className="mb-1 block text-sm font-semibold">Restaurante</label>
						<select
							className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none"
							{...register("restaurant", { required: "El restaurante es obligatorio" })}
						>
							<option value="">Selecciona un restaurante</option>
							{restaurants.map((restaurant) => (
								<option key={restaurant._id} value={restaurant._id}>
									{restaurant.name}
								</option>
							))}
						</select>
						{errors.restaurant && <p className="mt-1 text-xs text-red-600">{errors.restaurant.message}</p>}
					</div>

					<div>
						<label className="mb-1 block text-sm font-semibold">Número de mesa</label>
						<input
							className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none"
							{...register("tableNumber", {
								required: "El número es obligatorio",
								maxLength: { value: 50, message: "Máximo 50 caracteres" },
							})}
						/>
						{errors.tableNumber && <p className="mt-1 text-xs text-red-600">{errors.tableNumber.message}</p>}
					</div>

					<div>
						<label className="mb-1 block text-sm font-semibold">Capacidad</label>
						<input
							type="number"
							className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none"
							{...register("capacity", {
								required: "La capacidad es obligatoria",
								valueAsNumber: true,
								min: { value: 1, message: "Mínimo 1 persona" },
								max: { value: 20, message: "Máximo 20 personas" },
							})}
						/>
						{errors.capacity && <p className="mt-1 text-xs text-red-600">{errors.capacity.message}</p>}
					</div>

					<div>
						<label className="mb-1 block text-sm font-semibold">Ubicación</label>
						<select
							className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none"
							{...register("location", { required: "La ubicación es obligatoria" })}
						>
							<option value="Terraza">Terraza</option>
							<option value="Salón Principal">Salón Principal</option>
							<option value="VIP">VIP</option>
							<option value="Bar">Bar</option>
							<option value="Jardín">Jardín</option>
						</select>
					</div>

					{/* Availability Section */}
					<div className="md:col-span-2">
						<label className="block text-sm font-semibold mb-1">Disponibilidad de la mesa</label>
						<div className="space-y-2">
							{fields.map((field, idx) => (
								<div key={field.id} className="flex flex-wrap gap-2 items-center border border-[var(--border-color)] rounded-lg p-2 bg-[var(--bg-base)]">
									<select
										className="rounded border px-2 py-1 text-sm"
										{...register(`availability.${idx}.day`, { required: true })}
									>
										<option value="">Día</option>
										<option value="Lunes">Lunes</option>
										<option value="Martes">Martes</option>
										<option value="Miércoles">Miércoles</option>
										<option value="Jueves">Jueves</option>
										<option value="Viernes">Viernes</option>
										<option value="Sábado">Sábado</option>
										<option value="Domingo">Domingo</option>
									</select>
									<input
										type="time"
										className="rounded border px-2 py-1 text-sm"
										{...register(`availability.${idx}.startTime`, { required: true })}
									/>
									<span className="text-xs">a</span>
									<input
										type="time"
										className="rounded border px-2 py-1 text-sm"
										{...register(`availability.${idx}.endTime`, { required: true })}
									/>
									<button
										type="button"
										className="ml-2 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200"
										onClick={() => remove(idx)}
									>
										Quitar
									</button>
								</div>
							))}
							<button
								type="button"
								className="mt-2 px-3 py-1 rounded bg-[var(--color-brand-dark)] text-white text-sm font-semibold hover:bg-[var(--color-brand-yellow)]"
								onClick={() => append({ day: "", startTime: "", endTime: "" })}
							>
								Agregar horario
							</button>
							{availabilityError && <p className="text-xs text-red-600 mt-1">{availabilityError}</p>}
						</div>
					</div>

					<label className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-3 text-sm font-medium">
						<input type="checkbox" {...register("tableAvailability")} />
						Mesa disponible
					</label>

					<label className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-3 text-sm font-medium">
						<input type="checkbox" {...register("isActive")} />
						Mesa activa
					</label>

					<div className="md:col-span-2 flex justify-end gap-3 pt-2">
						<button type="button" onClick={onClose} className="rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium">
							Cancelar
						</button>
						<button type="submit" className="rounded-xl bg-[var(--color-brand-dark)] px-4 py-2.5 text-sm font-medium text-white">
							Guardar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
