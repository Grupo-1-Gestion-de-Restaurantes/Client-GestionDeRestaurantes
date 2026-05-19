import { useTableStore } from "../store/useTableStore.js";

export const useSaveTable = () => {
	const createTable = useTableStore((state) => state.createTable);
	const updateTable = useTableStore((state) => state.updateTable);

	const saveTable = async (data, tableId = null) => {
		// Validar y limpiar availability
		const availability = (data.availability || []).map((item) => ({
			day: item.day,
			startTime: item.startTime,
			endTime: item.endTime,
		}));

		const payload = {
			restaurant: data.restaurant,
			tableNumber: data.tableNumber,
			capacity: Number(data.capacity),
			location: data.location,
			tableAvailability: Boolean(data.tableAvailability),
			isActive: Boolean(data.isActive),
			availability,
		};

		if (tableId) {
			await updateTable(tableId, payload);
		} else {
			await createTable(payload);
		}
	};

	return { saveTable };
};
