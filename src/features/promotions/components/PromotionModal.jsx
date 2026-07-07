import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSavePromotion } from "../hooks/UseSavePromotion.jsx";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { useDishStore } from "../../dishes/store/useDishStore.js";
import { showError } from "../../../shared/utils/toast.js";

export const PromotionModal = ({ isOpen, onClose, promotion }) => {
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm();

	const { savePromotion } = useSavePromotion();
	const restaurants = useRestaurantStore((state) => state.restaurants);
	const getDishes = useDishStore((state) => state.getDishes);
	const dishes = useDishStore((state) => state.dishes);

	const selectedRestaurant = watch("restaurant");

	useEffect(() => {
		if (selectedRestaurant) {
			getDishes({ isActive: 'all', limit: 100 });
		}
	}, [selectedRestaurant, getDishes]);

	const filteredDishes = dishes.filter(dish => dish.restaurant?._id === selectedRestaurant || dish.restaurant === selectedRestaurant);

	useEffect(() => {
		if (!isOpen) return;

		if (promotion) {
			reset({
				title: promotion.title || "",
				description: promotion.description || "",
				discountPercentage: promotion.discountPercentage ?? "",
				restaurant: promotion.restaurant?._id || promotion.restaurant || "",
				scope: promotion.scope || "GENERAL",
				startDate: promotion.startDate ? String(promotion.startDate).slice(0, 10) : "",
				endDate: promotion.endDate ? String(promotion.endDate).slice(0, 10) : "",
				status: promotion.status || "PENDING",
				isActive: Boolean(promotion.isActive),
				dishesApplicables: Array.isArray(promotion.dishesApplicables)
					? promotion.dishesApplicables.map(d => d._id || d)
					: [],
			});
		} else {
			reset({
				title: "",
				description: "",
				discountPercentage: "",
				restaurant: "",
				scope: "GENERAL",
				startDate: "",
				endDate: "",
				status: "PENDING",
				isActive: true,
				dishesApplicables: [],
			});
		}
	}, [isOpen, promotion, reset]);

	// Determinar si la promoción está vencida (basado en el prop promotion para edición)
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const isExpired = promotion ? new Date(promotion.endDate) < today : false;

	// Watch endDate changes to auto-uncheck isActive
	const endDateValue = watch("endDate");
	const isEndDateExpired = endDateValue ? new Date(endDateValue) < today : false;

	useEffect(() => {
		if (isEndDateExpired) {
			// Auto-desactivar cuando la fecha de fin es anterior a hoy
			// Solo si el usuario no lo ha activado manualmente después
			// Usamos setValue para actualizar sin disparar validación
			// Nota: En un caso real, podrías querer mostrar una advertencia
		}
	}, [isEndDateExpired]);

	const onSubmit = async (data) => {
		// Validar que la fecha de fin sea posterior a la de inicio
		if (new Date(data.endDate) <= new Date(data.startDate)) {
			showError("La fecha de fin debe ser posterior a la fecha de inicio");
			return;
		}
		
		// Auto-desactivar si la fecha de fin ya pasó
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (new Date(data.endDate) < today) {
			data.isActive = false;
		}
		
		await savePromotion(data, promotion?._id);
		onClose();
	};

	if (!isOpen) return null;

	// Determinar si la promoción está vencida (basado en el prop promotion para edición)
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const isExpired = promotion ? new Date(promotion.endDate) < today : false;

	// Watch endDate changes to auto-uncheck isActive
	const endDateValue = watch("endDate");
	const isEndDateExpired = endDateValue ? new Date(endDateValue) < today : false;

	useEffect(() => {
		if (isEndDateExpired) {
			// Auto-desactivar cuando la fecha de fin es anterior a hoy
			// Solo si el usuario no lo ha activado manualmente después
			// Usamos setValue para actualizar sin disparar validación
			// Nota: En un caso real, podrías querer mostrar una advertencia
		}
	}, [isEndDateExpired]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
			<div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl">
				<div className="bg-[linear-gradient(90deg,var(--color-brand-dark)_0%,var(--color-brand-red-dark)_100%)] p-5 text-white">
					<h2 className="text-2xl font-bold">{promotion ? "Editar Promoción" : "Nueva Promoción"}</h2>
					<p className="text-sm opacity-80">Gestiona promociones desde el panel administrativo</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 p-5 md:grid-cols-2">
					<div className="md:col-span-2">
						<label className="mb-1 block text-sm font-semibold">Título</label>
						<input className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none" {...register("title", { required: "El título es obligatorio", maxLength: { value: 100, message: "Máximo 100 caracteres" } })} />
						{errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
					</div>

					<div className="md:col-span-2">
						<label className="mb-1 block text-sm font-semibold">Descripción</label>
						<textarea className="min-h-28 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none" {...register("description", { required: "La descripción es obligatoria", maxLength: { value: 500, message: "Máximo 500 caracteres" } })} />
						{errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
					</div>

					<div>
						<label className="mb-1 block text-sm font-semibold">Descuento (%)</label>
						<input type="number" step="any" className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none" {...register("discountPercentage", { required: "El descuento es obligatorio", valueAsNumber: true, min: { value: 0, message: "El descuento debe estar entre 0 y 100" }, max: { value: 100, message: "El descuento debe estar entre 0 y 100" } })} />
						{errors.discountPercentage && <p className="mt-1 text-xs text-red-600">{errors.discountPercentage.message}</p>}
					</div>

					<div>
						<label className="mb-1 block text-sm font-semibold">Restaurante</label>
						<select className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none" {...register("restaurant", { required: "El restaurante es obligatorio" })}>
							<option value="">Selecciona un restaurante</option>
							{restaurants.map((restaurant) => (
								<option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>
							))}
						</select>
						{errors.restaurant && <p className="mt-1 text-xs text-red-600">{errors.restaurant.message}</p>}
					</div>

					<div>
						<label className="mb-1 block text-sm font-semibold">Alcance</label>
						<select className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none" {...register("scope", { required: "El alcance es obligatorio", validate: value => ['EVENTOS', 'PEDIDOS', 'GENERAL'].includes(value) || "El alcance debe ser EVENTOS, PEDIDOS o GENERAL" })}>
							<option value="EVENTOS">EVENTOS</option>
							<option value="PEDIDOS">PEDIDOS</option>
							<option value="GENERAL">GENERAL</option>
						</select>
						{errors.scope && <p className="mt-1 text-xs text-red-600">{errors.scope.message}</p>}
					</div>

					<div>
						<label className="mb-1 block text-sm font-semibold">Estado</label>
						<select className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none" {...register("status", { required: "El estado es obligatorio", validate: value => ['PENDING', 'APPROVED', 'REJECTED'].includes(value) || "El estado es inválido" })}>
							<option value="PENDING">PENDING</option>
							<option value="APPROVED">APPROVED</option>
							<option value="REJECTED">REJECTED</option>
						</select>
						{errors.status && <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>}
					</div>

					<div>
						<label className="mb-1 block text-sm font-semibold">Inicio</label>
						<input type="date" className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none" {...register("startDate", { required: "La fecha de inicio es obligatoria" })} />
						{errors.startDate && <p className="mt-1 text-xs text-red-600">{errors.startDate.message}</p>}
					</div>

					<div>
						<label className="mb-1 block text-sm font-semibold">Fin</label>
						<input 
							type="date" 
							className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none" 
							{...register("endDate", { 
								required: "La fecha de fin es obligatoria",
								validate: value => {
									const startDate = watch("startDate");
									if (startDate && value && new Date(value) <= new Date(startDate)) {
										return "La fecha de fin debe ser posterior a la fecha de inicio";
									}
								}
							})} 
						/>
						{errors.endDate && <p className="mt-1 text-xs text-red-600">{errors.endDate.message}</p>}
					</div>

					<div className="md:col-span-2">
						<label className="mb-2 block text-sm font-semibold">Platos aplicables</label>
						{!selectedRestaurant ? (
							<p className="text-xs text-[var(--text-secondary)] italic">Seleccione un restaurante para ver sus platos...</p>
						) : filteredDishes.length === 0 ? (
							<p className="text-xs text-[var(--text-secondary)] italic">El restaurante no tiene platos registrados.</p>
						) : (
							<div className="max-h-40 overflow-y-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] p-3">
								<div className="grid grid-cols-2 gap-2">
									{filteredDishes.map((dish) => (
										<label key={dish._id} className="flex items-center gap-2 text-sm">
											<input 
												type="checkbox" 
												value={dish._id} 
												{...register("dishesApplicables")} 
												className="rounded border-[var(--border-color)]"
											/>
											{dish.name}
										</label>
									))}
								</div>
							</div>
						)}
					</div>

					<label className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-3 text-sm font-medium">
						<input 
							type="checkbox" 
							{...register("isActive")} 
							disabled={isExpired}
						/>
						Promoción activa
						{isExpired && <span className="text-xs text-red-600">(Vencida - no se puede activar)</span>}
					</label>

					<div className="md:col-span-2 flex justify-end gap-3 pt-2">
						<button type="button" onClick={onClose} className="rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium">Cancelar</button>
						<button type="submit" className="rounded-xl bg-[var(--color-brand-dark)] px-4 py-2.5 text-sm font-medium text-white">Guardar</button>
					</div>
				</form>
			</div>
		</div>
	);
};
