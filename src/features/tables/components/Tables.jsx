import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Table2, MapPinned, Users, Power, PowerOff, PencilLine, BadgeCheck } from "lucide-react";
import { useTableStore } from "../store/useTableStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { useAuthStore } from "../../../features/auth/store/useAuthStore.js";
import { TableModal } from "./TableModal.jsx";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { showError } from "../../../shared/utils/toast.js";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";
import { Pagination } from "../../../shared/components/ui/Pagination.jsx";

export const Tables = () => {
	const { tables, loading, error, getTables, deactivateTable, activateTable, pagination } = useTableStore();
	const { restaurants, getRestaurants } = useRestaurantStore();
	const { user } = useAuthStore();
	const isAdmin = user?.role === "ADMIN_ROLE";
	const { openConfirm } = useUIStore();

	const [openModal, setOpenModal] = useState(false);
	const [selectedTable, setSelectedTable] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeFilter, setActiveFilter] = useState("active");
	const [restaurantFilter, setRestaurantFilter] = useState("");

	useEffect(() => {
		getRestaurants({ isActive: 'all', limit: 100 });
	}, [getRestaurants]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			const filters = { page: 1 };

			if (activeFilter !== "all") {
				filters.isActive = activeFilter === "active";
			}

			if (isAdmin && restaurantFilter) {
				filters.restaurant = restaurantFilter;
			}

			getTables(filters);
		}, 200);

		return () => clearTimeout(timeoutId);
	}, [activeFilter, restaurantFilter, getTables, isAdmin]);

	const handlePageChange = (page) => {
		const filters = { page };

		if (activeFilter !== "all") {
			filters.isActive = activeFilter === "active";
		}

		if (isAdmin && restaurantFilter) {
			filters.restaurant = restaurantFilter;
		}

		getTables(filters);
	};

	useEffect(() => {
		if (error) showError(error);
	}, [error]);

	const filteredTables = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();

		return tables.filter((table) => {
			if (!normalizedSearch) return true;

			const restaurantName = table.restaurant?.name || "";
			return [table.tableNumber, table.location, restaurantName]
				.join(" ")
				.toLowerCase()
				.includes(normalizedSearch);
		});
	}, [tables, searchTerm, restaurantFilter, isAdmin]);

	const filteredByRestaurant = useMemo(() => {
		if (!isAdmin || !restaurantFilter) return filteredTables;
		return filteredTables.filter(table => String(table.restaurant?._id || table.restaurant) === restaurantFilter);
	}, [filteredTables, restaurantFilter, isAdmin]);

	const emptyMessage = (searchTerm.trim() || activeFilter !== "active" || (isAdmin && restaurantFilter))
		? "No hay mesas con esos filtros."
		: "No hay mesas registradas.";

	if (loading && tables.length === 0) return <Spinner />;

	return (
		<div className="p-4">
			<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold text-[var(--text-primary)]">Gestión de Mesas</h1>
					<p className="mt-1 text-sm text-[var(--text-muted)]">Administra las mesas del panel de administración</p>
				</div>

				<button
					onClick={() => {
						setOpenModal(true);
						setSelectedTable(null);
					}}
					className="rounded-lg border border-transparent bg-[var(--color-brand-dark)] px-4 py-2 font-medium text-white shadow transition hover:bg-[var(--color-brand-red)]"
				>
					<span className="inline-flex items-center gap-2">
						<LucideMotionIcon icon={Plus} className="!w-4 !h-4 text-white" />
						Agregar Mesa
					</span>
				</button>
			</div>

			<div className="mb-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shadow-sm">
				<div className="grid gap-4 lg:grid-cols-[1fr_240px_auto] lg:items-end">
					<div>
						<label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Buscar mesas</label>
						<div className="relative">
							<span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
								<LucideMotionIcon icon={Search} className="!w-4 !h-4 text-[var(--text-muted)]" />
							</span>
							<input
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
								placeholder="Buscar por número, restaurante o ubicación"
								className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-brand-dark)]"
							/>
						</div>
					</div>

					<div>
						<label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Mostrar</label>
						<select
							value={activeFilter}
							onChange={(event) => setActiveFilter(event.target.value)}
							className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none"
						>
							<option value="active">Activas</option>
							<option value="inactive">Inactivas</option>
							<option value="all">Todas</option>
						</select>
					</div>

					{isAdmin && (
						<div>
							<label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Restaurante</label>
							<select
								value={restaurantFilter}
								onChange={(event) => setRestaurantFilter(event.target.value)}
								className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none"
							>
								<option value="">Todos los restaurantes</option>
								{restaurants?.map((r) => (
									<option key={r._id} value={r._id}>{r.name}</option>
								))}
							</select>
						</div>
					)}

					<div>
						<label className="mb-2 block text-sm font-semibold text-[var(--text-primary)] invisible">Limpiar</label>
						<button
							type="button"
							onClick={() => {
								setSearchTerm("");
								setActiveFilter("active");
								setRestaurantFilter("");
							}}
							className="w-full rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-base)]"
						>
							<span className="inline-flex items-center gap-2">
								<LucideMotionIcon icon={BadgeCheck} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]" />
								Limpiar
							</span>
						</button>
					</div>
				</div>
			</div>

			<div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-md">
				<table className="w-full border-collapse text-left">
					<thead className="border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-sm text-[var(--text-secondary)]">
						<tr>
							<th className="px-6 py-4 font-semibold">Mesa</th>
							<th className="px-6 py-4 font-semibold">Restaurante</th>
							<th className="px-6 py-4 font-semibold">Capacidad</th>
							<th className="px-6 py-4 font-semibold">Ubicación</th>
							<th className="px-6 py-4 font-semibold">Disponibilidad</th>
							<th className="px-6 py-4 font-semibold">Activo</th>
							<th className="px-6 py-4 font-semibold text-center">Acciones</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[var(--border-color)]">
						{filteredByRestaurant.length > 0 ? (
							filteredByRestaurant.map((table) => (
								<tr key={table._id} className="transition-colors hover:bg-[var(--bg-base)]">
									<td className="px-6 py-4 font-medium text-[var(--text-primary)]">
										<span className="inline-flex items-center gap-2">
											<LucideMotionIcon icon={Table2} className="!w-4 !h-4 hover:translate-y-0 hover:scale-100" />
											Mesa {table.tableNumber}
										</span>
									</td>
									<td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
										<span className="inline-flex items-center gap-2">
											<LucideMotionIcon icon={MapPinned} className="!w-4 !h-4 hover:translate-y-0 hover:scale-100" />
											{table.restaurant?.name || restaurants.find((item) => item._id === table.restaurant)?.name || "N/A"}
										</span>
									</td>
									<td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
										<span className="inline-flex items-center gap-2">
											<LucideMotionIcon icon={Users} className="!w-4 !h-4 hover:translate-y-0 hover:scale-100" />
											{table.capacity} personas
										</span>
									</td>
									<td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{table.location}</td>
									<td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
										<div className="flex flex-col gap-1">
											{Array.isArray(table.availability) && table.availability.length > 0 ? (
												table.availability.map((a, idx) => (
													<span key={idx} className="inline-block bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded px-2 py-0.5 text-xs font-medium">
														{a.day}: {a.startTime} - {a.endTime}
													</span>
												))
											) : (
												<span className="text-xs text-[var(--text-muted)]">Sin horarios</span>
											)}
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
										<span className={`rounded-full px-3 py-1 text-xs font-medium ${table.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
											{table.isActive ? "Activa" : "Inactiva"}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center justify-center gap-3">
											<button
												onClick={() => {
													setSelectedTable(table);
													setOpenModal(true);
												}}
												className="inline-flex items-center gap-2 font-medium text-[var(--color-brand-yellow)] transition hover:opacity-75"
											>
												<LucideMotionIcon icon={PencilLine} className="!w-4 !h-4 text-[var(--color-brand-yellow)]" />
												Editar
											</button>
											{table.isActive ? (
												<button
													onClick={() =>
														openConfirm({
															title: "Desactivar Mesa",
															message: `¿Estás seguro de desactivar la mesa ${table.tableNumber}?`,
															onConfirm: () => deactivateTable(table._id),
														})
													}
													className="inline-flex items-center gap-2 font-medium text-[var(--color-brand-red)] transition hover:opacity-75"
												>
													<LucideMotionIcon icon={PowerOff} className="!w-4 !h-4 text-[var(--color-brand-red)]" />
													Desactivar
												</button>
											) : (
												<button
													onClick={() =>
														openConfirm({
															title: "Activar Mesa",
															message: `¿Estás seguro de activar la mesa ${table.tableNumber}?`,
															onConfirm: () => activateTable(table._id),
														})
													}
													className="inline-flex items-center gap-2 font-medium text-green-700 transition hover:opacity-75"
												>
													<LucideMotionIcon icon={Power} className="!w-4 !h-4 text-green-700 dark:text-[var(--color-brand-yellow)]" />
													Activar
												</button>
											)}
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="7" className="py-8 text-center text-[var(--text-muted)]">{emptyMessage}</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<Pagination 
                pagination={pagination} 
                onPageChange={handlePageChange} 
            />

			<TableModal
				isOpen={openModal}
				onClose={() => {
					setOpenModal(false);
					setSelectedTable(null);
				}}
				table={selectedTable}
			/>
		</div>
	);
};
